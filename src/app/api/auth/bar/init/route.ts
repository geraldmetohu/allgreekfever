import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { getAdminEmails } from "@/app/actions";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const adminEmails = await getAdminEmails();

  // If admin: return all events and select the first one
  if (adminEmails.includes(user.email)) {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      select: { id: true, name: true },
    });

    const defaultEventId = events[0]?.id ?? "";
    return NextResponse.json({ events, defaultEventId });
  }

  // If staff: get event assigned to them
  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
    include: { event: true },
  });

  if (!staff?.event) {
    return NextResponse.json({ events: [], defaultEventId: "" });
  }

  return NextResponse.json({
    events: [{ id: staff.event.id, name: staff.event.name }],
    defaultEventId: staff.event.id,
  });
}

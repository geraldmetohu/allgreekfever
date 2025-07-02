import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
    select: { eventId: true },
  });

  if (!staff?.eventId) {
    return NextResponse.json({ tables: [] });
  }

  const tables = await prisma.table.findMany({
    where: {
      plan: {
        eventId: staff.eventId,
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({ tables });
}


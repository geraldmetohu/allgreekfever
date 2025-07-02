// src/app/api/waitress-tables/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the waitress and her assigned event ID
  const waitress = await prisma.staff.findFirst({
    where: { email: user.email },
    select: { eventId: true },
  });

  if (!waitress?.eventId) {
    return NextResponse.json({ tables: [] });
  }

  // Fetch all tables linked to plans under the waitress's event
  const tables = await prisma.table.findMany({
    where: {
      plan: {
        eventId: waitress.eventId,
      },
    },
    orderBy: { name: "asc" }, // Optional: sort by name
  });

  return NextResponse.json({ tables });
}

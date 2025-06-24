// src/app/api/waitress-tables/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const waitress = await prisma.staff.findFirst({
    where: { email: user.email },
    include: { event: true },
  });

  if (!waitress || !waitress.eventId) {
    return NextResponse.json({ tables: [], waitress: null });
  }

  const tables = await prisma.table.findMany({
    where: {
      plan: {
        eventId: waitress.eventId,
      },
    },
    include: {
      plan: {
        include: { event: true },
      },
    },
  });

  return NextResponse.json({ tables, waitress });
}

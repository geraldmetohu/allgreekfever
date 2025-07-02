import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.email) {
      console.error("Missing user email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await prisma.staff.findFirst({
      where: { email: user.email },
      select: { eventId: true },
    });

    if (!staff?.eventId) {
      console.warn("No event found for staff");
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

    console.log("Returning tables:", tables);
    return NextResponse.json({ tables });
  } catch (error) {
    console.error("Error in GET /api/waitress-tables:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
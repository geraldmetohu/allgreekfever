// src/app/api/bar_orders/route.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminEmails } from "@/app/actions";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) return NextResponse.json([], { status: 401 });

  const adminEmails = await getAdminEmails();

  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
  });

  if (!staff && !adminEmails.includes(user.email)) {
    return NextResponse.json([], { status: 403 });
  }

  const orders = await prisma.orders.findMany({
    include: {
      orderItems: { include: { product: true } },
      waitress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const filtered = staff?.role === "WAITRESS"
    ? orders.filter((o) => o.waitress.email === user.email)
    : orders;

  return NextResponse.json(filtered);
}

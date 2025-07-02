import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const waitress = await prisma.staff.findFirst({
    where: { email: user.email },
  });

  if (!waitress) {
    return NextResponse.json({ error: "Waitress not found" }, { status: 404 });
  }

  const body = await req.json();

  const order = await prisma.orders.create({
    data: {
      table: body.table,
      notes: body.notes,
      total: body.total,
      paid: body.paid,
      served: body.served,
      paymentType: body.paymentType,
      waitress: { connect: { id: waitress.id } },
      orderItems: {
        create: body.orderItems.map((item: any) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  return NextResponse.json(order);
}

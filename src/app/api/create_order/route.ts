// src/app/api/create_order/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const order = await prisma.orders.create({
      data: {
        table: body.table,
        notes: body.notes,
        total: body.total,
        paymentType: body.paymentType,
        paid: body.paid,
        served: body.served,
        waitress: {
          connect: { id: waitress.id },
        },
        orderItems: {
          create: body.orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


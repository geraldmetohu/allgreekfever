// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID not provided" }, { status: 400 });
    }

    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: {
        ...(body.paid !== undefined && { paid: body.paid }),
        ...(body.served !== undefined && { served: body.served }),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

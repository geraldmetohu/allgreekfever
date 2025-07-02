// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: {
        ...(data.paid !== undefined && { paid: data.paid }),
        ...(data.served !== undefined && { served: data.served }),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("PUT /api/orders/[id] failed:", error);
    return NextResponse.json(
      { error: "Update failed", details: String(error) },
      { status: 500 }
    );
  }
}

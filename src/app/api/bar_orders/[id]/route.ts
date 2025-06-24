// src/app/api/orders/[id]/route.ts
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();

  const updated = await prisma.orders.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updated);
}

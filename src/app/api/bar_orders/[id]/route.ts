// src/app/api/bar_orders/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const data = await req.json();

  const updated = await prisma.orders.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updated);
}

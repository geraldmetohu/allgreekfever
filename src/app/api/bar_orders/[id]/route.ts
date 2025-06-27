import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req: NextRequest, context: any) {
  const id = context.params.id;
  const data = await req.json();

  try {
    const updated = await prisma.orders.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed", details: String(error) },
      { status: 500 }
    );
  }
}

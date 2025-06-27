import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;
  const body = await req.json();

  try {
    const updated = await prisma.products.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;

  try {
    await prisma.products.delete({ where: { id } });
    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

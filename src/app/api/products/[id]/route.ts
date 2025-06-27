import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// ✅ Correct PUT handler
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.products.update({
      where: { id: context.params.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ✅ Correct DELETE handler
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  try {
    await prisma.products.delete({ where: { id: context.params.id } });
    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

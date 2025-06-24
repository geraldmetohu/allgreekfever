// src/app/api/staff/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// DELETE handler (already implemented)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const staff = await prisma.staff.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json({ error: "Staff not found or deletion failed" }, { status: 500 });
  }
}

// ✅ NEW PUT handler to toggle `active`
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { active } = await req.json();

    const updated = await prisma.staff.update({
      where: { id: params.id },
      data: { active },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

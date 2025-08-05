import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// ✅ DELETE handler
export async function DELETE(_: NextRequest, context: any) {
  const id = context.params.id;

  try {
    const staff = await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json({ error: "Staff not found or deletion failed" }, { status: 500 });
  }
}

// ✅ PUT handler
export async function PUT(req: NextRequest, context: any) {
  const id = context.params.id;

  try {
    const { active } = await req.json();

    const updated = await prisma.staff.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


//This API route handles staff management by ID. It allows deleting a staff member or updating their active status (e.g., activate/deactivate waitress or bartender access). Used in the admin panel for staff control.
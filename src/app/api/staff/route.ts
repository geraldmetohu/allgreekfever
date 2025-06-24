// src/app/api/staff/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/db";

// src/app/api/staff/route.ts

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, role, eventId, active } = data;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        role,
        eventId: eventId || null, // ✅ just this
        active,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


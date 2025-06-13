// ✅ FILE: app/api/tables/[id]/route.ts (Soft Delete Version — Fixed for Turbopack)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// ✅ PUT: Update Table
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tableId = params.id;
  const body = await req.json();

  try {
    const updated = await prisma.table.update({
      where: { id: tableId },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating table:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// ✅ DELETE: Soft Delete Table (mark as booked = true)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tableId = params.id;

  try {
    const softDeleted = await prisma.table.update({
      where: { id: tableId },
      data: { booked: true },
    });

    return NextResponse.json({ message: 'Table marked as booked (soft deleted)', table: softDeleted });
  } catch (error) {
    console.error('[SOFT DELETE TABLE]', error);
    return new NextResponse('Failed to soft delete table', { status: 500 });
  }
}

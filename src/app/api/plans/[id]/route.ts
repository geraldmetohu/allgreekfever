import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// ✅ GET: Fetch a single plan by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // ✅ explicitly typed to avoid Vercel build error
) {
  const { id } = context.params;

  if (!id) return new Response("Missing ID", { status: 400 });

  try {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) return new Response("Plan not found", { status: 404 });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to fetch plan:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// ✅ DELETE: Delete a plan and its related tables
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } // ✅ same here
) {
  const { id: planId } = context.params;

  try {
    await prisma.table.deleteMany({ where: { planId } });
    await prisma.plan.delete({ where: { id: planId } });

    return NextResponse.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('[DELETE PLAN]', error);
    return new Response('Failed to delete plan', { status: 500 });
  }
}

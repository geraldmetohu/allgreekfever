// app/api/tables/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get('planId');

  if (!planId) {
    return new Response('Missing planId', { status: 400 });
  }

  try {
    const tables = await prisma.table.findMany({
      where: { planId },
    });
    return Response.json(tables);
  } catch (err) {
    console.error('Error fetching tables:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}export async function POST(req: NextRequest) {
  const body = await req.json();

  // ❌ Don't send "id" on creation — let Prisma auto-generate it
  const { id, ...data } = body;

  try {
    const table = await prisma.table.create({
      data,
    });
    return Response.json(table);
  } catch (err) {
    console.error('Error creating table:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// app/api/cart/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { addTableBookingToCart } from '@/app/actions';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  try {
    await addTableBookingToCart(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart add failed:", error);
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}

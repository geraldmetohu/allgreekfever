import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { Cart } from "@/lib/interfaces"; // ✅ import your Cart interface

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return NextResponse.json({ count: 0 });

  const cart = (await redis.get(`cart-${user.id}`)) as Cart | null;

  const count = cart?.items?.reduce((acc, item) => acc + item.tickets, 0) || 0;

  return NextResponse.json({ count });
}

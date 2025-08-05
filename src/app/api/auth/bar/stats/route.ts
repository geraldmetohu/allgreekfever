import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 });

  // Time window: today
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  // Get all orders for this event today
  const orders = await prisma.orders.findMany({
    where: {
      createdAt: { gte: todayStart, lte: todayEnd },
      waitress: { eventId },
    },
    include: {
      waitress: true,
    },
  });

  const ordersToday = orders.length;
  const unpaidOrders = orders.filter((o) => !o.paid).length;
  const servedUnpaid = orders.filter((o) => o.served && !o.paid).length;
  const totalRevenue = orders
    .filter((o) => o.paid)
    .reduce((sum, o) => sum + o.total, 0);

  // Count orders per waitress
  const countPerWaitress: Record<string, { name: string; count: number }> = {};
  for (const order of orders) {
    const id = order.waitressId;
    const name = order.waitress.name;
    if (!countPerWaitress[id]) {
      countPerWaitress[id] = { name, count: 1 };
    } else {
      countPerWaitress[id].count++;
    }
  }

  const mostActive = Object.values(countPerWaitress).sort((a, b) => b.count - a.count)[0];

  return NextResponse.json({
    ordersToday,
    unpaidOrders,
    servedUnpaid,
    totalRevenue,
    mostActiveWaitress: mostActive?.name ?? "--",
  });
}

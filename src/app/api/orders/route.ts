// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        waitress: {
          select: { id: true, name: true, eventId: true },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        customer: true,
        phone: true,
        tableId: true,
        eventId: true,
        event: { select: { name: true } },
      },
    });

    const ordersWithBooking = orders.map((order) => {
      const match = bookings.find(
        (b) =>
          b.tableId === order.table &&
          (!order.waitress?.eventId || b.eventId === order.waitress.eventId)
      );

      return {
        ...order,
        booking: match ?? null,
      };
    });

    return NextResponse.json(ordersWithBooking);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

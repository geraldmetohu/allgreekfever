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

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID not provided" }, { status: 400 });
    }

    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: {
        ...(body.paid !== undefined && { paid: body.paid }),
        ...(body.served !== undefined && { served: body.served }),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

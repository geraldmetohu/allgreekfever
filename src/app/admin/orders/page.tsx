"use client";

import { useEffect, useState } from "react";
import { Orders, OrderItem, Products, Staff, Event, Booking } from "@prisma/client";

interface FullOrderWithDetails extends Orders {
  waitress: Staff & { event: Event | null };
  orderItems: (OrderItem & { product: Products })[];
  booking?: Booking | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<FullOrderWithDetails[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="px-4 sm:px-6 py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">
        All Orders
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 text-slate-800">Created</th>
              <th className="p-2 text-blue-600">Waitress</th>
              <th className="p-2 text-purple-700">Event</th>
              <th className="p-2 text-pink-600">Table</th>
              <th className="p-2 text-yellow-700">Customer</th>
              <th className="p-2 text-teal-700">Products</th>
              <th className="p-2 text-violet-700">Payment</th>
              <th className="p-2 text-green-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-300">
                <td className="p-2 text-slate-800">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="p-2 text-blue-600">{order.waitress.name}</td>
                <td className="p-2 text-purple-700">
                  {order.waitress.event?.name || "Not Known"}
                </td>
                <td className="p-2 text-pink-600">{order.table}</td>
                <td className="p-2 text-yellow-700">
                  {order.booking?.customer || "-"}
                </td>
                <td className="p-2 text-teal-700 space-y-1">
                  {order.orderItems.map((item) => (
                    <div key={item.id}>
                      {item.product.name} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td
                  className={`p-2 font-semibold ${
                    order.paymentType === "CARD"
                      ? "text-blue-900"
                      : order.paymentType === "MIXED"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {order.paymentType}
                </td>
                <td className="p-2 text-green-600 font-bold">
                  £{order.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

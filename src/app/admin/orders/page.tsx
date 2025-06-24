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
    <div style={{ padding: 20 }}>
      <h1 className="text-blue-600" style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 ,}}>All Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-[900px] text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th style={{ padding: 10, color: "#1e293b" }}>Created</th>
              <th style={{ padding: 10, color: "#2563eb" }}>Waitress</th>
              <th style={{ padding: 10, color: "#6d28d9" }}>Event</th>
              <th style={{ padding: 10, color: "#db2777" }}>Table</th>
              <th style={{ padding: 10, color: "#ca8a04" }}>Customer</th>
              <th style={{ padding: 10, color: "#0f766e" }}>Products</th>
              <th style={{ padding: 10, color: "#7c3aed" }}>Payment</th>
              <th style={{ padding: 10, color: "#16a34a" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-300">
                <td style={{ padding: 10, color: "#1e293b" }}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: 10, color: "#2563eb" }}>
                  {order.waitress.name}
                </td>
                <td style={{ padding: 10, color: "#6d28d9" }}>
                  {order.waitress.event?.name || "Not Known"}
                </td>
                <td style={{ padding: 10, color: "#db2777" }}>{order.table}</td>
                <td style={{ padding: 10, color: "#ca8a04" }}>
                  {order.booking?.customer || "-"}
                </td>
                <td style={{ padding: 10, color: "#0f766e" }}>
                  {order.orderItems.map((item) => (
                    <div key={item.id}>
                      {item.product.name} x{item.quantity}
                    </div>
                  ))}
                </td>
                <td
                  style={{
                    padding: 10,
                    fontWeight: "bold",
                    color:
                      order.paymentType === "CARD"
                        ? "#1e40af"
                        : order.paymentType === "MIXED"
                        ? "#d97706"
                        : "#6b7280",
                  }}
                >
                  {order.paymentType}
                </td>
                <td style={{ padding: 10, color: "#16a34a", fontWeight: "bold" }}>
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

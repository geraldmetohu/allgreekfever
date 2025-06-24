
"use client";

import { useEffect, useRef, useState } from "react";
import { Orders, OrderItem, Products, Staff } from "@prisma/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FullOrder extends Orders {
  orderItems: (OrderItem & { product: Products })[];
  waitress: Staff;
}

export default function ClientOrderList({ isBartender, userEmail }: { isBartender: boolean, userEmail: string }) {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [lastSeenId, setLastSeenId] = useState<string | null>(null);
  const notificationRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/bar_orders");
      if (res.ok) {
        const data = await res.json();
        if (orders.length && data.length && isBartender) {
          const latestNew = data.find((o: FullOrder) => !orders.some(old => old.id === o.id));
          if (latestNew && latestNew.waitress.email !== userEmail) {
            notificationRef.current?.play();
            toast.success("New order received");
          }
        }
        setOrders(data);
        if (!lastSeenId && data.length) {
          setLastSeenId(data[0].id);
        }
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [orders, isBartender, lastSeenId, userEmail]);

  const toggleOrder = async (id: string, changes: { paid?: boolean; served?: boolean }) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });

    if (res.ok) {
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <audio ref={notificationRef} src="/notify.mp3" preload="auto" />
      <div className="overflow-x-auto">
        <table className="w-full table-auto border text-black">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Table</th>
              <th className="border p-2">Waitress</th>
              <th className="border p-2">Products</th>
              <th className="border p-2">Notes</th>
              <th className="border p-2">Total (£)</th>
              <th className="border p-2">Payment</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created</th>
              {isBartender && <th className="border p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr
                key={order.id}
                className={cn(
                  "text-sm text-black",
                  order.paid ? "bg-green-100" : order.served ? "bg-yellow-100" : "bg-red-100"
                )}
              >
                <td className="border p-2">{order.table}</td>
                <td className="border p-2">{order.waitress.name} ({order.waitress.email})</td>
                <td className="border p-2">
                  <ul>
                    {order.orderItems.map(item => (
                      <li key={item.id}>
                        {item.product.name} x {item.quantity} (£{item.price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2">{order.notes || "-"}</td>
                <td className="border p-2">£{order.total.toFixed(2)}</td>
                <td className="border p-2">{order.paymentType}</td>
                <td className="border p-2">
                  {order.paid ? "Paid" : order.served ? "Served Only" : "Unpaid"}
                </td>
                <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                {isBartender && (
                  <td className="border p-2 space-y-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded block"
                      onClick={() => toggleOrder(order.id, { paid: !order.paid })}
                    >
                      {order.paid ? "Unmark Paid" : "Mark Paid"}
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded block"
                      onClick={() => toggleOrder(order.id, { served: !order.served })}
                    >
                      {order.served ? "Unmark Served" : "Mark Served"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

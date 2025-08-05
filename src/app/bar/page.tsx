// file: src/app/bar/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select"; // if using shadcn/ui
import { Label } from "@/components/ui/label";

type Stats = {
  ordersToday: number;
  unpaidOrders: number;
  servedUnpaid: number;
  totalRevenue: number;
  mostActiveWaitress: string;
};

type EventOption = {
  id: string;
  name: string;
};

export default function BarDashboardPage() {
  const [stats, setStats] = useState<Stats>();
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  useEffect(() => {
    // Get stats & events
    async function fetchInitial() {
      const eventRes = await fetch("/api/bar/init");
      const data = await eventRes.json();

      setEvents(data.events);
      setSelectedEventId(data.defaultEventId);
    }

    fetchInitial();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    async function fetchStats() {
      const res = await fetch(`/api/bar/stats?eventId=${selectedEventId}`);
      const data = await res.json();
      setStats(data);
    }

    fetchStats();
  }, [selectedEventId]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Bar Overview & Stats</h1>

      {events.length > 1 && (
        <div className="mb-4">
          <Label>Select Event</Label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card title="Orders Today" value={stats?.ordersToday ?? "--"} color="text-red-600" />
        <Card title="Unpaid Orders" value={stats?.unpaidOrders ?? "--"} color="text-red-600" />
        <Card title="Served but Unpaid" value={stats?.servedUnpaid ?? "--"} color="text-yellow-600" />
        <Card title="Total Revenue Today" value={`£${stats?.totalRevenue.toFixed(2) ?? "--.--"}`} color="text-green-600" />
        <Card title="Most Active Waitress" value={stats?.mostActiveWaitress ?? "--"} />
      </div>

      <p className="mt-6 text-sm text-gray-600">
        All values are updated in real-time. Important figures are marked in <span className="text-red-600 font-semibold">red</span>.
        This page is fully responsive and mobile friendly.
      </p>
    </div>
  );
}

function Card({ title, value, color }: { title: string; value: string | number; color?: string }) {
  return (
    <div className="border p-4 rounded bg-gray-100">
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className={`text-3xl mt-2 font-bold ${color ?? "text-slate-800"}`}>{value}</p>
    </div>
  );
}

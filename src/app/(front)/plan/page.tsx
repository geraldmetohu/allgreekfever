'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Event, TableType } from "@/types";
import { getAllEventsfront, getTablesByEvent } from "@/app/actions";
import TableDetailsModal from "@/app/components/front/TablesDetailModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  BLACK: "#000000",
  GREY: "#6b7280",
  ORANGE: "#f97316",
  GREEN: "#22c55e",
  RED: "#ef4444",
  BRONZE: "#cd7f32",
};

export default function PlanPage() {
  const searchParams = useSearchParams();
  const eventIdParam = searchParams?.get("event") ?? null;

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [tables, setTables] = useState<TableType[]>([]);
  const [planSize, setPlanSize] = useState({ width: 0, height: 0 });
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [scale, setScale] = useState(1);
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.7;

      const planW = planSize.width * 20;
      const planH = planSize.height * 20;

      const scaleW = maxWidth / planW;
      const scaleH = maxHeight / planH;
      const finalScale = Math.min(scaleW, scaleH, 1);

      setScale(finalScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [planSize]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllEventsfront();
        setEvents(data);
        const initial = eventIdParam || data[0]?.id;
        if (initial) {
          setSelectedEventId(initial);
          const res = await getTablesByEvent(initial);
          setTables(res.tables);
          setPlanSize({ width: res.width, height: res.height });
          setPlanId(res.planId ?? null);
        }
      } catch (err) {
        toast.error("Failed to load plan data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [eventIdParam]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const featuredEvents = events.filter((e) => e.id !== selectedEventId).slice(0, 3);

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-bold text-amber-300 mb-4">Plan Your Night</h1>

        <div className="flex flex-wrap gap-2">
          {events.map((event) => (
            <Button
              key={event.id}
              className={cn(
                event.id === selectedEventId
                  ? "bg-green-700 text-amber-50 0 border-amber-50 border-2"
                  : "bg-green-700 hover:bg-green-400 ",
                "group px-3 py-2 rounded-md font-medium transition-colors"
              )}
              onClick={() => setSelectedEventId(event.id)}
            >
              {event.name}
            </Button>
          ))}
        </div>

        <div className="w-full mt-6 flex justify-center items-center bg-white rounded border overflow-hidden">
          <div
            className="relative"
            style={{
              width: `${planSize.width * 20}px`,
              height: `${planSize.height * 20}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {tables.map((table) => (
              <motion.div
                key={table.id}
                onClick={() => {
                  if (table.name === "Any" || !table.booked) {
                    setSelectedTable(table);
                  }
                }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`absolute text-[10px] text-white flex items-center justify-center font-medium shadow cursor-pointer hover:ring-2 transition-all duration-200 ${
                  table.booked && table.name !== "Any"
                    ? "bg-gray-400 cursor-not-allowed"
                    : ""
                }`}
                style={{
                  top: `${table.startY * 20}px`,
                  left: `${table.startX * 20}px`,
                  width: `${table.width * 20}px`,
                  height: `${table.height * 20}px`,
                  borderRadius: table.rounded ? "999px" : "6px",
                  backgroundColor:
                    table.booked && table.name !== "Any"
                      ? "#9ca3af"
                      : colorMap[table.color],
                  transform:
                    table.position === "DIAGONAL"
                      ? "rotate(45deg)"
                      : table.position === "HORIZONTAL"
                      ? "rotate(0deg)"
                      : "rotate(90deg)",
                }}
              >
                {table.name}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-800"
            onClick={() => {
              const anyTable = tables.find(
                (t) => t.name.toLowerCase() === "any" && !t.booked
              );
              if (anyTable) {
                setSelectedTable(anyTable);
              } else {
                toast.error("No available 'Any' table found.");
              }
            }}
          >
            Book Any Table
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {selectedEvent && (
          <div className="border rounded-xl p-4 shadow bg-amber-50">
            <h2 className="text-2xl text-teal-800 font-semibold mb-1">{selectedEvent.name}</h2>
            <p className="text-sm text-teal-700 mb-2">
              {new Date(selectedEvent.date).toLocaleDateString()} @ {selectedEvent.time}
            </p>
            <p className="text-blue-950 mb-2">{selectedEvent.description}</p>
            <p className="text-sm text-teal-950 italic">
              Location: {selectedEvent.location}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-3xl font-semibold text-amber-300 mb-3">Featured Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="block rounded-xl overflow-hidden shadow border hover:scale-[1.01] transition border-amber-50"
              >
                <Image
                  src={event.images?.[0] || "/placeholder.jpg"}
                  alt={event.name}
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1 truncate text-amber-200">
                    {event.name}
                  </h4>
                  <p className="text-xs text-amber-100 truncate">
                    {event.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for both desktop and mobile */}
      {selectedTable && selectedEvent && (
        <TableDetailsModal
          table={selectedTable}
          event={{ id: selectedEvent.id, name: selectedEvent.name }}
          onClose={() => setSelectedTable(null)}
          showToast={true}
        />
      )}
    </div>
  );
}

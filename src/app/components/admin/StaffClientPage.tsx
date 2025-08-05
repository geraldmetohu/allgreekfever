// src/app/components/admin/StaffClientPage.tsx
"use client";

import { useState } from "react";
import StaffForm from "./StaffForm";
import StaffList from "./StaffList";
import { Staff, Event } from "@prisma/client";

export type StaffWithEvent = Staff & { event: Event | null };

interface Props {
  events: { id: string; name: string }[];
  staff: StaffWithEvent[];
}

export default function StaffClientPage({ events, staff: initialStaff }: Props) {
  const [staff, setStaff] = useState<StaffWithEvent[]>(initialStaff);

  const handleStaffAdded = async (newStaff: Staff) => {
    const matchingEvent = events.find(e => e.id === newStaff.eventId);
    setStaff((prev) => [
      {
        ...newStaff,
        event: matchingEvent ? { id: matchingEvent.id, name: matchingEvent.name } as Event : null,
      },
      ...prev,
    ]);
  };

const handleDelete = async (id: string) => {
  const res = await fetch(`/api/staff/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    setStaff(prev => prev.filter(s => s.id !== id));
  } else {
    console.error("Failed to delete staff");
  }
};


  const handleToggleActive = async (id: string, currentValue: boolean) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentValue })
    });
    if (res.ok) {
      const updated = await res.json();
      setStaff(prev => prev.map(s => s.id === id ? { ...s, active: updated.active } : s));
    }
  };

  return (
<div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
  <h1 className="text-xl sm:text-2xl font-bold mb-6 text-blue-700">Staff Management</h1>
  <StaffForm events={events} onStaffAdded={handleStaffAdded} />
  <div className="mt-6">
    <StaffList staff={staff} onDelete={handleDelete} onToggleActive={handleToggleActive} />
  </div>
</div>

  );
}

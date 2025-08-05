// src/app/components/admin/StaffForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Roles, Staff } from "@prisma/client";

interface StaffFormProps {
  events: { id: string; name: string }[];
  onStaffAdded: (newStaff: Staff) => void;
}

export default function StaffForm({ events, onStaffAdded }: StaffFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "WAITRESS" as Roles,
    eventId: "",
    active: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: form.eventId || null }),
      });
      if (res.ok) {
        const newStaff = await res.json();
        onStaffAdded(newStaff);
        setForm({ name: "", email: "", role: "WAITRESS", eventId: "", active: false });
      }
    } catch (err) {
      console.error("Error creating staff:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
 <form
  onSubmit={handleSubmit}
  className="bg-white text-gray-950 p-4 sm:p-6 rounded shadow-md space-y-6 border border-gray-300"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Name"
      className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email"
      className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
    <select
      name="role"
      value={form.role}
      onChange={handleChange}
      className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {Object.values(Roles).map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
    <select
      name="eventId"
      value={form.eventId}
      onChange={handleChange}
      className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">No specific event</option>
      {events.map((event) => (
        <option key={event.id} value={event.id}>
          {event.name}
        </option>
      ))}
    </select>
  </div>

  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      name="active"
      checked={form.active}
      onChange={handleChange}
      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <label htmlFor="active" className="text-sm font-medium text-gray-700">
      Active
    </label>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
  >
    {loading ? "Adding..." : "Add Staff"}
  </button>
</form>

  );
}

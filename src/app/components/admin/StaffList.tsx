"use client";

import { Staff, Event } from "@prisma/client";

type StaffWithEvent = Staff & { event: Event | null };

interface Props {
  staff: StaffWithEvent[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentValue: boolean) => void;
}

export default function StaffList({ staff, onDelete, onToggleActive }: Props) {
  return (
    <div className="overflow-x-auto max-w-full w-full">
      <table className="min-w-[800px] sm:min-w-full text-sm border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-800">
            <th className="p-2 border border-gray-300">Name</th>
            <th className="p-2 border border-gray-300">Email</th>
            <th className="p-2 border border-gray-300">Role</th>
            <th className="p-2 border border-gray-300">Event</th>
            <th className="p-2 border border-gray-300">Active</th>
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((person) => (
            <tr key={person.id} className="border-t border-gray-300 text-blue-900">
              <td className="p-2 border border-gray-300">{person.name}</td>
              <td className="p-2 border border-gray-300">{person.email}</td>
              <td className="p-2 border border-gray-300">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium">
                  {person.role}
                </span>
              </td>
              <td className="p-2 border border-gray-300">
                {person.event?.name ?? "General"}
              </td>
              <td className="p-2 border border-gray-300">
                <button
                  onClick={() => onToggleActive(person.id, person.active)}
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    person.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {person.active ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="p-2 border border-gray-300">
                <button
                  onClick={() => onDelete(person.id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

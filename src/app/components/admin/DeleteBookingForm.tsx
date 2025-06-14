'use client';

import { useState } from "react";

export function DeleteBookingForm({ bookingId }: { bookingId: string }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      e.preventDefault();
    }
  };

  return (
    <form action={`/admin/booking/${bookingId}/delete`} method="POST" onSubmit={handleSubmit}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <button type="submit" className="w-full text-left text-red-600">Delete</button>
    </form>
  );
}

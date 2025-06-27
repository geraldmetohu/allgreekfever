'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { getAllEventsfront } from '@/app/actions';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getAllEventsfront().then((data) => {
      setEvents(data);
    });
  }, []);

  const now = new Date();

  return (
    <div className="px-4 py-12 max-w-6xl mx-auto text-amber-100">
      <h1 className="text-4xl font-bold text-amber-200 mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isPast = new Date(event.date) < now;

          return (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="relative block border-2 rounded-lg border-amber-300 overflow-hidden shadow hover:shadow-lg transition hover:animate-pulse"
            >
              <img
                src={event.images?.[0] || '/placeholder.jpg'}
                alt={event.name}
                className="w-full h-52 object-cover"
              />

              {/* Badge */}
              {isPast && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Completed
                </span>
              )}

              <div className="p-4">
                <h2 className="text-xl text-white font-semibold mb-1">{event.name}</h2>
                <p className="text-sm text-zinc-300">
                  <span suppressHydrationWarning>{new Date(event.date).toLocaleDateString()}</span> — {event.time}
                </p>
                <p className="text-sm text-amber-50 mt-1">{event.singer}</p>
                <p className="text-sm text-green-300 mt-2">From £{event.price.toFixed(2)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Event } from "@/types";

interface Props {
  events: Event[];
}

export default function EventShowcase({ events }: Props) {
  const latest = [...events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const now = new Date();

  return (
    <section className="bg-gradient-to-r from-zinc-900 to bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Browse Our Events</h2>
        <div className="grid md:grid-cols-3 gap-8 border-black">
          {latest.map((event) => {
            const isPast = new Date(event.date) < now;

            return (
              <Link
                href={`/event/${event.id}`}
                key={event.id}
                className="relative block rounded-xl overflow-hidden shadow-lg border-2 hover:scale-[1.01] transition border-blue-600"
              >
                <img
                  src={event.images?.[0] || "/placeholder.jpg"}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />

                {/* Badge for completed events */}
                {isPast && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Completed
                  </span>
                )}

                <div className="p-4">
                  <h3 className="font-bold text-gray-100 text-lg mb-1">{event.name}</h3>
                  <p className="text-sm text-amber-400 truncate">{event.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/events"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-800"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}

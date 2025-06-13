import { format } from "date-fns";
import { Event } from "@/types";

interface Props {
  events: Event[];
}

export default function NextEvent({ events }: Props) {
  const now = new Date();
  const next = [...events]
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  if (!next) return null;

  return (
    <section className="px-4 py-16 bg-gradient-to-l from-zinc-900 to bg-black text-white">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 space-y-4 ">
          <h2 className="text-4xl font-bold">Book a Bouzouki Night</h2>
          <p className="text-zinc-300 text-lg">
            {next.description.slice(0, 120)}...
          </p>
          <div className="text-sm text-amber-400">{format(new Date(next.date), 'PPP')} — {next.time}</div>
          <div className="mt-4">
            <a
              href={`/event/${next.id}`}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-800"
            >
              Reserve Now
            </a>
          </div>
        </div>
        <img
          src={next.images?.[0] || "/club.jpg"}
          alt={next.name}
          className="w-full md:w-96 h-72 object-cover rounded-2xl shadow-lg border-2 border-blue-600"
        />
      </div>
    </section>
  );
}

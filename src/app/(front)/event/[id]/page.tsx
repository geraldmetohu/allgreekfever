// src/app/(front)/event/[id]/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Music2, Clock, StarIcon } from 'lucide-react';
import { ImageSlider } from '@/app/components/front/ImageSlider';
import EventShowcase from '@/app/components/front/EventShowCase';
import { getEvents } from '@/app/actions';

async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      date: true,
      time: true,
      singer: true,
      location: true,
      price: true,
      image: true,
    },
  });

  if (!event) return notFound();
  return event;
}

export default async function EventPage({ params }: any) {
  const event = await getEventById(params.id);
  const events = await getEvents();

  const isPast = new Date(event.date) < new Date();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
        {/* ✅ ImageSlider */}
        <div className="relative">
          <ImageSlider images={event.image} />
          {isPast && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Completed
            </span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-amber-100">{event.name}</h1>
          <p className="text-2xl mt-2 text-green-500">£{event.price.toFixed(2)}</p>

          <div className="mt-4 space-y-2 text-amber-200 text-sm">
            <p className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {event.time}
            </p>
            <p className="flex items-center gap-2">
              <Music2 className="w-4 h-4" /> {event.singer}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {event.location}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            ))}
          </div>

          <p className="text-base text-zinc-100 mt-6 whitespace-pre-line">{event.description}</p>

          {isPast ? (
            <Button disabled className="mt-6 bg-gray-500 text-white cursor-not-allowed">
              Booking Closed
            </Button>
          ) : (
            <Button className="mt-6 bg-green-600 hover:bg-green-800" asChild>
              <a href={`/plan?event=${event.id}`}>Book a Table</a>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-16">
        <EventShowcase events={events} />
      </div>
    </>
  );
}

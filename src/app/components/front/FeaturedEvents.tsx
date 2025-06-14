import { Suspense } from "react";
import { EventCard } from "./EventCard";
import prisma from "@/lib/db";
import { LoadingEventCard } from "./LoadingEventCard";

async function getEvents() {
  const events = await prisma.event.findMany({
  where: {
    isFeatured: true,
  },
  select: {
    id: true,
    name: true,
    description: true,
    date: true,
    time: true,
    singer: true,
    location: true,
    price: true,
    image: true, // ✅ correct field
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 3,
});

return events.map((event) => ({
  id: event.id,
  name: event.name,
  description: event.description,
image: event.image ?? [], // ✅ safe fallback in case it's null
  date: event.date.toISOString(),
  time: event.time,
  singer: event.singer,
  location: event.location,
  price: event.price,
}));

}

export function FeaturedEvents() {
  return (
    <>
      <h2 className="text-2xl font-extrabold tracking-tight">Featured Events</h2>
      <Suspense fallback={<LoadingEventRows />}>
        <LoadFeaturedEvents />
      </Suspense>
    </>
  );
}

async function LoadFeaturedEvents() {
  const events = await getEvents();
  return (
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function LoadingEventRows() {
  return (
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <LoadingEventCard />
      <LoadingEventCard />
      <LoadingEventCard />
    </div>
  );
}

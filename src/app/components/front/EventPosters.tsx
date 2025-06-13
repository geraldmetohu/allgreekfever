"use client";

import { useEffect, useState } from "react";
import { PosterCard } from "./PosterCard";

type Poster = {
  id: string;
  title: string;
  imageString: string;
};

export function EventPosters({ eventId }: { eventId: string }) {
  const [posters, setPosters] = useState<Poster[] | null>(null);

  useEffect(() => {
    fetch(`/api/posters?eventId=${eventId}`)
      .then((res) => res.json())
      .then((data) => setPosters(data));
  }, [eventId]);

  if (!posters) {
    return <div className="space-y-4">Loading posters...</div>; // Optional: replace with shimmer
  }

  if (posters.length === 0) return null;

  return (
    <aside className="space-y-4">
      {posters.map((poster) => (
        <PosterCard key={poster.id} title={poster.title} src={poster.imageString} />
      ))}
    </aside>
  );
}

"use client";
import Image from "next/image";
import { useState } from "react";

export function PosterCard({ title, src }: { title: string; src: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-w-[300px] max-w-[300px] h-[90vh] flex-shrink-0 flex items-center justify-center">
      <div className="w-full h-full border rounded-lg overflow-hidden shadow-md flex flex-col">
        <div className="relative w-full h-full bg-gray-200">
          {!error && (
            <Image
              src={src}
              alt={title}
              fill
              sizes="100vw"
              className={`object-contain transition-all duration-500 ${
                loaded ? "animate-beat" : "opacity-0"
              }`}
              onLoadingComplete={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          )}
          {!loaded && !error && (
            <div className="absolute inset-0 animate-pulse bg-gray-300" />
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              Image unavailable
            </div>
          )}
        </div>
        <div className="p-4 text-center text-lg font-semibold bg-white">{title}</div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

const images = [
  '/sax.jpg',
  '/stage.jpg',
  '/valle.jpg',
  '/dancing2.jpg',
];

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full">
      <div className="relative h-[60vh] overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 border-2 border-amber-600 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === index ? 'bg-blue-700' : 'bg-white'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

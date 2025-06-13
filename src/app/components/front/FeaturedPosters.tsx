"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Poster {
  id: string;
  title: string;
  imageString: string;
}

export function FeaturedPosters() {
  const [poster, setPoster] = useState<Poster | null>(null);

  useEffect(() => {
    fetch("/api/posters?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setPoster(data[0]);
      });
  }, []);

  if (!poster) {
    return <div className="text-center py-10 text-muted">Loading featured poster...</div>;
  }

  return (
    
    <section className="w-full overflow-hidden py-8 bg-gradient-to-r from-zinc-900 to-black text-white">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">{poster.title}</h2>
<div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
  <div
  className="relative"
  style={{
    width: "100%",
    height: "80vh",
    overflow: "hidden",
    position: "relative",
  }}
>
  <img
    src={poster.imageString}
    alt={poster.title}
    style={{
      position: "absolute",
      top: "50%",
      left: "0%",
      transform: "translateY(-50%)",
      maxHeight: "70vh",
      width: "auto",
      animation: "moveX 6s ease-in-out infinite",
      animationPlayState: "running",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLImageElement).style.animationPlayState = "paused";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLImageElement).style.animationPlayState = "running";
    }}
  />
</div>
<style jsx global>{`
  @keyframes moveX {
    0% {
      left: 0%;
    }
    50% {
      left: 40%;
    }
    100% {
      left: 0%;
    }
  }

  @media (max-width: 768px) {
    @keyframes moveX {
      0% {
        left: 0%;
      }
      50% {
        left: 20%;
      }
      100% {
        left: 0%;
      }
    }
  }
`}</style>


      </div>
    </section>
  );
}

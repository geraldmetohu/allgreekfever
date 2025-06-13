"use client";
import { useEffect, useState } from "react";

export function CartCountBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const res = await fetch("/api/cart-count");
      const data = await res.json();
      setCount(data.count);
    }

    fetchCount();

    const interval = setInterval(fetchCount, 10000); // Refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span className="ml-2 text-sm font-medium text-zinc-100 group-hover:text-gray-800">
      {count}
    </span>
  );
}

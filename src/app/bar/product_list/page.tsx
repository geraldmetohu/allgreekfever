"use client";

import { useEffect, useState } from "react";
import { Products } from "@prisma/client";

export default function ProductListPage() {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-900">
        Product List
      </h2>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm text-zinc-900 border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-slate-800">
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Description</th>
              <th className="px-4 py-2 border border-gray-300 bg-indigo-100">VIP (£)</th>
              <th className="px-4 py-2 border border-gray-300 bg-yellow-100">Gold (£)</th>
              <th className="px-4 py-2 border border-gray-300 bg-sky-100">Silver (£)</th>
              <th className="px-4 py-2 border border-gray-300 bg-orange-100">Bronze (£)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="bg-white hover:bg-slate-50 transition">
                <td className="px-4 py-2 border border-gray-200 font-medium">{product.name}</td>
                <td className="px-4 py-2 border border-gray-200">{product.description}</td>
                <td className="px-4 py-2 border border-gray-200 text-indigo-800 font-bold">£{product.price_v}</td>
                <td className="px-4 py-2 border border-gray-200 text-yellow-900 font-bold">£{product.price_g}</td>
                <td className="px-4 py-2 border border-gray-200 text-cyan-800 font-bold">£{product.price_s}</td>
                <td className="px-4 py-2 border border-gray-200 text-orange-800 font-bold">£{product.price_b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
    <div className="max-w-5xl mx-auto p-6">
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "#1e3a8a" }}
      >
        Product List
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-zinc-900">
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6", color: "#1e293b" }}>
              <th style={{ padding: 10, border: "1px solid #e5e7eb" }}>Name</th>
              <th style={{ padding: 10, border: "1px solid #e5e7eb" }}>Description</th>
              <th style={{ padding: 10, border: "1px solid #e5e7eb", backgroundColor: "#c7d2fe" }}>VIP (£)</th>
              <th style={{ padding: 10, border: "1px solid #e5e7eb", backgroundColor: "#fde68a" }}>Gold (£)</th>
              <th style={{ padding: 10, border: "1px solid #e5e7eb", backgroundColor: "#e0f2fe" }}>Silver (£)</th>
              <th style={{ padding: 10, border: "1px solid #e5e7eb", backgroundColor: "#fed7aa" }}>Bronze (£)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ backgroundColor: "#f9fafb" }}>
                <td style={{ padding: 10, border: "1px solid #e5e7eb", fontWeight: "500" }}>{product.name}</td>
                <td style={{ padding: 10, border: "1px solid #e5e7eb" }}>{product.description}</td>
                <td style={{ padding: 10, border: "1px solid #e5e7eb", color: "#1e40af", fontWeight: "bold" }}>
                  £{product.price_v}
                </td>
                <td style={{ padding: 10, border: "1px solid #e5e7eb", color: "#92400e", fontWeight: "bold" }}>
                  £{product.price_g}
                </td>
                <td style={{ padding: 10, border: "1px solid #e5e7eb", color: "#0e7490", fontWeight: "bold" }}>
                  £{product.price_s}
                </td>
                <td style={{ padding: 10, border: "1px solid #e5e7eb", color: "#c2410c", fontWeight: "bold" }}>
                  £{product.price_b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

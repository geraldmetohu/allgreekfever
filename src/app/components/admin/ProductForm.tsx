// src/app/components/admin/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_v: 0,
    price_g: 0,
    price_s: 0,
    price_b: 0,
    quantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, step } = e.target as HTMLInputElement;
    let parsedValue: string | number = value;

    if (type === "number" && step === "10") {
      parsedValue = Math.round(parseFloat(value) / 10) * 10;
    } else if (name.startsWith("price") || name === "quantity") {
      parsedValue = parseFloat(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
        setForm({
          name: "",
          description: "",
          price_v: 0,
          price_g: 0,
          price_s: 0,
          price_b: 0,
          quantity: 0,
        });
      }
    } catch (err) {
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="bg-white text-gray-950 p-4 sm:p-6 rounded shadow-md space-y-6 border border-gray-300"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-800">Product Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-800">Description</span>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-800">Price VIP</span>
          <input
            name="price_v"
            type="number"
            step="10"
            value={form.price_v}
            onChange={handleChange}
            className="border border-gray-400 bg-gray-100 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-800">Price Gold</span>
          <input
            name="price_g"
            type="number"
            step="10"
            value={form.price_g}
            onChange={handleChange}
            className="border border-yellow-400 bg-yellow-100 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-800">Price Silver</span>
          <input
            name="price_s"
            type="number"
            step="10"
            value={form.price_s}
            onChange={handleChange}
            className="border border-blue-400 bg-blue-100 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-800">Price Bronze</span>
          <input
            name="price_b"
            type="number"
            step="10"
            value={form.price_b}
            onChange={handleChange}
            className="border border-amber-400 bg-amber-100 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-800">Quantity</span>
          <input
            name="quantity"
            type="number"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            className="border border-gray-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </label>
      </div>

 <button
    type="submit"
    disabled={loading}
    className="w-full sm:w-auto px-6 py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition"
  >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
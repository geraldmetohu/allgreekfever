// src/app/components/admin/ProductList.tsx
"use client";

import { Products } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductListProps {
  products: Products[];
}

export default function ProductList({ products: initialProducts }: ProductListProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Products[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Products>>({});

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEditClick = (product: Products) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: ["quantity", "price_v", "price_g", "price_s", "price_b"].includes(name) ? parseFloat(value) : value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await fetch(`/api/products/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setProducts(products.map(p => p.id === editingId ? { ...p, ...editForm } as Products : p));
    setEditingId(null);
    setEditForm({});
  };

  const adjustQuantity = (id: string, delta: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const updatedQty = product.quantity + delta;
    fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: updatedQty }),
    }).then(() => {
      setProducts(products.map(p => p.id === id ? { ...p, quantity: updatedQty } : p));
    });
  };

  return (
    <div className="overflow-x-auto max-w-full w-full">
      <table className="min-w-[800px] sm:min-w-full text-sm border border-gray-400">
        <thead>
          <tr className="bg-gray-200 text-left text-gray-900">
            <th className="p-2 border border-gray-400">Name</th>
            <th className="p-2 border border-gray-400">Description</th>
            <th className="p-2 border border-gray-400">VIP</th>
            <th className="p-2 border border-gray-400">Gold</th>
            <th className="p-2 border border-gray-400">Silver</th>
            <th className="p-2 border border-gray-400">Bronze</th>
            <th className="p-2 border border-gray-400">Qty</th>
            <th className="p-2 border border-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-gray-400">
              {editingId === product.id ? (
                <>
                  <td className="p-2 border border-gray-400">
                    <input
                      name="name"
                      value={editForm.name || ""}
                      onChange={handleFormChange}
                      className="border border-gray-600 text-black rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 border border-gray-400">
                    <input
                      name="description"
                      value={editForm.description || ""}
                      onChange={handleFormChange}
                      className="border border-gray-600 text-black rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 border border-gray-400">
                    <input
                      name="price_v"
                      type="number"
                      value={editForm.price_v ?? 0}
                      onChange={handleFormChange}
                      className="border border-gray-600 text-black rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 border border-gray-400">
                    <input
                      name="price_g"
                      type="number"
                      value={editForm.price_g ?? 0}
                      onChange={handleFormChange}
                      className="border border-gray-600 text-black rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 border border-gray-400">
                    <input
                      name="price_s"
                      type="number"
                      value={editForm.price_s ?? 0}
                      onChange={handleFormChange}
                      className="border border-gray-600 text-black rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 border border-gray-400">
                    <input
                      name="price_b"
                      type="number"
                      value={editForm.price_b ?? 0}
                      onChange={handleFormChange}
                      className="border border-gray-600 text-black rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 border border-gray-400 text-gray-950">
                    <input
                      name="quantity"
                      type="number"
                      value={editForm.quantity ?? 0}
                      onChange={handleFormChange}
                      className="border border-gray-600 text-zinc-800 rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 space-x-2 border border-gray-400">
                    <button onClick={handleUpdate} className="text-green-600 font-medium hover:underline">Save</button>
                    <button onClick={handleCancel} className="text-gray-500 font-medium hover:underline">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border border-gray-400 font-medium text-gray-900">{product.name}</td>
                  <td className="p-2 border border-gray-400 text-gray-800">{product.description}</td>
                  <td className="p-2 border border-gray-400"><span className="bg-gray-100 text-black px-2 py-1 rounded text-sm">£{product.price_v.toFixed(2)}</span></td>
                  <td className="p-2 border border-gray-400"><span className="bg-yellow-100 text-black px-2 py-1 rounded text-sm">£{product.price_g.toFixed(2)}</span></td>
                  <td className="p-2 border border-gray-400"><span className="bg-blue-100 text-black px-2 py-1 rounded text-sm">£{product.price_s.toFixed(2)}</span></td>
                  <td className="p-2 border border-gray-400"><span className="bg-amber-100 text-black px-2 py-1 rounded text-sm">£{product.price_b.toFixed(2)}</span></td>
                  <td className="p-2 border border-gray-400 flex items-center space-x-2">
                    <button onClick={() => adjustQuantity(product.id, -10)} className="px-2 py-1 bg-red-100 hover:bg-red-200 text-black rounded">-</button>
                    <span>{product.quantity}</span>
                    <button onClick={() => adjustQuantity(product.id, 10)} className="px-2 py-1 bg-green-100 hover:bg-green-200 text-black rounded">+</button>
                  </td>
                  <td className="p-2 border border-gray-400 space-x-2">
                    <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
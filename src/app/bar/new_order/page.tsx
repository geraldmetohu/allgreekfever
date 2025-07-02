"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, Products } from "@prisma/client";
import { createOrder } from "@/app/actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function NewOrderPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});
  const [notes, setNotes] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"CASH" | "CARD">("CASH");
  const [paid, setPaid] = useState(false);
  const [served, setServed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/waitress-tables");
      const data = await res.json();
      setTables(data.tables);
      setProducts(await (await fetch("/api/products")).json());
    }
    fetchData();
  }, []);

  const total = Object.entries(selectedProducts).reduce((acc, [id, qty]) => {
    const prod = products.find((p) => p.id === id);
    return acc + (prod ? prod.price_v * qty : 0);
  }, 0);

  const handleProductChange = (productId: string, quantity: number) => {
    setSelectedProducts((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleSubmit = async () => {
    const orderItems = Object.entries(selectedProducts).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return {
        productId,
        quantity,
        price: product?.price_v || 0,
      };
    });

    await createOrder({
      table: selectedTable,
      notes,
      total,
      paymentType,
      paid,
      served,
      orderItems,
    });

    router.push("/bar/orders");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#1e40af", marginBottom: 16 }}>
        New Order
      </h2>

      {/* Table selection */}
      <Label style={{ color: "#0f172a" }}>Table</Label>
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        style={{ borderColor: "#94a3b8", backgroundColor: "#f1f5f9" }}
      >
        <option value="">Select a table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.name}>
            {table.name}
          </option>
        ))}
      </select>

      {/* Product Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {products.map((product) => {
          const qty = selectedProducts[product.id] || 0;

          return (
            <div
              key={product.id}
              className="border rounded p-4 bg-slate-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                <span className="text-green-700 text-sm">£{product.price_v}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    handleProductChange(product.id, Math.max(qty - 1, 0))
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  −
                </button>
                <span className="text-lg font-medium">{qty}</span>
                <button
                  onClick={() => handleProductChange(product.id, qty + 1)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <Label style={{ color: "#0f172a" }}>Notes</Label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="mb-4"
        style={{ backgroundColor: "#f8fafc", borderColor: "#cbd5e1" }}
      />

      {/* Payment Type */}
      <RadioGroup
        defaultValue={paymentType}
        onValueChange={(v) => setPaymentType(v as "CASH" | "CARD")}
        className="mb-4"
      >
        <Label className="mr-4" style={{ color: "#0c4a6e" }}>Payment Method:</Label>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="CASH" id="cash" />
            <Label htmlFor="cash" style={{ color: "#6b7280" }}>Cash</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="CARD" id="card" />
            <Label htmlFor="card" style={{ color: "#6b7280" }}>Card</Label>
          </div>
        </div>
      </RadioGroup>

      {/* Paid / Served */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2" style={{ color: "#0284c7" }}>
          <input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} /> Paid
        </label>
        <label className="flex items-center gap-2" style={{ color: "#8b5cf6" }}>
          <input type="checkbox" checked={served} onChange={() => setServed(!served)} /> Served
        </label>
      </div>

      {/* Total */}
      <div className="mb-4 font-semibold" style={{ color: "#15803d", fontSize: 18 }}>
        Total: £{total.toFixed(2)}
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        style={{ backgroundColor: "#0f766e", color: "white" }}
      >
        Submit Order
      </Button>
    </div>
  );
}

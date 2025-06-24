"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

      <div className="space-y-4 mb-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <Label className="w-1/3" style={{ color: "#1e293b" }}>{product.name}</Label>
            <Input
              type="number"
              value={selectedProducts[product.id] || 0}
              onChange={(e) => handleProductChange(product.id, Number(e.target.value))}
              className="w-1/4"
              style={{ borderColor: "#60a5fa", backgroundColor: "#eff6ff" }}
              min={0}
            />
            <span className="text-sm" style={{ color: "#047857" }}>
              Price: £{product.price_v}
            </span>
          </div>
        ))}
      </div>

      <Label style={{ color: "#0f172a" }}>Notes</Label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="mb-4"
        style={{ backgroundColor: "#f8fafc", borderColor: "#cbd5e1" }}
      />

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

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2" style={{ color: "#0284c7" }}>
          <input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} /> Paid
        </label>
        <label className="flex items-center gap-2" style={{ color: "#8b5cf6" }}>
          <input type="checkbox" checked={served} onChange={() => setServed(!served)} /> Served
        </label>
      </div>

      <div className="mb-4 font-semibold" style={{ color: "#15803d", fontSize: 18 }}>
        Total: £{total.toFixed(2)}
      </div>

      <Button
        onClick={handleSubmit}
        style={{ backgroundColor: "#0f766e", color: "white" }}
      >
        Submit Order
      </Button>
    </div>
  );
}

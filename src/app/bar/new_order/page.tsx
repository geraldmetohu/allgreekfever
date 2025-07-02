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
  const [selectedTableId, setSelectedTableId] = useState<string>("");
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
      setTables(data.tables || []);
      const productsRes = await fetch("/api/products");
      const productData = await productsRes.json();
      setProducts(productData || []);
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
    if (!selectedTableId || total === 0) return;

    const table = tables.find((t) => t.id === selectedTableId);
    const tableName = table?.name || "Unknown";

    const orderItems = Object.entries(selectedProducts).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return {
        productId,
        quantity,
        price: product?.price_v || 0,
      };
    });

    await createOrder({
      table: tableName, // ✅ Save name, not ID
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#1e40af", marginBottom: 24 }}>
        New Order
      </h2>

      {/* Table Dropdown */}
      <Label style={{ color: "#0f172a", marginBottom: 8 }}>Table</Label>
      <select
        value={selectedTableId}
        onChange={(e) => setSelectedTableId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "24px",
          borderRadius: "6px",
          border: "1px solid #94a3b8",
          backgroundColor: "#f1f5f9",
        }}
      >
        <option value="">Select a table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id}>
            {table.name}
          </option>
        ))}
      </select>

      {/* Product Cards */}
      <Label style={{ display: "block", color: "#0f172a", fontSize: 18, marginBottom: 12 }}>
        Select Products
      </Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 }}>
        {products.map((product) => {
          const qty = selectedProducts[product.id] || 0;

          return (
            <div
              key={product.id}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: "bold", color: "#1e293b" }}>{product.name}</span>
                <span style={{ color: "#15803d" }}>£{product.price_v.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  onClick={() => handleProductChange(product.id, Math.max(qty - 1, 0))}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  −
                </button>
                <span style={{ fontSize: 18 }}>{qty}</span>
                <button
                  onClick={() => handleProductChange(product.id, qty + 1)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <Label style={{ color: "#0f172a", marginBottom: 8 }}>Notes</Label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#f1f5f9",
          marginBottom: 24,
        }}
      />

      {/* Payment Type */}
      <Label style={{ color: "#0f172a", marginBottom: 8 }}>Payment Method</Label>
      <div style={{ display: "flex", gap: "20px", marginBottom: 24 }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1e3a8a" }}>
          <input
            type="radio"
            value="CASH"
            checked={paymentType === "CASH"}
            onChange={() => setPaymentType("CASH")}
          />
          Cash
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1e3a8a" }}>
          <input
            type="radio"
            value="CARD"
            checked={paymentType === "CARD"}
            onChange={() => setPaymentType("CARD")}
          />
          Card
        </label>
      </div>

      {/* Paid / Served */}
      <div style={{ display: "flex", gap: "20px", marginBottom: 24 }}>
        <label style={{ color: "#0ea5e9" }}>
          <input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} /> Paid
        </label>
        <label style={{ color: "#8b5cf6" }}>
          <input type="checkbox" checked={served} onChange={() => setServed(!served)} /> Served
        </label>
      </div>

      {/* Total */}
      <div style={{ fontWeight: "bold", fontSize: 18, color: "#16a34a", marginBottom: 24 }}>
        Total: £{total.toFixed(2)}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!selectedTableId || total === 0}
        style={{
          backgroundColor: "#0f766e",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        Submit Order
      </Button>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, Products } from "@prisma/client";

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
      try {
        const res = await fetch("/api/waitress_tables");
        const data = await res.json();
        console.log("Fetched Tables:", data);
        setTables(data.tables || []);

        const productsRes = await fetch("/api/products");
        const productData = await productsRes.json();
        console.log("Fetched Products:", productData);
        setProducts(productData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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

    try {
      const response = await fetch("/api/create_orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: tableName,
          notes,
          total,
          paymentType,
          paid,
          served,
          orderItems,
        }),
      });

      const result = await response.json();
      console.log("Order creation response:", result);
      router.push("/bar/orders");
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#0c4a6e", marginBottom: 24 }}>
        New Order
      </h2>

      <Label style={{ color: "#334155", marginBottom: 8 }}>Table</Label>
      <select
        value={selectedTableId}
        onChange={(e) => setSelectedTableId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "24px",
          borderRadius: "6px",
          border: "1px solid #94a3b8",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
        }}
      >
        <option value="" style={{ color: "#64748b" }}>Select a table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id} style={{ color: "#1e293b" }}>
            {table.name}
          </option>
        ))}
      </select>

      <Label style={{ display: "block", color: "#0f172a", fontSize: 18, marginBottom: 12 }}>
        Select Products
      </Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: 24 }}>
        {products.map((product) => (
          <div key={product.id} style={{ marginBottom: "16px" }}>
            <Label style={{ color: "#1e293b" }}>{product.name} (£{product.price_v})</Label>
            <select
              value={selectedProducts[product.id] || 0}
              onChange={(e) => handleProductChange(product.id, parseInt(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f1f5f9",
                color: "#1e293b",
              }}
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

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
          color: "#1e293b",
        }}
      />

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

      <div style={{ display: "flex", gap: "20px", marginBottom: 24 }}>
        <label style={{ color: "#0ea5e9" }}>
          <input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} /> Paid
        </label>
        <label style={{ color: "#8b5cf6" }}>
          <input type="checkbox" checked={served} onChange={() => setServed(!served)} /> Served
        </label>
      </div>

      <div style={{ fontWeight: "bold", fontSize: 18, color: "#16a34a", marginBottom: 24 }}>
        Total: £{total.toFixed(2)}
      </div>

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

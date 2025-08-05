"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, Products } from "@prisma/client";

type OrderItemForm = {
  productId: string;
  quantity: number;
};

export default function NewOrderPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([{ productId: "", quantity: 1 }]);
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
        setTables(data.tables || []);

        const productsRes = await fetch("/api/products");
        const productData = await productsRes.json();
        setProducts(productData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const total = orderItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    return acc + (product ? product.price_v * item.quantity : 0);
  }, 0);

  const handleItemChange = (index: number, field: "productId" | "quantity", value: string | number) => {
  const updatedItems = [...orderItems];

  if (field === "quantity") {
    updatedItems[index].quantity = Number(value);
  } else {
    updatedItems[index].productId = String(value);
  }

  setOrderItems(updatedItems);
};


  const handleAddItem = () => {
    setOrderItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  };

  const handleSubmit = async () => {
    if (!selectedTableId || total === 0) return;

    const table = tables.find((t) => t.id === selectedTableId);
    const tableName = table?.name || "Unknown";

    const formattedItems = orderItems
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product?.price_v || 0,
        };
      });

    try {
      const response = await fetch("/api/create_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: tableName,
          notes,
          total,
          paymentType,
          paid,
          served,
          orderItems: formattedItems,
        }),
      });

      const result = await response.json();
      router.push("/bar/order_list");
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#0c4a6e", marginBottom: 20 }}>
        New Order
      </h2>

      <Label style={{ marginBottom: 6 }}>Table</Label>
      <select
        value={selectedTableId}
        onChange={(e) => setSelectedTableId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "16px",
          borderRadius: "6px",
          border: "1px solid #94a3b8",
        }}
      >
        <option value="">Select a table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id}>
            {table.name}
          </option>
        ))}
      </select>

      <Label style={{ fontSize: 18, marginBottom: 12 }}>Products</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {orderItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <select
              value={item.productId}
              onChange={(e) => handleItemChange(index, "productId", e.target.value)}
              style={{
                flex: "2",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (£{product.price_v})
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              max={20}
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              style={{
                flex: "1",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            />
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddItem} style={{ marginBottom: 24 }}>
        ➕ Add Another Product
      </Button>

      <Label style={{ marginBottom: 8 }}>Notes</Label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ width: "100%", marginBottom: 24 }}
      />

      <Label style={{ marginBottom: 8 }}>Payment Method</Label>
      <div style={{ display: "flex", gap: "20px", marginBottom: 16 }}>
        <label>
          <input type="radio" checked={paymentType === "CASH"} onChange={() => setPaymentType("CASH")} /> Cash
        </label>
        <label>
          <input type="radio" checked={paymentType === "CARD"} onChange={() => setPaymentType("CARD")} /> Card
        </label>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: 16 }}>
        <label>
          <input type="checkbox" checked={paid} onChange={() => setPaid(!paid)} /> Paid
        </label>
        <label>
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
        }}
      >
        Submit Order
      </Button>
    </div>
  );
}

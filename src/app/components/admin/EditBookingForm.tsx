"use client";

import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CreateBooking, EditBooking } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitButton } from "../SubmitButtons";
import { Switch } from "@/components/ui/switch";
import { bookingSchema } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface EditBookingFormProps {
data?: {
  id: string;
  paid: boolean;
  date: Date;
  time: string;
  customer: string;
  email: string;
  phone?: string;
  tickets: number;
  total: number;
  tableId: string;
  eventId: string;
  eventName?: string;   // ✅ Add this
  tableName?: string;   // ✅ Add this
};

  isEdit?: boolean;
  eventOptions?: { id: string; name: string }[];
  planOptions?: { id: string; name: string }[];
  tableOptions?: { id: string; name: string }[];
  setEvent?: (id: string) => void;
  setPlan?: (id: string) => void;
  setTable?: (id: string) => void;
}

export function EditBookingForm({
  data,
  isEdit = true,
  eventOptions = [],
  planOptions = [],
  tableOptions = [],
  setEvent,
  setPlan,
  setTable,
}: EditBookingFormProps) {
  const [lastResult, action] = useActionState(
    isEdit ? EditBooking : CreateBooking,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bookingSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      className="max-w-3xl mx-auto py-10"
    >
      {isEdit && data && (
        <input type="hidden" name="bookingId" value={data.id} />
      )}
      {data && isEdit && (
        <input type="hidden" name="eventId" value={data.eventId} />
      )}
            <div className="flex items-center gap-x-4 pb-2">
              <Button asChild variant="outline" size="icon">
                <Link href="/admin/booking">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold tracking-tight">{isEdit ? "Edit Booking" : "Create Booking"}</h1>
            </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Booking" : "Create Booking"}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {!isEdit && (
            <>
              <div>
                <Label>Event</Label>
                <select
                  name="eventId"
                  onChange={(e) => setEvent?.(e.target.value)}
                  required
                >
                  <option value="">Select Event</option>
                  {eventOptions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Plan</Label>
                <select
                  onChange={(e) => setPlan?.(e.target.value)}
                  required
                >
                  <option value="">Select Plan</option>
                  {planOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Table</Label>
                <select
                  name="tableId"
                  onChange={(e) => setTable?.(e.target.value)}
                  required
                >
                  <option value="">Select Table</option>
                  {tableOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <p className="text-red-500">{fields.tableId.errors}</p>
              </div>
            </>
          )}

          <div>
            <Label>Customer</Label>
            <Input
              type="text"
              name="customer"
              defaultValue={data?.customer || ""}
              key={fields.customer.key}
            />
            <p className="text-red-500">{fields.customer.errors}</p>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              defaultValue={data?.email || ""}
              key={fields.email.key}
            />
            <p className="text-red-500">{fields.email.errors}</p>
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              type="text"
              name="phone"
              defaultValue={data?.phone || ""}
              key={fields.phone?.key}
            />
            <p className="text-red-500">{fields.phone?.errors}</p>
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              defaultValue={
                data?.date
                  ? new Date(data.date).toISOString().split("T")[0]
                  : ""
              }
              key={fields.date.key}
            />
            <p className="text-red-500">{fields.date.errors}</p>
          </div>

          <div>
            <Label>Time</Label>
            <Input
              type="text"
              name="time"
              defaultValue={data?.time || ""}
              key={fields.time.key}
            />
            <p className="text-red-500">{fields.time.errors}</p>
          </div>

          <div>
            <Label>Tickets</Label>
            <Input
              type="number"
              name="tickets"
              defaultValue={data?.tickets?.toString() || "1"}
              key={fields.tickets.key}
            />
            <p className="text-red-500">{fields.tickets.errors}</p>
          </div>

          <div>
            <Label>Total (£)</Label>
            <Input
              type="number"
              step="0.01"
              name="total"
              defaultValue={data?.total?.toString() || "0"}
              key={fields.total.key}
            />
            <p className="text-red-500">{fields.total.errors}</p>
          </div>

{isEdit && (
  <>
    <div>
      <Label>Event</Label>
      <Input
        type="text"
        value={data?.eventName || ""}
        readOnly
        disabled
      />
    </div>

    <div>
      <Label>Table</Label>
      <select name="tableId" defaultValue={data?.tableId} required>
        <option value="">Select Table</option>
        {tableOptions.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <p className="text-red-500">{fields.tableId.errors}</p>
    </div>
  </>
)}


          <div className="flex items-center gap-2">
            <Label>Paid</Label>
            <Switch name="paid" defaultChecked={data?.paid ?? false} />
            <p className="text-red-500">{fields.paid.errors}</p>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton text={isEdit ? "Update Booking" : "Create Booking"} />
        </CardFooter>
      </Card>
    </form>
  );
}

import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

async function getBooking(bookingId: string) {
  const data = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customer: true,
      email: true,
      phone: true,
      tickets: true,
      total: true,
      paid: true,
      date: true,
      time: true,
      table: {
        select: {
          name: true,
          plan: {
            select: {
              event: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!data) return notFound();
  return data;
}
export default async function ViewBookingPage(props: { params: { id: string } }) {
  const { params } = props;
  const data = await getBooking(params.id); // ✅ Safe now

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>View-only booking information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p><strong>Customer:</strong> {data.customer}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Phone:</strong> {data.phone ?? "N/A"}</p>
          <p><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {data.time}</p>
          <p><strong>Tickets (Seats):</strong> {data.tickets}</p>
          <p><strong>Total Paid:</strong> £{data.total.toFixed(2)}</p>
          <p><strong>Table:</strong> {data.table?.name ?? "N/A"}</p>
          <p><strong>Event:</strong> {data.table?.plan?.event?.name ?? "N/A"}</p>
          <p><strong>Status:</strong> {data.paid ? "Paid" : "Unpaid"}</p>
        </CardContent>
      </Card>
    </div>
  );
}

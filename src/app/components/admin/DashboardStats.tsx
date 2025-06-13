import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { PartyPopper, PoundSterling, CalendarDays, User2 } from "lucide-react";

async function getData() {
  const [bookings, events] = await Promise.all([
    prisma.booking.findMany({
      select: {
        total: true,
        customer: true,
      },
    }),
    prisma.event.findMany({
      select: {
        id: true,
      },
    }),
  ]);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const uniqueCustomers = new Set(bookings.map(b => b.customer)).size;

  return {
    bookingsCount: bookings.length,
    totalRevenue,
    eventsCount: events.length,
    customersCount: uniqueCustomers,
  };
}

export async function DashboardStats() {
  const { bookingsCount, totalRevenue, eventsCount, customersCount } = await getData();

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center p-2">
          <CardTitle>Total Revenue</CardTitle>
          <PoundSterling className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">£{new Intl.NumberFormat().format(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground">From all bookings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center p-2">
          <CardTitle>Total Bookings</CardTitle>
          <CalendarDays className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{bookingsCount}</p>
          <p className="text-xs text-muted-foreground">Total Booking Records</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center p-2">
          <CardTitle>Total Events</CardTitle>
          <PartyPopper className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{eventsCount}</p>
          <p className="text-xs text-muted-foreground">Events Created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center p-2">
          <CardTitle>Total Customers</CardTitle>
          <User2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{customersCount}</p>
          <p className="text-xs text-muted-foreground">Unique Customers</p>
        </CardContent>
      </Card>
    </div>
  );
}

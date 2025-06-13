import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownmenu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { DeleteBookingForm } from "./[id]/delete/page";

async function getBookings() {
  return await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      event: true,
    },
  });
}

export default async function BookingAdminPage() {
  const bookings = await getBookings();

  return (
    <>
      <Card className="mt-5">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Manage event bookings and view full details.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/booking/create">+ Create Booking</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-end">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.event?.name}</TableCell>
                  <TableCell>{booking.tickets}</TableCell>
                  <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/booking/${booking.id}`}>View</Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="secondary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

<DropdownMenuContent align="end">
  <DropdownMenuLabel>Action</DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuItem asChild>
    <Link href={`/admin/booking/${booking.id}/edit`}>Edit</Link>
  </DropdownMenuItem>
  <DropdownMenuItem asChild>
    <DeleteBookingForm bookingId={booking.id} />
  </DropdownMenuItem>
</DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

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
} from "@/components/ui/dropdown-menu"; // ✅ corrected import path
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import { deleteEvent } from "@/app/actions";

async function getEvents() {
  return await prisma.event.findMany({
    orderBy: { date: "desc" },
  });
}

export default async function EventInfoPage() {
  const events = await getEvents();

  return (
    <>
      <div className="flex justify-end items-center">
        <Button asChild className="flex items-center gap-x-2">
          <Link href="/admin/events/create">
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </Button>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Manage your events and update or delete them as needed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Singer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-end">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.singer}</TableCell>
                  <TableCell>£{event.price.toFixed(2)}</TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href={`/admin/events/${event.id}`}>Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <form action={deleteEvent}>
                            <input type="hidden" name="eventId" value={event.id} />
                            <button type="submit" className="w-full text-left">
                              Delete
                            </button>
                          </form>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

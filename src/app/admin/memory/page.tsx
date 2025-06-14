import { DeleteMemory } from "@/app/actions";
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
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getMemories() {
  return await prisma.memory.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function MemoriesRoute() {
  const memories = await getMemories();

  return (
    <>
      <div className="flex items-center justify-end">
        <Button asChild className="flex gap-x-2">
          <Link href="/admin/memory/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Memory</span>
          </Link>
        </Button>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Memories</CardTitle>
          <CardDescription>Manage your event memories</CardDescription>
        </CardHeader>
        <CardContent>
          {memories.length === 0 ? (
            <p className="text-gray-500 text-center">No memories found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memories.map((memory) => (
                  <TableRow key={memory.id}>
                    <TableCell>
                      <Image
                        src={memory.mediaUrl}
                        alt="Memory"
                        width={64}
                        height={64}
                        className="rounded-lg object-cover h-16 w-16"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{memory.title}</TableCell>
                    <TableCell className="font-medium">{memory.eventName}</TableCell>
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
                            <Link href={`/admin/memory/${memory.id}/edit`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
<DropdownMenuItem asChild>
  <form action={DeleteMemory}>
    <input type="hidden" name="memoryId" value={memory.id} />
    <button type="submit" className="w-full text-left text-red-600">
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
          )}
        </CardContent>
      </Card>
    </>
  );
}

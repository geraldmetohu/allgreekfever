// app/admin/poster/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FeaturedToggle } from "./FeaturedToggle"; // ✅ import client component
import { DeletePoster } from "@/app/actions";

async function getPosters() {
  return await prisma.poster.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      event: { select: { name: true } },
    },
  });
}

export default async function PosterRoute() {
  const posters = await getPosters();

  return (
    <>
      <div className="flex items-center justify-end">
        <Button asChild className="flex gap-x-2">
          <Link href="/admin/poster/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Poster</span>
          </Link>
        </Button>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Posters</CardTitle>
          <CardDescription>Manage event posters</CardDescription>
        </CardHeader>
        <CardContent>
          {posters.length === 0 ? (
            <p className="text-gray-500 text-center">No posters found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posters.map((poster) => (
                  <TableRow key={poster.id}>
                    <TableCell>
                      <Image
                        alt="Poster"
                        src={poster.imageString}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover h-16 w-16"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{poster.title}</TableCell>
                    <TableCell className="font-medium">{poster.event?.name ?? "N/A"}</TableCell>
                    <TableCell>
                      <FeaturedToggle id={poster.id} isFeatured={poster.isFeatured} />
                    </TableCell>
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
                            <Link href={`/admin/poster/${poster.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
<DropdownMenuItem asChild>
  <form action={DeletePoster}>
    <input type="hidden" name="posterId" value={poster.id} />
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

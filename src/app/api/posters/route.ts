import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Poster } from "@prisma/client"; // ✅ Import model type

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const featured = searchParams.get("featured");

  let posters: Poster[] = [];

  if (eventId) {
    posters = await prisma.poster.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });
  } else if (featured) {
    posters = await prisma.poster.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(posters);
}

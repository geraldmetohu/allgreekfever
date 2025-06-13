import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    image: string[]; // array of image URLs
    date: string;
    time: string;
    singer: string; // ISO string or formatted
    location: string;
    price: number;
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="rounded-lg">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {event.image.map((img, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[330px]">
                <Image
                  src={img}
                  alt={`Event image ${index + 1}`}
                  fill
                  className="object-cover object-center w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>

      <div className="flex justify-between items-center mt-2">
        <h1 className="font-semibold text-xl">{event.name}</h1>
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10">
          £{event.price}
        </span>
      </div>

      <p className="text-gray-500 text-sm mt-1">{event.date} — {event.location}</p>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{event.description}</p>

      <Button asChild className="w-full mt-5 bg-blue-600 text-primary hover:text-white hover:bg-blue-900">
        <Link href={`/event/${event.id}`}>Reserve Your Spot</Link>
      </Button>
    </div>
  );
}

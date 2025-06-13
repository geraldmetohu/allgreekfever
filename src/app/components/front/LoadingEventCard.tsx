import { Skeleton } from "@/components/ui/skeleton";

export function LoadingEventCard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-[330px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-full" />
      </div>
      <Skeleton className="h-10 mt-5 w-full" />
    </div>
  );
}

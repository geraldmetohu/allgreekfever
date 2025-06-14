import { DeleteMemory } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function DeleteMemoryRoute({ params }: PageProps) {
  return (
    <div className="h-[88vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this memory?</CardTitle>
          <CardDescription>
            This action cannot be undone. It will permanently delete this memory entry.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/admin/memory">Cancel</Link>
          </Button>
          <form action={DeleteMemory}>
            <input type="hidden" name="memoryId" value={params.id} />
            <SubmitButton variant="destructive" text="Delete Memory" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

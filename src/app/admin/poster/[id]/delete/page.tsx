import { DeletePoster } from "@/app/actions";
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

export default function DeletePosterRoute({ params }: { params: { id: string } }) {
  return (
    <div className="h-[88vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this poster?</CardTitle>
          <CardDescription>
            This action cannot be undone. It will permanently delete this poster and remove all related data.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/admin/poster">Cancel</Link>
          </Button>
          <form action={DeletePoster}>
            <input type="hidden" name="posterId" value={params.id} />
            <SubmitButton variant="destructive" text="Delete Poster" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

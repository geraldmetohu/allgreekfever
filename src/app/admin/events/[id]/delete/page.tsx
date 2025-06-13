import { DeleteEvent } from "@/app/actions";
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

export default function DeleteEventRoute({ params }: { params: { id: string } }) {
  return (
    <div className="h-[88vh] w-full flex items-center justify-center">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this event?</CardTitle>
          <CardDescription>
            This action cannot be undone. It will permanently delete this event and all related data from our servers.
          </CardDescription>
        </CardHeader>

        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/admin/events">Cancel</Link>
          </Button>

          <form action={DeleteEvent}>
            <input type="hidden" name="eventId" value={params.id} />
            <SubmitButton variant="destructive" text="Delete Event" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

// app/admin/poster/create/CreatePosterForm.tsx

'use client';

import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { posterSchema } from "@/lib/zodSchemas";
import { CreatePoster } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
}

interface Props {
  events: Event[];
}

export default function CreatePosterForm({ events }: Props) {
  const [image, setImage] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const [lastResult, action] = useActionState(CreatePoster, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: posterSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDelete = () => setImage(undefined);

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4 mb-5">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/poster">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Poster</h1>
      </div>

      <Card>
        <CardHeader className="mt-5">
          <CardTitle>Poster Details</CardTitle>
          <CardDescription>Create a poster for an event</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-y-6">
            {/* Title Field */}
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.title.name}>Title</Label>
              <Input
                id={fields.title.name}
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                type="text"
                placeholder="Poster title"
              />
              {fields.title.errors && (
                <p className="text-red-500">{fields.title.errors}</p>
              )}
            </div>

            {/* Event Selection Dropdown */}
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.eventId.name}>Event</Label>
              <select
                id={fields.eventId.name}
                name={fields.eventId.name}
                key={fields.eventId.key}
                defaultValue={fields.eventId.initialValue}
                className="border rounded-md p-2"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              {fields.eventId.errors && (
                <p className="text-red-500">{fields.eventId.errors}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-3">
              <Label>Image</Label>
              <input
                type="hidden"
                name={fields.imageString.name}
                value={image ?? ""}
                key={fields.imageString.key}
              />

              {image ? (
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    src={image}
                    alt="Uploaded Poster Image"
                    width={200}
                    height={200}
                    className="object-cover rounded-lg border w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border border-dashed p-4 rounded-md">
                  <UploadButton
                    className="ut-button:bg-blue-600 ut-button:text-white ut-button:rounded-md ut-button:px-4 ut-button:py-2 ut-button:hover:bg-blue-700"
                    endpoint="posterImageRoute"
                    onClientUploadComplete={(res) => {
                      if (res.length > 0) {
                        const url = res[0].url;
                        setImage(url);
                        setUploading(false);
                      }
                    }}
                    onUploadError={(error) => {
                      console.error("❌ Upload error:", error);
                      alert("Upload failed: " + error.message);
                      setUploading(false);
                    }}
                    onUploadBegin={() => {
                      setUploading(true);
                    }}
                  />
                </div>
              )}
              {fields.imageString.errors && (
                <p className="text-red-500">{fields.imageString.errors}</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton text="Create Poster" />
        </CardFooter>
      </Card>
    </form>
  );
}

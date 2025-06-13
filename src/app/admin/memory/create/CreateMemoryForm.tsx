// app/admin/memory/create/CreateMemoryForm.tsx

'use client';

import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { memorySchema } from "@/lib/zodSchemas";
import { CreateMemory } from "@/app/actions";
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

export default function CreateMemoryForm({ events }: Props) {
  const [mediaUrl, setMediaUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const [lastResult, action] = useActionState(CreateMemory, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: memorySchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDelete = () => setMediaUrl(undefined);

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4 mb-5">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/memory">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Memory</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Memory Details</CardTitle>
          <CardDescription>Upload an event memory</CardDescription>
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
                placeholder="Memory title"
              />
              {fields.title.errors && (
                <p className="text-red-500">{fields.title.errors}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.description.name}>Description</Label>
              <Input
                id={fields.description.name}
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={fields.description.initialValue}
                type="text"
                placeholder="Short description"
              />
              {fields.description.errors && (
                <p className="text-red-500">{fields.description.errors}</p>
              )}
            </div>

            {/* Event Selection Dropdown */}
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.eventName.name}>Event</Label>
              <select
                id={fields.eventName.name}
                name={fields.eventName.name}
                key={fields.eventName.key}
                defaultValue={fields.eventName.initialValue}
                className="border rounded-md p-2"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
              {fields.eventName.errors && (
                <p className="text-red-500">{fields.eventName.errors}</p>
              )}
            </div>

            {/* Media Upload */}
            <div className="flex flex-col gap-3">
              <Label>Media (image or video)</Label>
              <input
                type="hidden"
                name={fields.mediaUrl.name}
                value={mediaUrl ?? ""}
                key={fields.mediaUrl.key}
              />

              {mediaUrl ? (
                <div className="relative w-[300px] h-[200px]">
                  <Image
                    src={mediaUrl}
                    alt="Memory media"
                    fill
                    className="rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border border-dashed p-4 rounded-md">
                  <UploadButton
                    className="ut-button:bg-blue-600 ut-button:text-white ut-button:px-4 ut-button:py-2"
                    endpoint="memoryMediaRoute"
                    onClientUploadComplete={(res) => {
                      if (res.length > 0) {
                        const url = res[0].url;
                        setMediaUrl(url);
                        setUploading(false);
                      }
                    }}
                    onUploadError={(error) => {
                      console.error("❌ Upload error:", error);
                      alert("Upload failed: " + error.message);
                      setUploading(false);
                    }}
                    onUploadBegin={() => setUploading(true)}
                  />
                </div>
              )}

              {fields.mediaUrl.errors && (
                <p className="text-red-500">{fields.mediaUrl.errors}</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton text="Create Memory" />
        </CardFooter>
      </Card>
    </form>
  );
}

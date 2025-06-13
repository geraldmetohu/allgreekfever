"use client";

import { CreateEvent } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { generateUploadButton } from "@uploadthing/react";
import { eventSchema } from "@/lib/zodSchemas";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Image from "next/image";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

export default function CreateEventPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lastResult, action] = useActionState(CreateEvent, undefined);

  const handleDelete = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="flex items-center gap-x-4 pb-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/events">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill in the details to add a new event.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Event Name</Label>
            <Input name={fields.name.name} defaultValue={fields.name.initialValue} key={fields.name.key} />
            <p className="text-red-500">{fields.name.errors}</p>
          </div>
          <div>
            <Label>Singer</Label>
            <Input name={fields.singer.name} defaultValue={fields.singer.initialValue} key={fields.singer.key} />
            <p className="text-red-500">{fields.singer.errors}</p>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" name={fields.date.name} defaultValue={fields.date.initialValue} key={fields.date.key} />
            <p className="text-red-500">{fields.date.errors}</p>
          </div>
          <div>
            <Label>Time</Label>
            <Input name={fields.time.name} defaultValue={fields.time.initialValue} key={fields.time.key} placeholder="e.g. 20:00" />
            <p className="text-red-500">{fields.time.errors}</p>
          </div>
          <div>
            <Label>Location</Label>
            <Input name={fields.location.name} defaultValue={fields.location.initialValue} key={fields.location.key} />
            <p className="text-red-500">{fields.location.errors}</p>
          </div>
          <div>
            <Label>Price (£)</Label>
            <Input type="number" name={fields.price.name} defaultValue={fields.price.initialValue} key={fields.price.key} step="0.01" />
            <p className="text-red-500">{fields.price.errors}</p>
          </div>
        </CardContent>

        <CardContent className="space-y-4">
          <div>
            <Label>Description</Label>
            <Textarea name={fields.description.name} defaultValue={fields.description.initialValue} key={fields.description.key} />
            <p className="text-red-500">{fields.description.errors}</p>
          </div>

          <div>
            <Label>Upload Images</Label>

            {imageUrls.map((url, index) => (
              <input
                type="hidden"
                key={index}
                name={fields.images.name}
                value={url}
              />
            ))}

            <div className="border border-dashed p-4 rounded-md">
              <UploadButton
                endpoint="eventImageRoute"
                onClientUploadComplete={(res) => {
                  const urls = res.map((r) => r.url);
                  console.log("✅ Upload complete:", urls);
                  setImageUrls((prev) => [...prev, ...urls]);
                  setUploading(false);
                }}
                onUploadError={(error) => {
                  console.error("❌ Upload error:", error);
                  setUploading(false);
                  alert("Upload failed: " + error.message);
                }}
                onUploadBegin={(name) => {
                  console.log("🔄 Uploading:", name);
                  setUploading(true);
                }}
                className="ut-button:bg-blue-600 ut-button:text-white ut-button:rounded-md ut-button:px-4 ut-button:py-2 ut-button:hover:bg-blue-700"
              />
            </div>

            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative w-[100px] h-[100px]">
                    <Image
                      src={url}
                      alt="Uploaded Event Image"
                      width={100}
                      height={100}
                      className="object-cover rounded-lg border w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploading && <p className="text-yellow-600">Uploading images...</p>}
            <p className="text-red-500">{fields.images.errors}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              name={fields.isFeatured.name}
              defaultChecked={fields.isFeatured.initialValue === "true"}
              key={fields.isFeatured.key}
            />
            <Label htmlFor="isFeatured">Mark as Featured</Label>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton text="Create Event" />
        </CardFooter>
      </Card>
    </form>
  );
}

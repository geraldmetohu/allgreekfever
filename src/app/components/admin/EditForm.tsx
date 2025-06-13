"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "../SubmitButtons";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState, useState } from "react";
import { eventSchema } from "@/lib/zodSchemas";
import { EditEvent } from "@/app/actions";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

interface EditEventProps {
  data: {
    id: string;
    name: string;
    description: string;
    date: string; // yyyy-mm-dd
    time: string;
    singer: string;
    location: string;
    price: number;
    image: string[];
    isFeatured: boolean;
  };
}

export default function EditEventForm({ data }: EditEventProps) {
  const [images, setImages] = useState<string[]>(data.image || []);
  const [uploading, setUploading] = useState(false);

  const [lastResult, action] = useActionState(EditEvent, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} className="max-w-4xl mx-auto py-8">
      <input type="hidden" name="eventId" value={data.id} />
      <div className="flex items-center gap-x-4 pb-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/events">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Edit Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Update your event information.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div>
            <Label>Name</Label>
            <Input name={fields.name.name} defaultValue={data.name} key={fields.name.key} />
            <p className="text-red-500">{fields.name.errors}</p>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea name={fields.description.name} defaultValue={data.description} key={fields.description.key} />
            <p className="text-red-500">{fields.description.errors}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" name={fields.date.name} defaultValue={data.date} key={fields.date.key} />
              <p className="text-red-500">{fields.date.errors}</p>
            </div>
            <div>
              <Label>Time</Label>
              <Input type="text" name={fields.time.name} defaultValue={data.time} key={fields.time.key} />
              <p className="text-red-500">{fields.time.errors}</p>
            </div>
          </div>

          <div>
            <Label>Singer</Label>
            <Input name={fields.singer.name} defaultValue={data.singer} key={fields.singer.key} />
            <p className="text-red-500">{fields.singer.errors}</p>
          </div>

          <div>
            <Label>Location</Label>
            <Input name={fields.location.name} defaultValue={data.location} key={fields.location.key} />
            <p className="text-red-500">{fields.location.errors}</p>
          </div>

          <div>
            <Label>Price (£)</Label>
            <Input
              type="number"
              name={fields.price.name}
              defaultValue={data.price}
              key={fields.price.key}
              step="0.01"
            />
            <p className="text-red-500">{fields.price.errors}</p>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              name={fields.isFeatured.name}
              defaultChecked={data.isFeatured}
              key={fields.isFeatured.key}
            />
            <Label>Featured</Label>
            <p className="text-red-500">{fields.isFeatured.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Images</Label>

            {/* Hidden fields for each image */}
            {images.map((url, index) => (
              <input type="hidden" key={index} name={fields.images.name} value={url} />
            ))}

            <div className="border border-dashed p-4 rounded-md">
              <UploadButton
                endpoint="eventImageRoute"
                onClientUploadComplete={(res) => {
                  const urls = res.map((r) => r.url);
                  setImages((prev) => [...prev, ...urls]);
                  setUploading(false);
                }}
                onUploadError={(err) => {
                  console.error(err);
                  alert("Upload failed");
                  setUploading(false);
                }}
                onUploadBegin={() => setUploading(true)}
                className="ut-button:bg-blue-600 ut-button:text-white ut-button:rounded-md ut-button:px-4 ut-button:py-2 ut-button:hover:bg-blue-700"
              />
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {images.map((url, index) => (
                  <div key={index} className="relative w-[100px] h-[100px]">
                    <Image
                      src={url}
                      alt="Event Image"
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
        </CardContent>

        <CardFooter>
          <SubmitButton text="Update Event" />
        </CardFooter>
      </Card>
    </form>
  );
}

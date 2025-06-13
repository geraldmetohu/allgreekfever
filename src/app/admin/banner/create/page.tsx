"use client";

import { CreateBanner } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing"; // ✅ Switched from UploadDropzone
import { bannerSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function BannerRoute() {
  const [image, setImage] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const [lastResult, action] = useActionState(CreateBanner, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bannerSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput"
  });

  const handleDelete = () => setImage(undefined);

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4 mb-5">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Banner</h1>
      </div>

      <Card>
        <CardHeader className="mt-5">
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>Create your banner here</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-3">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                type="text"
                placeholder="Create title for Banner"
              />
              <p className="text-red-500">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Subtitle</Label>
              <Input
                name={fields.subtitle.name}
                key={fields.subtitle.key}
                defaultValue={fields.subtitle.initialValue}
                type="text"
                placeholder="Create title for Banner"
              />
              <p className="text-red-500">{fields.subtitle.errors}</p>
            </div>

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
                    alt="Uploaded Banner Image"
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
                    className="ut-button:bg-blue-600 ut-button:text-white ut-button:rounded-md ut-button:px-4 ut-button:py-2  ut-button:hover:bg-blue-700
"

                    endpoint="bannerImageRoute"
                    onClientUploadComplete={(res) => {
                      if (res.length > 0) {
                        const url = res[0].url;
                        console.log("✅ Upload complete:", url);
                        setImage(url);
                        setUploading(false);
                      }
                    }}
                    onUploadError={(error) => {
                      console.error("❌ Upload error:", error);
                      alert("Upload failed: " + error.message);
                      setUploading(false);
                    }}
                    onUploadBegin={(name) => {
                      console.log("🔄 Uploading:", name);
                      setUploading(true);
                    }}
                  />
                </div>
              )}

              <p className="text-red-500">{fields.imageString.errors}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton text="Create Banner" />
        </CardFooter>
      </Card>
    </form>
  );
}

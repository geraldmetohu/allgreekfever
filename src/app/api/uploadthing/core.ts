import { ADMIN_EMAILS } from "@/lib/adminemails";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !ADMIN_EMAILS.includes(user.email!))
        throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
  bannerImageRoute: f({
      image: {
        maxFileSize: "4MB",
        maxFileCount: 1,
      },
    })
      // Set permissions and file types for this FileRoute
      .middleware(async ({ req }) => {
        // This code runs on your server before upload
        const { getUser } = getKindeServerSession()
        const user = await getUser()
  
        // If you throw, the user will not be able to upload
      if (!user || !ADMIN_EMAILS.includes(user.email!))
        throw new UploadThingError("Unauthorized");

  
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
  
        console.log("file url", file.url);
  
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
    }),
    
  posterImageRoute: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !ADMIN_EMAILS.includes(user.email!)) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Poster image uploaded by:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // ✅ NEW EVENT IMAGE ROUTE
eventImageRoute: f({
  image: {
    maxFileSize: "4MB",
    maxFileCount: 10,
  },
})
.middleware(async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log("🔍 Checking user in UploadThing middleware...");
  console.log("👤 User:", user);

  if (!user || !ADMIN_EMAILS.includes(user.email!)) {
    console.log("❌ Unauthorized upload attempt by:", user?.email);
    throw new UploadThingError("Unauthorized");
  }

  console.log("✅ Authorized upload by:", user.email);
  return { userId: user.id };
})
.onUploadComplete(async ({ metadata, file }) => {
  console.log("📦 Upload complete for userId:", metadata.userId);
  console.log("🖼️ File URL:", file.url);
  return { uploadedBy: metadata.userId };
}),

memoryMediaRoute: f({
  image: { maxFileSize: "8MB", maxFileCount: 1 },
})
  .middleware(async ({ req }) => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email!)) {
      throw new UploadThingError("Unauthorized");
    }
    return { userId: user.id };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Memory uploaded by:", metadata.userId);
    return { uploadedBy: metadata.userId };
  }),


} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

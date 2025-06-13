import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subitle is required"),
  imageString: z.string().min(1, "Image string is required"),
});

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  time: z.string().min(1, "Time is required"),
  singer: z.string().min(1, "Singer name is required"),
  location: z.string().min(1, "Location is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  isFeatured: z.boolean(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export const bookingSchema = z.object({
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  time: z.string().min(1, "Time is required"),
  customer: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(5, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional(),
  tickets: z.coerce.number().int().min(1, "Must book at least one ticket"),
  total: z.coerce.number().min(0, "Total must be 0 or more"),
  tableId: z.string().min(1, "Table ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
  paid: z.coerce.boolean().optional().default(false), // ← for consistency with Prisma default
});

export const tableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  shape: z.enum(["CIRCLE", "RECTANGULAR", "SQUARE"]),
  position: z.enum(["VERTICAL", "DIAGONAL", "HORIZONTAL"]),
  color: z.enum(["BLACK", "GREY", "ORANGE", "GREEN", "RED", "BRONZE"]),
  rounded: z.boolean(),
  booked: z.boolean(),
  width: z.coerce.number().int().min(1, "Width must be at least 1"),
  height: z.coerce.number().int().min(1, "Height must be at least 1"),
  startX: z.coerce.number().int().min(0, "Start X must be at least 0"),
  startY: z.coerce.number().int().min(0, "Start Y must be at least 0"),
  seats: z.coerce.number().int().min(1, "Must have at least 1 seat"),
  price: z.coerce.number().int().min(0, "Price must be 0 or more"),
  planId: z.string().min(1, "Plan ID is required"),
});

export const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  width: z.coerce.number().int().min(1, "Width must be at least 1"),
  height: z.coerce.number().int().min(1, "Height must be at least 1"),
  eventId: z.string().min(1, "Event ID is required"),
});

// Optional: Extend it for admin updates (including id)
export const updatePlanSchema = planSchema.extend({
  planId: z.string().min(1),
});



export const memorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  mediaUrl: z.string().url("Must be a valid URL"),
  eventName: z.string().min(1, "Event name is required"),
});

export const posterSchema = z.object({
  title: z.string().trim().min(1, "Poster title is required"),
  imageString: z.string().url("Image must be a valid URL"),
  isFeatured: z.boolean().optional().default(false),
  eventId: z.string().min(1, "Event ID is required"),
});

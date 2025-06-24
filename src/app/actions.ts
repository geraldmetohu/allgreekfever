"use server";
import { type SubmissionResult } from "@conform-to/react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import prisma from "@/lib/db";
import { bannerSchema, bookingSchema, eventSchema, memorySchema, posterSchema, updatePlanSchema } from "@/lib/zodSchemas";
import { ADMIN_EMAILS } from "@/lib/adminemails";
import { z } from "zod";
import { revalidatePath } from 'next/cache';
import { BookingDraft, Cart, CartItem } from "@/lib/interfaces";
import { redis } from "@/lib/redis";
import { Event, Memory } from "@/types";
import { v4 as uuid } from 'uuid';
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";


export async function getBanners() {
  const banners = await prisma.banner.findMany({
    orderBy: {
      createdAt: "desc", // You can change this to a custom field if needed
    },
  });

  return banners;
}

export async function CreateBanner(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      subtitle: submission.value.subtitle,
      imageString: submission.value.imageString,
    },
  });

  redirect("/admin/banner");
}

export async function EditBanner(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = parseWithZod(formData, { schema: bannerSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const bannerId = formData.get("bannerId") as string;
  if (!bannerId) throw new Error("Missing banner ID");

  await prisma.banner.update({
    where: { id: bannerId },
    data: {
      title: submission.value.title,
      subtitle: submission.value.subtitle,
      imageString: submission.value.imageString,
    },
  });

  redirect("/admin/banner");
}

export async function DeleteBanner(formData: FormData) {
    const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const bannerId = formData.get("bannerId") as string;
  if (!bannerId) throw new Error("Missing banner ID");

  await prisma.banner.delete({
    where: {
      id: bannerId,
    },
  });

  redirect("/admin/banner");
}

export async function CreateEvent(_: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = parseWithZod(formData, {
    schema: eventSchema,
  });

  if (submission.status !== "success") {
    return submission.reply(); // return validation errors
  }

  await prisma.event.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      date: new Date(submission.value.date), // ✅ Convert to Date object
      time: submission.value.time,
      singer: submission.value.singer,
      location: submission.value.location, // ✅ fixed
      image: submission.value.images,      // ✅ use as-is
      price: submission.value.price,
      isFeatured: submission.value.isFeatured,
    },
  });

  redirect("/admin/events");
}

export async function EditEvent(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = parseWithZod(formData, {
    schema: eventSchema,
  });

  if (submission.status !== "success") {
    return submission.reply(); // return validation errors
  }

  const eventId = formData.get("eventId") as string;

  if (!eventId) {
    throw new Error("Event ID is required for editing.");
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      name: submission.value.name,
      description: submission.value.description,
      date: new Date(submission.value.date),
      time: submission.value.time,
      singer: submission.value.singer,
      location: submission.value.location,
      price: submission.value.price,
      isFeatured: submission.value.isFeatured,
      image: submission.value.images,
    },
  });

  redirect("/admin/events");
}

export async function DeleteEvent(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const eventId = formData.get("eventId") as string;
  if (!eventId) throw new Error("Missing event ID");

  await prisma.event.delete({
    where: { id: eventId },
  });

  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  const eventId = formData.get('eventId') as string;

  if (!eventId) throw new Error('Missing event ID');

  await prisma.event.delete({
    where: { id: eventId },
  });

  revalidatePath('/admin/events');
}

export async function getAllEvents() {
  return await prisma.event.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function EditBooking(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = parseWithZod(formData, { schema: bookingSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const bookingId = formData.get("bookingId") as string;
  if (!bookingId) throw new Error("Missing booking ID");

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      date: new Date(submission.value.date),
      time: submission.value.time,
      customer: submission.value.customer,
      email: submission.value.email,
      phone: submission.value.phone,
      tickets: submission.value.tickets,
      total: submission.value.total,
      tableId: submission.value.tableId,
      eventId: submission.value.eventId,
      paid: submission.value.paid,
    },
  });

  redirect("/admin/booking");
}

export async function DeleteBooking(formData: FormData) {
    const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}
  const bookingId = formData.get("bookingId") as string;

  if (!bookingId) {
    throw new Error("Booking ID is missing");
  }

  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });

  redirect("/admin/booking");
}

export async function CreateBooking(prevState: unknown, formData: FormData) {
const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = parseWithZod(formData, {
    schema: bookingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.booking.create({
    data: {
      date: new Date(submission.value.date),
      time: submission.value.time,
      customer: submission.value.customer,
      email: submission.value.email,
      phone: submission.value.phone !,
      tickets: submission.value.tickets,
      total: submission.value.total,
      tableId: submission.value.tableId,
      eventId: submission.value.eventId,
      paid: submission.value.paid,
    },
  });

  redirect("/admin/booking");
}



export async function CreatePoster(_prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = parseWithZod(formData, { schema: posterSchema });

  if (submission.status !== "success") {
    return submission.reply(); // ✅ return typed SubmissionResult on validation error
  }

  const { title, imageString, eventId, isFeatured = false } = submission.value;

  await prisma.poster.create({
    data: {
      title,
      imageString,
      eventId,
      isFeatured,
    },
  });

  return redirect("/admin/poster"); // ✅ no custom object returned
}

export async function DeletePoster(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}
  const posterId = formData.get("posterId") as string;
  if (!posterId) throw new Error("Missing poster ID");

  await prisma.poster.delete({
    where: { id: posterId },
  });

  redirect("/admin/poster");
}


export async function CreateMemory(
  _prevState: any,
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const submission = await parseWithZod(formData, { schema: memorySchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { title, description, mediaUrl, eventName } = submission.value;

  await prisma.memory.create({
    data: {
      title,
      description,
      mediaUrl,
      eventName,
    },
  });

  return redirect("/admin/memory");
}

export async function DeleteMemory(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();


const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
  return redirect("/");
}

  const memoryId = formData.get("memoryId") as string;

  if (!memoryId) {
    throw new Error("Missing memory ID");
  }

  await prisma.memory.delete({
    where: { id: memoryId },
  });

  return redirect("/admin/memory");
}



const schema = z.object({
  planId: z.string().min(1),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
});

export async function updatePlanNameAndEvent({
  planId,
  name,
  eventId,
}: {
  planId: string;
  name: string;
  eventId: string;
}) {
  return await prisma.plan.update({
    where: { id: planId },
    data: {
      name,
      eventId,
    },
  });
}

export async function updatePlanSize(input: unknown) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  
const adminEmails = await getAdminEmails();

if (!user || !adminEmails.includes(user.email!)) {
    throw new Error("Unauthorized");
  }

  const parsed = updatePlanSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { planId, width, height } = parsed.data;

  await prisma.plan.update({
    where: { id: planId },
    data: { width, height },
  });

  return { success: true };
}

export async function getAllPlans() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email!)) {
    return redirect('/');
  }

  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      width: true,
      height: true,
    },
  });

  return plans;
}
// CREATE NEW PLAN AND DEFAULT TABLE
export async function createPlan({
  name,
  width,
  height,
  eventId,
}: {
  name: string;
  width: number;
  height: number;
  eventId: string;
}) {
  const newPlan = await prisma.plan.create({
    data: {
      name,
      width,
      height,
      eventId,
    },
  });

  // Automatically create a default table for the new plan
  await prisma.table.create({
    data: {
      name: "Any",
      shape: "SQUARE",       // ← adjust to match your enum values
      position: "HORIZONTAL",
      rounded: false,
      color: "RED",
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
      booked: false,
      seats: 10,
      price: 30,
      type: "BRONZE",
      planId: newPlan.id,
    },
  });

  revalidatePath("/admin/planner");
  return newPlan;
}
// UPDATE PLAN DIMENSIONS
export async function updatePlanDimensions({
  planId,
  width,
  height,
}: {
  planId: string;
  width: number;
  height: number;
}) {
  const updated = await prisma.plan.update({
    where: { id: planId },
    data: { width, height },
  });

  revalidatePath('/admin/planner');
  return updated;
}

export async function getPlansByEvent(eventId: string) {
  return prisma.plan.findMany({
    where: { eventId },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getFreeTablesByPlan(planId: string) {
  return prisma.table.findMany({
    where: {
      planId,
      booked: false,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getBooking(bookingId: string) {
  const data = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      paid: true,
      date: true,
      time: true,
      customer: true,
      email: true,
      phone: true,
      tickets: true,
      total: true,
      tableId: true,
      eventId: true,
      table: {
        select: { name: true },
      },
      event: {
        select: { name: true },
      },
    },
  });

  if (!data) return null;

  return {
    ...data,
    tableName: data.table?.name || "",
    eventName: data.event?.name || "",
    phone: data.phone ?? undefined,
  };
}

export async function getBookingDraft(userId: string): Promise<BookingDraft | null> {
  if (!userId) return null;

  const key = `booking-${userId}`;
  const data = await redis.get<BookingDraft>(key);

  if (!data || typeof data !== "object") return null;

  return data;
}

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
    });

    // ✅ map image → images
    return events.map((e) => ({
      ...e,
      images: e.image, // 👈 convert it
    }));
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}
// app/actions.ts
export async function getTablesByEvent(eventId: string) {
  const plan = await prisma.plan.findFirst({
    where: { eventId },
    include: {
      tables: true,
    },
  });

  console.log("PLAN FOUND:", plan); // 👈

  if (!plan) return { width: 0, height: 0, tables: [] };

  return {
    planId: plan.id,
    width: plan.width,
    height: plan.height,
    tables: plan.tables,
  };
}

export async function getAllEventsfront(): Promise<Event[]> {
  const data = await prisma.event.findMany({
    orderBy: { date: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      date: true,
      time: true,
      singer: true,
      location: true,
      price: true,
      image: true, // singular in DB
      isFeatured: true,
    },
  });

  return data.map((e) => ({
    ...e,
    images: e.image, // 👈 map image to images
  })) as Event[];
}

export async function delItem(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return;

  const cartItemId = formData.get("cartItemId")?.toString();
  if (!cartItemId) return;

  const cartKey = `cart-${user.id}`;
  const cart: Cart | null = await redis.get(cartKey);
  if (!cart?.items) return;

  const updatedItems = cart.items.filter((item) => item.id !== cartItemId);

  await redis.set(cartKey, { ...cart, items: updatedItems }); // ✅ preserve phone
  revalidatePath("/bag"); // ✅ ensures UI refresh
}


/*
export async function addTableToCart(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) throw new Error("User not authenticated");

  const tableId = formData.get("tableId")?.toString();
  const tableName = formData.get("tableName")?.toString();
  const eventId = formData.get("eventId")?.toString();
  const eventName = formData.get("eventName")?.toString();
  const tickets = parseInt(formData.get("tickets") as string, 10);
  const pricePerTicket = parseFloat(formData.get("pricePerTicket") as string);
  const imageString = formData.get("imageString")?.toString() ?? "";

  if (
    !tableId || !eventId || !tableName || !eventName ||
    isNaN(tickets) || isNaN(pricePerTicket)
  ) {
    throw new Error("Invalid cart data");
  }

  const cartKey = `cart-${user.id}`;
  const cart: Cart = (await redis.get(cartKey)) ?? { items: [] };

  const newItem: CartItem = {
    id: uuid(),
    userId: user.id,
    tableId,
    tableName,
    eventId,
    eventName,
    tickets,
    pricePerTicket,
    imageString,
    total: pricePerTicket * tickets,
  };

  cart.items.push(newItem);
  await redis.set(cartKey, cart);
}
*/



export async function getAllMemories(): Promise<Memory[]> {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return memories.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(), // convert Date to string
    }));
  } catch (error) {
    console.error("Error fetching memories:", error);
    return [];
  }
}


export async function createMemory(formData: FormData) {
  const parsed = memorySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    mediaUrl: formData.get("mediaUrl"),
    eventName: formData.get("eventName"),
  });

  if (!parsed.success) {
    throw new Error("Invalid memory data: " + JSON.stringify(parsed.error.format()));
  }

  const data = parsed.data;

  // Use `data` to insert into Prisma
}


export async function getEventById(id: string): Promise<Event | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) return null;

    return {
      ...event,
      images: event.image, // 👈 remap `image` to `images`
    };
  } catch (error) {
    console.error('Failed to fetch event by ID:', error);
    return null;
  }
}


export async function addTableBookingToCart(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const tableId = formData.get("tableId")?.toString();
  const eventId = formData.get("eventId")?.toString();
  const tickets = Number(formData.get("tickets"));
  const pricePerTicket = Number(formData.get("pricePerTicket"));

  // ✅ Validate required fields
  if (!tableId || !eventId || !tickets || !pricePerTicket) {
    throw new Error("Missing required booking information.");
  }

  const item = {
    id: crypto.randomUUID(),
    userId: user.id,
    eventId,
    eventName: formData.get("eventName")?.toString() || "",
    tableId,
    tableName: formData.get("tableName")?.toString() || "",
    tickets,
    pricePerTicket,
    imageString: formData.get("imageString")?.toString() || "",
    total: tickets * pricePerTicket,
  };

  const key = `cart-${user.id}`;
  const existingCart = (await redis.get(key)) as Cart | null;

  const cart: Cart = existingCart || { userId: user.id, items: [] };
  cart.items.push(item);

  await redis.set(key, cart);
  return true;
}

export async function togglePosterFeatured(id: string, isFeatured: boolean) {
  return await prisma.poster.update({
    where: { id },
    data: { isFeatured },
  });
}





// ------------------
// Checkout (Stripe)
// ------------------

export async function checkOut(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/");

  const phone = formData.get("phone")?.toString();
  if (!phone) throw new Error("Phone number is required");

  const cart = (await redis.get(`cart-${user.id}`)) as Cart | null;
  if (!cart || !cart.items?.length) return;

  // ✅ Save phone to cart
  await redis.set(`cart-${user.id}`, {
    ...cart,
    phone,
  });

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: "gbp",
      unit_amount: item.pricePerTicket * 100,
      product_data: {
        name: `${item.eventName} - ${item.tableName}`,
        images: item.imageString ? [item.imageString] : [],
      },
    },
    quantity: item.tickets,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    metadata: {
      userId: user.id,
      email: user.email,
      phone,
    },
  });

  return redirect(session.url as string);
}

// ------------------
// Save Booking from Cart
// ------------------

export async function saveBookingFromCart() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return;

  const cart = (await redis.get(`cart-${user.id}`)) as Cart | null;
  if (!cart || !cart.items?.length || !cart.phone) return;

  const now = new Date();
  const formattedTime = now.toTimeString().split(" ")[0]; // e.g. "12:45:10"

  for (const item of cart.items) {
    const bookingData = {
      paid: true,
      date: now.toISOString(),
      time: formattedTime,
      customer: `${user.given_name ?? ""} ${user.family_name ?? ""}`.trim(),
      email: user.email ?? "",
      phone: cart.phone ?? "",
      tickets: item.tickets,
      total: item.total,
      tableId: item.tableId ?? "",
      eventId: item.eventId ?? "",
    };

    const parsed = bookingSchema.safeParse(bookingData);
    if (!parsed.success) {
      console.error("❌ Booking validation failed:", parsed.error.flatten());
      continue;
    }

    // Create the booking
    await prisma.booking.create({
      data: {
        ...parsed.data,
        phone: parsed.data.phone ?? "",
      },
    });

    // Get table name to decide booking status
    const table = await prisma.table.findUnique({
      where: { id: item.tableId },
      select: { name: true },
    });

    // Update booked status based on table name
    await prisma.table.update({
      where: { id: item.tableId },
      data: {
        booked: table?.name === "Any" ? false : true,
      },
    });
  }

  // Clear the user's cart
  await redis.del(`cart-${user.id}`);
}

// ------------------
// Update Quantity
// ------------------

// ------------------
// Delete Cart Item
// ------------------


export async function updateQuantity(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return;

  const raw = formData.get("cartItemId")?.toString();
  const [cartItemId, action] = raw?.split("|") ?? [];
  if (!cartItemId || !action) return;

  const cartKey = `cart-${user.id}`;
  const cart: Cart | null = await redis.get(cartKey);
  if (!cart?.items) return;

  const updatedItems = cart.items.map((item) => {
    if (item.id === cartItemId) {
      let tickets = item.tickets;
      if (action === "increase") tickets += 1;
      else if (action === "decrease") tickets = Math.max(1, tickets - 1);

      return { ...item, tickets, total: tickets * item.pricePerTicket };
    }
    return item;
  });

  await redis.set(cartKey, { ...cart, items: updatedItems }); // ✅ keep phone
  revalidatePath("/bag"); // ✅ live UI update
}



type CreateOrderInput = {
  table: string;
  notes?: string;
  total: number;
  paymentType: "CASH" | "CARD";
  paid: boolean;
  served: boolean;
  orderItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];
};

export async function createOrder(data: CreateOrderInput) {
  const order = await prisma.orders.create({
    data: {
      table: data.table,
      notes: data.notes,
      total: data.total,
      paid: data.paid,
      served: data.served,
      paymentType: data.paymentType,
      waitress: {
        connect: {
          id: "demo-waitress-id", // Replace with actual user/waitress selection logic
        },
      },
      orderItems: {
        create: data.orderItems.map((item) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  return order;
}


export async function getOrders() {
  const orders = await prisma.orders.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      waitress: true,
    },
    orderBy: {
      createdAt: "desc", // Ensure newest orders are at the top
    },
  });

  return orders;
}


export async function getAdminEmails(): Promise<string[]> {
  const staticAdmins = ["geraldmetohu@gmail.com", "hasanajaleksios@icloud.com"];

  const dbAdmins = await prisma.staff.findMany({
    where: {
      role: { in: ["ADMIN", "BARTENDER"] },
    },
    select: { email: true },
  });

  const dynamicEmails = dbAdmins.map((staff) => staff.email);
  const uniqueEmails = Array.from(new Set([...staticAdmins, ...dynamicEmails]));

  return uniqueEmails;
} 

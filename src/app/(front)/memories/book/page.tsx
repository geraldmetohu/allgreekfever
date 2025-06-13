import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getBookingDraft } from "@/app/actions"; // Your redis fetch function
import { CheckoutButton } from "@/app/components/SubmitButtons";
import { ShoppingBag } from "lucide-react";

export default async function BookingSummaryPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const booking = await getBookingDraft(user.id); // E.g., redis.get(`booking-${user.id}`)
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="bg-primary/10 p-6 rounded-full">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold my-6">No booking found</h2>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          You don't have an active booking session. Please return and select your event and seats.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-8">
      <h1 className="text-2xl font-bold">Confirm Your Booking</h1>

      <div className="border rounded-lg p-5 space-y-2 text-sm">
        <p><strong>Name:</strong> {booking.customer}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Event:</strong> {booking.eventName}</p>
        <p><strong>Table:</strong> {booking.tableName}</p>
        <p><strong>Tickets:</strong> {booking.tickets}</p>
        <p><strong>Total:</strong> £{booking.total.toFixed(2)}</p>
      </div>

      <form action="/api/checkout" method="POST">
        <input type="hidden" name="tickets" value={booking.tickets} />
        <input type="hidden" name="total" value={booking.total} />
        <CheckoutButton />
      </form>
    </div>
  );
}

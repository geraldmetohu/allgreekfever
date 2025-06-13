import { EditBookingForm } from "@/app/components/admin/EditBookingForm";
import {
  getAllEvents,
  getPlansByEvent,
  getFreeTablesByPlan,
  getBooking,
} from "@/app/actions";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditBookingPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. Get booking data (with table + event info)
  const data = await getBooking(params.id);
  if (!data) return notFound();

  // 2. Get all events (for dropdown)
  const events = await getAllEvents();

  // 3. Get plans for the current event
  const plans = await getPlansByEvent(data.eventId);

  // 4. Get the current table's planId (ensure we get tables from the right plan)
  const currentTable = await prisma.table.findUnique({
    where: { id: data.tableId },
    select: { planId: true },
  });

  const currentPlanId = currentTable?.planId || plans[0]?.id || "";

  // 5. Get all available tables for that plan (include current table even if booked)
  const tables = await prisma.table.findMany({
    where: {
      planId: currentPlanId,
      OR: [
        { booked: false },
        { id: data.tableId }, // include currently selected table
      ],
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <EditBookingForm
      data={data}
      isEdit={true}
      eventOptions={events}
      planOptions={plans}
      tableOptions={tables}
    />
  );
}

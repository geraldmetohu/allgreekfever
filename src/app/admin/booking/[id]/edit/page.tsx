import { EditBookingForm } from "@/app/components/admin/EditBookingForm";
import {
  getAllEvents,
  getPlansByEvent,
  getBooking,
} from "@/app/actions";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

type Params = { params: { id: string } };

export default async function Page({ params }: Params) {
  const data = await getBooking(params.id);
  if (!data) return notFound();

  const events = await getAllEvents();
  const plans = await getPlansByEvent(data.eventId);

  const currentTable = await prisma.table.findUnique({
    where: { id: data.tableId },
    select: { planId: true },
  });

  const currentPlanId = currentTable?.planId || plans[0]?.id || "";

  const tables = await prisma.table.findMany({
    where: {
      planId: currentPlanId,
      OR: [{ booked: false }, { id: data.tableId }],
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

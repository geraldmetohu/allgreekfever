import { EditBookingForm } from "@/app/components/admin/EditBookingForm";
import {
  getAllEvents,
  getPlansByEvent,
  getBooking,
} from "@/app/actions";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
// DO NOT define or use a Params type.
// DO NOT use inline param typing.
// DO NOT rename the function to anything else but "Page".

export default async function Page(props: any) {
  const id = props?.params?.id;
  if (!id) return null;

  const data = await getBooking(id);
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

import EditEventForm from "@/app/components/admin/EditForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

async function getData(eventId: string) {
  const data = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!data) return notFound();

  return {
    ...data,
    date: data.date.toISOString().split("T")[0], // format for <input type="date">
  };
}
export default async function Page(props: any) {
  const id = props?.params?.id;
  if (!id) return null;

  const data = await getData(id);
  return <EditEventForm data={data} />;
}

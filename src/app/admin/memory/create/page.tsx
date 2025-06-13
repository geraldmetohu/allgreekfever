// app/admin/memory/create/page.tsx

import { getAllEvents } from "@/app/actions";
import CreateMemoryForm from "./CreateMemoryForm";



export default async function CreateMemoryPage() {
  const events = await getAllEvents();

  return <CreateMemoryForm events={events} />;
}

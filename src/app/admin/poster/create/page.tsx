// app/admin/poster/create/page.tsx

import { getAllEvents } from "@/app/actions";
import CreatePosterForm from "./CreatePosterForm";


export default async function CreatePosterPage() {
  const events = await getAllEvents();

  return <CreatePosterForm events={events} />;
}

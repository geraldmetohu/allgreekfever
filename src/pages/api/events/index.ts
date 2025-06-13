// pages/api/events/index.ts
import { getAllEvents } from "@/app/actions";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const events = await getAllEvents();
  res.status(200).json(events);
}

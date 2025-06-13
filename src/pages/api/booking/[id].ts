// src/pages/api/booking/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ success: false, error: "Invalid booking ID." });
  }

  try {
    switch (req.method) {
      case "GET":
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) return res.status(404).json({ success: false, error: "Booking not found." });
        return res.status(200).json({ success: true, booking });

      case "PUT":
        const updated = await prisma.booking.update({
          where: { id },
          data: req.body,
        });
        return res.status(200).json({ success: true, booking: updated });

      case "DELETE":
        await prisma.booking.delete({ where: { id } });
        return res.status(204).end();

      default:
        return res.status(405).json({ success: false, error: "Method not allowed." });
    }
  } catch (error) {
    console.error("Booking API error:", error);
    return res.status(500).json({ success: false, error: "Server error." });
  }
}

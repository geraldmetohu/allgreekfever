// file: src/app/bar/table_plan/page.tsx

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getTablesByEvent } from "@/app/actions";

export default async function TablePlanPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) return redirect("/");

  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
    include: { event: true },
  });

  if (!staff || !staff.event) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        No event or staff data found.
      </div>
    );
  }

  const tablesRes = await getTablesByEvent(staff.event.id);

  if (!tablesRes.tables.length) {
    return (
      <div className="p-6 text-center text-gray-700 font-medium">
        No table planner found for this event.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Table Layout for: <span className="text-red-600">{staff.event.name}</span>
      </h1>

      <div className="w-full flex justify-center items-center bg-white rounded border overflow-hidden">
        <div
          className="relative"
          style={{
            width: `${tablesRes.width * 20}px`,
            height: `${tablesRes.height * 20}px`,
          }}
        >
          {tablesRes.tables.map((table) => (
            <div
              key={table.id}
              className="absolute text-[10px] text-white flex items-center justify-center font-medium shadow"
              style={{
                top: `${table.startY * 20}px`,
                left: `${table.startX * 20}px`,
                width: `${table.width * 20}px`,
                height: `${table.height * 20}px`,
                borderRadius: table.rounded ? "999px" : "6px",
                backgroundColor: table.booked && table.name !== "Any" ? "#9ca3af" : table.color.toLowerCase(),
                transform:
                  table.position === "DIAGONAL"
                    ? "rotate(45deg)"
                    : table.position === "HORIZONTAL"
                    ? "rotate(0deg)"
                    : "rotate(90deg)",
              }}
            >
              {table.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

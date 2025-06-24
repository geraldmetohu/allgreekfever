// src/app/admin/staff/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAdminEmails } from "@/app/actions";
import StaffClientPage from "@/app/components/admin/StaffClientPage";

export default async function StaffPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.email) return redirect("/");

  const adminEmails = await getAdminEmails();
  if (!adminEmails.includes(user.email)) return redirect("/");

  const events = await prisma.event.findMany({
    select: { id: true, name: true },
  });

  const staff = await prisma.staff.findMany({
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    
    <StaffClientPage
      events={[{ id: "", name: "General" }, ...events]}
      staff={staff}
    />
  );
}

// src/app/bar/layout.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/bar/sidebar";
import  prisma  from "@/lib/db";
import { getAdminEmails } from "../actions";

export default async function BarLayout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) return redirect("/");

  const adminEmails = await getAdminEmails();

  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
  });

const isAllowed =
  adminEmails.includes(user.email) ||
  staff?.role === "BARTENDER" ||
  staff?.role === "WAITRESS";

if (!isAllowed) {
  return redirect("/");
}


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}

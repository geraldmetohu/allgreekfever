// file: src/app/bar/order_list/page.tsx

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import ClientOrderList from "./ClientOrderList";
import { getAdminEmails } from "@/app/actions";
import prisma from "@/lib/db";

export default async function OrderListPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) return redirect("/");

  const adminEmails = await getAdminEmails();

  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
  });

  if (!adminEmails.includes(user.email) && staff?.role !== "BARTENDER" && staff?.role !== "WAITRESS") {
    return redirect("/");
  }

  return <ClientOrderList isBartender={staff?.role === "BARTENDER"} userEmail={user.email} />;
}

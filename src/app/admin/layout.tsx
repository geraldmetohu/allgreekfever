// src/app/admin/layout.tsx
import { Sidebar } from "@/app/components/admin/Sidebar";
import { ADMIN_EMAILS } from "@/lib/adminemails";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default  async function AdminLayout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email!)) {
    return redirect("/");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}

// src/app/api/auth/creation/route.ts
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getAdminEmails } from "@/app/actions";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id || !user?.email) throw new Error("Something went wrong...");

  // Ensure user exists in your DB
  let dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email,
        profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }

  const adminEmails = await getAdminEmails();
  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
    select: { role: true },
  });

  let destination = "/";
  if (adminEmails.includes(user.email)) {
    destination = "/admin";
  } else if (staff?.role === "BARTENDER" || staff?.role === "WAITRESS") {
    destination = "/bar";
  }

  // Use next/navigation redirect (relative paths allowed in app routes)
  redirect(destination);
}

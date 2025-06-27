import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { getAdminEmails } from "@/app/actions";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user?.email) {
    throw new Error("Something went wrong...");
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }

  const adminEmails = await getAdminEmails();
  const staff = await prisma.staff.findFirst({
    where: { email: user.email },
    select: { role: true },
  });

  let redirectUrl = "/"; // default for clients

  if (adminEmails.includes(user.email)) {
    redirectUrl = "/admin";
  } else if (staff?.role === "BARTENDER" || staff?.role === "WAITRESS") {
    redirectUrl = "/bar";
  }

  return NextResponse.redirect(redirectUrl);
}

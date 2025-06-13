// app/bag/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { redis } from "@/lib/redis";
import { Cart } from "@/lib/interfaces";
import BagRouteClient from "./BagClient";

export default async function BagRoute() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const cart: Cart | null = await redis.get(`cart-${user.id}`);
  return <BagRouteClient cartData={cart} />;
}

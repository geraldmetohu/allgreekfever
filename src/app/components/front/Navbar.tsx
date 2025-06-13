// app/components/front/NavBar.tsx (SERVER COMPONENT)
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redis } from "@/lib/redis";
import { getTicketCount } from "@/lib/cart";
import { NavBarClient } from "./NavbarClient"; // You'll create this next

export async function NavBar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const total = user ? await getTicketCount(user.id) : 0;

  return <NavBarClient user={user} ticketCount={total}  />;
}

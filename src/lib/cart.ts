import { redis } from "./redis";
import { Cart } from "./interfaces";

export async function getTicketCount(userId: string): Promise<number> {
  const cart: Cart | null = await redis.get(`cart-${userId}`);
  return cart?.items.reduce((sum, item) => sum + item.tickets, 0) || 0;
}

// app/lib/interfaces.ts

export interface CartItem {
  id: string;
  userId: string;
  eventId: string;
  eventName: string;
  tableId: string;
  tableName: string;
  tickets: number;
  pricePerTicket: number;
  imageString: string;
  total: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  phone?: string; // ✅ added to support phone saved in Redis
}

export interface BookingDraft {
  customer: string;
  email: string;
  phone?: string;
  tickets: number;
  total: number;
  eventId: string;
  eventName: string;
  tableId: string;
  tableName: string;
}

interface NavBarProps {
  user: {
    id: string;
    email?: string | null;        // allow null as well
    given_name?: string | null;
    picture?: string | null;
  } | null;
  cartTotal: number;
}



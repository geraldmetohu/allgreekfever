export type TableType = {
  id: string;
  name: string;
  shape: "CIRCLE" | "SQUARE" | "RECTANGULAR";
  position: "VERTICAL" | "HORIZONTAL" | "DIAGONAL"; // ✅ add this
  color: string;
  rounded: boolean;
  booked: boolean;
  width: number;
  height: number;
  startX: number;
  startY: number;
  seats: number;
  price: number;
  planId: string;
  type?: string;
};

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string | Date;
  time: string;
  singer: string;
  location: string;
  price: number;
  images: string[]; // plural!
  isFeatured: boolean;
}

export interface Memory {
  id: string;
  title: string;
  mediaUrl: string;
  description: string;
  eventName: string;
  createdAt: string; // changed from Date
}

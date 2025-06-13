'use client';

import { useState, useEffect } from 'react';
import { TableType, Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';
import { getEventById } from '@/app/actions';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  table: TableType;
  event: {
    id: string;
    name: string;
  };
  onClose: () => void;
  showToast?: boolean;
}

export default function TableDetailsModal({ table, event, onClose }: Props) {
  const [tickets, setTickets] = useState(1);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const pricePerTicket = table.price;
  const total = tickets * pricePerTicket;

  const router = useRouter();

  const increase = () => setTickets((t) => Math.min(t + 1, table.seats));
  const decrease = () => setTickets((t) => Math.max(1, t - 1));

  useEffect(() => {
    getEventById(event.id).then(setEventDetails).catch(console.error);
  }, [event.id]);

  const handleAddToCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    try {
      toast.loading("Adding to cart...");
      const res = await fetch("/api/cart", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss();

      if (data.success) {
        toast.success("Item added to cart!");
        setTimeout(() => router.push("/bag"), 1000);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

  const form = (
    <form onSubmit={handleAddToCart} className="space-y-3">
      <input type="hidden" name="tableId" value={table.id} />
      <input type="hidden" name="tableName" value={table.name} />
      <input type="hidden" name="eventId" value={event.id} />
      <input type="hidden" name="eventName" value={event.name} />
      <input type="hidden" name="tickets" value={tickets.toString()} />
      <input type="hidden" name="pricePerTicket" value={pricePerTicket.toString()} />
      <input type="hidden" name="imageString" value={eventDetails?.images?.[0] || ''} />

      <Button className="w-full bg-green-600 hover:bg-green-700" type="submit">
        Add to Cart
      </Button>
      <Button className="w-full bg-red-600 hover:bg-red-700" type="button" onClick={onClose}>
        Cancel
      </Button>
    </form>
  );

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{table.name === 'Any' ? 'Any Available Table' : table.name}</h2>
        <button onClick={onClose}>
          <X className="text-zinc-800 hover:text-red-600" />
        </button>
      </div>

      <p className="text-md text-teal-800 mb-1 font-semibold">Type: <span className="text-zinc-700">{table.type}</span></p>
      <p className="text-md text-teal-800 mb-1 font-semibold">Seats: <span className="text-zinc-700">{table.seats}</span></p>
      <p className="text-md text-teal-800 mb-3 font-semibold">Price per Ticket: <span className="text-green-600">£{pricePerTicket}</span></p>

      <div className="flex items-center justify-center gap-4 mb-4">
        <Button className="bg-red-600 hover:bg-red-400" size="icon" onClick={decrease}><Minus size={16} /></Button>
        <span className="text-lg text-zinc-800 font-bold">{tickets}</span>
        <Button className="bg-green-600 hover:bg-green-400" size="icon" onClick={increase}><Plus size={16} /></Button>
      </div>

      <div className="text-center text-xl text-teal-900 mb-4 font-bold">
        Total: <span className="text-green-600">£{total}</span>
      </div>

      {eventDetails && (
        <div className="mb-4">
          <Image
            src={eventDetails.images?.[0] || '/placeholder.jpg'}
            alt={eventDetails.name}
            width={600}
            height={300}
            className="w-full h-32 object-cover rounded-xl border"
          />
          <h4 className="text-base font-semibold mt-2">{eventDetails.name}</h4>
          <p className="text-sm text-zinc-600">{eventDetails.description}</p>
        </div>
      )}

      {form}
    </>
  );

  return (
    <AnimatePresence>
      {/* Mobile Fullscreen Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex md:hidden items-center justify-center"
      >
        <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md overflow-y-auto">
          {content}
        </div>
      </motion.div>

      {/* Desktop Side Panel Modal */}
      <motion.div
        key="desktop"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        className="hidden md:fixed md:top-0 md:right-0 md:bottom-0 md:z-50 md:flex md:w-[400px] md:bg-white md:shadow-xl md:p-6 md:flex-col md:overflow-y-auto"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

import { Cart, CartItem } from '@/lib/interfaces';
import { updateQuantity, delItem, checkOut } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { CheckoutButton } from '@/app/components/SubmitButtons';

export default function BagRouteClient({ cartData }: { cartData: Cart | null }) {
  const [items, setItems] = useState<CartItem[]>(cartData?.items || []);

  const handleQuantity = async (itemId: string, action: 'increase' | 'decrease') => {
    const formData = new FormData();
    formData.append('cartItemId', itemId);
    formData.append('action', action);

    await updateQuantity(formData);

    // Optimistically update local state
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              tickets:
                action === 'increase'
                  ? item.tickets + 1
                  : Math.max(1, item.tickets - 1),
              total:
                action === 'increase'
                  ? item.total + item.pricePerTicket
                  : Math.max(item.pricePerTicket, item.total - item.pricePerTicket),
            }
          : item
      )
    );
  };

  const handleDelete = async (itemId: string) => {
    const formData = new FormData();
    formData.append('cartItemId', itemId);
    await delItem(formData);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center border p-8 rounded-lg bg-amber-50">
        <div className="mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-zinc-100">
          <ShoppingBag className="w-10 h-10 text-zinc-900" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-zinc-900">Your booking bag is empty</h2>
        <p className="text-sm text-zinc-700 foreground mb-6">
          Add tables and tickets to your bag and return here to complete your order.
        </p>
        <Button asChild className='bg-blue-600 hover:bg-blue-800'>
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-col gap-y-10">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
          >
            <div className="space-y-3 w-full sm:w-3/4">
              <p className="font-bold text-lg text-blue-600">{item.tableName}</p>
              <p className="text-sm text-amber-100">Event: {item.eventName}</p>

              {item.imageString && (
                <Image
                  src={item.imageString}
                  alt={item.eventName}
                  width={300}
                  height={150}
                  className="rounded-md object-cover mt-2 border-2 border-amber-300"
                />
              )}

              <div className="flex items-center gap-3 mt-3 bg-zinc-700 px-3 py-2 rounded-md w-fit">
                <button
                  onClick={() => handleQuantity(item.id, 'decrease')}
                  className="p-1 bg-red-600 hover:bg-red-800 rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-medium px-2">{item.tickets}</span>
                <button
                  onClick={() => handleQuantity(item.id, 'increase')}
                  className="p-1 bg-green-500 hover:bg-green-700 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>

              <p className="text-sm ">
                Price per ticket:{' '}
                <span className="font-medium">£{item.pricePerTicket}</span>
              </p>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total:</span>
            <span className="text-green-600 text-lg">
              £{item.total}
            </span>
          </div>            </div>

            <div className="self-start">
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 hover:bg-red-800 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        <form
          action={checkOut}
          className="space-y-6 mt-10 border rounded-lg p-6 bg-white shadow-sm text-zinc-900"
        >
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium text-sm">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              required
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total:</span>
            <span className="text-green-600">
              £{new Intl.NumberFormat('en-GB').format(totalPrice)}
            </span>
          </div>

          <CheckoutButton />
        </form>
      </div>
    </div>
  );
}

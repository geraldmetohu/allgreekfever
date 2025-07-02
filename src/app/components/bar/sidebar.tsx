"use client";

import Link from "next/link";
import {
  Calendar,
  Ticket,
  LayoutGrid,
  FlagIcon,
  MicVocal,
  Image,
  Info,
  Menu,
  X,
  Grape,
  icons,
  BadgePoundSterlingIcon,
  Table,
  SettingsIcon,
  PanelsLeftRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useState } from "react";
import { FaGlassMartini, FaMoneyBillAlt } from "react-icons/fa";

const navItems = [
  { href: "/bar", label: "Notes", icon: Calendar },
  { href: "/bar/order_list", label: "Orders List", icon: FaMoneyBillAlt },
  { href: "/bar/new_order", label: "New Order", icon: LayoutGrid },
  { href: "/bar/product_list", label: "All Products", icon: FaGlassMartini },
  { href: "/bar/table_plan", label: "See Table Plan", icon: Table },
  { href: "/admin", label: "Admin Only", icon: SettingsIcon},
  { href: "/", label: "WEBSITE", icon: PanelsLeftRightIcon}

];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-300 h-screen p-4 hidden md:block">
        <h2 className="text-xl font-bold text-black mb-6">Orders Dashboard</h2>
        <nav className="space-y-2 text-black">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <LogoutLink>Log Out</LogoutLink>
        </nav>
      </aside>

      {/* MOBILE BUTTON (positioned absolutely on screen) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow"
      >
        <Menu className="h-5 w-5 text-black" />
      </button>

      {/* MOBILE SIDEBAR (drawer) */}
      <div
        className={cn(
          "fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2 text-black">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <LogoutLink>Log Out</LogoutLink>
        </nav>
      </div>

      {/* OVERLAY BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

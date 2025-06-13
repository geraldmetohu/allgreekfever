"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navbarLinks = [
  { id: 0, name: "Home", href: "/" },
  { id: 1, name: "Book Table", href: "/plan" },
  { id: 2, name: "Events", href: "/events" },
  { id: 3, name: "Memories", href: "/memories" },
  { id: 4, name: "About us", href: "/about" },
];

export function NavbarLinks({
  isMobile = false,
  onLinkClick,
}: {
  isMobile?: boolean;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        isMobile ? "flex flex-col space-y-2 " : "hidden md:flex items-center gap-x-4 ml-8 ", 
      )}
    >
      {navbarLinks.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          onClick={onLinkClick}
          className={cn( 
            pathname === item.href
              ? "bg-blue-700 text-amber-50 "
              : "hover:bg-opacity-75 hover:bg-blue-900",
            "group px-3 py-2 rounded-md font-medium transition-colors "
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

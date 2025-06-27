'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBagIcon, MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { NavbarLinks } from "./NavbarLinks";
import { CartCountBadge } from "./CartCountBadge";
import { UserDropdown } from "./UserDropdown";

export function NavBarClient({ user, ticketCount }: { user: any, ticketCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-amber-100 font-bold text-xl lg:text-3xl">
            AllGreek<span className="text-amber-100">Fever</span>
          </h1>
        </Link>
        <NavbarLinks />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Hamburger - Mobile only */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        {user ? (
          <>
            <Link href="/bag" className="group p-2 flex items-center">
              <ShoppingBagIcon className="h-6 w-6 text-blue-400 group-hover:text-blue-600" />
              <CartCountBadge />
            </Link>
            <UserDropdown
              email={user.email}
              name={user.given_name}
              userImage={user.picture ?? `https://avatar.vercel.sh/${user.given_name}`}
            />
          </>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-amber-50 mb-5">
            <Button className="bg-green-500 hover:bg-green-700" asChild>
<LoginLink postLoginRedirectURL="/api/auth/creation">
  Sign In
</LoginLink>
            </Button>
            <Button className="bg-green-500 hover:bg-green-700" asChild>
              <RegisterLink>Create Account</RegisterLink>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-0 right-0 h-full w-64 z-50 bg-black shadow-lg p-6 md:hidden transition-all"
        >
          <NavbarLinks isMobile onLinkClick={() => setMobileOpen(false)} />

          {!user && (
            <div className="mt-4 flex flex-col space-y-2">
              <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                <LoginLink>Sign In</LoginLink>
              </Button>
              <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                <RegisterLink>Create Account</RegisterLink>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

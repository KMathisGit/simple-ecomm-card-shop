"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarSearch } from "./NavbarSearch";
import { UserMenu } from "./UserMenu";
import { useCartStore } from "@/lib/stores/cart";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);

  // Handle hydration mismatch for cart count
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? totalItems() : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-bold">P</span>
          </div>
          <span className="hidden sm:inline-block">Pokemon Card Shop</span>
        </Link>

        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <NavbarSearch />
        </div>

        {/* Desktop Actions - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          {/* Shop Link */}
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
            Shop
          </Link>

          {/* Cart Button */}
          <Button variant="outline" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>

          {/* User Menu / Sign In */}
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Cart Button */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>

          {/* Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-6">
                {/* Mobile Search */}
                <div>
                  <NavbarSearch
                    onResultClick={() => setMobileMenuOpen(false)}
                    className="max-w-none"
                  />
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <Badge variant="secondary">{cartCount}</Badge>
                    )}
                  </Link>
                </nav>

                {/* Mobile Auth Section */}
                <div className="border-t pt-4">
                  <UserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

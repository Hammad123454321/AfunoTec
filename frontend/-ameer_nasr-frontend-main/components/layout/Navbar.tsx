"use client";

import LocaleSwitcher from "@/components/LocaleSwitch";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WebSearch from "@/features/search/components/SearchWidget";
import { cn } from "@/lib/utils";
import { webPaths } from "@/paths";
import { LucideChevronDown, LucideHome } from "lucide-react";
import { Lily_Script_One } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { PlayStore } from "../Icons";
import { CurrencySelector } from "../MultiCurrency";

const lily = Lily_Script_One({ subsets: ["latin"], weight: "400" });

const NAV_ITEMS = [
  {
    name: "STAYS",
    href: webPaths.staysPath(),
    title: "Hotels, Apartments & Lodge",
  },
  {
    name: "THINGS TO DO",
    href: webPaths.thingsTodoPath(),
    title: "Activities Deals",
  },
  { name: "TOURS", href: webPaths.toursPath(), title: "Tours & Eco Tourism" },
  { name: "TRAVELS", href: webPaths.travelsPath(), title: "Travels" },
  {
    name: "TRANSPORTATION",
    href: webPaths.transfersPath(),
    title: "TRANSFERS",
  },
  {
    name: "NOSY BE",
    href: webPaths.nosyBePath(),
    title: "Nosy Be Destination",
  },
  {
    name: "CORPORATE",
    href: webPaths.corporatePath(),
    title: "CORPORATE",
  },
];

const MORE_ITEMS = [
  {
    name: "WORKPLACES",
    href: webPaths.workplacePath(),
    title: "Workplaces",
  },
  {
    name: "EVENT",
    href: webPaths.eventPath(),
    title: "Events",
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header>
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200">
        <Container>
          {/* Row 1: Logo, Account, Cart, Menu */}
          <div className="flex items-center justify-between gap-2 py-2.5 md:py-3">
            {/* Logo */}
            <Link
              href="/"
              className={`${lily.className} text-xl sm:text-2xl font-semibold shrink-0`}
              aria-label="Afuno homepage"
            >
              <span className="text-green-600">Afuno</span>
              <span className="text-orange-400">Tec</span>
            </Link>

            <div className="min-w-72 hidden lg:block">
              <WebSearch />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Play Store - Desktop only */}
              <div className="hidden md:block shrink-0">
                <PlayStore />
              </div>

              <span
                className="text-gray-300 hidden md:inline"
                aria-hidden="true"
              >
                |
              </span>

              {/* Locale & Currency - Desktop only */}
              <div className="hidden md:flex items-center gap-2">
                <LocaleSwitcher />
                <CurrencySelector />
              </div>

              <span
                className="text-gray-300 hidden md:inline"
                aria-hidden="true"
              >
                |
              </span>

              {/* Wishlist */}
              <button
                className="text-gray-700 hover:text-gray-900 transition-colors p-1"
                aria-label="View wishlist"
              >
                <CiHeart className="text-xl md:text-2xl" aria-hidden="true" />
              </button>

              {/* Shopping Cart */}
              <Link href="/cart">
                <button
                  className="text-gray-700 hover:text-gray-900 transition-colors p-1"
                  aria-label="View shopping cart"
                >
                  <AiOutlineShoppingCart
                    className="text-xl md:text-2xl"
                    aria-hidden="true"
                  />
                </button>
              </Link>

              {/* Gift Card - Desktop only */}
              <Link
                href="/gift-card"
                className="text-[#007ADF] text-sm font-semibold hover:underline hidden lg:inline whitespace-nowrap"
              >
                Gift Card
              </Link>

              {/* Holiday Offers - Desktop only */}
              <Link
                href="#"
                className="bg-sky-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-sky-600 transition-colors hidden lg:inline-block whitespace-nowrap h-9 flex items-center"
              >
                Holiday Offers
              </Link>
              {/* My Account Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-1 px-2 md:px-3 h-9"
                    aria-label="My account menu"
                  >
                    <FaRegUserCircle
                      className="text-lg md:text-xl"
                      aria-hidden="true"
                    />
                    <span className="hidden xl:inline text-sm">My Account</span>
                    <LucideChevronDown
                      className="w-3 h-3 md:w-4 md:h-4"
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings" className="cursor-pointer">
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logout" className="cursor-pointer">
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-2xl text-gray-700 p-1"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <HiX aria-hidden="true" />
                ) : (
                  <HiMenu aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Search Bar ONLY */}
          <div className="pb-2.5 md:pb-3 lg:hidden">
            <WebSearch />
          </div>
        </Container>
      </div>

      {/* Bottom Navigation Menu */}
      <nav
        className="bg-primary-500 text-white relative overflow-visible"
        role="navigation"
        aria-label="Main navigation"
      >
        <Container size="lg">
          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center relative overflow-visible">
            <li className="relative group">
              <Link
                href={"/"}
                className={cn(
                  "block px-6 py-4 transition-colors font-semibold hover:text-green-200",
                )}
                aria-label="Home"
              >
                <LucideHome className="text-2xl" aria-hidden="true" />
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li
                key={item.href}
                className="relative group flex items-center overflow-hidden"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "block px-4 xl:px-6 py-4 transition-colors font-semibold text-sm xl:text-base truncate uppercase",
                    isActive(item.href) ? "bg-green-600" : "hover:bg-green-600",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
                {/* Tooltip */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  role="tooltip"
                  aria-hidden="true"
                >
                  {item.title}
                </span>
                <div className="h-6 w-px bg-gray-100" aria-hidden="true"></div>
              </li>
            ))}

            {/* More Section - Using shadcn Dropdown */}
            <li className="relative">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1 px-6 py-4 font-semibold transition-colors hover:bg-green-600 cursor-pointer truncate",
                    )}
                    aria-label="More menu items"
                  >
                    MORE
                    <LucideChevronDown
                      className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={0}
                  className="min-w-[200px] bg-primary-500 border-none text-white rounded-none p-0 shadow-lg"
                >
                  {MORE_ITEMS?.map((item, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      asChild
                      className="p-0 focus:bg-transparent focus:text-white"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative block px-4 xl:px-6 py-4 transition-colors font-semibold text-sm xl:text-base rounded-none cursor-pointer",
                          isActive(item.href)
                            ? "bg-green-600"
                            : "hover:bg-green-600",
                        )}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.name}
                        {/* Tooltip */}
                        <span
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                          role="tooltip"
                          aria-hidden="true"
                        >
                          {item.title}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4" role="menu">
              <ul className="space-y-1">
                {/* Locale & Currency at top of mobile menu */}
                <li className="pb-3 border-b border-green-300 mb-2" role="none">
                  <div className="flex items-center justify-center gap-3">
                    <LocaleSwitcher />
                    <span className="text-green-300">|</span>
                    <CurrencySelector />
                  </div>
                </li>

                {NAV_ITEMS.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 rounded transition-colors text-sm",
                        isActive(item.href)
                          ? "bg-green-600"
                          : "hover:bg-green-600",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      role="menuitem"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                {/* More Items in Mobile */}
                <li className="py-4 border-t border-green-300" role="none">
                  <div className="px-4 py-2 text-xs font-semibold text-green-200">
                    MORE
                  </div>
                  <ul className="space-y-1">
                    {MORE_ITEMS.map((item) => (
                      <li key={item.href} role="none">
                        <Link
                          href={item.href}
                          className="block px-4 py-2 hover:bg-green-600 rounded transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={
                            isActive(item.href) ? "page" : undefined
                          }
                          role="menuitem"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Mobile-only actions */}
                <li
                  className="mt-6 space-y-2 pt-4 border-t border-green-300"
                  role="none"
                >
                  <Link
                    href="/gift-card"
                    className="block px-4 py-2 text-center bg-[#007ADF] hover:bg-[#0068C0] rounded transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    Gift Card
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-center bg-sky-500 hover:bg-sky-600 rounded transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    Holiday Offers
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
}

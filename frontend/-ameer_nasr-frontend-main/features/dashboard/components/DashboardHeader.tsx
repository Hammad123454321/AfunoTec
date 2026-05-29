"use client";

import NotificationWidget from "@/features/notifications/NotificationWidget";
import ProfileWidget from "@/features/profile/components/ProfileWidget";
import { paths } from "@/paths";
import { usePathname } from "next/navigation";

export const pathTitles: Record<string, string> = {
  // Admin
  [paths.admin.dashboard()]: "Dashboard",
  [paths.admin.bookings()]: "Bookings",
  [paths.admin.services()]: "Services",
  [paths.admin.customers()]: "Customers",
  [paths.admin.serviceOwners()]: "Service Owners",
  [paths.admin.users()]: "Users",
  [paths.admin.promotion.root()]: "Promotion",
  [paths.admin.promotion.coupons()]: "Promotion > Coupons",
  [paths.admin.promotion.giftCards()]: "Promotion > Gift Cards",
  [paths.admin.payments.root()]: "Payments",
  [paths.admin.payments.orders()]: "Payments > Orders",
  [paths.admin.payments.transactions()]: "Payments > Transactions",
  [paths.admin.payments.commission()]: "Payments > Commission",
  [paths.admin.chat()]: "Chat",
  [paths.admin.settings()]: "Settings",

  // User
  [paths.user.dashboard()]: "Dashboard",
  [paths.user.customer()]: "Customer Details",
  [paths.user.orders()]: "Orders",
  [paths.user.wish()]: "Wishlist",
  [paths.user.coupon()]: "My Coupons",
  [paths.user.gift()]: "Gift Cards",

  // Service Owner
  [paths.serviceOwner.dashboard()]: "Dashboard",
  [paths.serviceOwner.services()]: "Services",
  [paths.serviceOwner.customer()]: "Customers",
  [paths.serviceOwner.offer()]: "Offers",
  [paths.serviceOwner.payment()]: "Payments",
  [paths.serviceOwner.chat()]: "Chat",
  [paths.serviceOwner.setting()]: "Settings",
};

export default function DashboardHeader() {
  const pathname = usePathname();

  // Try exact match first
  let title = pathTitles[pathname];

  // If no exact match (e.g., /user/order-details/123), fallback to parent path
  if (!title) {
    const segments = pathname.split("/").filter(Boolean);
    while (segments.length) {
      const parentPath = "/" + segments.join("/");
      if (pathTitles[parentPath]) {
        title = pathTitles[parentPath];
        break;
      }
      segments.pop(); // remove last segment
    }
  }

  // Final fallback
  if (!title) title = "Dashboard";

  return (
    <div className="flex items-center justify-between p-4">
      <div className="font-semibold text-2xl">{title}</div>
      <div className="flex items-center gap-1">
        <NotificationWidget />
        <ProfileWidget />
      </div>
    </div>
  );
}

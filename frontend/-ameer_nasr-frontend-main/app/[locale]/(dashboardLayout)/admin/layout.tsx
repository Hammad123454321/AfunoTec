import {
  DashboardContainer,
  DashboardHeader,
  DashboardSidebar,
  SidebarProvider,
} from "@/features/dashboard/components";
import {
  DashboardHeaderContainer,
  DashboardMainContainer,
  DashboardSidebarContainer,
} from "@/features/dashboard/components/DashboardContainer";
import DashboardNavigation from "@/features/dashboard/components/DashboardNavigation";
import { DashboardNavigationType } from "@/features/dashboard/types";
import { paths } from "@/paths";
import { prefixLocalePath } from "@/lib/localePath";
import Container from "@/components/layout/Container";

type Props = {
  children: React.ReactNode;
};

// Build nav items server-side with prefixed paths
async function buildNavItems(): Promise<DashboardNavigationType[]> {
  // Resolve ALL paths first (including nested children paths)
  const [
    dashboardPath,
    bookingsPath,
    servicesPath,
    customersPath,
    serviceOwnersPath,
    usersPath,
    promotionRootPath,
    couponPath,
    giftCardPath,
    paymentsRootPath,
    orderListPath,
    transactionHistoryPath,
    commissionPath,
    chatPath,
    settingsPath,
  ] = await Promise.all([
    prefixLocalePath(paths.admin.dashboard()),
    prefixLocalePath(paths.admin.bookings()),
    prefixLocalePath(paths.admin.services()),
    prefixLocalePath(paths.admin.customers()),
    prefixLocalePath(paths.admin.serviceOwners()),
    prefixLocalePath(paths.admin.users()),
    prefixLocalePath(paths.admin.promotion.root()),
    prefixLocalePath(paths.admin.promotion.coupons()),
    prefixLocalePath(paths.admin.promotion.giftCards()),
    prefixLocalePath(paths.admin.payments.root()),
    prefixLocalePath(paths.admin.payments.orders()),
    prefixLocalePath(paths.admin.payments.transactions()),
    prefixLocalePath(paths.admin.payments.commission()),
    prefixLocalePath(paths.admin.chat()),
    prefixLocalePath(paths.admin.settings()),
  ]);

  // Build structure with pre-resolved paths and STRING icon names
  return [
    {
      href: dashboardPath,
      name: "Dashboard",
      icon: "PanelsTopLeft", // String name instead of JSX
      children: [],
    },
    {
      href: bookingsPath,
      name: "Bookings",
      icon: "CalendarDays",
      children: [],
    },
    {
      href: servicesPath,
      name: "Service Management",
      icon: "Package",
      children: [],
    },
    {
      href: customersPath,
      name: "Customer",
      icon: "Users",
      children: [],
    },
    {
      href: serviceOwnersPath,
      name: "Service Owner",
      icon: "UserCog",
      children: [],
    },
    {
      href: usersPath,
      name: "User Management",
      icon: "UserCheck",
      children: [],
    },
    {
      href: promotionRootPath,
      name: "Promotion",
      icon: "Percent",
      children: [
        {
          href: couponPath,
          name: "Coupon",
          icon: "TicketPercent",
          children: [],
        },
        {
          href: giftCardPath,
          name: "Gift Card",
          icon: "Gift",
          children: [],
        },
      ],
    },
    {
      href: paymentsRootPath,
      name: "Payment History",
      icon: "CreditCard",
      children: [
        {
          href: orderListPath,
          name: "Order List",
          icon: "ListOrdered",
          children: [],
        },
        {
          href: transactionHistoryPath,
          name: "Transaction History",
          icon: "ArrowLeftRight",
          children: [],
        },
        {
          href: commissionPath,
          name: "Commission",
          icon: "PercentCircle",
          children: [],
        },
      ],
    },

    {
      href: chatPath,
      name: "Chat",
      icon: "MessageSquare",
      children: [],
    },
    {
      href: settingsPath,
      name: "Setting",
      icon: "Settings",
      children: [],
    },
  ];
}

export default async function AdminLayout({ children }: Props) {
  const navItems = await buildNavItems();

  return (
    <SidebarProvider>
      <DashboardContainer>
        <DashboardSidebarContainer>
          <DashboardSidebar>
            <DashboardNavigation items={navItems} />
          </DashboardSidebar>
        </DashboardSidebarContainer>
        <DashboardHeaderContainer>
          <DashboardHeader />
        </DashboardHeaderContainer>
        <DashboardMainContainer>
          <Container className="pt-4">{children}</Container>
        </DashboardMainContainer>
      </DashboardContainer>
    </SidebarProvider>
  );
}

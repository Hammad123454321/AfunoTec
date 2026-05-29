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
import * as Icons from "lucide-react";
import { JSX } from "react";

export const metadata = {
  title: "Service Owner Dashboard",
  description: "Service Owner Dashboard",
};

type Props = {
  children: React.ReactNode;
};

// Sidebar icons for reuse
export const sidebarIcons: Record<string, JSX.Element> = {
  dashboard: <Icons.LayoutDashboard />,
  services: <Icons.Package />,
  customer: <Icons.Users />,
  offer: <Icons.Tag />,
  payment: <Icons.CreditCard />,
  chat: <Icons.MessageSquare />,
  setting: <Icons.Settings />,
  list: <Icons.List />,
};

import { prefixLocalePath } from "@/lib/localePath";
import Container from "@/components/layout/Container";

export default async function ServiceOwnerLayout({ children }: Props) {
  // Get current locale and prefix paths
  const dashboardHref = await prefixLocalePath(paths.serviceOwner.dashboard());
  const bookingsHref = await prefixLocalePath(paths.serviceOwner.bookings());
  const servicesHref = await prefixLocalePath(paths.serviceOwner.services());
  const customerHref = await prefixLocalePath(paths.serviceOwner.customer());
  const offerHref = await prefixLocalePath(paths.serviceOwner.offer());
  const paymentHref = await prefixLocalePath(paths.serviceOwner.payment());
  const chatHref = await prefixLocalePath(paths.serviceOwner.chat());
  const settingHref = await prefixLocalePath(paths.serviceOwner.setting());

  // Navigation items
  const navItems: DashboardNavigationType[] = [
    {
      href: dashboardHref,
      name: "Dashboard",
      icon: sidebarIcons.dashboard,
      children: [],
    },
    {
      href: bookingsHref,
      name: "My Bookings",
      icon: sidebarIcons.list,
      children: [],
    },
    {
      href: servicesHref,
      name: "Service List",
      icon: sidebarIcons.services,
      children: [],
    },
    {
      href: customerHref,
      name: "Customer",
      icon: sidebarIcons.customer,
      children: [],
    },
    { href: offerHref, name: "Offer", icon: sidebarIcons.offer, children: [] },
    {
      href: paymentHref,
      name: "Payment History",
      icon: sidebarIcons.payment,
      children: [],
    },
    { href: chatHref, name: "Chat", icon: sidebarIcons.chat, children: [] },
    {
      href: settingHref,
      name: "Setting",
      icon: sidebarIcons.setting,
      children: [],
    },
  ];

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

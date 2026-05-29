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
import { prefixLocalePath } from "@/lib/localePath";
import Container from "@/components/layout/Container";
import GetInTouch from "@/components/GetInTouch";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "User Dashboard",
  description: "User Dashboard",
};

type Props = {
  children: React.ReactNode;
};

// Sidebar icons
export const sidebarIcons: Record<string, JSX.Element> = {
  dashboard: <Icons.LayoutDashboard />,
  customer: <Icons.Users />,
  orders: <Icons.ShoppingBag />,
  wish: <Icons.Heart />,
  coupon: <Icons.Ticket />,
  gift: <Icons.Gift />,
};

// Build nav items server-side with prefixed paths
export async function buildNavItems(): Promise<DashboardNavigationType[]> {
  return [
    {
      href: await prefixLocalePath(paths.user.dashboard()),
      name: "Dashboard",
      icon: sidebarIcons.dashboard,
      children: [],
    },

    {
      href: await prefixLocalePath(paths.user.orders()),
      name: "Orders",
      icon: sidebarIcons.orders,
      children: [],
    },
    {
      href: await prefixLocalePath(paths.user.wish()),
      name: "Wishlist",
      icon: sidebarIcons.wish,
      children: [],
    },
    {
      href: await prefixLocalePath(paths.user.coupon()),
      name: "My Coupons",
      icon: sidebarIcons.coupon,
      children: [],
    },
    {
      href: await prefixLocalePath(paths.user.gift()),
      name: "Gift Cards",
      icon: sidebarIcons.gift,
      children: [],
    },
    {
      href: await prefixLocalePath(paths.user.customer()),
      name: "My Profile",
      icon: sidebarIcons.customer,
      children: [],
    },
  ];
}

export default async function UserLayout({ children }: Props) {
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
          <Container className="pt-4">
            {children} <GetInTouch />
            <Footer />
          </Container>
        </DashboardMainContainer>
      </DashboardContainer>
    </SidebarProvider>
  );
}

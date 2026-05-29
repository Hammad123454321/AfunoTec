"use client";

import React, { useMemo, useCallback } from "react";
import { useSidebar } from "./SidebarProvider";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DashboardActiveLink from "./DashboardActiveLink";
import { DashboardNavigationType } from "../types";
import { LucideChevronDown, LucideChevronRight } from "lucide-react";
import * as Icons from "lucide-react";

interface MenuProps {
  items: DashboardNavigationType[];
}

interface DashboardNavigationProps {
  items: DashboardNavigationType[];
}

// Icon mapping for string icon names
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Admin icons
  PanelsTopLeft: Icons.PanelsTopLeft,
  CalendarDays: Icons.CalendarDays,
  Package: Icons.Package,
  Users: Icons.Users,
  UserCog: Icons.UserCog,
  UserCheck: Icons.UserCheck,
  Percent: Icons.Percent,
  TicketPercent: Icons.TicketPercent,
  Gift: Icons.Gift,
  CreditCard: Icons.CreditCard,
  ListOrdered: Icons.ListOrdered,
  ArrowLeftRight: Icons.ArrowLeftRight,
  PercentCircle: Icons.PercentCircle,
  Mail: Icons.Mail,
  MessageSquare: Icons.MessageSquare,
  Settings: Icons.Settings,
  // User icons
  LayoutDashboard: Icons.LayoutDashboard,
  ShoppingBag: Icons.ShoppingBag,
  Heart: Icons.Heart,
  Ticket: Icons.Ticket,
};

// Updated renderIcon to handle both string and JSX element
const renderIcon = (
  icon: string | React.ReactElement | undefined,
  size: string
) => {
  if (!icon) return null;

  // If it's a string, look up the icon component
  if (typeof icon === "string") {
    const IconComponent = iconMap[icon];
    if (!IconComponent) {
      console.warn(`Icon "${icon}" not found in iconMap`);
      return null;
    }
    return <IconComponent className={size} />;
  }

  // If it's already a JSX element (backward compatibility)
  return React.cloneElement(icon, {
    className: size,
  } as React.SVGProps<SVGSVGElement>);
};

const IconSidebar = React.memo(({ items }: MenuProps) => {
  const validItems = useMemo(() => {
    return items.filter((item) => item.href && item.name);
  }, [items]);

  return (
    <motion.ul
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "linear" }}
      className="flex flex-col gap-6"
      role="navigation"
      aria-label="Collapsed navigation"
    >
      {validItems.map((item, idx) => (
        <li key={`${item.href}-${idx}`}>
          <DashboardActiveLink
            href={item.href}
            className={cn(
              "flex items-center size-6 justify-center ml-1 hover:bg-primary-600 hover:text-white rounded"
            )}
            aria-label={item.name}
            title={item.name}
          >
            {renderIcon(item.icon, "size-5")}
          </DashboardActiveLink>
        </li>
      ))}
    </motion.ul>
  );
});

IconSidebar.displayName = "IconSidebar";

const NameSidebar = React.memo(({ items }: MenuProps) => {
  const { activeTabs, handleActiveTabs } = useSidebar();
  const isActiveTab = useCallback(
    (index: number) => activeTabs.includes(index),
    [activeTabs]
  );

  const renderItems = useCallback(
    (
      navItems: DashboardNavigationType[],
      depth: number = 0
    ): React.ReactNode => {
      return navItems.map((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const itemKey = `${item.href}-${depth}-${index}`;

        return (
          <li
            key={itemKey}
            className={cn(
              "w-full hover:bg-primary-500 rounded",
              isActiveTab(index) &&
                "bg-primary-500 text-white rounded overflow-hidden"
            )}
          >
            <div className="flex w-full flex-1 items-center justify-between relative">
              <DashboardActiveLink
                href={item.href}
                className={cn(
                  "flex items-center gap-2 p-4 w-full hover:bg-primary-600 hover:text-white! rounded",
                  isActiveTab(index) &&
                    hasChildren &&
                    "bg-primary-500 rounded text-white"
                )}
                aria-current={isActiveTab(index) ? "page" : undefined}
              >
                {renderIcon(item.icon, "size-5")}
                <span>{item.name}</span>
              </DashboardActiveLink>

              {hasChildren && (
                <Button
                  variant="ghost"
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 before:absolute before:-inset-1"
                  onClick={() => handleActiveTabs(index)}
                  aria-expanded={isActiveTab(index)}
                  aria-controls={`submenu-${itemKey}`}
                >
                  {isActiveTab(index) ? (
                    <LucideChevronDown className="w-4 h-4" aria-hidden />
                  ) : (
                    <LucideChevronRight className="w-4 h-4" aria-hidden />
                  )}
                </Button>
              )}
            </div>

            {hasChildren && isActiveTab(index) && (
              <motion.ul
                id={`submenu-${itemKey}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15, ease: "linear" }}
                className="flex flex-col gap-1 [&_a]:pl-10!"
                role="group"
              >
                {renderItems(item.children!, depth + 1)}
              </motion.ul>
            )}
          </li>
        );
      });
    },
    [isActiveTab, handleActiveTabs]
  );

  const validItems = useMemo(
    () => items.filter((item) => item.href && item.name),
    [items]
  );

  return (
    <motion.ul
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "linear" }}
      className="flex flex-col gap-2 whitespace-nowrap"
      role="navigation"
      aria-label="Main navigation"
    >
      {renderItems(validItems)}
    </motion.ul>
  );
});

NameSidebar.displayName = "NameSidebar";

const DashboardNavigation = React.memo(
  ({ items }: DashboardNavigationProps) => {
    const { isCollapsedSidebar } = useSidebar();

    if (!items || items.length === 0) {
      console.warn("DashboardNavigation: No items provided");
      return null;
    }

    return isCollapsedSidebar ? (
      <IconSidebar items={items} />
    ) : (
      <NameSidebar items={items} />
    );
  }
);

DashboardNavigation.displayName = "DashboardNavigation";

export default DashboardNavigation;

"use client";

import { ChevronsRight } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import DashboardLogoutButton from "./DashboardLogoutButton";
import Logo from "@/components/Logo";

type DashboardSidebarProps = {
  children: React.ReactNode;
};

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const { isCollapsedSidebar } = useSidebar();

  return (
    <motion.nav
      className={cn(
        "h-full flex flex-col gap-8 z-50 sticky top-0 whitespace-nowrap px-4 shadow-xs bg-white text-base"
      )}
      style={{
        width: isCollapsedSidebar
          ? "var(--_sidebar-collapsed)"
          : "var(--_sidebar-expanded)",
      }}
      animate={{
        width: isCollapsedSidebar
          ? "var(--_sidebar-collapsed)"
          : "var(--_sidebar-expanded)",
      }}
    >
      <div className="absolute right-0 top-0 z-10">
        <SidebarToggleButton />
      </div>
      <SidebarHeader />

      <div className="flex-1 space-y-[var(--_sidebar-spacing)] overflow-y-scroll -mr-4 pr-4">
        {children}
      </div>
      <DashboardLogoutButton />
    </motion.nav>
  );
}

function SidebarHeader() {
  return (
    <div className="py-8 flex gap-2 items-center relative border-b border-gray-300">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="shrink-0 flex w-full justify-center"
      >
        <Logo />
      </motion.div>
    </div>
  );
}

export function SidebarToggleButton() {
  const { isExpanded, toggleSidebarCollapse } = useSidebar();
  return (
    <button className="p-1 cursor-pointer" onClick={toggleSidebarCollapse}>
      <ChevronsRight
        className={cn(
          "size-4 text-gray-500",
          isExpanded ? "-scale-100" : "scale-100"
        )}
      />
    </button>
  );
}

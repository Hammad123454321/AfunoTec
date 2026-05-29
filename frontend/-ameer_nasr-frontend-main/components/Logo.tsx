"use client";

import Link from "next/link";
import { useSidebar } from "@/features/dashboard/components";

export default function Logo() {
  const { isCollapsedSidebar } = useSidebar();
  return (
    <Link
      href="/"
      className="lily_script_one_a80d0536-module__TTvGeq__className text-2xl font-semibold"
    >
      {isCollapsedSidebar ? (
        <span className="text-green-800">AT</span>
      ) : (
        <>
          <span className="text-green-800">Afuno</span>
          <span className="text-orange-400">Tec</span>
        </>
      )}
    </Link>
  );
}

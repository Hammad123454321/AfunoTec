"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

type ActiveLinkProps = {
  exact?: boolean;
} & React.ComponentProps<"a">;

export default function DashboardActiveLink({
  href = "",
  className,
  children,
}: ActiveLinkProps) {
  const locale = useLocale();

  const pathname = usePathname();
  const isActive = "/" + locale + pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-y-2.5",
        isActive && "is-active-link bg-primary-600 text-white rounded",
        className
      )}
    >
      {children}
    </Link>
  );
}

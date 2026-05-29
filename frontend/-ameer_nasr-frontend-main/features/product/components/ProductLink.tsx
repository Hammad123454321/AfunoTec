"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { href: string } & React.PropsWithChildren;

export default function ProductLink({ children, href }: Props) {
  const pathname = usePathname();
  return (
    <Link className="after:absolute after:inset-0" href={`${pathname}/${href}`}>
      {children}
    </Link>
  );
}

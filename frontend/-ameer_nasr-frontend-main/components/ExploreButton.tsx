import Link from "next/link";
import { Button } from "./ui/button";
import { LucideChevronRight } from "lucide-react";

export default function ExploreButton({ href }: { href: string }) {
  return (
    <Button variant="link" asChild>
      <Link
        className="text-primary-500 text-lg! underline hover:opacity-70 group"
        href={href}
      >
        View All
        <LucideChevronRight className="size-5 group-hover:translate-x-1 relative transition-transform" />
      </Link>
    </Button>
  );
}

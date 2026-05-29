import { cn } from "@/lib/utils";

export default function Placeholder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-gray-600 text-sm truncate", className)}>
      {children}
    </span>
  );
}

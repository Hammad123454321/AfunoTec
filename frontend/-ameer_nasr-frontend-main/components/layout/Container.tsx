import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "section" | "article" | "main" | "aside";
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[95rem]",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "px-4",
  md: "px-4 md:px-6",
  lg: "px-4 md:px-8 lg:px-12",
};

export default function Container({
  children,
  className = "",
  size = "xl",
  padding = "md",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </Component>
  );
}

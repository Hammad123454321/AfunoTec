import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

type HeadingProps = {
  asChild?: boolean;
  as?: React.ElementType;
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "sm";
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right" | "justify";
  truncate?: boolean;
  gradient?: boolean;
  className?: string;
  children?: React.ReactNode;
  props?: React.ComponentProps<"h1">;
};

export default function Heading({
  asChild = false,
  as: Component = "h2",
  size = "h2",
  weight = "medium",
  align = "left",
  truncate = false,
  gradient = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : Component;

  const sizes: Record<string, string> = {
    h1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight",
    h2: "text-3xl sm:text-4xl md:text-5xl leading-snug",
    h3: "text-2xl sm:text-3xl md:text-4xl leading-snug",
    h4: "text-xl sm:text-2xl md:text-3xl leading-normal",
    h5: "text-base md:text-lg lg:text-[1.375rem] leading-[1.75rem]",
    h6: "text-sm sm:text-base md:text-lg leading-normal",
    sm: "text-sm",
  };

  const classes = cn(
    sizes[size],
    {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-semibold",
    }[weight],
    {
      left: "text-left",
      center: "text-center justify-center",
      right: "text-right",
      justify: "text-justify",
    }[align],
    truncate && "truncate",
    gradient &&
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent",
    "flex gap-2 flex-wrap",
    className,
  );

  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}

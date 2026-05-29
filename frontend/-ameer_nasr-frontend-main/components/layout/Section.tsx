import React from "react";
import { cn } from "@/lib/utils";
import Heading from "@/components/Heading";
import Container from "./Container";

type SectionProps = {
  /** Section heading text */
  title?: string | React.ReactNode;
  /** Optional description under the heading */
  description?: string;
  /** Content inside the section */
  children?: React.ReactNode;
  /** Background color or variant style */
  variant?: "default" | "muted" | "highlight";
  /** Spacing style */
  padding?: "none" | "sm" | "md" | "lg";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Additional className for customization */
  className?: string;
  id?: string;
  cta?: React.ReactNode;
};

export default function Section({
  title,
  description,
  children,
  variant = "default",
  padding = "md",
  align = "center",
  className,
  cta,
  ...props
}: SectionProps) {
  const variants: Record<typeof variant, string> = {
    default: "",
    muted: "bg-muted/50",
    highlight:
      "bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-950/20",
  };

  const paddings: Record<typeof padding, string> = {
    none: "",
    sm: "py-6 sm:py-8",
    md: "py-10 sm:py-14",
    lg: "py-16 sm:py-24",
  };

  const alignClass =
    align === "center"
      ? "text-center items-center! justify-center!"
      : align === "right"
        ? "text-right items-end"
        : "text-left items-start justify-start";

  return (
    <section
      className={cn(
        "w-full flex flex-col gap-6 sm:gap-8",
        variants[variant],
        paddings[padding],
        alignClass,
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <Container
          className={cn(
            "flex flex-col items-center gap-2 relative",
            alignClass,
          )}
        >
          {title && (
            <Heading
              as="h4"
              size="h4"
              weight="semibold"
              align={align}
              className="tracking-tight flex gap-2.5"
            >
              {title}
            </Heading>
          )}
          {description && (
            <p
              className={cn(
                "text-gray-700 max-w-4xl text-base lg:text-base xl:text-lg mx-auto text-center",
                alignClass,
              )}
            >
              {description}
            </p>
          )}
          {cta && (
            <div className="md:absolute inset-0 flex justify-end items-center">
              <span className="px-8 block">{cta}</span>
            </div>
          )}
        </Container>
      )}
      {children && <div className="w-full">{children}</div>}
    </section>
  );
}

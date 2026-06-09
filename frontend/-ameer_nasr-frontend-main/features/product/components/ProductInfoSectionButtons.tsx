"use client";

import Container from "@/components/layout/Container";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  items: string[];
};

export default function ProductInfoSectionButtons({ items }: Props) {
  const [activeSegment, setActiveSegment] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (const item of items) {
        const id = item.toLowerCase().replace(/\s+/g, "-");
        const element = document.getElementById(id);
        if (
          element &&
          element.offsetTop <= scrollPos &&
          element.offsetTop + element.offsetHeight > scrollPos
        ) {
          setActiveSegment(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-[#1f7be0] shadow-sm">
      <Container>
        <div className="flex overflow-x-auto scrollbar-hide no-scrollbar">
          {items.map((item, index) => {
            const id = item.toLowerCase().replace(/\s+/g, "-");
            const isActive = activeSegment === id;

            return (
              <a
                key={index}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={cn(
                  "relative px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer",
                  isActive
                    ? "bg-white text-[#1f7be0]"
                    : "text-white/90 hover:text-white hover:bg-white/10",
                )}
              >
                {item}
              </a>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

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
    <div className="sticky top-0 z-50 bg-white border-y border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
      <Container>
        <div className="flex flex-wrap overflow-x-auto scrollbar-hide py-3 gap-6 md:gap-12 no-scrollbar">
          {items.map((item, index) => {
            const id = item.toLowerCase().replace(/\s+/g, "-");
            const isActive = activeSegment === id;

            return (
              <a
                key={index}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={cn(
                  "relative py-1 text-sm md:text-base font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer",
                  isActive
                    ? "text-[#2d9e3f]"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {item}
                {isActive && (
                  <span className="absolute left-0 right-1 -bottom-[13px] h-1 bg-[#2d9e3f] rounded-full" />
                )}
              </a>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

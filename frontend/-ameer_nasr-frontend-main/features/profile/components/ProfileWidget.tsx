"use client";
import { Button } from "@/components/ui/button";
import { LucideUser } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProfileWidget() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <LucideUser />
        </Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

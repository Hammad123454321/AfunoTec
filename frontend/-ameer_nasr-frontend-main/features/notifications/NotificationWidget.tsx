"use client";
import { Button } from "@/components/ui/button";
import { LucideBell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function NotificationWidget() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <LucideBell />
        </Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  id: number;
  label: string;
  subLabel?: string;
  status: "pending" | "current" | "completed";
};

type Props = {
  steps: Step[];
};

export default function CheckoutStepper({ steps }: Props) {
  return (
    <div className="w-full bg-[#fcfdfd] py-8 border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-center gap-12 md:gap-24">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-4 relative">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500",
                  step.status === "completed"
                    ? "bg-[#2d9e4f] text-white"
                    : step.status === "current"
                      ? "bg-[#2d9e4f] text-white shadow-lg shadow-green-100"
                      : "bg-white border-2 border-gray-100 text-gray-300",
                )}
              >
                {step.status === "completed" ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Labels */}
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    step.status !== "pending"
                      ? "text-gray-900"
                      : "text-gray-400",
                  )}
                >
                  {step.label}
                </span>
                {step.subLabel && (
                  <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                    {step.subLabel}
                  </span>
                )}
              </div>

              {/* Connecting Line (Only visible on MD+) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute left-[140%] top-1/2 -translate-y-1/2 w-24 h-px bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

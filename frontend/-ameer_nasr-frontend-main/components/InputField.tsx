"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputFieldProps = {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
} & React.ComponentProps<"input">;

export function InputField({
  label,
  name,
  placeholder,
  type = "text",
  required,
  leftSlot,
  rightSlot,
  className,
  ...props
}: InputFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1", className)}>
          {label && (
            <FormLabel>
              {required ? (
                <span className="inline-flex items-center gap-1">
                  {label}
                  <span className="text-destructive font-semibold">*</span>
                </span>
              ) : (
                label
              )}
            </FormLabel>
          )}

          <FormControl>
            <div className="relative flex items-center">
              {leftSlot && (
                <span className="absolute left-2 flex items-center text-muted-foreground">
                  {leftSlot}
                </span>
              )}

              <Input
                {...field}
                {...props}
                type={type}
                placeholder={placeholder}
                className={cn(
                  leftSlot && "pl-8",
                  rightSlot && "pr-8",
                  "w-full"
                )}
              />

              {rightSlot && (
                <span className="absolute right-2 flex items-center text-muted-foreground">
                  {rightSlot}
                </span>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InputField;

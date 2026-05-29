// components/ui/text-field.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";

interface TextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
}

export function TextField({
  name,
  label,
  placeholder,
  type = "text",
}: TextFieldProps) {
  const {
    control,
    formState: { errors },
  } = useForm();

  const errorMessage = errors[name]?.message as string | undefined;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id={name}
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              className={`border px-4 py-2.5 rounded-lg w-full placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errorMessage ? "border-rose-500" : "border-gray-300"
              }`}
            />
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
    </div>
  );
}

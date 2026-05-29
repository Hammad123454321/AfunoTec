"use client";

import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import ImageUploader from "@/components/ImageUploader";
import type { ServiceFormValues } from "../../types/service-form.types";

interface ImageStepProps {
  control: Control<ServiceFormValues>;
}

export function ImageStep({ control }: ImageStepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Images</FormLabel>
            <FormControl>
              <ImageUploader
                value={field.value || []}
                onChange={(files) => {
                  // Ensure we're passing valid File objects
                  const validFiles = Array.isArray(files)
                    ? files.filter((f) => f instanceof File)
                    : [];
                  field.onChange(validFiles);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="text-sm text-muted-foreground">
        Upload images for your service (optional). Recommended size: 1200x800px
      </p>
    </div>
  );
}

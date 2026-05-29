"use client";

import { useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { useFieldArray, Controller, FieldPath } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Heading from "@/components/Heading";
import InputField from "@/components/InputField";
import type {
  RichTextArrayProps,
  ServiceFormValues,
} from "../types/service-form.types";

const AdaptiveMDXEditor = dynamic(() => import("@/components/MDXEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-gray-100 animate-pulse rounded" />
  ),
});

export const RichTextArray = memo(function RichTextArray({
  control,
  name,
  label,
}: RichTextArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `data.${name}` as const,
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && fields.length === 0) {
      append({ title: "", description: "" }, { shouldFocus: false });
      setInitialized(true);
    }
  }, [initialized, append]);

  return (
    <div className="space-y-4">
      <Heading as="h3" size="h4" weight="normal">
        {label}
      </Heading>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-4 p-4 border rounded-md bg-gray-50"
        >
          <InputField
            name={`data.${name}.${index}.title`}
            label={`${label} Title ${index + 1}`}
            placeholder="Enter title"
          />

          <div className="space-y-2">
            <Label>Description</Label>
            <Controller
              control={control}
              name={
                `data.${name}.${index}.description` as FieldPath<ServiceFormValues>
              }
              render={({ field: descField }) => (
                <div key={`${field.id}-editor`}>
                  <AdaptiveMDXEditor
                    value={
                      typeof descField.value === "string" ? descField.value : ""
                    }
                    onChange={(val) => descField.onChange(val)}
                    placeholder="Write description..."
                    minHeight="150px"
                  />
                </div>
              )}
            />
          </div>

          {fields.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              Remove {label}
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ title: "", description: "" }, { shouldFocus: false })
        }
      >
        + Add {label}
      </Button>
    </div>
  );
});

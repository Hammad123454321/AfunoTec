"use client";

import { useEffect } from "react";
import { useFieldArray, Control, FieldPath } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import InputField from "@/components/InputField";
import { LucidePlus } from "lucide-react";
import Heading from "@/components/Heading";

type DetailPointItem = {
  title: string;
  description: string;
};

interface DetailPointsProps {
  control: Control<any>; // your FormValues type
  name: "detailPoints";
  label?: string;
}

export default function DetailPoints({
  control,
  name,
  label = "Details Point",
}: DetailPointsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `data.${name}` as FieldPath<any>,
  });

  // Ensure at least one point exists
  useEffect(() => {
    if (fields.length === 0) append({ title: "", description: "" });
  }, [fields.length, append]);

  return (
    <div className="space-y-4">
      <Heading size="h6" as="h3">
        {label}
      </Heading>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`data.${name}.${index}` as FieldPath<any>}
            render={({ field: formField }) => (
              <FormItem className="space-y-2">
                {/* Title input */}
                <InputField
                  name={`data.${name}.${index}.title`}
                  label="Title"
                  placeholder="Enter title"
                  value={(formField.value as DetailPointItem)?.title || ""}
                  onChange={(e) =>
                    formField.onChange({
                      ...(formField.value as DetailPointItem),
                      title: e.target.value,
                    })
                  }
                />

                {/* Description input */}
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <InputField
                    name={`data.${name}.${index}.description`}
                    placeholder="Enter description"
                    value={
                      (formField.value as DetailPointItem)?.description || ""
                    }
                    onChange={(e) =>
                      formField.onChange({
                        ...(formField.value as DetailPointItem),
                        description: e.target.value,
                      })
                    }
                  />
                </FormControl>

                {/* Remove button if more than one */}
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                )}
              </FormItem>
            )}
          />
        ))}

        {/* Add new point button */}
        <Button
          variant="ghost"
          type="button"
          className="text-blue-500 hover:text-blue-600"
          onClick={() => append({ title: "", description: "" })}
        >
          <LucidePlus /> Add {label}
        </Button>
      </div>
    </div>
  );
}

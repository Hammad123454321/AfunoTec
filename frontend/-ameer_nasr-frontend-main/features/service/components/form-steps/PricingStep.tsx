"use client";

import { useEffect, memo } from "react";
import { useFieldArray, Controller, Control } from "react-hook-form";
import { ServiceSchema } from "../../utils/validation";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const currencyOptions = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "mga", label: "MGA" },
] as const;

interface PricingSectionProps {
  control: Control<ServiceSchema>;
}

const PricingStep = memo(function PricingStep({
  control,
}: PricingSectionProps) {
  const {
    fields: addOnFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "data.addOns",
  });

  useEffect(() => {
    if (addOnFields.length === 0) {
      append({ title: "", price: "0" }, { shouldFocus: false });
    }
  }, []);

  return (
    <div className="space-y-6">
      <fieldset className="p-4 rounded-md space-y-4 border">
        <legend className="font-semibold px-2">Base Price</legend>

        <InputField
          name="data.price"
          label="Price"
          type="number"
          placeholder="250"
          required
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium">Currency</Label>
          <Controller
            name="data.currency"
            control={control}
            render={({ field }) => (
              <Select
                key={field.value || "default"}
                value={field.value || "usd"}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <InputField
          name="data.priceUnitName"
          label="Price Unit"
          placeholder="per night, per person, etc."
        />
      </fieldset>

      <fieldset className="p-4 rounded-md space-y-4 border">
        <legend className="font-semibold px-2">Discount Info</legend>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Discount Type</Label>
          <Controller
            name="data.discountInfo.discountType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                key={field.value || "fixed"}
                value={field.value || "fixed"}
                onValueChange={field.onChange}
                className="flex items-center gap-6"
              >
                {["fixed", "percentage"].map((type) => (
                  <div
                    key={type}
                    className="flex items-center space-x-2 border px-3 py-1.5 rounded-md"
                  >
                    <RadioGroupItem
                      value={type}
                      id={`discount-${type}`}
                      className="w-4 h-4 rounded-sm"
                    />
                    <Label
                      htmlFor={`discount-${type}`}
                      className="capitalize text-sm cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <InputField
          name="data.discountInfo.discountValue"
          label="Discount Value"
          type="number"
          placeholder="0"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            name="data.discountInfo.validityPeriod.startDate"
            label="Start Date"
            type="date"
          />
          <InputField
            name="data.discountInfo.validityPeriod.endDate"
            label="End Date"
            type="date"
          />
        </div>
      </fieldset>

      <fieldset className="p-4 rounded-md space-y-4 border">
        <legend className="font-semibold px-2">Commission Info</legend>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Commission Type</Label>
          <Controller
            name="data.commissionDetails.commissionType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                key={field.value || "fixed"}
                value={field.value || "fixed"}
                onValueChange={field.onChange}
                className="flex items-center gap-6"
              >
                {["fixed", "percentage"].map((type) => (
                  <div
                    key={type}
                    className="flex items-center space-x-2 border px-3 py-1.5 rounded-md"
                  >
                    <RadioGroupItem
                      value={type}
                      id={`commission-${type}`}
                      className="w-4 h-4 rounded-sm"
                    />
                    <Label
                      htmlFor={`commission-${type}`}
                      className="capitalize text-sm cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <InputField
          name="data.commissionDetails.commissionValue"
          label="Commission Value"
          type="number"
          placeholder="0"
        />
      </fieldset>

      <fieldset className="p-4 rounded-md space-y-4 border">
        <legend className="font-semibold px-2">Add-Ons</legend>
        {addOnFields.map((field, index) => (
          <div
            key={field.id}
            className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end"
          >
            <InputField
              name={`data.addOns.${index}.title`}
              label="Title"
              placeholder="Add-on title"
            />
            <InputField
              name={`data.addOns.${index}.price`}
              type="number"
              label="Price"
              placeholder="50"
            />
            {addOnFields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                className="mb-0"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({ title: "", price: "0" }, { shouldFocus: false })
          }
        >
          Add Add-On
        </Button>
      </fieldset>
    </div>
  );
});

export default PricingStep;

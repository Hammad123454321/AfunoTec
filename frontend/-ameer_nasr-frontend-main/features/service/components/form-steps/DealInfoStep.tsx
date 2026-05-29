"use client";

import { memo } from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import InputField from "@/components/InputField";
import { CategoryDropdown } from "../CategoryDropdown";
import { RichTextArray } from "../RichTextArray";
import DetailsPoint from "../DetailsPointForm";
import type { ServiceFormValues } from "../../types/service-form.types";

const CATEGORY_OPTIONS = [
  { value: "hotels", label: "Hotels" },
  { value: "tours", label: "Tours" },
  { value: "services", label: "Services" },
];

const LOCATION_OPTIONS = [
  { value: "North", label: "North" },
  { value: "South", label: "South" },
  { value: "Center", label: "Center" },
  { value: "East", label: "East" },
  { value: "West", label: "West" },
];

interface DealInfoStepProps {
  control: Control<ServiceFormValues>;
}

export const DealInfoStep = memo(function DealInfoStep({
  control,
}: DealInfoStepProps) {
  return (
    <div className="space-y-8">
      {/* Deal Id is server-issued. Shown read-only at the top of the form
          so the provider can quote it on payouts / support. The backend
          fills it on POST /services in M2. */}
      <FormField
        control={control}
        name="data.dealId"
        render={({ field }) => (
          <FormItem className="max-w-xs">
            <FormLabel>Deal Id</FormLabel>
            <FormControl>
              <InputField
                name="data.dealId"
                label=""
                placeholder="Will be assigned on save"
                value={field.value || ""}
                onChange={field.onChange}
                disabled
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <InputField
        name="data.serviceName"
        label="Service Name"
        placeholder="Beachfront Resort Pro"
        required
      />

      <div className="flex flex-row items-start gap-4 flex-wrap">
        <InputField
          name="data.serviceTitle"
          label="Service Title"
          placeholder="Luxury Stay at Nosy Be"
          required
        />

        <Controller
          control={control}
          name="data.categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryDropdown
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Select category"
                  options={CATEGORY_OPTIONS}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={control}
          name="data.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <CategoryDropdown
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Select Location"
                  options={LOCATION_OPTIONS}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.duration"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputField
                  name="data.duration"
                  label="Duration"
                  placeholder="e.g., 3 nights / 4 days"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="data.shortSummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Summary</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="A brief summary of the service..."
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DetailsPoint control={control} name="detailPoints" />

      {/* Start / End points — required by tours, transfers and multi-day
          travel packages so the service can describe where the trip begins
          and ends (Figma p030). Free text for now; M3 will swap to a
          location picker. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          name="data.startPoint"
          label="Start Point"
          placeholder="e.g. Antananarivo (Ivato Airport)"
        />
        <InputField
          name="data.endPoint"
          label="End Point"
          placeholder="e.g. Nosy Be (Fascene Airport)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          name="data.checkInDate"
          label="Check-in Date"
          type="date"
          required
        />
        <InputField
          name="data.checkOutDate"
          label="Check-out Date"
          type="date"
          required
        />
      </div>

      <RichTextArray
        control={control}
        name="packageSummary"
        label="Package Summary"
      />

      <RichTextArray
        control={control}
        name="packageConditions"
        label="Package Conditions"
      />

      <RichTextArray
        control={control}
        name="whyStayHere"
        label="Why Stay Here"
      />
    </div>
  );
});

"use client";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

interface OfferFormValues {
  offerTitle: string;
  description: string;
  discountType: string;
  discountValue: string;
  services: string[];
  validityStartDate: string;
  validityEndDate: string;
  usageLimit: string;
  status: "active" | "draft";
  bannerImage: File[];
}

const serviceOptions = [
  { id: "hotels", label: "Hotels" },
  { id: "activities", label: "Activities" },
  { id: "culture", label: "Culture" },
  { id: "travel-deals", label: "Travel Deals" },
  { id: "transportation", label: "Transportation services" },
  { id: "corporate", label: "Corporate deal" },
  { id: "events", label: "Events and tickets" },
  { id: "tours", label: "Tours and Eco Tourism" },
];

export function CreateOffer() {
  const methods = useForm<OfferFormValues>({
    defaultValues: {
      offerTitle: "",
      description: "",
      discountType: "",
      discountValue: "",
      services: [],
      validityStartDate: "",
      validityEndDate: "",
      usageLimit: "",
      status: "active",
      bannerImage: [],
    },
  });

  const onSubmit = async (data: OfferFormValues) => {
    console.log(data);
    // Handle form submission
  };

  const selectedStatus = methods.watch("status");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Offer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Offer Information
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1: Offer Title and Description */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Offer Titles
                </label>
                <Controller
                  name="offerTitle"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Enter your offer titles"
                      className="w-full px-3 py-2.5 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Description
                </label>
                <Controller
                  name="description"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Enter your offer Discription"
                      className="w-full px-3 py-2.5 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                    />
                  )}
                />
              </div>
            </div>

            {/* Row 2: Discount Type and Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Discount Type
                </label>
                <Controller
                  name="discountType"
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full bg-gray-100 border-0">
                        <SelectValue placeholder="Discount Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Discount Value
                </label>
                <Controller
                  name="discountValue"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Type Discount Values"
                      type="number"
                      className="w-full px-3 py-2.5 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                    />
                  )}
                />
              </div>
            </div>

            {/* Applicable Services */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Applicable Services
              </label>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Services</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {serviceOptions.map((service) => (
                    <Controller
                      key={service.id}
                      name="services"
                      control={methods.control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              const updatedServices = checked
                                ? [...(field.value || []), service.id]
                                : field.value?.filter((s) => s !== service.id);
                              field.onChange(updatedServices);
                            }}
                          />
                          <label
                            htmlFor={service.id}
                            className="text-sm text-gray-900 cursor-pointer"
                          >
                            {service.label}
                          </label>
                        </div>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Validity Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Validity Start Date
                </label>
                <Controller
                  name="validityStartDate"
                  control={methods.control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="date"
                        placeholder="DD/MM/YY"
                        className="w-full px-3 py-2.5 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                      />
                      <Calendar
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Validity End Date
                </label>
                <Controller
                  name="validityEndDate"
                  control={methods.control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="date"
                        placeholder="DD/MM/YY"
                        className="w-full px-3 py-2.5 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                      />
                      <Calendar
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Usage Limit and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Usage Limit
                </label>
                <Controller
                  name="usageLimit"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Number"
                      type="number"
                      className="w-full px-3 py-2.5 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-900">
                  Status
                </label>
                <div className="flex gap-2">
                  <Controller
                    name="status"
                    control={methods.control}
                    render={({ field }) => (
                      <>
                        <button
                          type="button"
                          onClick={() => field.onChange("active")}
                          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                            selectedStatus === "active"
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Active
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("draft")}
                          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                            selectedStatus === "draft"
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Draft
                        </button>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Upload Banner/Image */}
            <div className="space-y-2">
              <label className="text-sm font-normal text-gray-900">
                Upload Banner/Image
              </label>
              <Controller
                name="bannerImage"
                control={methods.control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    maxFiles={1}
                    label=""
                    className="min-h-[280px]"
                  />
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Publish Offer
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-8 py-2 border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Save Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-8 py-2 border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

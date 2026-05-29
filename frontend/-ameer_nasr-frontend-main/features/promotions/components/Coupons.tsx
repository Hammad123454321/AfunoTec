"use client";

import { useForm, Controller, FormProvider } from "react-hook-form";
import ImageUploader from "@/components/ImageUploader";
import { TextField } from "@/components/TextField";
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
import { Textarea } from "@/components/ui/textarea";

interface FormValues {
  code: string;
  discountValue: string;
  usageLimit: string;
  type: string;
  status: string;
  startDate: string;
  expiryDate: string;
  note: string;
}

export function CreateCoupon() {
  const methods = useForm<FormValues>({
    defaultValues: {
      code: "",
      discountValue: "",
      usageLimit: "",
      type: "Percentage",
      status: "Enable",
      startDate: "",
      expiryDate: "",
      note: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Coupon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="opacity-0 absolute pointer-events-none select-none">
          <DialogTitle>Create Coupon</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Row 1: Code, Discount Value, Usage Limit */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Controller
                  name="code"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Iphone 16pro Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Value</label>
                <Controller
                  name="discountValue"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="10.00$"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Usage limit</label>
                <Controller
                  name="usageLimit"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="99"
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>
            </div>

            {/* Row 2: Type, Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Controller
                  name="type"
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Controller
                  name="status"
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Enable">Enable</SelectItem>
                        <SelectItem value="Disable">Disable</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Row 3: Start Date, Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start date</label>
                <Controller
                  name="startDate"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      placeholder="22-12-2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry date</label>
                <Controller
                  name="expiryDate"
                  control={methods.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      placeholder="31-12-2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>
            </div>

            {/* Row 4: Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <Controller
                name="note"
                control={methods.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="job posting $25 off*"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="px-8">
                Submit
              </Button>
              <Button type="button" variant="outline" className="px-8">
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

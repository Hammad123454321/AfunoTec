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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/TextField";

interface CommissionFormValues {
  applicableService: string;
  commissionName: string;
  commissionType: "percentage" | "fixed";
  commissionValue: string;
}

export function CreateCommission() {
  const methods = useForm<CommissionFormValues>({
    defaultValues: {
      applicableService: "",
      commissionName: "",
      commissionType: "percentage",
      commissionValue: "",
    },
  });

  const onSubmit = async (data: CommissionFormValues) => {
    console.log(data);
    // Handle form submission
  };

  const commissionType = methods.watch("commissionType");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Commission</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="opacity-0 absolute pointer-events-none select-none">
          <DialogTitle>Create Commission</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Applicable Service */}
            <div className="space-y-3">
              <label className="text-base font-normal text-gray-900">
                Applicable Service
              </label>
              <Controller
                name="applicableService"
                control={methods.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-12 ">
                      <SelectValue placeholder="All Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Category</SelectItem>
                      <SelectItem value="room-booking">Room Booking</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="spa">Spa Services</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Commission Name */}
            <TextField
              name="commissionName"
              label="Commission Name"
              placeholder="Commission Name"
            />

            {/* Commission Type - Radio Buttons */}
            <div className="space-y-3">
              <Controller
                name="commissionType"
                control={methods.control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center gap-8"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="percentage"
                        id="percentage"
                        className="border-2 border-green-500 text-green-500"
                      />
                      <Label
                        htmlFor="percentage"
                        className="text-base font-normal cursor-pointer"
                      >
                        Percentage of Total Booking Amount
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="fixed"
                        id="fixed"
                        className="border-2 border-green-500 text-green-500"
                      />
                      <Label
                        htmlFor="fixed"
                        className="text-base font-normal cursor-pointer"
                      >
                        Fixed Amount Per Booking
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <TextField
              name="commissionValue"
              label="Commission Value"
              placeholder="Commission Value"
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="default">
                Save Commission
              </Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

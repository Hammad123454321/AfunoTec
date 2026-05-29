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
import { TextField } from "@/components/TextField";
import SelectField from "@/components/SelectField";

interface GiftCardFormValues {
  giftCardName: string;
  expiryDate: string;
  value: string;
  note: string;
  status: string;
}

export function CreateGiftCard() {
  const methods = useForm<GiftCardFormValues>({
    defaultValues: {
      giftCardName: "",
      expiryDate: "",
      value: "",
      note: "",
      status: "Enable",
    },
  });

  const onSubmit = async (data: GiftCardFormValues) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Gift Card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="opacity-0 absolute pointer-events-none select-none">
          <DialogTitle>Create Gift Card</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Row 1: Gift Card Name, Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                name="giftCardName"
                label="Gift Card Name"
                placeholder="Gift card name"
              />

              <TextField
                name="giftCardName"
                label="Gift Card Name"
                placeholder="Gift card name"
                type="date"
              />
            </div>

            {/* Row 2: Value, Note */}
            <div className="grid grid-cols-2 gap-4">
              <TextField name="value" label="Value" placeholder="Value" />

              <TextField name="note" label="Note" placeholder="Note" />
            </div>

            <SelectField
              name="status"
              label="Status"
              options={[
                { label: "Enable", value: "enable" },
                { label: "Disable", value: "disable" },
              ]}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="default">
                Save
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

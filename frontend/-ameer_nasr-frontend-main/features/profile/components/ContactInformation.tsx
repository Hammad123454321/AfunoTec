"use client";

import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardSubtitle,
  ProfileCardTitle,
} from "./ProfileCard";
import { TextField } from "@/components/TextField";
import SubmitButton from "./SubmitButton";

interface FormValues {
  name: string;
  images: File[];
  email: string;
  phone: string;
}

export default function ContactInformation() {
  const methods = useForm<FormValues>({
    defaultValues: { name: "", images: [], email: "", phone: "" },
  });

  const onSubmit = async (data: FormValues) => {};

  return (
    <ProfileCard>
      <ProfileCardHeader>
        <ProfileCardTitle>Contact Information</ProfileCardTitle>
        <ProfileCardSubtitle>
          Ensure that your contact details are accurate for appointment
          confirmations, reminders, and support.
        </ProfileCardSubtitle>
      </ProfileCardHeader>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            name="address"
            label="Business Address"
            placeholder="Enter your business address"
          />
          <TextField
            name="email"
            label="Email Address"
            placeholder="Enter your email address"
          />
          <div className="flex gap-4 items-start [&>*]:flex-1">
            <TextField name="city" label="City" placeholder="City name" />
            <TextField name="zip" label="Zip Code" placeholder="Zip code" />
          </div>

          <TextField
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
          />

          <SubmitButton />
        </form>
      </FormProvider>
    </ProfileCard>
  );
}

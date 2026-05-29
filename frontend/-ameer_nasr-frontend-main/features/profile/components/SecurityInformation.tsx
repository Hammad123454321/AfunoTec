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

export default function SecurityInformation() {
  const methods = useForm<FormValues>({
    defaultValues: { name: "", images: [], email: "", phone: "" },
  });

  const onSubmit = async (data: FormValues) => {};

  return (
    <ProfileCard>
      <ProfileCardHeader>
        <ProfileCardTitle>Security Information</ProfileCardTitle>
        <ProfileCardSubtitle>
          If you wish to update your password, enter a new one below.
        </ProfileCardSubtitle>
      </ProfileCardHeader>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            name="currentPassword"
            label="Current Password"
            placeholder="Enter your current password"
          />
          <TextField
            name="newPassword"
            label="New Password"
            placeholder="Enter your new password"
          />

          <TextField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Enter your confirm password"
          />

          <SubmitButton />
        </form>
      </FormProvider>
    </ProfileCard>
  );
}

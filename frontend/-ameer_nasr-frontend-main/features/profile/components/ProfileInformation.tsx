"use client";

import { useForm, Controller, FormProvider } from "react-hook-form";
import ImageUploader from "@/components/ImageUploader";
import {
  ProfileCard,
  ProfileCardHeader,
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

export default function ProfileInformation() {
  const methods = useForm<FormValues>({
    defaultValues: { name: "", images: [], email: "", phone: "" },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    return;
    const formData = new FormData();
    data.images.forEach((img) => formData.append("images", img));
    await fetch("/api/upload", { method: "POST", body: formData });
  };

  return (
    <ProfileCard>
      <ProfileCardHeader>
        <ProfileCardTitle>Profile Information</ProfileCardTitle>
      </ProfileCardHeader>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Uploader */}
          <Controller
            name="images"
            control={methods.control}
            render={({ field }) => (
              <ImageUploader
                label="Profile picture"
                value={field.value}
                onChange={field.onChange}
                maxFiles={1}
                rounded
              />
            )}
          />

          <TextField
            name="name"
            label="Full Name"
            placeholder="Enter your name"
          />
          <TextField
            name="email"
            label="Email Address"
            placeholder="Enter your email address"
          />
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

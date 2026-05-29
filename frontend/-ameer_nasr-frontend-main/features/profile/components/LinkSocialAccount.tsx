"use client";

import { useForm, FormProvider } from "react-hook-form";
import { ProfileCard, ProfileCardTitle } from "./ProfileCard";
import { TextField } from "@/components/TextField";
import SubmitButton from "./SubmitButton";

interface FormValues {
  facebook: string;
  google: string;
}

export default function LinkSocialAccount() {
  const methods = useForm<FormValues>({
    defaultValues: { facebook: "", google: "" },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <ProfileCard>
      <ProfileCardTitle>My Social Login Accounts</ProfileCardTitle>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            name="facebook"
            label="Link your facebook account"
            placeholder="Enter your facebook account"
          />
          <TextField
            name="google"
            label="Link your google account"
            placeholder="Enter your google account"
          />

          <SubmitButton />
        </form>
      </FormProvider>
    </ProfileCard>
  );
}

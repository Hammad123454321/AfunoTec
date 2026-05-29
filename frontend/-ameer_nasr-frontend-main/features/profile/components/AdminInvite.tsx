"use client";

import { useForm, FormProvider } from "react-hook-form";
import { ProfileCard, ProfileCardTitle } from "./ProfileCard";
import { TextField } from "@/components/TextField";
import SubmitButton from "./SubmitButton";
import SelectField from "@/components/SelectField";

interface FormValues {
  name: string;
  service: string;
  location: string;
  category: string[];
}

export default function AdminInvite() {
  const methods = useForm<FormValues>({
    defaultValues: { name: "", service: "", location: "", category: [] },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <ProfileCard>
      <ProfileCardTitle>Admin Invite</ProfileCardTitle>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            name="email"
            label="Email"
            placeholder="Enter your business name"
          />
          <SelectField
            name="role"
            label="Assign Role"
            placeholder="Assign Role"
            options={[
              { label: "Admin", value: "admin" },
              { label: "Editor", value: "editor" },
            ]}
          />

          <SubmitButton />
        </form>
      </FormProvider>
    </ProfileCard>
  );
}

"use client";

import { useForm, FormProvider } from "react-hook-form";
import { ProfileCard, ProfileCardTitle } from "./ProfileCard";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import SubmitButton from "./SubmitButton";

interface FormValues {
  name: string;
  service: string;
  location: string;
  category: string[];
}

const DEFAULT_CATEGORIES = [
  "Accommodation",
  "Transportation",
  "Food",
  "Others",
  "Deals",
  "Tourism",
  "Events and tickets",
];

export default function ContactInformation() {
  const methods = useForm<FormValues>({
    defaultValues: { name: "", service: "", location: "", category: [] },
  });

  const [categories, setCategories] = useState<string[]>([]);

  const addCategory = (category: string) => {
    setCategories([...categories, category]);
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      removeCategory(category);
    } else {
      addCategory(category);
    }
  };

  const onSubmit = async (data: FormValues) => {
    console.log(data, categories);
  };

  return (
    <ProfileCard>
      <ProfileCardTitle>Business Information</ProfileCardTitle>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            name="name"
            label="Business Name"
            placeholder="Enter your business name"
          />
          <TextField
            name="service"
            label="Service Name"
            placeholder="Service name"
          />
          <Category
            selectedCategories={categories}
            toggleCategory={toggleCategory}
          />

          <SubmitButton />
        </form>
      </FormProvider>
    </ProfileCard>
  );
}

interface CategoryProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
}

export function Category({
  selectedCategories,
  toggleCategory,
}: CategoryProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Category</Label>
      <div className="flex flex-wrap gap-2">
        {DEFAULT_CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <motion.button
              key={category}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCategory(category)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-colors duration-150",
                isSelected
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              )}
            >
              {category}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

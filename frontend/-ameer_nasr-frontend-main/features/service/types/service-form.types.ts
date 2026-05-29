import { z } from "zod";
import { serviceSchema } from "../utils/validation";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export interface FormStepConfig<T extends FieldValues = ServiceFormValues> {
  label: string;
  fields: FieldPath<T>[];
}

export interface Option {
  value: string;
  label: string;
}

export interface BaseDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  className?: string;
}

export interface RichTextArrayProps {
  control: Control<ServiceFormValues>;
  name: "detailPoints" | "packageSummary" | "packageConditions" | "whyStayHere";
  label: string;
}

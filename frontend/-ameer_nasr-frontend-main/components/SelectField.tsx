import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

export default function SelectField({
  name,
  label,
  placeholder = "Select an option",
  options,
}: SelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={name}>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            id={name}
            className={`border p-2 rounded-lg w-full bg-white text-sm ${
              errorMessage ? "border-red-500" : "border-gray-500"
            }`}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />

      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
    </div>
  );
}

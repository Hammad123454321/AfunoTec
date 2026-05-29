"use client";
import { useState } from "react";
import DropdownSelect, { DropdownSelectOption } from "./DropdownSelect";

type Props = {
  placeholder: string | React.ReactNode;
};

export default function LocationSelect({ placeholder }: Props) {
  const options: DropdownSelectOption[] = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

  const [selected, setSelected] = useState<DropdownSelectOption | null>(null);

  return (
    <div className="w-full">
      <DropdownSelect
        options={options}
        value={selected}
        onChange={setSelected}
        placeholder={placeholder}
      />
    </div>
  );
}

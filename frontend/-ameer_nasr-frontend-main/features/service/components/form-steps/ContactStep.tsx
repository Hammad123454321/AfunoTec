"use client";

import InputField from "@/components/InputField";

export function ContactStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputField
        name="data.contactInfo.ownerName"
        label="Owner Name"
        required
        placeholder="John Doe"
      />
      <InputField
        name="data.contactInfo.phoneNumber"
        label="Phone Number"
        placeholder="+261-34567890"
      />
      <InputField
        name="data.contactInfo.emailAddress"
        label="Email Address"
        type="email"
        placeholder="owner@example.com"
      />
    </div>
  );
}

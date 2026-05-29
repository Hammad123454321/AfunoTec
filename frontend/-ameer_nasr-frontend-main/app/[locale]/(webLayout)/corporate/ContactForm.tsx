"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Field {
  label: string;
  name: keyof FormValues;
  placeholder: string;
  required?: boolean;
  type?: string;
}

interface FormValues {
  fullName: string;
  companyName: string;
  companyAddress: string;
  email: string;
  landline: string;
  mobile: string;
}

const ContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const fields: Field[] = [
    { label: "Your Full Name", required: true, placeholder: "Enter your full name:", name: "fullName" },
    { label: "Your Company Name", required: true, placeholder: "Enter your company name:", name: "companyName" },
    { label: "Company Address", required: true, placeholder: "Enter your company address:", name: "companyAddress" },
    { label: "E-mail Address", required: true, placeholder: "Enter your E-mail Address:", name: "email", type: "email" },
    { label: "Landline Number", required: true, placeholder: "Write your landline number here", name: "landline" },
    { label: "Mobile Number", required: true, placeholder: "Write your mobile number here", name: "mobile" },
  ];

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="bg-[#F4F4F4] w-full p-12 rounded">
        <div className="bg-white p-6 md:p-10 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8">Fill in the form below</h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.map((field, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type={field.type || "text"}
              placeholder={field.placeholder}
              className={`w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
              {...register(field.name, { required: field.required })}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">This field is required</p>
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default ContactForm;

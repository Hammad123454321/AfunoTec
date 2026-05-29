import React from "react";

export default function GettingStarted() {
  const steps = [
    {
      number: "01.",
      title: "Tell us who you are",
      description: "Simply fill out the form below with your contact details",
    },
    {
      number: "02.",
      title: "We'll call you back",
      description:
        "Our team will get in touch with you and you can let us know what you're looking for.",
    },
    {
      number: "03.",
      title: "Get the Best Deals for your Employees",
      description:
        "We'll create a special corporate account for you to start using immediately",
    },
  ];

  return (
    <div className="max-w-[1320px] mx-auto mt-18 mb-10 px-4">
      <h2 className="text-center text-xl md:text-2xl md:mb-10">
        Getting Started{" "}
        <span className="text-[#22A628]">in 3 Easy Steps</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-[#F0F0F0] p-5">
            <h3 className="text-[#0C57F9]">
              {step.number} {step.title}
            </h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

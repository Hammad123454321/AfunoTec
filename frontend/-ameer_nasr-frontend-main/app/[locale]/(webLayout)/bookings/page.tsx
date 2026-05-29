"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import CheckoutStepper from "./_components/CheckoutStepper";
import GuestInformationForm from "./_components/GuestInformationForm";
import BookingSummarySidebar from "./_components/BookingSummarySidebar";
import ConfirmationView from "./_components/ConfirmationView";
import NeedHelpCard from "./_components/NeedHelpCard";
import PaymentView from "./_components/PaymentView";

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Stepper data logic
  const checkoutSteps = [
    {
      id: 1,
      label: "Guest information",
      subLabel: "Tell us who's staying",
      status: step > 1 ? "completed" : "current",
    },
    {
      id: 2,
      label: "Payment",
      subLabel: "Secure checkout",
      status: step === 2 ? "current" : step > 2 ? "completed" : "pending",
    },
    {
      id: 3,
      label: "Confirmation",
      subLabel: "Booking confirmed",
      status: step === 3 ? "completed" : "pending",
    },
  ] as const;

  const handleProceedToPayment = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompleteBooking = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-32">
      {/* Header Stepper */}
      <CheckoutStepper steps={checkoutSteps as any} />

      <Container className="py-12 md:py-16">
        {(step === 1 || step === 2) && (
          <div className="lg:flex lg:gap-16 items-start relative overflow-visible">
            {/* Left Content Column */}
            <div className="flex-[2.5] min-w-0">
               {step === 1 && <GuestInformationForm onProceed={handleProceedToPayment} />}
               {step === 2 && <PaymentView onComplete={handleCompleteBooking} />}
            </div>

            {/* Right Sidebar Column */}
            <div className="hidden lg:block flex-1 max-w-[440px] lg:sticky lg:top-8 transition-all">
               <BookingSummarySidebar />
               <div className="mt-6">
                 <NeedHelpCard />
               </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-[1280px] mx-auto animate-in fade-in duration-1000">
             <ConfirmationView />
          </div>
        )}
      </Container>

      {/* Mobile Sidebar & Help View */}
      {(step === 1 || step === 2) && (
        <div className="lg:hidden mt-8 px-4 space-y-6">
           <BookingSummarySidebar />
           <NeedHelpCard />
        </div>
      )}
    </div>
  );
}

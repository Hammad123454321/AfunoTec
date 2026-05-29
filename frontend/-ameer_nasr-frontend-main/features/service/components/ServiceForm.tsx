"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { serviceSchema } from "../utils/validation";
import { Button } from "@/components/ui/button";
import ServiceTabs, { ServiceTab } from "./ServiceTabs";
import PricingStep from "./form-steps/PricingStep";
import { DealInfoStep } from "./form-steps/DealInfoStep";
import { AvailabilityStep } from "./form-steps/AvailabilityStep";
import { ImageStep } from "./form-steps/ImageStep";
import { ContactStep } from "./form-steps/ContactStep";
import type {
  ServiceFormValues,
  FormStepConfig,
} from "../types/service-form.types";

const FORM_STEPS: FormStepConfig[] = [
  {
    label: "Deal Info",
    fields: [
      // "data.serviceName",
      // "data.serviceTitle",
      // "data.categoryName",
      // "data.location",
    ],
  },
  {
    label: "Pricing and Discounts",
    fields: [
      // "data.price", "data.priceUnitName", "data.currency"
    ],
  },
  {
    label: "Availability",
    fields: [
      // "data.checkInDate", "data.checkOutDate"
    ],
  },
  {
    label: "Image",
    fields: [],
  },
  {
    label: "Contact Information",
    fields: [
      // "data.contactInfo.ownerName", "data.contactInfo.phoneNumber"
    ],
  },
];

const DEFAULT_FORM_VALUES: ServiceFormValues = {
  images: [],
  data: {
    serviceName: "",
    serviceTitle: "",
    categoryName: "",
    location: "",
    checkInDate: "",
    checkOutDate: "",
    serviceStatus: "ACTIVE",
    contactInfo: {
      ownerName: "",
      phoneNumber: "",
      emailAddress: "",
    },
    shortSummary: "",
    detailPoints: [{ title: "", description: "" }],
    priceUnitName: "",
    price: "0",
    currency: "usd",
    duration: "",
    discountInfo: {
      discountType: "fixed",
      discountValue: "0",
      validityPeriod: { startDate: "", endDate: "" },
    },
    commissionDetails: {
      commissionType: "fixed",
      commissionValue: "0",
    },
    addOns: [{ title: "", price: "0" }],
    packageSummary: [{ title: "", description: "" }],
    packageConditions: [{ title: "", description: "" }],
    whyStayHere: [{ title: "", description: "" }],
  },
};

export default function ServiceForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(
      serviceSchema
    ) as unknown as Resolver<ServiceFormValues>,
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { handleSubmit, trigger, reset, control } = form;

  const validateStep = useCallback(async (): Promise<boolean> => {
    const currentFields = FORM_STEPS[activeStep].fields;
    if (currentFields.length === 0) return true;
    return await trigger(currentFields);
  }, [activeStep, trigger]);

  const handleNext = useCallback(async () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    try {
      const isValid = await validateStep();

      if (!isValid) {
        toast.error("Please fill in all required fields before continuing.");
        return;
      }

      // Use requestAnimationFrame to ensure smooth transition
      requestAnimationFrame(() => {
        setCompletedSteps((prev) => {
          const updated = new Set(prev);
          for (let i = 0; i <= activeStep; i++) {
            updated.add(i);
          }
          return Array.from(updated);
        });

        setActiveStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
      });
    } finally {
      // Delay re-enabling to prevent rapid clicks
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [activeStep, validateStep, isTransitioning]);

  const handleBack = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    requestAnimationFrame(() => {
      setActiveStep((prev) => Math.max(prev - 1, 0));
    });

    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const onSubmit: SubmitHandler<ServiceFormValues> = async (values) => {
    console.log({ values });
    // return;
    try {
      setLoading(true);

      const formData = new FormData();
      values.images?.forEach((img) => formData.append("images", img));
      formData.append("data", JSON.stringify(values.data));

      const res = await fetch("/api/services", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create service");
      }

      toast.success("Service created successfully!");
      setCompletedSteps(FORM_STEPS.map((_, i) => i));
      setActiveStep(0);
      reset();
    } catch (err) {
      console.error("Service creation error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to create service. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Render step with key to force remount on step change
  const renderStepFields = useMemo(() => {
    const stepLabel = FORM_STEPS[activeStep].label;

    const StepComponent = () => {
      switch (stepLabel) {
        case "Deal Info":
          return <DealInfoStep control={control} />;
        case "Pricing and Discounts":
          return <PricingStep control={control} />;
        case "Availability":
          return <AvailabilityStep />;
        case "Image":
          return <ImageStep control={control} />;
        case "Contact Information":
          return <ContactStep />;
        default:
          return null;
      }
    };

    // Add key to force component remount on step change
    return (
      <div key={activeStep}>
        <StepComponent />
      </div>
    );
  }, [activeStep, control]);

  const isLastStep = activeStep === FORM_STEPS.length - 1;
  const isFirstStep = activeStep === 0;

  return (
    <div className="space-y-6 pb-10">
      <ServiceTabs>
        {FORM_STEPS.map((step, index) => (
          <ServiceTab
            key={step.label}
            index={index + 1}
            active={index === activeStep}
            completed={completedSteps.includes(index)}
          >
            {step.label}
          </ServiceTab>
        ))}
      </ServiceTabs>

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="p-6 rounded-md bg-white shadow-sm min-h-[200px] transition-opacity duration-200">
            {renderStepFields}
          </div>

          <div className="flex justify-between gap-2">
            <div>
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading || isTransitioning}
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {!isLastStep ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading || isTransitioning}
                >
                  {isTransitioning ? "Loading..." : "Next"}
                </Button>
              ) : (
                <Button type="submit" disabled={loading || isTransitioning}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

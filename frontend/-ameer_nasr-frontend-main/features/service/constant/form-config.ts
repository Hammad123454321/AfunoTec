import {
  FormStepConfig,
  ServiceFormValues,
  Option,
} from "../types/service-form.types";

export const CATEGORY_OPTIONS: Option[] = [
  { value: "hotels", label: "Hotels" },
  { value: "tours", label: "Tours" },
  { value: "services", label: "Services" },
] as const;

export const LOCATION_OPTIONS: Option[] = [
  { value: "North", label: "North" },
  { value: "South", label: "South" },
  { value: "Center", label: "Center" },
  { value: "East", label: "East" },
  { value: "West", label: "West" },
] as const;

export const FORM_STEPS: FormStepConfig[] = [
  {
    label: "Deal Info",
    fields: [
      "data.serviceName",
      "data.serviceTitle",
      "data.categoryName",
      "data.location",
    ],
  },
  {
    label: "Pricing and Discounts",
    fields: ["data.price", "data.priceUnitName", "data.currency"],
  },
  {
    label: "Availability",
    fields: ["data.checkInDate", "data.checkOutDate"],
  },
  {
    label: "Image",
    fields: [],
  },
  {
    label: "Contact Information",
    fields: ["data.contactInfo.ownerName", "data.contactInfo.phoneNumber"],
  },
] as const;

export const DEFAULT_FORM_VALUES: ServiceFormValues = {
  images: [],
  data: {
    dealId: "",
    serviceName: "",
    serviceTitle: "",
    categoryName: "",
    location: "",
    startPoint: "",
    endPoint: "",
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
} as const;

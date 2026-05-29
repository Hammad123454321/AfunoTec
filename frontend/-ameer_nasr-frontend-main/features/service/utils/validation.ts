import { z } from "zod";

// Image validation schema - handles both File objects and empty arrays
const imageSchema = z
  .union([
    z.instanceof(File),
    z.any(), // Fallback for edge cases
  ])
  .optional();

export const serviceSchema = z.object({
  images: z.array(imageSchema).optional().default([]),
  data: z.object({
    // Server-issued deal identifier (e.g. "1001"). Read-only in the form;
    // the backend assigns it on create. Optional in the schema so unsaved
    // drafts validate.
    dealId: z.string().optional().default(""),
    serviceName: z.string().min(1, "Service name is required"),
    serviceTitle: z.string().min(1, "Service title is required"),
    categoryName: z.string().min(1, "Category is required"),
    location: z.string().min(1, "Location is required"),
    // Free-text start/end-point locations for services that move between
    // two places (tours, transfers, multi-day travel packages).
    startPoint: z.string().optional().default(""),
    endPoint: z.string().optional().default(""),
    checkInDate: z.string().min(1, "Check-in date is required"),
    checkOutDate: z.string().min(1, "Check-out date is required"),
    serviceStatus: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).default("ACTIVE"),
    contactInfo: z.object({
      ownerName: z.string().min(1, "Owner name is required"),
      phoneNumber: z.string().optional().default(""),
      emailAddress: z.string().email().optional().or(z.literal("")).default(""),
    }),
    shortSummary: z.string().optional().default(""),
    detailPoints: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    priceUnitName: z.string().min(1, "Price unit is required"),
    price: z.string().min(1, "Price is required"),
    currency: z.enum(["usd", "eur", "mga", "USD", "EUR", "MGA"]).default("usd"),
    duration: z.string().optional().default(""),
    discountInfo: z.object({
      discountType: z.enum(["fixed", "percentage"]).default("fixed"),
      discountValue: z.string().default("0"),
      validityPeriod: z.object({
        startDate: z.string().default(""),
        endDate: z.string().default(""),
      }),
    }),
    commissionDetails: z.object({
      commissionType: z.enum(["fixed", "percentage"]).default("fixed"),
      commissionValue: z.string().default("0"),
    }),
    addOns: z.array(
      z.object({
        title: z.string(),
        price: z.string(),
      })
    ),
    packageSummary: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    packageConditions: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    whyStayHere: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

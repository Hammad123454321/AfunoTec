"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

export type BookingDetailsData = {
  bookingId: string;
  bookingDate: string;
  paymentStatus: string;
  // Booking Summary
  summary?: {
    id?: string;
    date?: string;
    status?: string;
    amount?: number | string;
  };
  // Service Information
  service?: {
    type?: string;
    location?: string;
    checkIn?: string;
    checkOut?: string;
    nights?: number;
    guests?: string;
  };
  // Customer Information
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  // Payment Information
  payment?: {
    refundDate?: string;
    method?: string;
    transactionId?: string;
    phone?: string;
    address?: string;
  };
};

interface Props {
  trigger: ReactNode;
  data: BookingDetailsData;
  onMarkReviewed?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
}

/**
 * Booking-details modal shown when a row is clicked on the My Bookings
 * page. Matches the layout of the Figma "Booking Details" overlay
 * (service-owner Figma p016): four labelled sections + Refund pill +
 * Mark as Reviewed / Cancel actions.
 */
export function BookingDetailsModal({
  trigger,
  data,
  onMarkReviewed,
  onCancel,
}: Props) {
  const [open, setOpen] = useState(false);

  const isRefund =
    data.paymentStatus === "Refunded" || data.summary?.status === "refund";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg">
              Booking Details — #{data.bookingId}
            </DialogTitle>
            {isRefund && <StatusBadge status="Refunded" />}
          </div>
          <DialogDescription>
            Booking Date: {data.bookingDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Section title="Booking Summary">
            <Row label="Booking ID" value={data.summary?.id ?? data.bookingId} />
            <Row
              label="Booking Date"
              value={data.summary?.date ?? data.bookingDate}
            />
            <Row
              label="Payment Status"
              value={
                data.summary?.status ? (
                  <StatusBadge status={data.summary.status} />
                ) : (
                  <StatusBadge status={data.paymentStatus} />
                )
              }
            />
            {data.summary?.amount !== undefined && (
              <Row
                label="Amount"
                value={
                  typeof data.summary.amount === "number"
                    ? `Ar ${data.summary.amount.toLocaleString()}`
                    : data.summary.amount
                }
              />
            )}
          </Section>

          <Section title="Service Information">
            <Row label="Service Type" value={data.service?.type ?? "—"} />
            <Row label="Location" value={data.service?.location ?? "—"} />
            <Row label="Check-in Date" value={data.service?.checkIn ?? "—"} />
            <Row label="Check-out Date" value={data.service?.checkOut ?? "—"} />
            {data.service?.nights !== undefined && (
              <Row label="Nights" value={`${data.service.nights} nights`} />
            )}
            <Row label="Guests" value={data.service?.guests ?? "—"} />
          </Section>

          <Section title="Customer Information">
            <Row label="Name" value={data.customer?.name ?? "—"} />
            <Row label="Email" value={data.customer?.email ?? "—"} />
            <Row label="Phone" value={data.customer?.phone ?? "—"} />
            <Row label="Address" value={data.customer?.address ?? "—"} />
          </Section>

          <Section title="Payment Information">
            {data.payment?.refundDate && (
              <Row label="Refund Date" value={data.payment.refundDate} />
            )}
            <Row label="Payment Method" value={data.payment?.method ?? "—"} />
            <Row
              label="Transaction ID"
              value={data.payment?.transactionId ?? "—"}
            />
            <Row label="Phone" value={data.payment?.phone ?? "—"} />
            <Row label="Address" value={data.payment?.address ?? "—"} />
          </Section>
        </div>

        <DialogFooter className="flex sm:justify-end gap-2">
          <Button
            type="button"
            className="bg-primary-500 hover:bg-primary-600 text-white"
            onClick={() => {
              onMarkReviewed?.(data.bookingId);
              setOpen(false);
            }}
          >
            Mark as Reviewed
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => onCancel?.(data.bookingId)}
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-primary-600 mb-2">{title}</h3>
      <dl className="space-y-1.5 text-sm text-gray-700">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}

export default BookingDetailsModal;

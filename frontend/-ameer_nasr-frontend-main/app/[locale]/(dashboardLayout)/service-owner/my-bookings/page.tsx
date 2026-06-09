"use client";

import Pagination from "@/features/table/components/Pagination";
import SearchField from "@/features/table/components/SearchField";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderItem,
  TableRow,
  TableBodyItem,
} from "@/features/table/components/Table";
import { TableProvider } from "@/features/table/components/TableProvider";
import { SortDirection } from "@/features/table/types/table.type";
import {
  RowSelect,
  RowSelectAll,
} from "@/features/table/components/TableCheckbox";
import { LucideStar, LucidePlus, LucideMoreVertical } from "lucide-react";
import { TableFilter } from "@/features/table/components/Filter";
import { Button } from "@/components/ui/button";
import {
  StatusBadge,
  BookingDetailsModal,
} from "@/features/dashboard/components";

// -------------------- Types --------------------
type BookingRow = {
  bookingId: string;
  customerName: string;
  serviceOwner: string;
  roomType: string;
  bookingDate: string;
  dateRegistered: string;
  amount: number;
  star: number;
  commission: string;
  location: string;
  paymentStatus: string;
  status: string;
};

// -------------------- Table Header --------------------
// Matches Figma p016 (service-owner Booking Details): includes
// Commission % and Date Registered alongside the customer / service /
// payment / status columns.
const tableHeader: { key: keyof BookingRow; label: string }[] = [
  { key: "bookingId", label: "Booking ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "serviceOwner", label: "Service Owner" },
  { key: "roomType", label: "Room Type" },
  { key: "bookingDate", label: "Booking Date" },
  { key: "amount", label: "Amount" },
  { key: "star", label: "Star" },
  { key: "commission", label: "Commission %" },
  { key: "dateRegistered", label: "Date Registered" },
  { key: "location", label: "Location" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "status", label: "Status" },
];

// -------------------- Dummy Data (replaced by API in M2/M3) --------------------
const bookings: BookingRow[] = [
  {
    bookingId: "B00123",
    customerName: "Ayesha Rahman",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Singles",
    bookingDate: "28 Aug 2025",
    dateRegistered: "20 Aug 2025",
    amount: 200000,
    star: 5,
    commission: "20%",
    location: "Nosy Be",
    paymentStatus: "Paid",
    status: "Active",
  },
  {
    bookingId: "B00124",
    customerName: "Rahim Uddin",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Family",
    bookingDate: "29 Aug 2025",
    dateRegistered: "21 Aug 2025",
    amount: 250000,
    star: 4,
    commission: "20%",
    location: "Nosy Be",
    paymentStatus: "Unpaid",
    status: "Pending",
  },
  {
    bookingId: "B00125",
    customerName: "Lalaina R.",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Suite",
    bookingDate: "30 Aug 2025",
    dateRegistered: "22 Aug 2025",
    amount: 300000,
    star: 5,
    commission: "20%",
    location: "Antananarivo",
    paymentStatus: "Refunded",
    status: "Cancelled",
  },
  {
    bookingId: "B00126",
    customerName: "Hery N.",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Singles",
    bookingDate: "5 Sep 2025",
    dateRegistered: "29 Aug 2025",
    amount: 180000,
    star: 4,
    commission: "20%",
    location: "Tamatave",
    paymentStatus: "Paid",
    status: "Scheduled",
  },
  {
    bookingId: "B00127",
    customerName: "Mialy B.",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Family",
    bookingDate: "12 Sep 2025",
    dateRegistered: "30 Aug 2025",
    amount: 220000,
    star: 5,
    commission: "20%",
    location: "Antsirabe",
    paymentStatus: "Paid",
    status: "Expired",
  },
  {
    bookingId: "B00128",
    customerName: "Toky H.",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Singles",
    bookingDate: "—",
    dateRegistered: "31 Aug 2025",
    amount: 150000,
    star: 3,
    commission: "20%",
    location: "Diego",
    paymentStatus: "Unpaid",
    status: "Draft",
  },
  {
    bookingId: "B00129",
    customerName: "Sabrina M.",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Suite",
    bookingDate: "—",
    dateRegistered: "01 Sep 2025",
    amount: 280000,
    star: 5,
    commission: "20%",
    location: "Mahajanga",
    paymentStatus: "Unpaid",
    status: "Payment Pending",
  },
];

// -------------------- Component --------------------
export default function BookingTable() {
  const totalPages = 1;
  const sorted = bookings;

  const DATE_RANGE_OPTIONS = [
    { label: "Recommended date", value: "recommended" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last month", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last year", value: "1y" },
  ];

  const SERVICE_OPTIONS = [
    { label: "All Services", value: "all" },
    { label: "Hotels", value: "hotels" },
    { label: "Tours", value: "tours" },
    { label: "Transportation", value: "transport" },
  ];

  return (
    <TableProvider>
      <div className="space-y-6 overflow-x-hidden">
        {/* Header — title + search on the left, filters + "+ New" on the right */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between print:hidden">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <SearchField
              placeholder="Customer name, Booking ID…"
              initialValue={""}
            />
            <TableFilter
              options={SERVICE_OPTIONS}
              paramKey={"service"}
              placeholder={"All Services"}
              allLabel={"All Services"}
              variant={"button"}
            />
          </div>
          <div className="flex gap-3 items-center">
            <TableFilter
              options={DATE_RANGE_OPTIONS}
              paramKey={"date"}
              placeholder={"Recommended date"}
              allLabel={"Recommended date"}
              variant={"ghost"}
            />
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button
              size="sm"
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              <LucidePlus className="size-4" />
              New
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <RowSelectAll allIds={sorted.map((item) => item.bookingId)} />
              {tableHeader.map(({ key }) => (
                <TableHeaderItem
                  key={key}
                  prop={key}
                  currentSort={"name"}
                  sortDirection={"asc" as SortDirection}
                />
              ))}
              <th className="text-white font-normal px-4">Action</th>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sorted.map((item) => (
              <TableRow key={item.bookingId}>
                <RowSelect id={item.bookingId} />
                {tableHeader.map(({ key }) => {
                  let content: React.ReactNode = item[key] ?? "N/A";

                  if (key === "amount") {
                    content = (
                      <span className="font-currency">{`Ar ${item.amount.toLocaleString()}`}</span>
                    );
                  } else if (key === "star") {
                    content = (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <LucideStar
                            key={i}
                            className={`size-4 shrink-0 ${
                              i < item.star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    );
                  } else if (key === "status" || key === "paymentStatus") {
                    content = <StatusBadge status={item[key]} />;
                  }

                  return <TableBodyItem key={key}>{content}</TableBodyItem>;
                })}
                <td className="text-center">
                  <BookingDetailsModal
                    trigger={
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-gray-100"
                        aria-label={`View booking ${item.bookingId}`}
                      >
                        <LucideMoreVertical className="size-4 text-gray-500" />
                      </button>
                    }
                    data={{
                      bookingId: item.bookingId,
                      bookingDate: item.bookingDate,
                      paymentStatus: item.paymentStatus,
                      summary: {
                        id: `#${item.bookingId}`,
                        date: item.bookingDate,
                        status: item.paymentStatus,
                        amount: item.amount,
                      },
                      service: {
                        type: item.roomType,
                        location: item.location,
                        checkIn: "25 Aug 2025",
                        checkOut: "27 Aug 2025",
                        nights: 2,
                        guests: "2 Adults, 1 Child",
                      },
                      customer: {
                        name: item.customerName,
                        email: "rahimuddin@mail.com",
                        phone: "+8801xxxxxxx",
                        address: "Dhaka, Bangladesh",
                      },
                      payment: {
                        refundDate:
                          item.paymentStatus === "Refunded"
                            ? "31 Aug 2025"
                            : undefined,
                        method: "Mvola",
                        transactionId: "TXN123456789",
                        phone: "+8801xxxxxxx",
                        address: "Dhaka, Bangladesh",
                      },
                    }}
                  />
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination totalPages={totalPages} currentPage={1} pageSize={10} />
      </div>
    </TableProvider>
  );
}

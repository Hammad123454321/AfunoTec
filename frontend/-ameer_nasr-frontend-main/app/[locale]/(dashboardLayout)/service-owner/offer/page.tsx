import Actions from "@/features/table/components/Actions";
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
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
} from "@/features/table/utils/constant";
import {
  LucideEllipsis,
  LucideEllipsisVertical,
  LucideStar,
} from "lucide-react";
import {
  DateRangeFilter,
  TableFilter,
} from "@/features/table/components/Filter";
import { CreateOffer } from "@/features/promotions/components/Offer";

// -------------------- Types --------------------
type BookingRow = {
  bookingId: string;
  customerName: string;
  serviceOwner: string;
  roomType: string;
  bookingDate: string;
  amount: number;
  star: number;
  commission: string;
  location: string;
  paymentStatus: string;
  status: string;
};

type SearchParams = {
  page?: string;
  limit?: string;
  sort?: string;
  q?: string;
};

// -------------------- Table Header --------------------
const tableHeader: { key: keyof BookingRow; label: string }[] = [
  { key: "bookingId", label: "Booking ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "serviceOwner", label: "Service Owner" },
  { key: "roomType", label: "Room Type" },
  { key: "bookingDate", label: "Booking Date" },
  { key: "amount", label: "Amount" },
  { key: "star", label: "Star" },
  { key: "commission", label: "Commission %" },
  { key: "location", label: "Location" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "status", label: "Status" },
];

// -------------------- Dummy Data --------------------
const bookings: BookingRow[] = [
  {
    bookingId: "#B-00012",
    customerName: "Ayesha Rahman",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Singles",
    bookingDate: "28 Aug 2025",
    amount: 50000,
    star: 5,
    commission: "20%",
    location: "Madagascar",
    paymentStatus: "Paid",
    status: "Confirmed",
  },
  {
    bookingId: "#B-00013",
    customerName: "Ayesha Rahman",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Singles",
    bookingDate: "28 Aug 2025",
    amount: 50000,
    star: 5,
    commission: "20%",
    location: "Madagascar",
    paymentStatus: "Unpaid",
    status: "Pending",
  },
  {
    bookingId: "#B-00014",
    customerName: "Ayesha Rahman",
    serviceOwner: "Ocean Views Hotel",
    roomType: "Singles",
    bookingDate: "28 Aug 2025",
    amount: 50000,
    star: 4,
    commission: "20%",
    location: "Madagascar",
    paymentStatus: "Refunded",
    status: "Cancelled",
  },
];

// -------------------- Helper Functions --------------------
// function parseSearchParams(params: SearchParams): {
//   page: number;
//   limit: number;
//   sortField: string;
//   sortDirection: SortDirection;
//   q?: string;
//   filter?: string;
// } {
//   const page = Number(params.page) || DEFAULT_PAGE;
//   const limit = Number(params.limit) || DEFAULT_ITEMS_PER_PAGE;
//   const [sortField = "", sortDirection = ""] = (params.sort || "").split(":");

//   return {
//     page,
//     limit,
//     sortField,
//     sortDirection: sortDirection as SortDirection,
//     q: params.q,
//   };
// }

// -------------------- Component --------------------
export default async function OfferPage() {
  const totalPages: number = 1;

  // fake sorting placeholder
  const sorted = bookings;

  const DATE_RANGE_OPTIONS = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last year", value: "1y" },
  ];

  const CATEGORY_OPTIONS = [
    { label: "Technology", value: "tech" },
    { label: "Business", value: "business" },
    { label: "Health", value: "health" },
    { label: "Education", value: "education" },
  ];

  return (
    <TableProvider>
      <div className="space-y-6 overflow-x-hidden">
        <div className="flex items-center justify-between print:hidden">
          <SearchField placeholder="Search..." initialValue={""} />

          <div className="flex gap-4 items-center">
            <TableFilter
              options={DATE_RANGE_OPTIONS}
              paramKey={"date"}
              placeholder={"Select date"}
              allLabel={"All time"}
              variant={"ghost"}
            />
            <TableFilter
              options={CATEGORY_OPTIONS}
              paramKey={"cat"}
              placeholder={"Select Category"}
              allLabel={"All category"}
              variant={"button"}
            />
            <CreateOffer />
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
            {sorted.map((item, i) => (
              <TableRow key={i}>
                <RowSelect id={item.bookingId} />
                {tableHeader.map(({ key }) => {
                  let content: React.ReactNode = item[key] ?? "N/A";

                  // Special formatting
                  if (key === "amount") {
                    content = `$${item.amount.toLocaleString()}`;
                  }

                  if (key === "star") {
                    content = (
                      <div className="flex items-center gap-2">
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
                  }

                  return <TableBodyItem key={key}>{content}</TableBodyItem>;
                })}
                <td>
                  <Actions item={undefined} actions={[]} />
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

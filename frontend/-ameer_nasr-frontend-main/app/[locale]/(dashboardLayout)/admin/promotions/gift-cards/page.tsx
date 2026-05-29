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
import Image from "next/image";
import { CreateGiftCard } from "@/features/promotions/components/GiftCards";

// -------------------- Types --------------------
type BookingStatus =
  | "Active"
  | "In active"
  | "Pending"
  | "Disable"
  | "Inactive"
  | "Upcoming";

type BookingRow = {
  id: string;
  bookingId: string;
  serviceOwner: {
    name: string;
    avatar: string;
  };
  service: string;
  date: string;
  status: BookingStatus;
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
  { key: "serviceOwner", label: "Service Owners" },
  { key: "service", label: "Service" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

// -------------------- Scraped Data --------------------
const scrapedData: BookingRow[] = [
  {
    id: "1",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Active",
  },
  {
    id: "2",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "In active",
  },
  {
    id: "3",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Pending",
  },
  {
    id: "4",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Disable",
  },
  {
    id: "5",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "In active",
  },
  {
    id: "6",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Inactive",
  },
  {
    id: "7",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Active",
  },
  {
    id: "8",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Upcoming",
  },
  {
    id: "9",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Inactive",
  },
  {
    id: "10",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Active",
  },
  {
    id: "11",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Upcoming",
  },
  {
    id: "12",
    bookingId: "#123545",
    serviceOwner: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    service: "Hotel, Tours, Culture, Event & Tickets",
    date: "March 6, 2018",
    status: "Inactive",
  },
];

// -------------------- Helper Functions --------------------
const getStatusConfig = (
  status: BookingStatus
): { color: string; bg: string } => {
  const config: Record<BookingStatus, { color: string; bg: string }> = {
    Active: { color: "text-green-700", bg: "bg-green-50" },
    "In active": { color: "text-blue-600", bg: "bg-blue-50" },
    Pending: { color: "text-orange-600", bg: "bg-orange-50" },
    Disable: { color: "text-gray-700", bg: "bg-gray-100" },
    Inactive: { color: "text-orange-500", bg: "bg-orange-50" },
    Upcoming: { color: "text-blue-600", bg: "bg-blue-50" },
  };
  return config[status] || config.Active;
};

// -------------------- Component --------------------
export default async function BookingTable() {
  const totalPages = 1;
  const sorted = scrapedData;

  return (
    <TableProvider>
      <div className="space-y-2 overflow-x-hidden">
        <div className="flex items-center gap-4 justify-between print:hidden">
          <SearchField placeholder="Search coupons..." initialValue={""} />
          <CreateGiftCard />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <RowSelectAll allIds={sorted.map((item) => item.id)} />
              {tableHeader.map(({ key, label }) => (
                <TableHeaderItem
                  key={key}
                  prop={key}
                  currentSort={"name"}
                  sortDirection={"asc" as SortDirection}
                />
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sorted.map((item) => (
              <TableRow key={item.id}>
                <RowSelect id={item.id} />
                {tableHeader.map(({ key }) => {
                  let content: React.ReactNode = "N/A";

                  // Render booking ID
                  if (key === "bookingId") {
                    content = (
                      <span className="font-medium text-gray-700">
                        {item.bookingId}
                      </span>
                    );
                  }

                  // Render service owner with avatar
                  if (key === "serviceOwner") {
                    content = (
                      <div className="flex items-center gap-3">
                        <Image
                          width={32}
                          height={32}
                          src={item.serviceOwner.avatar}
                          alt={item.serviceOwner.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-700">
                          {item.serviceOwner.name}
                        </span>
                      </div>
                    );
                  }

                  // Render service
                  if (key === "service") {
                    content = (
                      <span className="text-gray-600 text-sm">
                        {item.service}
                      </span>
                    );
                  }

                  // Render date
                  if (key === "date") {
                    content = (
                      <span className="text-gray-700">{item.date}</span>
                    );
                  }

                  // Render status badge
                  if (key === "status") {
                    const statusConfig = getStatusConfig(item.status);
                    content = (
                      <span
                        className={`inline-flex px-3 py-1 rounded-md text-sm font-medium ${statusConfig.color} ${statusConfig.bg}`}
                      >
                        {item.status}
                      </span>
                    );
                  }

                  return <TableBodyItem key={key}>{content}</TableBodyItem>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TableProvider>
  );
}

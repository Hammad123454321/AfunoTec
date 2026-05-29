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
import Image from "next/image";

// -------------------- Types --------------------
type PromotionStatus = "Active" | "Upcoming" | "Expired";

type PromotionRow = {
  id: string;
  promoCode: string;
  title: string;
  discount: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  startDate: string;
  endDate: string;
  status: PromotionStatus;
};

// -------------------- Table Header --------------------
const tableHeader: { key: keyof PromotionRow; label: string }[] = [
  { key: "promoCode", label: "Promo Code" },
  { key: "title", label: "Title" },
  { key: "discount", label: "Discount" },
  { key: "createdBy", label: "Created By" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "status", label: "Status" },
];

// -------------------- Promotion Data --------------------
const promotions: PromotionRow[] = [
  {
    id: "1",
    promoCode: "EID2025",
    title: "Eid Festival — 50% Off Storewide",
    discount: "50%",
    createdBy: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    startDate: "Apr 20, 2025",
    endDate: "Apr 30, 2025",
    status: "Expired",
  },
  {
    id: "2",
    promoCode: "SUMMER60",
    title: "Summer Mega Sale — Up to 60% Off",
    discount: "60%",
    createdBy: {
      name: "Daniel Kim",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    startDate: "Jun 1, 2025",
    endDate: "Jun 15, 2025",
    status: "Upcoming",
  },
  {
    id: "3",
    promoCode: "FLASHBUY1",
    title: "Flash Deal — Buy 1 Get 1 Free",
    discount: "BOGO",
    createdBy: {
      name: "Sophia Ahmed",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    startDate: "May 10, 2025",
    endDate: "May 12, 2025",
    status: "Active",
  },
  {
    id: "4",
    promoCode: "WINTER70",
    title: "Winter Clearance — 70% Off Jackets",
    discount: "70%",
    createdBy: {
      name: "Rahim Uddin",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    startDate: "Dec 1, 2025",
    endDate: "Dec 31, 2025",
    status: "Upcoming",
  },
];

// -------------------- Helper Functions --------------------
const getStatusConfig = (
  status: PromotionStatus
): { color: string; bg: string } => {
  const config: Record<PromotionStatus, { color: string; bg: string }> = {
    Active: { color: "text-green-700", bg: "bg-green-50" },
    Upcoming: { color: "text-blue-600", bg: "bg-blue-50" },
    Expired: { color: "text-gray-600", bg: "bg-gray-100" },
  };
  return config[status];
};

// -------------------- Component --------------------
export default async function PromotionTable() {
  const sorted = promotions;

  return (
    <TableProvider>
      <div className="space-y-2 overflow-x-hidden">
        {/* Search */}
        <div className="flex items-center justify-end print:hidden">
          <SearchField placeholder="Search promotions..." initialValue={""} />
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <RowSelectAll allIds={sorted.map((item) => item.id)} />
              {tableHeader.map(({ key }) => (
                <TableHeaderItem
                  key={key}
                  prop={key}
                  currentSort={"promoCode"}
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

                  if (key === "promoCode") {
                    content = (
                      <span className="font-medium text-gray-700">
                        {item.promoCode}
                      </span>
                    );
                  }

                  if (key === "title") {
                    content = (
                      <span className="text-gray-700 text-sm">
                        {item.title}
                      </span>
                    );
                  }

                  if (key === "discount") {
                    content = (
                      <span className="text-green-700 font-semibold">
                        {item.discount}
                      </span>
                    );
                  }

                  if (key === "createdBy") {
                    content = (
                      <div className="flex items-center gap-2">
                        <Image
                          width={28}
                          height={28}
                          src={item.createdBy.avatar}
                          alt={item.createdBy.name}
                          className="rounded-full"
                        />
                        <span>{item.createdBy.name}</span>
                      </div>
                    );
                  }

                  if (key === "startDate") {
                    content = <span>{item.startDate}</span>;
                  }

                  if (key === "endDate") {
                    content = <span>{item.endDate}</span>;
                  }

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

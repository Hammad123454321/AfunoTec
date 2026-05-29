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
import { CreateCoupon } from "@/features/promotions/components/Coupons";

// -------------------- Types --------------------
type CouponStatus = "Active" | "Expired" | "Upcoming" | "Disabled";

type CouponRow = {
  id: string;
  code: string;
  title: string;
  discountType: string;
  value: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  validTill: string;
  status: CouponStatus;
};

// -------------------- Table Header --------------------
const tableHeader: { key: keyof CouponRow; label: string }[] = [
  { key: "code", label: "Coupon Code" },
  { key: "title", label: "Title" },
  { key: "discountType", label: "Type" },
  { key: "value", label: "Value" },
  { key: "createdBy", label: "Created By" },
  { key: "validTill", label: "Valid Till" },
  { key: "status", label: "Status" },
];

// -------------------- Coupon Data --------------------
const coupons: CouponRow[] = [
  {
    id: "1",
    code: "WELCOME10",
    title: "Welcome Offer for New Users",
    discountType: "Percentage",
    value: "10%",
    createdBy: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    validTill: "Dec 31, 2025",
    status: "Active",
  },
  {
    id: "2",
    code: "FIRST100",
    title: "Flat ৳100 Off on First Order",
    discountType: "Flat",
    value: "৳100",
    createdBy: {
      name: "Rahim Uddin",
      avatar: "https://i.pravatar.cc/150?img=16",
    },
    validTill: "Jan 10, 2025",
    status: "Expired",
  },
  {
    id: "3",
    code: "FREESHIP",
    title: "Free Shipping for Orders Above ৳2000",
    discountType: "Free Shipping",
    value: "৳0",
    createdBy: {
      name: "Sophia Ahmed",
      avatar: "https://i.pravatar.cc/150?img=17",
    },
    validTill: "Aug 1, 2025",
    status: "Upcoming",
  },
  {
    id: "4",
    code: "BLACKFRIDAY50",
    title: "Black Friday Mega Deal — 50% Off",
    discountType: "Percentage",
    value: "50%",
    createdBy: {
      name: "Daniel Kim",
      avatar: "https://i.pravatar.cc/150?img=18",
    },
    validTill: "Nov 28, 2025",
    status: "Upcoming",
  },
  {
    id: "5",
    code: "STUDENT20",
    title: "Student Discount — 20% Off",
    discountType: "Percentage",
    value: "20%",
    createdBy: {
      name: "Jenny Wilson",
      avatar: "https://i.pravatar.cc/150?img=19",
    },
    validTill: "Mar 15, 2026",
    status: "Active",
  },
];

// -------------------- Helper Functions --------------------
const getStatusConfig = (
  status: CouponStatus
): { color: string; bg: string } => {
  const config: Record<CouponStatus, { color: string; bg: string }> = {
    Active: { color: "text-green-700", bg: "bg-green-50" },
    Expired: { color: "text-gray-600", bg: "bg-gray-100" },
    Upcoming: { color: "text-blue-700", bg: "bg-blue-50" },
    Disabled: { color: "text-red-600", bg: "bg-red-50" },
  };
  return config[status];
};

// -------------------- Component --------------------
export default async function CouponTable() {
  const sorted = coupons;

  return (
    <TableProvider>
      <div className="space-y-2 overflow-x-hidden">
        {/* Search */}
        <div className="flex items-center gap-4 justify-between print:hidden">
          <SearchField placeholder="Search coupons..." initialValue={""} />
          <CreateCoupon />
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
                  currentSort={"code"}
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

                  if (key === "code") {
                    content = (
                      <span className="font-semibold text-gray-800">
                        {item.code}
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

                  if (key === "discountType") {
                    content = (
                      <span className="text-gray-600 text-sm">
                        {item.discountType}
                      </span>
                    );
                  }

                  if (key === "value") {
                    content = (
                      <span className="text-green-700 font-semibold">
                        {item.value}
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

                  if (key === "validTill") {
                    content = (
                      <span className="text-gray-600">{item.validTill}</span>
                    );
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

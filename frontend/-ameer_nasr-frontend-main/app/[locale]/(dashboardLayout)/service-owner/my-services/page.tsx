"use client";

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
import { LucidePlus, LucideStar } from "lucide-react";
import { TableFilter } from "@/features/table/components/Filter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatusBadge } from "@/features/dashboard/components";

// -------------------- Types --------------------
type ServiceRow = {
  dealId: string;
  serviceName: string;
  category: string;
  location: string;
  price: number;
  star: number;
  status: string;
  createdAt: string;
};

// -------------------- Table Header (matches Figma Service List) --------------------
const tableHeader: { key: keyof ServiceRow; label: string }[] = [
  { key: "dealId", label: "Deal Id" },
  { key: "serviceName", label: "Service Name" },
  { key: "category", label: "Category" },
  { key: "location", label: "Location" },
  { key: "price", label: "Price" },
  { key: "star", label: "Star" },
  { key: "createdAt", label: "Created" },
  { key: "status", label: "Status" },
];

// -------------------- Dummy Data (replaced by /services API in M2) --------------------
const services: ServiceRow[] = [
  {
    dealId: "1001",
    serviceName: "Preskil Island Resort Mauritius",
    category: "Hotels",
    location: "Nosy Be",
    price: 200000,
    star: 5,
    status: "Active",
    createdAt: "20 Aug 2025",
  },
  {
    dealId: "1002",
    serviceName: "Luxury Stay at Nosy Be",
    category: "Hotels",
    location: "Nosy Be",
    price: 250000,
    star: 4,
    status: "Active",
    createdAt: "22 Aug 2025",
  },
  {
    dealId: "1003",
    serviceName: "Whale Watching — Full Day",
    category: "Tours",
    location: "Diego",
    price: 180000,
    star: 5,
    status: "Scheduled",
    createdAt: "24 Aug 2025",
  },
  {
    dealId: "1004",
    serviceName: "Airport Transfer (Ivato → City)",
    category: "Transportation",
    location: "Antananarivo",
    price: 80000,
    star: 4,
    status: "Draft",
    createdAt: "26 Aug 2025",
  },
  {
    dealId: "1005",
    serviceName: "Tana → Nosy Be Package",
    category: "Travels",
    location: "Centre",
    price: 950000,
    star: 5,
    status: "Inactive",
    createdAt: "28 Aug 2025",
  },
  {
    dealId: "1006",
    serviceName: "Spinner Dolphin Catamaran Cruise",
    category: "Tours",
    location: "West",
    price: 175000,
    star: 4,
    status: "Expired",
    createdAt: "30 Aug 2025",
  },
];

// -------------------- Component --------------------
export default function ServiceListPage() {
  const totalPages = 1;
  const sorted = services;

  // Combined sort + recency dropdown that matches the Figma p030 control:
  // "Recommended / Last 7 days / Last month / Descending / Ascending".
  const SORT_OPTIONS = [
    { label: "Recommended", value: "recommended" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last month", value: "30d" },
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  const CATEGORY_OPTIONS = [
    { label: "All", value: "all" },
    { label: "Hotels", value: "hotels" },
    { label: "Tours", value: "tours" },
    { label: "Travels", value: "travels" },
    { label: "Transportation", value: "transport" },
    { label: "Things to do", value: "things" },
    { label: "Events", value: "events" },
  ];

  return (
    <TableProvider>
      <div className="space-y-6 overflow-x-hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between print:hidden">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <SearchField
              placeholder="Search services…"
              initialValue={""}
            />
            <TableFilter
              options={CATEGORY_OPTIONS}
              paramKey={"cat"}
              placeholder={"All categories"}
              allLabel={"All categories"}
              variant={"button"}
            />
          </div>
          <div className="flex gap-3 items-center">
            <TableFilter
              options={SORT_OPTIONS}
              paramKey={"sort"}
              placeholder={"Recommended"}
              allLabel={"Recommended"}
              variant={"ghost"}
            />
            <Button
              asChild
              size="sm"
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Link href="/service-owner/my-services/create">
                <LucidePlus className="size-4" />
                New Service
              </Link>
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <RowSelectAll allIds={sorted.map((s) => s.dealId)} />
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
              <TableRow key={item.dealId}>
                <RowSelect id={item.dealId} />
                {tableHeader.map(({ key }) => {
                  let content: React.ReactNode = item[key] ?? "N/A";
                  if (key === "price") {
                    content = `Ar ${item.price.toLocaleString()}`;
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
                  } else if (key === "status") {
                    content = <StatusBadge status={item.status} />;
                  } else if (key === "dealId") {
                    content = `#${item.dealId}`;
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

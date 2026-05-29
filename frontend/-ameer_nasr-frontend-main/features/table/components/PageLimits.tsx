import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_ITEMS_PER_PAGE } from "../utils/constant";

const pageLimits = ["5", "10", "15", "20", "50"];

export default function PageLimits() {
  const searchParams = new URLSearchParams(useSearchParams());
  const router = useRouter();

  const handlePageLimitChange = (limit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit);
    params.delete("page");
    const url = `?${params.toString()}`;
    router.push(url, { scroll: false });
  };

  return (
    <Select
      defaultValue={
        searchParams.get("limit") || DEFAULT_ITEMS_PER_PAGE.toString()
      }
      onValueChange={handlePageLimitChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Page Limit" />
      </SelectTrigger>
      <SelectContent>
        {pageLimits.map((limit) => (
          <SelectItem key={limit} value={limit}>
            {limit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

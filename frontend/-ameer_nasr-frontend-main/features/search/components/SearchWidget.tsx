import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

export default function SearchWidget() {
  return (
    <div className="relative w-full rounded overflow-hidden">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Search"
      />
      <Button
        className="absolute right-0 top-1/2 -translate-y-1/2"
        aria-label="Search button"
        variant="ghost"
      >
        <FaSearch className="text-gray-600" />
      </Button>
    </div>
  );
}

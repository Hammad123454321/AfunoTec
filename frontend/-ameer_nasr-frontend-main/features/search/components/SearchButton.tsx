import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

export default function SearchButton({ ...props }) {
  return (
    <Button
      className="bg-blue-300 w-full text-white hover:bg-primary-500 rounded-none p-4!  lg:p-6!"
      size="lg"
      {...props}
    >
      <FaSearch />
      SEARCH
    </Button>
  );
}

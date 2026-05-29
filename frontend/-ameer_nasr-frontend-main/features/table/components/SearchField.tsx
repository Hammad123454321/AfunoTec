"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LucideLoader, LucideSearch } from "lucide-react";

interface SearchFieldProps {
  placeholder?: string;
  initialValue?: string;
  debounceTime?: number;
}

export default function SearchField({
  initialValue,
  debounceTime = 500,
  placeholder,
}: SearchFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue || "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, debounceTime, router]);

  return (
    <div className="inline-flex items-center border border-primary-500 gap-1 rounded overflow-hidden focus-within:border-primary">
      <input
        type="text"
        placeholder={placeholder ? placeholder : "Search..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-none px-2 bg-transparent outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 w-52 text-gray-950"
      />
      <div className="size-7 inline-flex items-center justify-center">
        {isPending ? (
          <LucideLoader size={14} className="animate-spin" />
        ) : (
          <LucideSearch size={14} />
        )}
      </div>
    </div>
  );
}

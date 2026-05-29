"use client";

import { Button } from "@/components/ui/button";
import { useTable } from "@/features/table/components/TableProvider";
import { LucideSquare, LucideSquareCheck } from "lucide-react";
import { useEffect, useMemo } from "react";

type RowSelectAllProps = {
  /** all available row IDs on the current page */
  allIds: string[];
};

export function RowSelectAll({ allIds }: RowSelectAllProps) {
  const { selectedIds, dispatch } = useTable();

  // Determine if all rows are already selected
  const allSelected = useMemo(() => {
    return allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  }, [allIds, selectedIds]);

  const handleToggleAll = () => {
    if (allSelected) {
      dispatch({ type: "CLEAR_ALL" });
    } else {
      dispatch({ type: "ADD_ALL", payload: allIds });
    }
  };

  return (
    <th>
      <Button
        variant="ghost"
        onClick={handleToggleAll}
        className="text-white hover:bg-transparent hover:text-white"
      >
        {allSelected ? <LucideSquareCheck /> : <LucideSquare />}
      </Button>
    </th>
  );
}

export function RowSelect({ id }: { id: string }) {
  const { isSelected, dispatch, state } = useTable();

  const toggleSelect = () => {
    if (isSelected(id)) {
      dispatch({ type: "REMOVE_DATA", payload: id });
    } else {
      dispatch({ type: "ADD_DATA", payload: id });
    }
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <td>
      <Button variant="ghost" onClick={toggleSelect}>
        {isSelected(id) ? <LucideSquareCheck /> : <LucideSquare />}
      </Button>
    </td>
  );
}

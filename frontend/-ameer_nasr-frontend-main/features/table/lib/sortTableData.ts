import { SortDirection } from "../types/table.type";

export default function sortTableData<T>(
  items: T[],
  sortBy: keyof T,
  order: SortDirection = "asc"
): T[] {
  if (!items || items.length === 0) return [];

  const sortedItems = [...items];

  sortedItems.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    // Null / undefined handling
    if (valA == null && valB != null) return order === "asc" ? -1 : 1;
    if (valB == null && valA != null) return order === "asc" ? 1 : -1;
    if (valA == null && valB == null) return 0;

    // Number comparison
    if (typeof valA === "number" && typeof valB === "number") {
      return order === "asc" ? valA - valB : valB - valA;
    }

    // Date comparison
    if (valA instanceof Date && valB instanceof Date) {
      return order === "asc"
        ? valA.getTime() - valB.getTime()
        : valB.getTime() - valA.getTime();
    }

    // String comparison using localeCompare
    const strA = String(valA);
    const strB = String(valB);
    return order === "asc"
      ? strA.localeCompare(strB, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      : strB.localeCompare(strA, undefined, {
          numeric: true,
          sensitivity: "base",
        });
  });

  return sortedItems;
}

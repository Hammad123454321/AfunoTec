"use client";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <table className="table-auto border-collapse border border-gray-500 w-full rounded">
      {showHeader && (
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-3 bg-gray-700 animate-pulse">
                <div className="h-4 bg-gray-500 rounded w-3/4 mx-auto" />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  );
}

interface TableRowSkeletonProps {
  columns?: number;
}

export function TableRowSkeleton({ columns = 5 }: TableRowSkeletonProps) {
  return (
    <tr className="border-b border-gray-500 hover:bg-gray-800">
      {Array.from({ length: columns }).map((_, i) => (
        <TableCellSkeleton key={i} />
      ))}
    </tr>
  );
}

export function TableCellSkeleton() {
  return (
    <td className="px-4 py-4">
      <div className="h-4 bg-gray-500 rounded animate-pulse w-full" />
    </td>
  );
}

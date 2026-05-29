"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Heading from "@/components/Heading";

// ✅ Data type
export interface ChartItem {
  name: string;
  value: number;
  color: string;
}

interface DonutBreakdownChartProps {
  title?: string;
  data: ChartItem[];
  year?: number;
  isLoading?: boolean;
  className?: string;
}

// ✅ Utility to format numbers like 1K, 1.2M
const formatValue = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
};

// ✅ Tooltip formatter
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white shadow-lg border rounded-md px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium text-gray-700">{item.name}</span>
        </div>
        <div className="text-gray-500 font-semibold mt-1">
          {formatValue(item.value)}
        </div>
      </div>
    );
  }
  return null;
};

export function DonutBreakdownChart({
  title = "TOTAL DATA BREAKDOWN",
  data = [],
  year = new Date().getFullYear(),
  isLoading = false,
  className = "",
}: DonutBreakdownChartProps) {
  // ✅ Compute total
  const total = React.useMemo(
    () => data.reduce((sum, item) => sum + (item.value || 0), 0),
    [data]
  );

  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white rounded shadow-sm border border-gray-100",
          className
        )}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded shadow-sm border border-gray-100 p-2",
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Heading as="h3" size="sm">
          {title}
        </Heading>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded text-gray-600">
          <Calendar size={14} />
          <span className="text-sm font-medium">{year}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-center mb-6" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                {item.name}
              </span>
            </div>
            <span className="text-sm text-gray-500 font-semibold">
              ({formatValue(item.value)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

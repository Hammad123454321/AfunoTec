import {
  ChartItem,
  DonutBreakdownChart,
} from "@/features/dashboard/components/DonutBreakdownChart";

export default function CategoryActivity() {
  const sampleData: ChartItem[] = [
    { name: "HOTELS", value: 245, color: "#047857" },
    { name: "ACTIVITIES", value: 32, color: "#10b981" },
    { name: "TOURS", value: 12000, color: "#34d399" },
    { name: "TRANSPORTATION", value: 56, color: "#fbbf24" },
    { name: "MEETINGS", value: 62, color: "#a3e635" },
    { name: "TRAVEL", value: 541, color: "#fde047" },
    { name: "COUNTRY", value: 644, color: "#fef3c7" },
    { name: "CORPORATE DEAL", value: 458, color: "#fb923c" },
    { name: "EVENTS AND TICKETS", value: 55000, color: "#f97316" },
    { name: "CULTURE", value: 15000, color: "#dc2626" },
  ];

  return (
    <DonutBreakdownChart
      title="TOTAL CATEGORY'S"
      data={sampleData}
      year={2025}
      isLoading={false}
    />
  );
}

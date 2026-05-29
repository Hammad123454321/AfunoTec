import {
  ChartItem,
  DonutBreakdownChart,
} from "@/features/dashboard/components/DonutBreakdownChart";

const languageData: ChartItem[] = [
  { name: "en", value: 245, color: "#047857" },
  { name: "mg", value: 32, color: "#10b981" },
  { name: "fr", value: 12000, color: "#34d399" },
];

const currencyData: ChartItem[] = [
  { name: "en", value: 245, color: "#047857" },
  { name: "mg", value: 32, color: "#10b981" },
  { name: "fr", value: 12000, color: "#34d399" },
];

export default function AdditionalInformation() {
  return (
    <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-4">
      <div className="md:col-span-3 lg:col-span-4">
        <DonutBreakdownChart
          title="TOTAL CATEGORY'S"
          data={languageData}
          year={2025}
          isLoading={false}
        />
      </div>
      <div className="md:col-span-3 lg:col-span-4">
        <DonutBreakdownChart
          title="TOTAL CATEGORY'S"
          data={currencyData}
          year={2025}
          isLoading={false}
        />
      </div>
    </div>
  );
}

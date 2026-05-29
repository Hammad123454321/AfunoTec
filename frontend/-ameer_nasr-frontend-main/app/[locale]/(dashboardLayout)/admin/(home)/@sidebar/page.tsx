import CategoryActivity from "./_components/CategoryActivity";
import RecentActivity from "./_components/RecentActivity";
import RecentlyAdded from "./_components/RecentAdd";

export default function page() {
  return (
    <div className="space-y-4">
      <CategoryActivity />
      <RecentActivity />
      <RecentlyAdded />
    </div>
  );
}

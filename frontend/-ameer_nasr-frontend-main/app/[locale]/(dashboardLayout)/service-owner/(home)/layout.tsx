type Props = {
  metrics: React.ReactNode;
  sidebar: React.ReactNode;
  otherActivity: React.ReactNode;
  table: React.ReactNode;
};

export default function ServiceOwnerDashboardLayout({
  metrics,
  sidebar,
  otherActivity,
  table,
}: Props) {
  return (
    <>
      {metrics}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="md:col-span-9 space-y-4">
          {table}
          {otherActivity}
        </div>
        <div className="md:col-span-3">{sidebar}</div>
      </div>
    </>
  );
}

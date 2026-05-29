export default function StepSidebar({ step }: { step: number }) {
  return (
    <div className="w-64 hidden lg:block bg-[#F5F7FA] border-r p-6">
      <h2 className="font-semibold mb-6">BOOKING DETAILS</h2>

      <div className="space-y-4">
        <div
          className={
            step === 1
              ? "text-green-600 font-semibold bg-[#EBF0F5]"
              : "text-gray-400 bg-[#EBF0F5]"
          }
        >
          1. Guest Information
        </div>

        <div
          className={
            step === 2 ? "text-green-600 font-semibold" : "text-gray-400"
          }
        >
          2. Make Payment
        </div>
      </div>
    </div>
  );
}

export function DiscountBadge({ children }: React.PropsWithChildren) {
  return (
    <span className="absolute z-10 top-0 right-0 size-[72px] bg-danger-600 discount-clip text-right p-1 text-white text-md">
      <span className="font-semibold">{children}%</span>
      <span
        className="block -translate-y-1 font-semibold text-xs"
        translate="no"
      >
        Off
      </span>
    </span>
  );
}

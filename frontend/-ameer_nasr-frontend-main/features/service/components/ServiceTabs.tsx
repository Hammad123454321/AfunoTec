import { cn } from "@/lib/utils";
import { LucideCheck } from "lucide-react";

export default function ServiceTabs({ children }: React.PropsWithChildren) {
  return <div className="flex flex-wrap gap-4">{children}</div>;
}

type ServiceTabProps = {
  active: boolean;
  completed: boolean;
  index: number;
} & React.PropsWithChildren;

export function ServiceTab({
  active = true,
  index = 1,
  children,
  completed,
}: ServiceTabProps) {
  return (
    <div
      className={cn(
        "flex-1 max-w-max px-6 py-2 bg-rose-000 [clip-path:polygon(0_0,93%_0%,100%_50%,93%_100%,0_100%,5%_50%)] relative gap-2 flex items-center",

        !active && "text-white bg-[#495AFF]/30 pointer-events-none",
        completed && "bg-[#495AFF] text-white",
        active && "bg-[#495AFF] hover:bg-[#495AFF]/90 text-white cursor-pointer"
      )}
    >
      {/* Always render Check but conditionally show it */}
      <div className={cn("absolute", !active && "hidden")}>
        <Check />
      </div>
      <span
        className={cn(
          "rounded-full border text-xs inline-flex items-center justify-center size-5 shrink-0",
          active && "border border-gray-100"
        )}
      >
        {completed ? (
          <LucideCheck size="12" />
        ) : (
          index.toString().padStart(2, "0")
        )}
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
}

function Check() {
  return (
    <div className="h-full w-4 overflow-hidden block right-2 before:absolute after:absolute before:h-[calc(50%+7px)] after:h-[calc(50%+7px)] before:w-px after:w-px before:bg-gray-300 after:bg-gray-300 before:right-1 after:right-1 before:top-0 after:bottom-0 before:-rotate-[35deg] after:rotate-[35deg]"></div>
  );
}

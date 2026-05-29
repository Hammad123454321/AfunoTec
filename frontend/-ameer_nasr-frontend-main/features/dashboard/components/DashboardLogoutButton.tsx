import { LucideLogOut } from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { Button } from "@/components/ui/button";

export default function DashboardLogoutButton() {
  const { isCollapsedSidebar } = useSidebar();
  return (
    <div className="py-8">
      {isCollapsedSidebar ? (
        <Button variant="secondary" size="icon">
          <LucideLogOut />
        </Button>
      ) : (
        <Button className="w-full" variant="secondary">
          <LucideLogOut /> Logout
        </Button>
      )}
    </div>
  );
}

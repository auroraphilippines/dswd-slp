import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Programs - DSWD SLP Inventory System",
};

export default function ProgramsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Programs"
        text="Manage livelihood programs and initiatives"
      >
        <Button asChild>
          <Link href="/programs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Program
          </Link>
        </Button>
      </DashboardHeader>
      <div className="rounded-md border p-8 text-center">
        <h3 className="text-lg font-medium">Programs management coming soon</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This section is under development. Check back soon for updates.
        </p>
      </div>
    </DashboardShell>
  );
}

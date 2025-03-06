import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Beneficiaries - DSWD SLP Inventory System",
};

export default function BeneficiariesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Beneficiaries"
        text="Manage program beneficiaries and their details"
      >
        <Button asChild>
          <Link href="/beneficiaries/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Beneficiary
          </Link>
        </Button>
      </DashboardHeader>
      <div className="rounded-md border p-8 text-center">
        <h3 className="text-lg font-medium">
          Beneficiaries management coming soon
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          This section is under development. Check back soon for updates.
        </p>
      </div>
    </DashboardShell>
  );
}

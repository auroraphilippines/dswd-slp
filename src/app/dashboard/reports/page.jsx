import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ReportsList } from "@/components/reports/reports-list";
import { ReportFilters } from "@/components/reports/report-filters";

export const metadata = {
  title: "Reports - DSWD SLP Inventory System",
};

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Reports"
        text="Generate and view inventory reports"
      >
        <ReportFilters />
      </DashboardHeader>
      <ReportsList />
    </DashboardShell>
  );
}

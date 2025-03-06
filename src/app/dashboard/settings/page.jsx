import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsTabs } from "./settings-tab";

export const metadata = {
  title: "Settings - DSWD SLP Inventory System",
};

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your system preferences and configurations"
      />
      <SettingsTabs />
    </DashboardShell>
  );
}

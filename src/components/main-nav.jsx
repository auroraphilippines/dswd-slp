"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  FileText,
  CreditCard,
  BarChart,
  Settings,
} from "lucide-react";

export function MainNav({ className, ...props }) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/inventory",
      label: "Inventory",
      icon: Package,
      active: pathname === "/inventory" || pathname.startsWith("/inventory/"),
    },
    {
      href: "/vendors",
      label: "Vendors",
      icon: Users,
      active: pathname === "/vendors" || pathname.startsWith("/vendors/"),
    },
    {
      href: "/beneficiaries",
      label: "Beneficiaries",
      icon: UserCheck,
      active: pathname === "/beneficiaries",
    },
    {
      href: "/programs",
      label: "Programs",
      icon: FileText,
      active: pathname === "/programs",
    },
    {
      href: "/disbursements",
      label: "Disbursements",
      icon: CreditCard,
      active: pathname === "/disbursements",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: BarChart,
      active: pathname === "/reports",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Link href="/" className="flex items-center gap-2 px-4 py-3">
        <Logo className="h-8 w-8" />
        <span className="font-bold text-lg">DSWD SWCF</span>
      </Link>
      <nav className="flex flex-col gap-1 px-2 py-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              route.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

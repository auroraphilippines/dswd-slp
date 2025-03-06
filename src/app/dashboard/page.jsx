import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, Users } from "lucide-react";

export const metadata = {
  title: "Dashboard - DSWD SLP Inventory System",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your inventory system"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">412</div>
            <p className="text-xs text-muted-foreground">Across 5 categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              Below minimum threshold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <span className="text-muted-foreground">₱</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱15.2M</div>
            <p className="text-xs text-muted-foreground">
              +8.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vendors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Supplying inventory items
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-500">
                    Food Items
                  </Badge>
                  <span className="text-sm">Rice (5kg bag)</span>
                </div>
                <div className="text-sm">245 in stock</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500/20 text-orange-500">
                    Food Items
                  </Badge>
                  <span className="text-sm">Canned Goods (Assorted)</span>
                </div>
                <div className="text-sm">32 in stock</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-500">
                    Medical Supplies
                  </Badge>
                  <span className="text-sm">First Aid Kit (Standard)</span>
                </div>
                <div className="text-sm">120 in stock</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500/20 text-red-500">
                    Educational Materials
                  </Badge>
                  <span className="text-sm">
                    School Supplies Kit (Elementary)
                  </span>
                </div>
                <div className="text-sm">0 in stock</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500/20 text-orange-500">
                    Hygiene Supplies
                  </Badge>
                  <span className="text-sm">Hygiene Kit (Family Size)</span>
                </div>
                <div className="text-sm">15 in stock</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <div className="text-sm font-medium">
                  Added 200 units of Rice (5kg bags)
                </div>
                <div className="text-xs text-muted-foreground">
                  10 minutes ago
                </div>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="text-sm font-medium">
                  New disbursement #D-2023-124 for Barangay Matatag
                </div>
                <div className="text-xs text-muted-foreground">
                  25 minutes ago
                </div>
              </div>
              <div className="border-l-2 border-orange-500 pl-4">
                <div className="text-sm font-medium">
                  Low stock alert for Hygiene Kits (15 remaining)
                </div>
                <div className="text-xs text-muted-foreground">1 hour ago</div>
              </div>
              <div className="border-l-2 border-green-500 pl-4">
                <div className="text-sm font-medium">
                  Disbursement #D-2023-118 has been delivered to beneficiaries
                </div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="text-sm font-medium">
                  50 new beneficiaries added to Disaster Relief Program
                </div>
                <div className="text-xs text-muted-foreground">3 hours ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

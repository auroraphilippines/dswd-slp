import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RecentActivities } from "./recent-activities";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            DSWD Social Welfare Capital Fund
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Manage Inventory
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inventory
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">412</div>
              <p className="text-xs text-muted-foreground">
                +3.2% from last month
              </p>
              <Progress value={65} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Disbursements
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <div className="flex items-center pt-1 text-xs text-green-500">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+8% from last week</span>
              </div>
              <Progress value={45} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fund Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱15,231,890</div>
              <div className="flex items-center pt-1 text-xs text-green-500">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+5.2% from last month</span>
              </div>
              <Progress value={75} className="mt-2 h-1" />
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
              <div className="flex items-center pt-1 text-xs text-red-500">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                <span>+6 since yesterday</span>
              </div>
              <Progress value={15} className="mt-2 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Inventory Value by Category</CardTitle>
              <CardDescription>
                Distribution of inventory value across categories
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <CategoryDistribution />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest inventory and disbursement activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivities />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                47 items are running low on stock and need replenishment.
              </p>
              <Link href="/dashboard/inventory?filter=low-stock">
                <Button variant="secondary" className="w-full">
                  View Low Stock Items
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Disbursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                124 disbursements are waiting to be processed and delivered.
              </p>
              <Link href="/dashboard/disbursements?status=pending">
                <Button variant="secondary" className="w-full">
                  Process Disbursements
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Generate and download the monthly inventory and fund report.
              </p>
              <Link href="/dashboard/reports/generate">
                <Button variant="secondary" className="w-full">
                  Generate Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

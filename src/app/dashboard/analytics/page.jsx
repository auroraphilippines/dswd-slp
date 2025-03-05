import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryTrendsChart } from "@/components/inventory-trends-chart";
import { CategoryDistributionChart } from "@/components/category-distribution-chart";
import { StockLevelMetrics } from "@/components/stock-level-metrics";
import { TopProductsTable } from "@/components/top-products-table";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
            <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Inventory Trends</CardTitle>
                  <CardDescription>
                    Stock levels and inventory value over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryTrendsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of inventory by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryDistributionChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Level Metrics</CardTitle>
                  <CardDescription>
                    Current inventory status and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StockLevelMetrics />
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Best and worst performing products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopProductsTable />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Inventory Analysis</CardTitle>
                <CardDescription>
                  In-depth analysis of your inventory data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section provides detailed analytics about your inventory
                  performance, turnover rates, and optimization opportunities.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance Analytics</CardTitle>
                <CardDescription>
                  Comprehensive analysis of sales data and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View detailed sales analytics including revenue trends,
                  top-selling products, and sales by channel.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

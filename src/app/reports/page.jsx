import {
  FileBarChart,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  TableIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportGenerator } from "./report-generator";

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Report Generator</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-4 mt-4">
            <ReportGenerator />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ReportCard
                title="Inventory Valuation"
                description="Total value of inventory by category and location"
                icon={BarChart3}
                lastGenerated="2 days ago"
              />
              <ReportCard
                title="Stock Levels"
                description="Current stock levels across all products"
                icon={LineChart}
                lastGenerated="Yesterday"
              />
              <ReportCard
                title="Inventory Turnover"
                description="Rate at which inventory is sold and replaced"
                icon={PieChart}
                lastGenerated="1 week ago"
              />
              <ReportCard
                title="Low Stock Items"
                description="Products below minimum stock threshold"
                icon={TableIcon}
                lastGenerated="Today"
              />
              <ReportCard
                title="Inventory Aging"
                description="Age of inventory items in stock"
                icon={Calendar}
                lastGenerated="3 days ago"
              />
              <ReportCard
                title="Stock Movement"
                description="Inbound and outbound inventory movement"
                icon={LineChart}
                lastGenerated="5 days ago"
              />
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ReportCard
                title="Sales by Product"
                description="Revenue breakdown by product and category"
                icon={BarChart3}
                lastGenerated="Yesterday"
              />
              <ReportCard
                title="Sales Trends"
                description="Sales performance over time with trends"
                icon={LineChart}
                lastGenerated="Today"
              />
              <ReportCard
                title="Top Selling Items"
                description="Best performing products by volume and revenue"
                icon={PieChart}
                lastGenerated="2 days ago"
              />
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>
                  Configure reports to be automatically generated and sent on a
                  schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You have 3 scheduled reports configured. The next report will
                  be generated tomorrow at 8:00 AM.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ReportCard({ title, description, icon: Icon, lastGenerated }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-md font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs text-muted-foreground">
          Last generated: {lastGenerated}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <FileBarChart className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
}

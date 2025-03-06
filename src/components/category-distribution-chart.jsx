"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "./ui/chart";

const data = [
  { name: "Electronics", value: 40 },
  { name: "Furniture", value: 30 },
  { name: "Office Supplies", value: 20 },
  { name: "Raw Materials", value: 10 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function CategoryDistributionChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Inventory distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart className="h-[300px]">
          <ChartLegend className="justify-center">
            {data.map((entry, index) => (
              <ChartLegendItem
                key={`item-${index}`}
                name={entry.name}
                color={COLORS[index % COLORS.length]}
              />
            ))}
          </ChartLegend>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent formatter={(value) => `${value}%`} />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Chart>
      </CardContent>
    </Card>
  );
}

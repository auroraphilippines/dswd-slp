"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", stockCount: 12500, inventoryValue: 1250000 },
  { month: "Feb", stockCount: 13200, inventoryValue: 1320000 },
  { month: "Mar", stockCount: 14100, inventoryValue: 1410000 },
  { month: "Apr", stockCount: 13800, inventoryValue: 1380000 },
  { month: "May", stockCount: 15200, inventoryValue: 1520000 },
  { month: "Jun", stockCount: 16500, inventoryValue: 1650000 },
  { month: "Jul", stockCount: 18000, inventoryValue: 1800000 },
  { month: "Aug", stockCount: 17500, inventoryValue: 1750000 },
  { month: "Sep", stockCount: 19200, inventoryValue: 1920000 },
  { month: "Oct", stockCount: 20500, inventoryValue: 2050000 },
  { month: "Nov", stockCount: 22000, inventoryValue: 2200000 },
  { month: "Dec", stockCount: 24000, inventoryValue: 2400000 },
];

export function InventoryTrendsChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="stockCount"
          name="Stock Count"
          stroke="#3b82f6"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="inventoryValue"
          name="Inventory Value ($)"
          stroke="#10b981"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

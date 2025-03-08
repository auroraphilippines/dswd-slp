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
  {
    date: "Jun 01",
    foodItems: 4250000,
    medicalSupplies: 2400000,
    educationalMaterials: 1800000,
    hygieneSupplies: 1200000,
    shelterMaterials: 800000,
  },
  {
    date: "Jun 05",
    foodItems: 4300000,
    medicalSupplies: 2450000,
    educationalMaterials: 1750000,
    hygieneSupplies: 1250000,
    shelterMaterials: 820000,
  },
  {
    date: "Jun 10",
    foodItems: 4400000,
    medicalSupplies: 2500000,
    educationalMaterials: 1800000,
    hygieneSupplies: 1300000,
    shelterMaterials: 850000,
  },
  {
    date: "Jun 15",
    foodItems: 4450000,
    medicalSupplies: 2550000,
    educationalMaterials: 1850000,
    hygieneSupplies: 1350000,
    shelterMaterials: 870000,
  },
  {
    date: "Jun 20",
    foodItems: 4500000,
    medicalSupplies: 2600000,
    educationalMaterials: 1900000,
    hygieneSupplies: 1400000,
    shelterMaterials: 900000,
  },
  {
    date: "Jun 25",
    foodItems: 4550000,
    medicalSupplies: 2650000,
    educationalMaterials: 1950000,
    hygieneSupplies: 1450000,
    shelterMaterials: 920000,
  },
  {
    date: "Jun 30",
    foodItems: 4600000,
    medicalSupplies: 2700000,
    educationalMaterials: 2000000,
    hygieneSupplies: 1500000,
    shelterMaterials: 950000,
  },
];

export function InventoryChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `₱${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `₱${(value / 1000).toFixed(0)}K`;
    }
    return `₱${value}`;
  };

  const formatTooltipValue = (value) => {
    return `₱${value.toLocaleString()}`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
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
        <XAxis dataKey="date" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={formatTooltipValue} />
        <Legend />
        <Line
          type="monotone"
          dataKey="foodItems"
          name="Food Items"
          stroke="#3b82f6"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="medicalSupplies"
          name="Medical Supplies"
          stroke="#10b981"
        />
        <Line
          type="monotone"
          dataKey="educationalMaterials"
          name="Educational Materials"
          stroke="#f59e0b"
        />
        <Line
          type="monotone"
          dataKey="hygieneSupplies"
          name="Hygiene Supplies"
          stroke="#8b5cf6"
        />
        <Line
          type="monotone"
          dataKey="shelterMaterials"
          name="Shelter Materials"
          stroke="#ef4444"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

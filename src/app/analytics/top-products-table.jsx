import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export function TopProductsTable() {
  const topProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      stock: 145,
      turnoverRate: 12.5,
      trend: "up",
    },
    {
      id: 2,
      name: "Ergonomic Office Chair",
      category: "Furniture",
      stock: 32,
      turnoverRate: 8.7,
      trend: "up",
    },
    {
      id: 3,
      name: "Premium Cotton T-Shirt",
      category: "Clothing",
      stock: 200,
      turnoverRate: 15.2,
      trend: "up",
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      category: "Electronics",
      stock: 78,
      turnoverRate: 7.3,
      trend: "down",
    },
    {
      id: 5,
      name: "Leather Wallet",
      category: "Accessories",
      stock: 120,
      turnoverRate: 5.1,
      trend: "down",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Current Stock</TableHead>
          <TableHead className="text-right">Turnover Rate</TableHead>
          <TableHead className="text-right">Trend</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="text-right">{product.stock}</TableCell>
            <TableCell className="text-right">
              {product.turnoverRate}%
            </TableCell>
            <TableCell className="text-right">
              {product.trend === "up" ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Up
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                >
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Down
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryFilter } from "./category-filter";
import { InventoryStats } from "./inventory-stats";

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSelectedItem(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter inventory data based on active category and search query
  const filteredInventory = inventoryData.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        <InventoryStats />

        <div className="flex flex-col md:flex-row gap-4">
          {/* Category sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Inventory Items</CardTitle>
                    <CardDescription>
                      {activeCategory === "all"
                        ? "All inventory items"
                        : `${activeCategory} inventory items`}
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search items..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className={`grid ${
                    selectedItem ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                  } gap-0`}
                >
                  <div className={`${selectedItem ? "border-r" : ""}`}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Item ID</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">
                            Value (₱)
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInventory.length > 0 ? (
                          filteredInventory.map((item) => (
                            <TableRow
                              key={item.id}
                              className={`cursor-pointer ${
                                selectedItem?.id === item.id ? "bg-muted" : ""
                              }`}
                              onClick={() => handleViewDetails(item)}
                            >
                              <TableCell className="font-medium">
                                {item.itemId}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {item.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {item.variant}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right">
                                {item.stock}
                              </TableCell>
                              <TableCell>
                                <StockStatusBadge status={item.status} />
                              </TableCell>
                              <TableCell className="text-right">
                                {item.value.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(item);
                                      }}
                                    >
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Edit Item
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View History
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Adjust Stock
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Delete Item
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No items found. Try adjusting your search or
                              filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {selectedItem && (
                    <div className="p-4 overflow-auto max-h-[800px]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Item Details</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseDetails();
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Close
                        </Button>
                      </div>

                      <Tabs defaultValue="basic">
                        <TabsList className="mb-4">
                          <TabsTrigger value="basic">Basic Info</TabsTrigger>
                          <TabsTrigger value="stock">Stock & Value</TabsTrigger>
                          <TabsTrigger value="vendor">Vendor</TabsTrigger>
                          <TabsTrigger value="allocation">
                            Allocation
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Basic Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Item ID:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.itemId}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Name:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.name}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Category:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.category}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Variant:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.variant}
                                  </dd>
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Description:
                                  </dt>
                                  <dd className="text-sm">
                                    {selectedItem.description || "N/A"}
                                  </dd>
                                </div>
                              </dl>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Additional Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Date Added:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.dateAdded || "N/A"}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Last Updated:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.lastUpdated || "N/A"}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Storage Location:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.storageLocation || "N/A"}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Shelf Life:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.shelfLife || "N/A"}
                                  </dd>
                                </div>
                              </dl>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="stock" className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Stock Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Current Stock:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.stock}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Status:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    <StockStatusBadge
                                      status={selectedItem.status}
                                    />
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Unit Value:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    ₱{selectedItem.value.toLocaleString()}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Total Value:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    ₱
                                    {(
                                      selectedItem.stock * selectedItem.value
                                    ).toLocaleString()}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Minimum Stock:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.minStock}
                                  </dd>
                                </div>
                                <div className="flex justify-between sm:block">
                                  <dt className="text-sm font-medium text-muted-foreground">
                                    Reorder Point:
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {selectedItem.reorderPoint || "N/A"}
                                  </dd>
                                </div>
                              </dl>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Stock History
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">
                                      Quantity
                                    </TableHead>
                                    <TableHead>Reference</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedItem.stockHistory ? (
                                    selectedItem.stockHistory.map(
                                      (entry, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{entry.date}</TableCell>
                                          <TableCell>{entry.type}</TableCell>
                                          <TableCell className="text-right">
                                            {entry.type === "Stock In"
                                              ? "+"
                                              : "-"}
                                            {entry.quantity}
                                          </TableCell>
                                          <TableCell>
                                            {entry.reference}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )
                                  ) : (
                                    <TableRow>
                                      <TableCell
                                        colSpan={4}
                                        className="text-center"
                                      >
                                        No stock history available
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="vendor" className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Vendor Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedItem.vendor ? (
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                  <div className="flex justify-between sm:block">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                      Vendor:
                                    </dt>
                                    <dd className="text-sm font-medium">
                                      {selectedItem.vendor.name}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between sm:block">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                      Contact Person:
                                    </dt>
                                    <dd className="text-sm font-medium">
                                      {selectedItem.vendor.contactPerson}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between sm:block">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                      Contact Number:
                                    </dt>
                                    <dd className="text-sm font-medium">
                                      {selectedItem.vendor.contactNumber}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between sm:block">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                      Email:
                                    </dt>
                                    <dd className="text-sm font-medium">
                                      {selectedItem.vendor.email}
                                    </dd>
                                  </div>
                                  <div className="col-span-1 sm:col-span-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                      Address:
                                    </dt>
                                    <dd className="text-sm">
                                      {selectedItem.vendor.address || "N/A"}
                                    </dd>
                                  </div>
                                </dl>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No vendor information available
                                </p>
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Purchase History
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>PO Number</TableHead>
                                    <TableHead className="text-right">
                                      Quantity
                                    </TableHead>
                                    <TableHead className="text-right">
                                      Unit Price
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedItem.purchaseHistory ? (
                                    selectedItem.purchaseHistory.map(
                                      (entry, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{entry.date}</TableCell>
                                          <TableCell>
                                            {entry.poNumber}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {entry.quantity}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            ₱{entry.unitPrice.toLocaleString()}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )
                                  ) : (
                                    <TableRow>
                                      <TableCell
                                        colSpan={4}
                                        className="text-center"
                                      >
                                        No purchase history available
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="allocation" className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Program Allocation
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedItem.programAllocation &&
                              Object.keys(selectedItem.programAllocation)
                                .length > 0 ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Program</TableHead>
                                      <TableHead className="text-right">
                                        Allocated Quantity
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Value (₱)
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {Object.entries(
                                      selectedItem.programAllocation
                                    ).map(([program, quantity]) => (
                                      <TableRow key={program}>
                                        <TableCell>{program}</TableCell>
                                        <TableCell className="text-right">
                                          {quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          ₱
                                          {(
                                            quantity * selectedItem.value
                                          ).toLocaleString()}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell className="font-medium">
                                        Total
                                      </TableCell>
                                      <TableCell className="text-right font-medium">
                                        {Object.values(
                                          selectedItem.programAllocation
                                        ).reduce((a, b) => a + b, 0)}
                                      </TableCell>
                                      <TableCell className="text-right font-medium">
                                        ₱
                                        {(
                                          Object.values(
                                            selectedItem.programAllocation
                                          ).reduce((a, b) => a + b, 0) *
                                          selectedItem.value
                                        ).toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No program allocations available
                                </p>
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">
                                Disbursement History
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Program</TableHead>
                                    <TableHead>Beneficiary</TableHead>
                                    <TableHead className="text-right">
                                      Quantity
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedItem.disbursementHistory ? (
                                    selectedItem.disbursementHistory.map(
                                      (entry, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{entry.date}</TableCell>
                                          <TableCell>{entry.program}</TableCell>
                                          <TableCell>
                                            {entry.beneficiary}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {entry.quantity}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )
                                  ) : (
                                    <TableRow>
                                      <TableCell
                                        colSpan={4}
                                        className="text-center"
                                      >
                                        No disbursement history available
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Export Details
                        </Button>
                        <Button size="sm">Edit Item</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockStatusBadge({ status }) {
  if (status === "In Stock") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      >
        <CheckCircle className="mr-1 h-3 w-3" />
        In Stock
      </Badge>
    );
  } else if (status === "Low Stock") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
      >
        <AlertTriangle className="mr-1 h-3 w-3" />
        Low Stock
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      >
        Out of Stock
      </Badge>
    );
  }
}

const inventoryData = [
  {
    id: 1,
    itemId: "FD-1001",
    name: "Rice",
    variant: "5kg bag",
    category: "Food Items",
    stock: 245,
    status: "In Stock",
    value: 250,
    description: "5kg bag of rice for food assistance program",
    minStock: 50,
    reorderPoint: 75,
    dateAdded: "2023-01-15",
    lastUpdated: "2023-06-10",
    storageLocation: "Main Warehouse - Section A",
    shelfLife: "12 months",
    vendor: {
      name: "National Food Authority",
      contactPerson: "Juan Dela Cruz",
      contactNumber: "09123456789",
      email: "nfa@example.com",
      address: "123 NFA Road, Quezon City",
    },
    programAllocation: {
      "Disaster Relief": 100,
      "Food Security Program": 145,
    },
    stockHistory: [
      {
        date: "2023-06-10",
        type: "Stock In",
        quantity: 100,
        reference: "PO-2023-0610",
      },
      {
        date: "2023-05-15",
        type: "Stock Out",
        quantity: 50,
        reference: "DO-2023-0515",
      },
      {
        date: "2023-04-20",
        type: "Stock In",
        quantity: 200,
        reference: "PO-2023-0420",
      },
    ],
    purchaseHistory: [
      {
        date: "2023-06-10",
        poNumber: "PO-2023-0610",
        quantity: 100,
        unitPrice: 250,
      },
      {
        date: "2023-04-20",
        poNumber: "PO-2023-0420",
        quantity: 200,
        unitPrice: 245,
      },
      {
        date: "2023-02-05",
        poNumber: "PO-2023-0205",
        quantity: 150,
        unitPrice: 240,
      },
    ],
    disbursementHistory: [
      {
        date: "2023-05-15",
        program: "Disaster Relief",
        beneficiary: "Barangay Matatag",
        quantity: 50,
      },
      {
        date: "2023-03-10",
        program: "Food Security Program",
        beneficiary: "Barangay Masigasig",
        quantity: 30,
      },
      {
        date: "2023-02-20",
        program: "Food Security Program",
        beneficiary: "Barangay Maunlad",
        quantity: 25,
      },
    ],
  },
  // Additional inventory items would be listed here
];

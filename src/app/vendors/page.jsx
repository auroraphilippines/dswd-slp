"use client";

import { useState } from "react";
import { Store, Plus, Search, Download, MoreHorizontal, X } from "lucide-react";
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
import { VendorDetailView } from "./vendor-detail-view";

export default function VendorsPage() {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleCloseDetails = () => {
    setSelectedVendor(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter vendors based on search query
  const filteredVendors = vendorData.filter((vendor) => {
    return (
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Vendor Management
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>
                  Manage your suppliers and vendor details
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
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
                selectedVendor ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              } gap-0`}
            >
              <div className={`${selectedVendor ? "border-r" : ""}`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <TableRow
                          key={vendor.id}
                          className={`cursor-pointer ${
                            selectedVendor?.id === vendor.id ? "bg-muted" : ""
                          }`}
                          onClick={() => handleViewDetails(vendor)}
                        >
                          <TableCell className="font-medium">
                            {vendor.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                <Store className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="font-medium">{vendor.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{vendor.category}</TableCell>
                          <TableCell>{vendor.contactPerson}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                vendor.status === "Active"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {vendor.status}
                            </Badge>
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
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(vendor);
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Edit Vendor
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Supplied Items
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {vendor.status === "Active"
                                    ? "Deactivate Vendor"
                                    : "Activate Vendor"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No vendors found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {selectedVendor && (
                <div className="p-4 overflow-auto max-h-[800px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Vendor Details</h3>
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

                  <VendorDetailView vendor={selectedVendor} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const vendorData = [
  {
    id: "V-1001",
    name: "National Food Authority",
    category: "Food Items",
    contactPerson: "Juan Dela Cruz",
    position: "Supply Officer",
    phone: "09123456789",
    email: "nfa@example.com",
    address: "123 NFA Road, Quezon City",
    status: "Active",
    registrationDate: "Jan 15, 2022",
    taxId: "123-456-789-000",
    accreditationDate: "Jan 20, 2022",
    accreditationExpiry: "Jan 20, 2025",
    accreditationLevel: "Level A",
    accreditationNumber: "ACC-2022-001",
    additionalContacts: [
      {
        name: "Maria Santos",
        position: "Accounting Officer",
        phone: "09123456788",
        email: "maria@nfa.example.com",
      },
    ],
    suppliedItems: [
      {
        id: "FD-1001",
        name: "Rice",
        category: "Food Items",
        lastSupplyDate: "Jun 10, 2023",
      },
      {
        id: "FD-1003",
        name: "Canned Sardines",
        category: "Food Items",
        lastSupplyDate: "May 22, 2023",
      },
    ],
    purchaseOrders: [
      {
        poNumber: "PO-2023-0610",
        date: "Jun 10, 2023",
        amount: 25000,
        status: "Completed",
      },
      {
        poNumber: "PO-2023-0420",
        date: "Apr 20, 2023",
        amount: 49000,
        status: "Completed",
      },
      {
        poNumber: "PO-2023-0205",
        date: "Feb 05, 2023",
        amount: 36000,
        status: "Completed",
      },
    ],
    paymentHistory: [
      {
        reference: "PAY-2023-0615",
        date: "Jun 15, 2023",
        amount: 25000,
        method: "Bank Transfer",
      },
      {
        reference: "PAY-2023-0425",
        date: "Apr 25, 2023",
        amount: 49000,
        method: "Bank Transfer",
      },
      {
        reference: "PAY-2023-0210",
        date: "Feb 10, 2023",
        amount: 36000,
        method: "Bank Transfer",
      },
    ],
  },
  // Additional vendor data would be listed here
];

"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Calendar,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
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
import { DisbursementDetailView } from "./disbursement-detail-view";

export default function DisbursementsPage() {
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (disbursement) => {
    setSelectedDisbursement(disbursement);
  };

  const handleCloseDetails = () => {
    setSelectedDisbursement(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter disbursements based on search query
  const filteredDisbursements = disbursementData.filter((disbursement) => {
    return (
      searchQuery === "" ||
      disbursement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disbursement.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disbursement.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disbursement.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Disbursement Management
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Disbursement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Disbursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                In the last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Disbursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Disbursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68</div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱3.2M</div>
              <p className="text-xs text-muted-foreground">
                Disbursed in last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Disbursements</CardTitle>
                <CardDescription>
                  Manage assistance disbursements to beneficiaries
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search disbursements..."
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
                selectedDisbursement
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              } gap-0`}
            >
              <div className={`${selectedDisbursement ? "border-r" : ""}`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Barangay</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisbursements.length > 0 ? (
                      filteredDisbursements.map((disbursement) => (
                        <TableRow
                          key={disbursement.id}
                          className={`cursor-pointer ${
                            selectedDisbursement?.id === disbursement.id
                              ? "bg-muted"
                              : ""
                          }`}
                          onClick={() => handleViewDetails(disbursement)}
                        >
                          <TableCell className="font-medium">
                            {disbursement.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="font-medium">
                                {disbursement.program}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{disbursement.barangay}</TableCell>
                          <TableCell>{disbursement.date}</TableCell>
                          <TableCell>
                            <DisbursementStatusBadge
                              status={disbursement.status}
                            />
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
                                    handleViewDetails(disbursement);
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Edit Disbursement
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Print Manifest
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {disbursement.status === "Pending" && (
                                  <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                {disbursement.status === "Scheduled" && (
                                  <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Start Processing
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Cancel Disbursement
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No disbursements found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {selectedDisbursement && (
                <div className="p-4 overflow-auto max-h-[800px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Disbursement Details
                    </h3>
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

                  <DisbursementDetailView disbursement={selectedDisbursement} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DisbursementStatusBadge({ status }) {
  if (status === "Completed") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      >
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </Badge>
    );
  } else if (status === "Pending") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
      >
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  } else if (status === "Scheduled") {
    return (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      >
        <Calendar className="mr-1 h-3 w-3" />
        Scheduled
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      >
        <AlertTriangle className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    );
  }
}

const disbursementData = [
  {
    id: "D-2023-124",
    program: "Disaster Relief Program",
    barangay: "Barangay Matatag",
    date: "Jun 15, 2023",
    status: "Pending",
    beneficiaryCount: 50,
    totalValue: 150000,
    items: [
      { name: "Food Packs", quantity: 50, value: 75000 },
      { name: "Cash Assistance", quantity: 50, value: 75000 },
    ],
    coordinator: "Maria Reyes",
    contactNumber: "09123456789",
    scheduledDate: "Jun 15, 2023",
    scheduledTime: "9:00 AM",
    location: "Barangay Matatag Covered Court",
    notes: "Priority for families affected by recent flooding",
    beneficiaries: [
      {
        id: "B-1001",
        name: "Maria Santos",
        assistanceType: "Food Pack, Cash Assistance",
      },
      {
        id: "B-1005",
        name: "Pedro Reyes",
        assistanceType: "Food Pack, Cash Assistance",
      },
      // More beneficiaries would be listed here
    ],
    timeline: [
      {
        date: "Jun 10, 2023",
        time: "10:00 AM",
        action: "Disbursement Created",
        user: "Juan Santos",
      },
      {
        date: "Jun 12, 2023",
        time: "2:00 PM",
        action: "Items Prepared",
        user: "Elena Cruz",
      },
      {
        date: "Jun 15, 2023",
        time: "8:30 AM",
        action: "Team Dispatched",
        user: "Maria Reyes",
      },
    ],
  },
  {
    id: "D-2023-123",
    program: "Food Security Program",
    barangay: "Barangay Masigasig",
    date: "Jun 10, 2023",
    status: "Completed",
    beneficiaryCount: 45,
    totalValue: 135000,
    items: [
      { name: "Food Packs", quantity: 45, value: 67500 },
      { name: "Rice (5kg)", quantity: 90, value: 67500 },
    ],
    coordinator: "Juan Santos",
    contactNumber: "09123456790",
    scheduledDate: "Jun 10, 2023",
    scheduledTime: "10:00 AM",
    location: "Barangay Masigasig Community Center",
    notes: "Monthly food assistance for registered beneficiaries",
    beneficiaries: [
      {
        id: "B-1002",
        name: "Pedro Reyes",
        assistanceType: "Food Pack, Rice (5kg)",
      },
      {
        id: "B-1008",
        name: "Ana Lim",
        assistanceType: "Food Pack, Rice (5kg)",
      },
      // More beneficiaries would be listed here
    ],
    timeline: [
      {
        date: "Jun 5, 2023",
        time: "9:00 AM",
        action: "Disbursement Created",
        user: "Juan Santos",
      },
      {
        date: "Jun 8, 2023",
        time: "1:00 PM",
        action: "Items Prepared",
        user: "Elena Cruz",
      },
      {
        date: "Jun 10, 2023",
        time: "9:30 AM",
        action: "Team Dispatched",
        user: "Juan Santos",
      },
      {
        date: "Jun 10, 2023",
        time: "3:00 PM",
        action: "Disbursement Completed",
        user: "Juan Santos",
      },
    ],
  },
  {
    id: "D-2023-125",
    program: "Educational Assistance",
    barangay: "All Barangays",
    date: "Jul 1, 2023",
    status: "Scheduled",
    beneficiaryCount: 100,
    totalValue: 250000,
    items: [
      { name: "School Supplies", quantity: 100, value: 100000 },
      { name: "Uniform Allowance", quantity: 100, value: 150000 },
    ],
    coordinator: "Elena Cruz",
    contactNumber: "09123456791",
    scheduledDate: "Jul 1, 2023",
    scheduledTime: "8:00 AM",
    location: "Municipal Gymnasium",
    notes: "Annual educational assistance for the new school year",
    beneficiaries: [
      // Beneficiaries would be listed here
    ],
    timeline: [
      {
        date: "Jun 20, 2023",
        time: "11:00 AM",
        action: "Disbursement Created",
        user: "Elena Cruz",
      },
    ],
  },
];

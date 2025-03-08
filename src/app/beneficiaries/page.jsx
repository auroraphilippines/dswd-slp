"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Download,
  MoreHorizontal,
  UserPlus,
  X,
  UserCheck,
  UserX,
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
import { BeneficiariesDetailView } from "./beneficiary-detail-view";

export default function BeneficiariesPage() {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const handleCloseDetails = () => {
    setSelectedBeneficiary(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter beneficiaries based on search query
  const filteredBeneficiaries = beneficiaryData.filter((beneficiary) => {
    return (
      searchQuery === "" ||
      beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beneficiary.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beneficiary.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beneficiary.program.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Beneficiary Management
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Beneficiary
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Beneficiaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,543</div>
              <p className="text-xs text-muted-foreground">
                Across all programs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Beneficiaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,105</div>
              <p className="text-xs text-muted-foreground">
                Currently receiving assistance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187</div>
              <p className="text-xs text-muted-foreground">
                Awaiting document verification
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Graduated Beneficiaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">251</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed program
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Beneficiaries</CardTitle>
                <CardDescription>
                  Manage program beneficiaries and their details
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search beneficiaries..."
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
                selectedBeneficiary
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              } gap-0`}
            >
              <div className={`${selectedBeneficiary ? "border-r" : ""}`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Barangay</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBeneficiaries.length > 0 ? (
                      filteredBeneficiaries.map((beneficiary) => (
                        <TableRow
                          key={beneficiary.id}
                          className={`cursor-pointer ${
                            selectedBeneficiary?.id === beneficiary.id
                              ? "bg-muted"
                              : ""
                          }`}
                          onClick={() => handleViewDetails(beneficiary)}
                        >
                          <TableCell className="font-medium">
                            {beneficiary.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="font-medium">
                                {beneficiary.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{beneficiary.barangay}</TableCell>
                          <TableCell>{beneficiary.program}</TableCell>
                          <TableCell>
                            <BeneficiaryStatusBadge
                              status={beneficiary.status}
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
                                    handleViewDetails(beneficiary);
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Edit Beneficiary
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Assistance History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {beneficiary.status === "Active"
                                    ? "Deactivate Beneficiary"
                                    : "Activate Beneficiary"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No beneficiaries found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {selectedBeneficiary && (
                <div className="p-4 overflow-auto max-h-[800px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Beneficiary Details
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

                  <BeneficiaryDetailView beneficiary={selectedBeneficiary} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BeneficiaryStatusBadge({ status }) {
  if (status === "Active") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      >
        <UserCheck className="mr-1 h-3 w-3" />
        Active
      </Badge>
    );
  } else if (status === "Pending") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
      >
        <UserPlus className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800"
      >
        <UserX className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    );
  }
}

const beneficiaryData = [
  {
    id: "B-1001",
    name: "Maria Santos",
    barangay: "Barangay Matatag",
    program: "Disaster Relief Program",
    status: "Active",
    gender: "Female",
    age: 42,
    contactNumber: "09123456789",
    address: "123 Main St, Barangay Matatag, Manila",
    familyMembers: 5,
    dateRegistered: "Jan 15, 2023",
    validID: "Voter's ID",
    validIDNumber: "123456789",
    emergencyContact: {
      name: "Juan Santos",
      relationship: "Husband",
      contactNumber: "09123456788",
    },
    assistanceHistory: [
      {
        date: "Jun 10, 2023",
        type: "Food Pack",
        quantity: 1,
        value: 1500,
        program: "Disaster Relief Program",
      },
      {
        date: "May 15, 2023",
        type: "Cash Assistance",
        quantity: 1,
        value: 3000,
        program: "Disaster Relief Program",
      },
      {
        date: "Apr 20, 2023",
        type: "Food Pack",
        quantity: 1,
        value: 1500,
        program: "Disaster Relief Program",
      },
    ],
    documents: [
      {
        name: "Barangay Certificate",
        dateSubmitted: "Jan 10, 2023",
        status: "Verified",
      },
      { name: "Valid ID", dateSubmitted: "Jan 10, 2023", status: "Verified" },
      {
        name: "Proof of Residence",
        dateSubmitted: "Jan 10, 2023",
        status: "Verified",
      },
    ],
  },
  {
    id: "B-1002",
    name: "Pedro Reyes",
    barangay: "Barangay Masigasig",
    program: "Food Security Program",
    status: "Active",
    gender: "Male",
    age: 35,
    contactNumber: "09123456790",
    address: "456 Side St, Barangay Masigasig, Manila",
    familyMembers: 4,
    dateRegistered: "Feb 5, 2023",
    validID: "Driver's License",
    validIDNumber: "987654321",
    emergencyContact: {
      name: "Ana Reyes",
      relationship: "Wife",
      contactNumber: "09123456791",
    },
    assistanceHistory: [
      {
        date: "Jun 15, 2023",
        type: "Food Pack",
        quantity: 1,
        value: 1500,
        program: "Food Security Program",
      },
      {
        date: "May 20, 2023",
        type: "Rice (5kg)",
        quantity: 2,
        value: 500,
        program: "Food Security Program",
      },
    ],
    documents: [
      {
        name: "Barangay Certificate",
        dateSubmitted: "Feb 1, 2023",
        status: "Verified",
      },
      { name: "Valid ID", dateSubmitted: "Feb 1, 2023", status: "Verified" },
      {
        name: "Proof of Residence",
        dateSubmitted: "Feb 1, 2023",
        status: "Verified",
      },
    ],
  },
  {
    id: "B-1003",
    name: "Elena Cruz",
    barangay: "Barangay Maunlad",
    program: "Educational Assistance",
    status: "Pending",
    gender: "Female",
    age: 28,
    contactNumber: "09123456792",
    address: "789 Back St, Barangay Maunlad, Manila",
    familyMembers: 3,
    dateRegistered: "Jun 20, 2023",
    validID: "PhilHealth ID",
    validIDNumber: "456789123",
    emergencyContact: {
      name: "Roberto Cruz",
      relationship: "Father",
      contactNumber: "09123456793",
    },
    assistanceHistory: [],
    documents: [
      {
        name: "Barangay Certificate",
        dateSubmitted: "Jun 18, 2023",
        status: "Pending",
      },
      { name: "Valid ID", dateSubmitted: "Jun 18, 2023", status: "Verified" },
      {
        name: "Proof of Residence",
        dateSubmitted: "Jun 18, 2023",
        status: "Pending",
      },
    ],
  },
];

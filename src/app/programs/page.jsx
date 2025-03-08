"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Download,
  MoreHorizontal,
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
import { ProgramDetailView } from "./program-detail-view";

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
  };

  const handleCloseDetails = () => {
    setSelectedProgram(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter programs based on search query
  const filteredPrograms = programData.filter((program) => {
    return (
      searchQuery === "" ||
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Program Management
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Currently running programs
              </p>
            </CardContent>
          </Card>
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
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱15.2M</div>
              <p className="text-xs text-muted-foreground">
                Allocated for all programs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Disbursed Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱8.7M</div>
              <p className="text-xs text-muted-foreground">
                57% of total budget
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Programs</CardTitle>
                <CardDescription>
                  Manage welfare programs and their details
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search programs..."
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
                selectedProgram ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              } gap-0`}
            >
              <div className={`${selectedProgram ? "border-r" : ""}`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Program Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Beneficiaries</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrograms.length > 0 ? (
                      filteredPrograms.map((program) => (
                        <TableRow
                          key={program.id}
                          className={`cursor-pointer ${
                            selectedProgram?.id === program.id ? "bg-muted" : ""
                          }`}
                          onClick={() => handleViewDetails(program)}
                        >
                          <TableCell className="font-medium">
                            {program.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="font-medium">{program.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{program.category}</TableCell>
                          <TableCell>{program.beneficiaryCount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                program.status === "Active"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                program.status === "Active"
                                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                  : program.status === "Planned"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                  : ""
                              }
                            >
                              {program.status}
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
                                    handleViewDetails(program);
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Edit Program
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Manage Beneficiaries
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {program.status === "Active"
                                    ? "Deactivate Program"
                                    : "Activate Program"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No programs found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {selectedProgram && (
                <div className="p-4 overflow-auto max-h-[800px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Program Details</h3>
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

                  <ProgramDetailView program={selectedProgram} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const programData = [
  {
    id: "P-1001",
    name: "Disaster Relief Program",
    category: "Emergency Assistance",
    status: "Active",
    beneficiaryCount: 1250,
    description:
      "Provides immediate assistance to families affected by natural disasters and calamities.",
    startDate: "Jan 15, 2023",
    endDate: "Dec 31, 2023",
    budget: 5000000,
    disbursed: 3200000,
    remaining: 1800000,
    coordinator: "Maria Reyes",
    contactNumber: "09123456789",
    email: "maria.reyes@dswd.gov.ph",
    location: "All Barangays",
    eligibilityCriteria: [
      "Families affected by natural disasters",
      "Families with damaged houses",
      "Families with no source of income due to disaster",
    ],
    assistanceTypes: [
      { type: "Food Packs", value: 1500, frequency: "One-time" },
      { type: "Cash Assistance", value: 3000, frequency: "One-time" },
      { type: "Shelter Materials", value: 5000, frequency: "One-time" },
    ],
    recentDisbursements: [
      {
        date: "Jun 15, 2023",
        barangay: "Barangay Matatag",
        beneficiaries: 50,
        amount: 150000,
      },
      {
        date: "Jun 10, 2023",
        barangay: "Barangay Masigasig",
        beneficiaries: 45,
        amount: 135000,
      },
      {
        date: "Jun 5, 2023",
        barangay: "Barangay Maunlad",
        beneficiaries: 40,
        amount: 120000,
      },
    ],
  },
  {
    id: "P-1002",
    name: "Food Security Program",
    category: "Nutrition",
    status: "Active",
    beneficiaryCount: 850,
    description:
      "Ensures access to nutritious food for vulnerable families and communities.",
    startDate: "Feb 1, 2023",
    endDate: "Jan 31, 2024",
    budget: 3500000,
    disbursed: 1800000,
    remaining: 1700000,
    coordinator: "Juan Santos",
    contactNumber: "09123456790",
    email: "juan.santos@dswd.gov.ph",
    location: "Selected Barangays",
    eligibilityCriteria: [
      "Families with malnourished children",
      "Families below poverty threshold",
      "Families with pregnant or lactating mothers",
    ],
    assistanceTypes: [
      { type: "Food Packs", value: 1500, frequency: "Monthly" },
      { type: "Rice (5kg)", value: 250, frequency: "Monthly" },
      { type: "Nutrition Education", value: 0, frequency: "Quarterly" },
    ],
    recentDisbursements: [
      {
        date: "Jun 20, 2023",
        barangay: "Barangay Matatag",
        beneficiaries: 30,
        amount: 45000,
      },
      {
        date: "Jun 18, 2023",
        barangay: "Barangay Masigasig",
        beneficiaries: 25,
        amount: 37500,
      },
      {
        date: "Jun 15, 2023",
        barangay: "Barangay Maunlad",
        beneficiaries: 20,
        amount: 30000,
      },
    ],
  },
  {
    id: "P-1003",
    name: "Educational Assistance",
    category: "Education",
    status: "Planned",
    beneficiaryCount: 0,
    description:
      "Provides educational support to children from low-income families.",
    startDate: "Jul 1, 2023",
    endDate: "Jun 30, 2024",
    budget: 2500000,
    disbursed: 0,
    remaining: 2500000,
    coordinator: "Elena Cruz",
    contactNumber: "09123456791",
    email: "elena.cruz@dswd.gov.ph",
    location: "All Barangays",
    eligibilityCriteria: [
      "Children from families below poverty threshold",
      "Children with good academic standing",
      "Children at risk of dropping out",
    ],
    assistanceTypes: [
      { type: "School Supplies", value: 1000, frequency: "Annual" },
      { type: "Uniform Allowance", value: 1500, frequency: "Annual" },
      { type: "Transportation Allowance", value: 500, frequency: "Monthly" },
    ],
    recentDisbursements: [],
  },
];

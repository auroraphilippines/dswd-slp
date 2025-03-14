"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoadingPage from "../loading/page";
import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  ShoppingCart,
  Users,
  Menu,
  X,
  Bell,
  Search,
  Building2,
  Store,
  Plus,
  Download,
  MoreHorizontal,
  User,
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
import { ThemeToggle } from "@/components/theme-toggle";
import { ProgramDetailView } from "./program-detail-view";
import { auth, db } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";
import LoadingPage from "./loading";

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const rawName = userData.name || "";
            const displayName = rawName === "255" ? "Admin DSWD" : rawName;

            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: userData.email || "admin@dswd.gov.ph",
              name: displayName,
              role: userData.role || "Administrator",
            });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Get user initials from name
  const getUserInitials = (name) => {
    if (!name) return "AD";
    if (name === "Admin DSWD") return "AD";

    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
  };

  const handleCloseDetails = () => {
    setSelectedProgram(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <LoadingPage />;
  }

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

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vendors", href: "/vendors", icon: Store },
    { name: "Beneficiaries", href: "/beneficiaries", icon: Users },
    { name: "Programs", href: "/programs", icon: Building2 },
    { name: "Reports", href: "./reports", icon: FileBarChart },
    { name: "Analytics", href: "./analytics", icon: FileBarChart },
    { name: "Settings", href: "./settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-card">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard" className="flex items-center">
              <img src="./images/SLP.png" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">DSWD SLP-TIS</span>
            </Link>
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {getUserInitials(currentUser?.name)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {currentUser?.name || "Admin DSWD"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.role || "Administrator"}
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? "fixed inset-0 z-40 flex" : "hidden"
        } md:hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link href="/dashboard" className="flex items-center">
                <img src="./images/SLP.png" alt="Logo" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold">DSWD SLP-TIS</span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="text-sm font-medium">
                  {getUserInitials(currentUser?.name)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {currentUser?.name || "Admin DSWD"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-card shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-muted-foreground md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-muted-foreground focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 ml-3" aria-hidden="true" />
                  </div>
                  <Input
                    id="search-field"
                    className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-muted-foreground placeholder-muted-foreground focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search programs..."
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-3 rounded-full"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {getUserInitials(currentUser?.name)}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.name || "Admin DSWD"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email || "admin@dswd.gov.ph"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
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
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div
                      className={`grid ${
                        selectedProgram
                          ? "grid-cols-1 lg:grid-cols-2"
                          : "grid-cols-1"
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
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPrograms.length > 0 ? (
                              filteredPrograms.map((program) => (
                                <TableRow
                                  key={program.id}
                                  className={`cursor-pointer ${
                                    selectedProgram?.id === program.id
                                      ? "bg-muted"
                                      : ""
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
                                      <div className="font-medium">
                                        {program.name}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{program.category}</TableCell>
                                  <TableCell>
                                    {program.beneficiaryCount}
                                  </TableCell>
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
                                          <span className="sr-only">
                                            Open menu
                                          </span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                          Actions
                                        </DropdownMenuLabel>
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
                                <TableCell
                                  colSpan={6}
                                  className="text-center py-4"
                                >
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
                            <h3 className="text-lg font-semibold">
                              Program Details
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

                          <ProgramDetailView program={selectedProgram} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
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
  },
];
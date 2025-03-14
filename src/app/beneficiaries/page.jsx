"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  UserPlus,
  UserCheck,
  UserX,
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
import { BeneficiariesDetailView } from "./beneficiary-detail-view";
import { auth, db } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";
import LoadingPage from "./loading";

export default function BeneficiariesPage() {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Format the display name based on the raw data
            const rawName = userData.name || "";
            const displayName = rawName === "255" ? "Admin DSWD" : rawName;
            
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: userData.email || "admin@dswd.gov.ph",
              name: displayName,
              role: userData.role || "Administrator"
            });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

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

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleViewDetails = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const handleCloseDetails = () => {
    setSelectedBeneficiary(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vendors", href: "/vendors", icon: Store },
    { name: "Beneficiaries", href: "/beneficiaries", icon: Users },
    { name: "Programs", href: "/programs", icon: Building2 },
   
    { name: "Reports", href: "./reports", icon: FileBarChart },
    { name: "Analytics", href: "./analytics", icon: FileBarChart },
    { name: "Settings", href: "./settings", icon: Settings },
  ];

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

  if (loading) {
    return <LoadingPage />;
  }

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
                  <span className="text-sm font-medium">{getUserInitials(currentUser?.name)}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
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
                <span className="text-sm font-medium">{getUserInitials(currentUser?.name)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser?.name}</p>
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
                    placeholder="Search"
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
                      <span className="text-sm font-medium">{getUserInitials(currentUser?.name)}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
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
            {/* Beneficiaries Content */}
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
                      <div
                        className={`${selectedBeneficiary ? "border-r" : ""}`}
                      >
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[80px]">ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Barangay</TableHead>
                              <TableHead>Program</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
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
                                <TableCell
                                  colSpan={6}
                                  className="text-center py-4"
                                >
                                  No beneficiaries found. Try adjusting your
                                  search.
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

                          <BeneficiaryDetailView
                            beneficiary={selectedBeneficiary}
                          />
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
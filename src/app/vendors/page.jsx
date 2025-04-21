"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  LogOut,
  Trash2,
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
import { VendorDetailView } from "./vendor-detail-view";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  subscribeToVendors,
  deleteVendor,
  updateVendorDetails,
} from "@/service/vendor";
import { getCurrentUser } from "@/service/auth";
import LoadingPage from "../loading/page";
import { auth, db } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Checkbox } from "@/components/ui/checkbox";
import XLSX from 'xlsx';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function VendorsPage() {
  const router = useRouter();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [editingVendor, setEditingVendor] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [analytics, setAnalytics] = useState({
    total: 0,
    programDistribution: {},
    totalManpowerCost: 0,
    totalMaterialsCost: 0,
    totalEquipmentCost: 0
  });
  const [selectedVendors, setSelectedVendors] = useState([]);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let unsubscribe = () => {};

    const setupVendorsSubscription = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
          return;
        }

        setCurrentUser(user);
        
        // Subscribe to all vendors collection without user filtering
        unsubscribe = subscribeToVendors((fetchedVendors) => {
          // Sort vendors by createdAt date in descending order (newest first)
          const sortedVendors = fetchedVendors.sort((a, b) => 
            b.createdAt?.toDate() - a.createdAt?.toDate()
          );
          setVendors(sortedVendors);
          
          // Calculate analytics
          const vendorAnalytics = calculateVendorAnalytics(sortedVendors);
          setAnalytics(vendorAnalytics);
          
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up vendors subscription:", error);
        toast.error("Failed to load vendors");
        setLoading(false);
      }
    };

    setupVendorsSubscription();

    return () => {
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateVendorAnalytics = (vendors) => {
    const stats = {
      total: vendors.length,
      programDistribution: {},
      totalManpowerCost: 0,
      totalMaterialsCost: 0,
      totalEquipmentCost: 0
    };

    vendors.forEach(vendor => {
      // Program distribution
      stats.programDistribution[vendor.programName] = 
        (stats.programDistribution[vendor.programName] || 0) + 1;

      // Calculate costs
      stats.totalManpowerCost += vendor.manpower?.reduce((sum, worker) => sum + (Number(worker.wage) || 0), 0) || 0;
      stats.totalMaterialsCost += vendor.rawMaterials?.reduce((sum, material) => sum + (Number(material.totalCost) || 0), 0) || 0;
      stats.totalEquipmentCost += vendor.tools?.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0) || 0;
    });

    return stats;
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Building2 },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "Programs", href: "/programs", icon: Building2 },
    { name: "Reports", href: "./reports", icon: FileBarChart },
    { name: "Analytics", href: "./analytics", icon: FileBarChart },
    { name: "Settings", href: "./settings", icon: Settings },
  ];

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleCloseDetails = () => {
    setSelectedVendor(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddVendor = () => {
    router.push("./vendors/add");
  };

  const exportToCSV = () => {
    let csvContent = "";
    const BOM = "\uFEFF";

    // Headers for all sections in one line
    const headers = [
      // Vendor Info
      "ID", "Project Code", "Program Name", "Email",
      // Manpower Headers
      "MANPOWER Number", "MANPOWER Task", "MANPOWER Daily Wage", "MANPOWER Total Daily Wage",
      // Raw Materials Headers
      "RAW MATERIALS Name", "RAW MATERIALS Quantity", "RAW MATERIALS Unit", "RAW MATERIALS Unit Price", "RAW MATERIALS Frequency", "RAW MATERIALS Total Cost",
      // Tools & Equipment Headers
      "TOOLS & EQUIPMENT Name", "TOOLS & EQUIPMENT Quantity", "TOOLS & EQUIPMENT Unit", "TOOLS & EQUIPMENT Unit Price", 
      "TOOLS & EQUIPMENT Life Span", "TOOLS & EQUIPMENT Production Cycle", "TOOLS & EQUIPMENT Total Cost", "TOOLS & EQUIPMENT Depreciation",
      // Status and Date
      "Status", "Date Registered"
    ].join(",") + "\n";

    csvContent += headers;

    vendors.forEach((vendor) => {
      // Get the maximum number of items in any category for this vendor
      const maxItems = Math.max(
        vendor.manpower?.length || 0,
        vendor.rawMaterials?.length || 0,
        vendor.tools?.length || 0
      );

      // If there are no items in any category, create one row with just vendor info
      if (maxItems === 0) {
        const emptyRow = [
          vendor.id || "",
          vendor.projectCode || "",
          vendor.programName || "",
          vendor.email || "",
          // Empty cells for all categories
          ...Array(18).fill(""),
          "Active",
          vendor.createdAt?.toDate().toLocaleDateString() || ""
        ];
        csvContent += emptyRow.join(",") + "\n";
        return;
      }

      // Create rows for each index up to maxItems
      for (let i = 0; i < maxItems; i++) {
        const row = [];

        // Vendor info (only on first row)
        if (i === 0) {
          row.push(
            vendor.id || "",
            vendor.projectCode || "",
            vendor.programName || "",
            vendor.email || ""
          );
        } else {
          row.push("", "", "", "");
        }

        // Manpower data
        const manpower = vendor.manpower?.[i];
        if (manpower) {
          const totalDailyWage = (Number(manpower.wage) * Number(manpower.numberOfWorkers)) || 0;
          row.push(
            manpower.numberOfWorkers || "",
            manpower.task || "",
            manpower.wage || "",
            totalDailyWage || ""
          );
        } else {
          row.push("", "", "", "");
        }

        // Raw Materials data
        const material = vendor.rawMaterials?.[i];
        if (material) {
          row.push(
            material.name || "",
            material.quantity || "",
            material.unit || "",
            material.unitPrice || "",
            material.frequency || "",
            material.totalCost || ""
          );
        } else {
          row.push("", "", "", "", "", "");
        }

        // Tools & Equipment data
        const tool = vendor.tools?.[i];
        if (tool) {
          row.push(
            tool.name || "",
            tool.quantity || "",
            tool.unit || "",
            tool.unitPrice || "",
            tool.lifeSpan || "",
            tool.productionCycle || "",
            tool.totalCost || "",
            tool.depreciationCost || ""
          );
        } else {
          row.push("", "", "", "", "", "", "", "");
        }

        // Status and Date (only on first row)
        if (i === 0) {
          row.push(
            "Active",
            vendor.createdAt?.toDate().toLocaleDateString() || ""
          );
        } else {
          row.push("", "");
        }

        csvContent += row.join(",") + "\n";
      }
    });

    // Create and download the file
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "vendors_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor({
      id: vendor.id,
      projectCode: vendor.projectCode || "",
      programName: vendor.programName || "",
      name: vendor.name || "",
      email: vendor.email || "",
    });
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("You must be logged in to update vendors");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateVendorDetails(
        editingVendor.id,
        {
          projectCode: editingVendor.projectCode,
          programName: editingVendor.programName,
          name: editingVendor.name,
          email: editingVendor.email,
        },
        currentUser.uid
      );

      if (result.success) {
        toast.success("Vendor updated successfully!");
        setEditingVendor(null);
      } else {
        toast.error(result.error || "Failed to update vendor");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error("An error occurred while updating the vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!vendorToDelete || !currentUser) {
      toast.error("You must be logged in to delete vendors");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await deleteVendor(vendorToDelete.id);

      if (result.success) {
        toast.success("Vendor deleted successfully!");
        setShowDeleteDialog(false);
        setVendorToDelete(null);
        if (selectedVendor?.id === vendorToDelete.id) {
          setSelectedVendor(null);
        }
      } else {
        toast.error(result.error || "Failed to delete vendor");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("An error occurred while deleting the vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailUpdate = async (updatedVendor) => {
    if (!currentUser) {
      toast.error("You must be logged in to update vendors");
      return;
    }

    try {
      const result = await updateVendorDetails(
        updatedVendor.id,
        updatedVendor,
        currentUser.uid
      );

      if (result.success) {
        toast.success("Vendor details updated successfully!");
        setSelectedVendor(updatedVendor); // Update the local state
      } else {
        toast.error(result.error || "Failed to update vendor details");
      }
    } catch (error) {
      console.error("Error updating vendor details:", error);
      toast.error("An error occurred while updating vendor details");
    }
  };

  // Filter vendors based on search query
  const filteredVendors = vendors.filter((vendor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      (vendor.projectCode &&
        vendor.projectCode.toLowerCase().includes(searchLower)) ||
      (vendor.programName &&
        vendor.programName.toLowerCase().includes(searchLower)) ||
      (vendor.name && vendor.name.toLowerCase().includes(searchLower)) ||
      (vendor.email && vendor.email.toLowerCase().includes(searchLower))
    );
  });

  const getUserInitials = (name) => {
    if (!name) return "AD";
    if (name === "Admin DSWD") return "AD";

    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Add this function to handle checkbox selection
  const handleSelectVendor = (vendor, checked) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, vendor]);
    } else {
      setSelectedVendors(selectedVendors.filter(v => v.id !== vendor.id));
    }
  };

  // Add this function to handle multiple delete
  const handleMultipleDelete = async () => {
    if (!selectedVendors.length || !currentUser) {
      toast.error("Please select vendors to delete");
      return;
    }

    setIsSubmitting(true);
    try {
      const deletePromises = selectedVendors.map(vendor => deleteVendor(vendor.id));
      await Promise.all(deletePromises);
      
      toast.success("Selected vendors deleted successfully!");
      setSelectedVendors([]);
      if (selectedVendor && selectedVendors.some(v => v.id === selectedVendor.id)) {
        setSelectedVendor(null);
      }
    } catch (error) {
      console.error("Error deleting vendors:", error);
      toast.error("An error occurred while deleting vendors");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportManpower = () => {
    let csvContent = "";
    const BOM = "\uFEFF"; // For Excel compatibility
    const headers = [
      "ID",
      "Project Code",
      "Program Name",
      "Email",
      "Number of Workers",
      "Task",
      "Daily Wage",
      "Total Daily Wage",
      "Status",
      "Date Registered"
    ].join(",") + "\n";

    csvContent += headers;

    vendors.forEach((vendor) => {
      let isFirstRow = true;
      
      if (vendor.manpower && vendor.manpower.length > 0) {
        vendor.manpower.forEach((worker) => {
          const row = [];
          
          // Basic vendor info - only on first row or if it's the only row
          if (isFirstRow) {
            row.push(
              vendor.id || "",
              vendor.projectCode || "",
              vendor.programName || "",
              vendor.email || ""
            );
            isFirstRow = false;
          } else {
            row.push("", "", "", "");
          }

          const totalDailyWage = (Number(worker.wage) * Number(worker.numberOfWorkers)) || 0;
          row.push(
            worker.numberOfWorkers || "0",
            worker.task || "",
            worker.wage || "0",
            totalDailyWage.toString(),
            isFirstRow ? "Active" : "",
            isFirstRow ? (vendor.createdAt?.toDate().toLocaleDateString() || "") : ""
          );

          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Create and download the file
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "manpower_list.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const exportRawMaterials = () => {
    let csvContent = "";
    const BOM = "\uFEFF"; // For Excel compatibility
    const headers = [
      "ID",
      "Project Code",
      "Program Name",
      "Email",
      "Material Name",
      "Quantity",
      "Unit",
      "Unit Price",
      "Frequency",
      "Total Cost",
      "Status",
      "Date Registered"
    ].join(",") + "\n";

    csvContent += headers;

    vendors.forEach((vendor) => {
      let isFirstRow = true;
      
      if (vendor.rawMaterials && vendor.rawMaterials.length > 0) {
        vendor.rawMaterials.forEach((material) => {
          const row = [];
          
          // Basic vendor info - only on first row or if it's the only row
          if (isFirstRow) {
            row.push(
              vendor.id || "",
              vendor.projectCode || "",
              vendor.programName || "",
              vendor.email || ""
            );
            isFirstRow = false;
          } else {
            row.push("", "", "", "");
          }

          row.push(
            material.name || "",
            material.quantity || "0",
            material.unit || "",
            material.unitPrice || "0",
            material.frequency || "",
            material.totalCost || "0",
            isFirstRow ? "Active" : "",
            isFirstRow ? (vendor.createdAt?.toDate().toLocaleDateString() || "") : ""
          );

          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Create and download the file
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "raw_materials_list.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const exportToolsEquipment = () => {
    let csvContent = "";
    const BOM = "\uFEFF"; // For Excel compatibility
    const headers = [
      "ID",
      "Project Code",
      "Program Name",
      "Email",
      "Tool/Equipment Name",
      "Quantity",
      "Unit",
      "Unit Price",
      "Life Span",
      "Production Cycle",
      "Total Cost",
      "Depreciation Cost",
      "Status",
      "Date Registered"
    ].join(",") + "\n";

    csvContent += headers;

    vendors.forEach((vendor) => {
      let isFirstRow = true;
      
      if (vendor.tools && vendor.tools.length > 0) {
        vendor.tools.forEach((item) => {
          const row = [];
          
          // Basic vendor info - only on first row or if it's the only row
          if (isFirstRow) {
            row.push(
              vendor.id || "",
              vendor.projectCode || "",
              vendor.programName || "",
              vendor.email || ""
            );
            isFirstRow = false;
          } else {
            row.push("", "", "", "");
          }

          row.push(
            item.name || "",
            item.quantity || "0",
            item.unit || "",
            item.unitPrice || "0",
            item.lifeSpan || "0",
            item.productionCycle || "0",
            item.totalCost || "0",
            item.depreciationCost || "0",
            isFirstRow ? "Active" : "",
            isFirstRow ? (vendor.createdAt?.toDate().toLocaleDateString() || "") : ""
          );

          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Create and download the file
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "tools_equipment_list.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ToastContainer position="top-right" />
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-card">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard" className="flex items-center">
              <img src="./images/SLP.png" alt="Logo" className="h-8 w-8" />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                DSWD SLP-PS
              </span>
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
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getUserInitials(currentUser?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{currentUser?.name || "Admin DSWD"}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.role || "Administrator"}</p>
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
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  DSWD SLP-PS
                </span>
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
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getUserInitials(currentUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{currentUser?.name || "Admin DSWD"}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.role || "Administrator"}</p>
                  </div>
                </div>
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
                    placeholder="Search vendors..."
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
                  <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getUserInitials(currentUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">
                      {currentUser?.name || "Admin DSWD"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl p-1">
                  <DropdownMenuLabel className="px-2 py-1.5">
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
                  <DropdownMenuItem className="rounded-lg cursor-pointer">
                    <Link href="/profile" className="flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg cursor-pointer">
                    <Link href="/settings" className="flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg text-red-500 focus:text-red-500 cursor-pointer">
                    <Link href="/" className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between pt-4">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Vendor Management
                  </h1>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowExportDialog(true)}
                      className="px-4 py-2 h-10 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 rounded-md"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export to Excel
                    </Button>
                    <Button 
                      onClick={handleAddVendor} 
                      className="px-4 py-2 h-10 text-sm font-medium bg-black hover:bg-black/90 rounded-md"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vendor
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Total Vendors Card */}
                  <Card className="bg-gradient-to-br from-[#C5D48A] to-[#A6C060] border-0 relative overflow-hidden h-[220px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#B7CC60]/20 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2 pt-6">
                      <CardTitle className="text-2xl font-medium text-white">
                        Total Vendors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col justify-center h-full pt-4">
                        <div className="text-[52px] font-bold text-white leading-none tracking-tight">{analytics.total}</div>
                        <p className="text-xl text-white/90 mt-3">Registered vendors</p>
                        <div className="absolute bottom-6 left-0 right-0 h-[60px]">
                          <svg className="w-full h-full text-white/10" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <path 
                              d="M0,50 Q100,80 200,50 T400,50"
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="3"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Investment Card */}
                  <Card className="bg-gradient-to-br from-[#96B54A] to-[#496E22] border-0 relative overflow-hidden h-[220px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#5F862C]/20 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2 pt-6">
                      <CardTitle className="text-2xl font-medium text-white">
                        Total Investment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col justify-center h-full pt-4">
                        <div className="text-[52px] font-bold text-white leading-none tracking-tight">
                          ₱{(analytics.totalManpowerCost + analytics.totalMaterialsCost + analytics.totalEquipmentCost).toLocaleString()}
                        </div>
                        <p className="text-xl text-white/90 mt-3">Combined costs</p>
                        <div className="absolute bottom-6 left-0 right-0 h-[60px]">
                          <svg className="w-full h-full text-white/10" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <path 
                              d="M0,50 Q100,80 200,50 T400,50"
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="3"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Program Distribution Chart */}
                <Card className="mb-8 bg-gradient-to-br from-[#1E3B0C] to-[#2C4A1B] border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader className="pb-2 pt-6">
                    <CardTitle className="text-lg font-semibold text-white">Program Distribution</CardTitle>
                    <CardDescription className="text-white/70">Distribution of vendors across different programs</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[300px] relative">
                      <Chart
                        type="bar"
                        data={{
                          labels: Object.keys(analytics.programDistribution || {}),
                          datasets: [
                            {
                              type: 'bar',
                              label: 'Vendors',
                              data: Object.values(analytics.programDistribution || {}),
                              backgroundColor: [
                                'rgba(197, 212, 138, 0.8)', // lightest green
                                'rgba(183, 204, 96, 0.8)',  // light green
                                'rgba(150, 181, 74, 0.8)',  // medium green
                                'rgba(121, 159, 58, 0.8)',  // green
                                'rgba(95, 134, 44, 0.8)',   // dark green
                                'rgba(73, 110, 34, 0.8)',   // darkest green
                              ],
                              borderColor: [
                                'rgb(197, 212, 138)', // lightest green
                                'rgb(183, 204, 96)',  // light green
                                'rgb(150, 181, 74)',  // medium green
                                'rgb(121, 159, 58)',  // green
                                'rgb(95, 134, 44)',   // dark green
                                'rgb(73, 110, 34)',   // darkest green
                              ],
                              borderWidth: 1,
                              borderRadius: 4,
                            },
                            {
                              type: 'line',
                              label: 'Trend',
                              data: Object.values(analytics.programDistribution || {}),
                              borderColor: 'rgba(197, 212, 138, 0.8)', // light green
                              borderWidth: 2,
                              fill: true,
                              backgroundColor: (context) => {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) return null;
                                
                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                gradient.addColorStop(0, 'rgba(197, 212, 138, 0.4)');
                                gradient.addColorStop(0.5, 'rgba(197, 212, 138, 0.1)');
                                gradient.addColorStop(1, 'rgba(197, 212, 138, 0)');
                                return gradient;
                              },
                              tension: 0.4,
                              pointBackgroundColor: 'rgb(197, 212, 138)',
                              pointBorderColor: '#2C4A1B',
                              pointBorderWidth: 2,
                              pointRadius: 4,
                            },
                            {
                              type: 'line',
                              label: 'Trend Overlay',
                              data: Object.values(analytics.programDistribution || {}),
                              borderColor: 'rgba(183, 204, 96, 0.8)', // light green
                              borderWidth: 2,
                              fill: true,
                              backgroundColor: (context) => {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) return null;
                                
                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                gradient.addColorStop(0, 'rgba(183, 204, 96, 0.4)');
                                gradient.addColorStop(0.5, 'rgba(183, 204, 96, 0.1)');
                                gradient.addColorStop(1, 'rgba(183, 204, 96, 0)');
                                return gradient;
                              },
                              tension: 0.4,
                              pointBackgroundColor: 'rgb(183, 204, 96)',
                              pointBorderColor: '#2C4A1B',
                              pointBorderWidth: 2,
                              pointRadius: 4,
                            }
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                              },
                              ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: {
                                  weight: '500'
                                }
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: {
                                  weight: '500'
                                }
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              labels: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                font: {
                                  weight: '500'
                                }
                              }
                            },
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                              backgroundColor: 'rgba(46, 74, 27, 0.9)',
                              titleColor: 'rgba(255, 255, 255, 1)',
                              bodyColor: 'rgba(255, 255, 255, 0.8)',
                              borderColor: 'rgba(197, 212, 138, 0.3)',
                              borderWidth: 1,
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Vendors Table */}
                <Card className="border-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#C5D48A]/10 to-[#A6C060]/10">
                  <CardHeader className="pb-3 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B7CC60]/5 to-transparent"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-[#96B54A] to-[#496E22] bg-clip-text text-transparent">Vendors</CardTitle>
                        <CardDescription className="text-black/70">
                          Manage your suppliers and vendor details
                        </CardDescription>
                      </div>
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-black/70" />
                        <Input
                          type="search"
                          placeholder="Search vendors..."
                          className="pl-8 w-full sm:w-[300px] border-[#96B54A]/20 bg-white/50 focus:border-[#96B54A] focus:ring-[#96B54A]/20 placeholder-black/50"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div
                      className={`grid ${
                        selectedVendor
                          ? "grid-cols-1 lg:grid-cols-2"
                          : "grid-cols-1"
                      } gap-0`}
                    >
                      <div className={`${selectedVendor ? "border-r border-[#96B54A]/10" : ""}`}>
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gradient-to-r from-[#C5D48A]/20 to-[#A6C060]/10 hover:bg-[#96B54A]/5">
                                <TableHead className="w-[100px]">
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={selectedVendors.length === filteredVendors.length}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedVendors(filteredVendors);
                                        } else {
                                          setSelectedVendors([]);
                                        }
                                      }}
                                    />
                                    {selectedVendors.length > 0 && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleMultipleDelete}
                                        disabled={isSubmitting}
                                        className="h-6 px-2"
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete ({selectedVendors.length})
                                      </Button>
                                    )}
                                  </div>
                                </TableHead>
                                <TableHead className="w-[100px] text-black font-semibold">
                                  Project Code
                                </TableHead>
                                <TableHead className="text-black font-semibold">Program Name</TableHead>
                                <TableHead className="text-black font-semibold">Name</TableHead>
                                <TableHead className="text-black font-semibold">Email</TableHead>
                                <TableHead className="text-black font-semibold">Created At</TableHead>
                                <TableHead className="text-right text-black font-semibold">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredVendors.length > 0 ? (
                                filteredVendors.map((vendor) => (
                                  <TableRow
                                    key={vendor.id}
                                    className={`cursor-pointer transition-colors hover:bg-[#96B54A]/5 ${
                                      selectedVendor?.id === vendor.id
                                        ? "bg-[#96B54A]/10"
                                        : ""
                                    }`}
                                    onClick={() => handleViewDetails(vendor)}
                                  >
                                    <TableCell>
                                      <Checkbox
                                        checked={selectedVendors.some(v => v.id === vendor.id)}
                                        onCheckedChange={(checked) => {
                                          handleSelectVendor(vendor, checked);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium text-black">
                                      <div className="flex items-center gap-2">
                                        <span>{vendor.projectCode}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center space-x-2">
                                        <div className="h-10 w-10 rounded-md bg-[#96B54A]/10 flex items-center justify-center">
                                          <Store className="h-5 w-5 text-black/70" />
                                        </div>
                                        <div className="font-medium text-black">
                                          {vendor.programName}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-black/90">{vendor.name || "-"}</TableCell>
                                    <TableCell className="text-black/90">{vendor.email || "-"}</TableCell>
                                    <TableCell className="text-black/90">
                                      {vendor.createdAt
                                        ?.toDate()
                                        .toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger
                                          asChild
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Button variant="ghost" size="icon" className="text-black hover:text-[#96B54A] hover:bg-[#96B54A]/10">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                              Open menu
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-[#96B54A]/20">
                                          <DropdownMenuLabel className="text-black">
                                            Actions
                                          </DropdownMenuLabel>
                                          <DropdownMenuItem
                                            className="text-black focus:text-black focus:bg-[#96B54A]/10"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleViewDetails(vendor);
                                            }}
                                          >
                                            View Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="text-black focus:text-black focus:bg-[#96B54A]/10"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditVendor(vendor);
                                            }}
                                          >
                                            Edit Vendor
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator className="bg-[#96B54A]/10" />
                                          <DropdownMenuItem
                                            className="text-red-500 focus:text-red-500 focus:bg-red-50"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteClick(vendor);
                                            }}
                                          >
                                            Delete Vendor
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
                                    className="text-center py-8 text-black/70"
                                  >
                                    {searchQuery
                                      ? "No vendors found. Try adjusting your search."
                                      : "No vendors added yet. Click 'Add Vendor' to get started."}
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {selectedVendor && (
                        <div className="p-6 overflow-auto max-h-[800px] bg-gradient-to-br from-white to-[#C5D48A]/5">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-black">
                              Vendor Details
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCloseDetails}
                              className="text-black hover:text-[#96B54A] hover:bg-[#96B54A]/10"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Close
                            </Button>
                          </div>

                          <VendorDetailView
                            vendor={selectedVendor}
                            onUpdate={handleDetailUpdate}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Dialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Export Vendors Data</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <Button
                      className="flex items-center justify-start gap-2"
                      variant="outline"
                      onClick={exportToCSV}
                    >
                      <Download className="h-5 w-5" />
                      Export Complete Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Edit Dialog */}
              <Dialog
                open={!!editingVendor}
                onOpenChange={(open) => {
                  if (!open) setEditingVendor(null);
                }}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Vendor</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateVendor}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="projectCode" className="text-right">
                          Project Code
                        </label>
                        <Input
                          id="projectCode"
                          value={editingVendor?.projectCode ?? ""}
                          onChange={(e) =>
                            setEditingVendor({
                              ...editingVendor,
                              projectCode: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="programName" className="text-right">
                          Program Name
                        </label>
                        <Input
                          id="programName"
                          value={editingVendor?.programName ?? ""}
                          onChange={(e) =>
                            setEditingVendor({
                              ...editingVendor,
                              programName: e.target.value.toUpperCase(),
                            })
                          }
                          className="col-span-3 uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                          Name
                        </label>
                        <Input
                          id="name"
                          value={editingVendor?.name ?? ""}
                          onChange={(e) =>
                            setEditingVendor({
                              ...editingVendor,
                              name: e.target.value,
                            })
                          }
                          className="col-span-3"
                          readOnly
                        />
                      </div>  
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="email" className="text-right">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={editingVendor?.email ?? ""}
                          onChange={(e) =>
                            setEditingVendor({
                              ...editingVendor,
                              email: e.target.value,
                            })
                          }
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingVendor(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Add Delete Confirmation Dialog */}
              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Vendor</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>
                      Are you sure you want to delete vendor "
                      {vendorToDelete?.name}"? This action cannot be undone.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleConfirmDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
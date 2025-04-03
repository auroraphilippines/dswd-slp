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
      stats.totalManpowerCost += vendor.workers?.reduce((sum, worker) => sum + (Number(worker.wage) || 0), 0) || 0;
      stats.totalMaterialsCost += vendor.rawMaterials?.reduce((sum, material) => sum + (Number(material.totalCost) || 0), 0) || 0;
      stats.totalEquipmentCost += vendor.toolsAndEquipment?.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0) || 0;
    });

    return stats;
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vendors", href: "/vendors", icon: Store },
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

  const exportToGoogleSheets = () => {
    const headers = [
      "Project Code",
      "Program Name",
      "Name",
      "Email",
      "Created At",
      // Manpower Headers
      "Total Manpower Cost",
      "Number of Workers",
      // Materials Headers
      "Total Materials Cost",
      "Number of Materials",
      // Equipment Headers
      "Total Equipment Cost",
      "Number of Equipment",
      "Total Depreciation Cost",
    ];

    const csvContent = [
      headers,
      ...vendors.map((vendor) => {
        // Calculate totals
        const totalManpowerCost =
          vendor.workers?.reduce(
            (sum, worker) => sum + (Number(worker.wage) || 0),
            0
          ) || 0;
        const totalMaterialsCost =
          vendor.rawMaterials?.reduce(
            (sum, material) => sum + (Number(material.totalCost) || 0),
            0
          ) || 0;
        const totalEquipmentCost =
          vendor.toolsAndEquipment?.reduce(
            (sum, item) => sum + (Number(item.totalCost) || 0),
            0
          ) || 0;
        const totalDepreciationCost =
          vendor.toolsAndEquipment?.reduce(
            (sum, item) => sum + (Number(item.depreciationCost) || 0),
            0
          ) || 0;

        return [
          vendor.projectCode || "",
          vendor.programName || "",
          vendor.name || "",
          vendor.email || "",
          vendor.createdAt?.toDate().toLocaleDateString() || "",
          totalManpowerCost.toFixed(2),
          vendor.workers?.length || 0,
          totalMaterialsCost.toFixed(2),
          vendor.rawMaterials?.length || 0,
          totalEquipmentCost.toFixed(2),
          vendor.toolsAndEquipment?.length || 0,
          totalDepreciationCost.toFixed(2),
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob and URL
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the CSV
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors_data.csv";
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const exportToExcelOnline = () => {
    // Create workbook data with multiple sheets
    let csvContent = "";

    // Main Vendors Sheet
    const mainHeaders = [
      "Project Code",
      "Program Name",
      "Name",
      "Email",
      "Created At",
      "Total Manpower Cost",
      "Total Materials Cost",
      "Total Equipment Cost",
      "Total Depreciation Cost",
    ];

    csvContent += "Vendors Summary\n";
    csvContent += mainHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      const totalManpowerCost =
        vendor.workers?.reduce(
          (sum, worker) => sum + (Number(worker.wage) || 0),
          0
        ) || 0;
      const totalMaterialsCost =
        vendor.rawMaterials?.reduce(
          (sum, material) => sum + (Number(material.totalCost) || 0),
          0
        ) || 0;
      const totalEquipmentCost =
        vendor.toolsAndEquipment?.reduce(
          (sum, item) => sum + (Number(item.totalCost) || 0),
          0
        ) || 0;
      const totalDepreciationCost =
        vendor.toolsAndEquipment?.reduce(
          (sum, item) => sum + (Number(item.depreciationCost) || 0),
          0
        ) || 0;

      const row = [
        vendor.projectCode || "",
        vendor.programName || "",
        vendor.name || "",
        vendor.email || "",
        vendor.createdAt?.toDate().toLocaleDateString() || "",
        totalManpowerCost.toFixed(2),
        totalMaterialsCost.toFixed(2),
        totalEquipmentCost.toFixed(2),
        totalDepreciationCost.toFixed(2),
      ];
      csvContent += row.join(",") + "\n";
    });

    // Add a blank line between sheets
    csvContent += "\n\nManpower Details\n";

    // Manpower Sheet
    const manpowerHeaders = [
      "Project Code",
      "Program Name",
      "Worker Name",
      "Task",
      "Daily Wage",
    ];
    csvContent += manpowerHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      if (vendor.workers && vendor.workers.length > 0) {
        vendor.workers.forEach((worker) => {
          const row = [
            vendor.projectCode || "",
            vendor.programName || "",
            worker.name || "",
            worker.task || "",
            (worker.wage || 0).toFixed(2),
          ];
          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Materials Sheet
    csvContent += "\n\nRaw Materials Details\n";
    const materialsHeaders = [
      "Project Code",
      "Program Name",
      "Material Name",
      "Quantity",
      "Unit",
      "Unit Price",
      "Total Cost",
      "Frequency",
    ];
    csvContent += materialsHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      if (vendor.rawMaterials && vendor.rawMaterials.length > 0) {
        vendor.rawMaterials.forEach((material) => {
          const row = [
            vendor.projectCode || "",
            vendor.programName || "",
            material.name || "",
            material.quantity || "0",
            material.unit || "",
            (material.unitPrice || 0).toFixed(2),
            (material.totalCost || 0).toFixed(2),
            material.frequency || "",
          ];
          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Equipment Sheet
    csvContent += "\n\nTools and Equipment Details\n";
    const equipmentHeaders = [
      "Project Code",
      "Program Name",
      "Item Name",
      "Quantity",
      "Unit",
      "Unit Cost",
      "Life Span (Years)",
      "Production Cycle (Months)",
      "Total Cost",
      "Depreciation Cost",
    ];
    csvContent += equipmentHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      if (vendor.toolsAndEquipment && vendor.toolsAndEquipment.length > 0) {
        vendor.toolsAndEquipment.forEach((item) => {
          const row = [
            vendor.projectCode || "",
            vendor.programName || "",
            item.name || "",
            item.quantity || "0",
            item.unit || "",
            (item.unitCost || 0).toFixed(2),
            item.lifeSpan || "0",
            item.productionCycle || "0",
            (item.totalCost || 0).toFixed(2),
            (item.depreciationCost || 0).toFixed(2),
          ];
          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Create Blob with UTF-8 BOM for Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=UTF-8",
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors_detailed.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const exportVendorToExcel = (vendor) => {
    let csvContent = "";

    // Vendor Basic Information
    csvContent += "Basic Information\n";
    csvContent += "Vendor ID," + (vendor.vendorId || "") + "\n";
    csvContent += "Project Code," + (vendor.projectCode || "") + "\n";
    csvContent += "Program Name," + (vendor.programName || "") + "\n";
    csvContent += "Name," + (vendor.name || "") + "\n";
    csvContent += "Email," + (vendor.email || "") + "\n";
    csvContent +=
      "Registration Date," +
      (vendor.createdAt?.toDate().toLocaleDateString() || "") +
      "\n\n";

    // Manpower Details
    csvContent += "\nManpower Details\n";
    csvContent += "Worker Name,Task,Daily Wage\n";
    if (vendor.workers && vendor.workers.length > 0) {
      vendor.workers.forEach((worker) => {
        csvContent += `${worker.name || ""},${worker.task || ""},${(
          worker.wage || 0
        ).toFixed(2)}\n`;
      });
    }
    const totalManpowerCost =
      vendor.workers?.reduce(
        (sum, worker) => sum + (Number(worker.wage) || 0),
        0
      ) || 0;
    csvContent += `Total Manpower Cost,${totalManpowerCost.toFixed(2)}\n\n`;

    // Raw Materials Details
    csvContent += "\nRaw Materials Details\n";
    csvContent +=
      "Material Name,Quantity,Unit,Unit Price,Total Cost,Frequency\n";
    if (vendor.rawMaterials && vendor.rawMaterials.length > 0) {
      vendor.rawMaterials.forEach((material) => {
        csvContent += `${material.name || ""},${material.quantity || "0"},${
          material.unit || ""
        },${(material.unitPrice || 0).toFixed(2)},${(
          material.totalCost || 0
        ).toFixed(2)},${material.frequency || ""}\n`;
      });
    }
    const totalMaterialsCost =
      vendor.rawMaterials?.reduce(
        (sum, material) => sum + (Number(material.totalCost) || 0),
        0
      ) || 0;
    csvContent += `Total Materials Cost,${totalMaterialsCost.toFixed(2)}\n\n`;

    // Tools and Equipment Details
    csvContent += "\nTools and Equipment Details\n";
    csvContent +=
      "Item Name,Quantity,Unit,Unit Cost,Life Span (Years),Production Cycle (Months),Total Cost,Depreciation Cost\n";
    if (vendor.toolsAndEquipment && vendor.toolsAndEquipment.length > 0) {
      vendor.toolsAndEquipment.forEach((item) => {
        csvContent += `${item.name || ""},${item.quantity || "0"},${
          item.unit || ""
        },${(item.unitCost || 0).toFixed(2)},${item.lifeSpan || "0"},${
          item.productionCycle || "0"
        },${(item.totalCost || 0).toFixed(2)},${(
          item.depreciationCost || 0
        ).toFixed(2)}\n`;
      });
    }
    const totalEquipmentCost =
      vendor.toolsAndEquipment?.reduce(
        (sum, item) => sum + (Number(item.totalCost) || 0),
        0
      ) || 0;
    const totalDepreciationCost =
      vendor.toolsAndEquipment?.reduce(
        (sum, item) => sum + (Number(item.depreciationCost) || 0),
        0
      ) || 0;
    csvContent += `Total Equipment Cost,${totalEquipmentCost.toFixed(2)}\n`;
    csvContent += `Total Depreciation Cost,${totalDepreciationCost.toFixed(
      2
    )}\n\n`;

    // Summary of Costs
    csvContent += "\nTotal Costs Summary\n";
    csvContent += `Total Manpower Cost,${totalManpowerCost.toFixed(2)}\n`;
    csvContent += `Total Materials Cost,${totalMaterialsCost.toFixed(2)}\n`;
    csvContent += `Total Equipment Cost,${totalEquipmentCost.toFixed(2)}\n`;
    csvContent += `Total Depreciation Cost,${totalDepreciationCost.toFixed(
      2
    )}\n`;
    csvContent += `Grand Total,${(
      totalManpowerCost +
      totalMaterialsCost +
      totalEquipmentCost
    ).toFixed(2)}\n`;

    // Create Blob with UTF-8 BOM for Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=UTF-8",
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `vendor_${vendor.vendorId || vendor.id}_details.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
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
          <div className="py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Vendor Management
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowExportDialog(true)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button onClick={handleAddVendor}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vendor
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Total Vendors Card */}
                  <Card className="bg-gradient-to-br from-[#C5D48A] to-[#A6C060] border-0 relative overflow-hidden h-[240px] rounded-3xl">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#B7CC60]/20 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-medium text-white">
                        Total Vendors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col justify-center h-full pt-4">
                        <div className="text-[45px] font-bold text-white leading-none tracking-tight">{analytics.total}</div>
                        <p className="text-xl text-white/90 mt-2">Registered vendors</p>
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
                  <Card className="bg-gradient-to-br from-[#96B54A] to-[#496E22] border-0 relative overflow-hidden h-[240px] rounded-3xl">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#5F862C]/20 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-medium text-white">
                        Total Investment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col justify-center h-full pt-4">
                        <div className="text-[45px] font-bold text-white leading-none tracking-tight">
                          ₱{(analytics.totalManpowerCost + analytics.totalMaterialsCost + analytics.totalEquipmentCost).toLocaleString()}
                        </div>
                        <p className="text-xl text-white/90 mt-2">Combined costs</p>
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
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Program Distribution</CardTitle>
                    <CardDescription>Distribution of vendors across different programs</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                                'rgba(220, 233, 169, 0.8)', // lightest green
                                'rgba(183, 204, 96, 0.8)',  // light green
                                'rgba(150, 181, 74, 0.8)',  // medium green
                                'rgba(121, 159, 58, 0.8)',  // green
                                'rgba(95, 134, 44, 0.8)',   // dark green
                                'rgba(73, 110, 34, 0.8)',   // darkest green
                              ],
                              borderColor: [
                                'rgb(220, 233, 169)', // lightest green
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
                              borderColor: 'rgba(121, 159, 58, 0.8)', // medium green
                              borderWidth: 2,
                              fill: true,
                              backgroundColor: (context) => {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) return null;
                                
                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                gradient.addColorStop(0, 'rgba(121, 159, 58, 0.4)');
                                gradient.addColorStop(0.5, 'rgba(121, 159, 58, 0.1)');
                                gradient.addColorStop(1, 'rgba(121, 159, 58, 0)');
                                return gradient;
                              },
                              tension: 0.4,
                              pointBackgroundColor: 'rgb(121, 159, 58)',
                              pointBorderColor: '#fff',
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
                              pointBorderColor: '#fff',
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
                                color: 'rgba(255, 255, 255, 0.7)',
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              labels: {
                                color: 'rgba(255, 255, 255, 0.7)',
                              }
                            },
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Vendors Table */}
                <Card className="border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[#C5D48A]/10 to-[#A6C060]/10">
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
                                    <TableCell className="font-medium text-black">
                                      <div className="flex items-center gap-2">
                                        <span>{vendor.projectCode}</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-black hover:text-[#96B54A] hover:bg-[#96B54A]/10"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            exportVendorToExcel(vendor);
                                          }}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
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
                      onClick={exportToGoogleSheets}
                    >
                      <Download className="h-5 w-5" />
                      Export as CSV Files
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
                              programName: e.target.value,
                            })
                          }
                          className="col-span-3"
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
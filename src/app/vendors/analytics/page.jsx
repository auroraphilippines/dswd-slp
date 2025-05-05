"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  LayoutDashboard,
  Building2,
  Users,
  FolderOpen,
  Settings,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { subscribeToVendors } from "@/service/vendor";
import LoadingPage from "../../loading/page";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth, db } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define navigation items
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/vendors",
    icon: Building2,
    requiresAccess: 'projects'
  },
  {
    name: "Participants",
    href: "/participants",
    icon: Users,
    requiresAccess: 'participants'
  },
  {
    name: "File Storage",
    href: "/filestorage",
    icon: FolderOpen,
    requiresAccess: 'filestorage'
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  }
];

export default function VendorsAnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState({
    readOnly: false,
    accessProject: true,
    accessParticipant: true,
    accessFileStorage: true
  });
  const [analytics, setAnalytics] = useState({
    total: 0,
    programDistribution: {},
    totalManpowerCost: 0,
    totalMaterialsCost: 0,
    totalEquipmentCost: 0,
    monthlyInvestments: []
  });

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

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserPermissions({
              readOnly: userData.permissions?.readOnly ?? false,
              accessProject: userData.permissions?.accessProject ?? true,
              accessParticipant: userData.permissions?.accessParticipant ?? true,
              accessFileStorage: userData.permissions?.accessFileStorage ?? true
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        toast.error("Error loading user permissions");
      }
    };

    fetchUserPermissions();
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const hasModuleAccess = (moduleName) => {
    if (!moduleName) return true;
    switch (moduleName.toLowerCase()) {
      case 'projects':
        return userPermissions.accessProject;
      case 'participants':
        return true;
      case 'filestorage':
        return true;
      default:
        return true;
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "AD";
    if (name === "Admin DSWD") return "AD";

    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    let unsubscribe = () => {};

    const setupVendorsSubscription = async () => {
      try {
        unsubscribe = subscribeToVendors((fetchedVendors) => {
          // Sort vendors by createdAt date in descending order (newest first)
          const sortedVendors = fetchedVendors.sort((a, b) => 
            b.createdAt?.toDate() - a.createdAt?.toDate()
          );
          
          // Calculate analytics
          const vendorAnalytics = calculateVendorAnalytics(sortedVendors);
          setAnalytics(vendorAnalytics);
          
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up vendors subscription:", error);
        setLoading(false);
      }
    };

    setupVendorsSubscription();

    return () => {
      unsubscribe();
    };
  }, []);

  const calculateVendorAnalytics = (vendors) => {
    const stats = {
      total: vendors.length,
      programDistribution: {},
      totalManpowerCost: 0,
      totalMaterialsCost: 0,
      totalEquipmentCost: 0,
      monthlyInvestments: []
    };

    // Create a map to store monthly totals with proper date handling
    const monthlyTotals = new Map();
    
    // Start from January 2025 and get next 12 months
    const startDate = new Date(2025, 0, 1); // January 2025
    const months = Array.from({length: 12}, (_, i) => {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      return date.toISOString().slice(0, 7); // Format: YYYY-MM
    });

    // Initialize all months with zero
    months.forEach(month => {
      monthlyTotals.set(month, {
        total: 0,
        manpowerCost: 0,
        materialsCost: 0,
        equipmentCost: 0,
        count: 0
      });
    });

    vendors.forEach(vendor => {
      // Program distribution
      stats.programDistribution[vendor.programName] = 
        (stats.programDistribution[vendor.programName] || 0) + 1;

      // Calculate manpower cost with number of workers
      const manpowerCost = vendor.manpower?.reduce((sum, worker) => {
        const wage = Number(worker.wage) || 0;
        const numberOfWorkers = Number(worker.numberOfWorkers) || 0;
        return sum + (wage * numberOfWorkers);
      }, 0) || 0;

      // Calculate materials cost with quantity and unit price
      const materialsCost = vendor.rawMaterials?.reduce((sum, material) => {
        const quantity = Number(material.quantity) || 0;
        const unitPrice = Number(material.unitPrice) || 0;
        return sum + (quantity * unitPrice);
      }, 0) || 0;

      // Calculate equipment cost with quantity and unit price
      const equipmentCost = vendor.tools?.reduce((sum, tool) => {
        const quantity = Number(tool.quantity) || 0;
        const unitPrice = Number(tool.unitPrice) || 0;
        return sum + (quantity * unitPrice);
      }, 0) || 0;

      // Update total costs
      stats.totalManpowerCost += manpowerCost;
      stats.totalMaterialsCost += materialsCost;
      stats.totalEquipmentCost += equipmentCost;

      if (!vendor.createdAt) return;

      const vendorDate = vendor.createdAt.toDate();
      // Adjust vendor date to 2025 if it's in the past
      if (vendorDate < startDate) {
        vendorDate.setFullYear(2025);
      }
      const monthKey = vendorDate.toISOString().slice(0, 7); // Format: YYYY-MM

      // Only process if the vendor is in our target months
      if (monthlyTotals.has(monthKey)) {
        // Update monthly totals
        const monthData = monthlyTotals.get(monthKey);
        monthData.manpowerCost += manpowerCost;
        monthData.materialsCost += materialsCost;
        monthData.equipmentCost += equipmentCost;
        monthData.total += (manpowerCost + materialsCost + equipmentCost);
        monthData.count += 1;
      }
    });

    // Convert monthly totals to sorted array
    stats.monthlyInvestments = Array.from(monthlyTotals.entries())
      .map(([month, data]) => ({
        month: new Date(month),
        ...data
      }))
      .sort((a, b) => a.month - b.month);

    return stats;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ToastContainer position="top-right" />
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-[#0B3D2E]">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-green-900">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <Link href="/dashboard" className="flex items-center">
              <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-green-100">
                <Image
                  src="/images/SLP.png"
                  alt="Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                DSWD SLP-PS
              </span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col px-3">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const hasAccess = hasModuleAccess(item.requiresAccess);
                
                return (
                  <Link
                    key={item.name}
                    href={hasAccess ? item.href : "#"}
                    onClick={(e) => {
                      if (!hasAccess) {
                        e.preventDefault();
                        toast.error(`You don't have access to ${item.name.toLowerCase()}.`);
                      }
                    }}
                    className={`${
                      isActive
                        ? "bg-white/10 text-white"
                        : hasAccess
                        ? "text-white/70 hover:bg-white/10 hover:text-white"
                        : "text-white/50 cursor-not-allowed"
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-white"
                          : hasAccess
                          ? "text-white/70 group-hover:text-white"
                          : "text-white/50"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-white/10 p-4">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {getUserInitials(currentUser?.name)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                  <p className="text-xs text-gray-300">
                    {currentUser?.role}
                  </p>
                </div>
              </div>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
          <div className="absolute top-0 right-0 -mr-12 pt-4">
            <button
              type="button"
              className="flex items-center justify-center h-10 w-10 rounded-full bg-black/10 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-6">
              <Link href="/dashboard" className="flex items-center">
                <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-primary/10">
                  <Image
                    src="/images/SLP.png"
                    alt="Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  DSWD SLP-TIS
                </span>
              </Link>
            </div>
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const hasAccess = hasModuleAccess(item.requiresAccess);
                
                return (
                  <Link
                    key={item.name}
                    href={hasAccess ? item.href : "#"}
                    onClick={(e) => {
                      if (!hasAccess) {
                        e.preventDefault();
                        toast.error(`You don't have access to ${item.name.toLowerCase()}.`);
                      }
                    }}
                    className={`${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : hasAccess
                        ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary-foreground"
                          : hasAccess
                          ? "text-muted-foreground group-hover:text-foreground"
                          : "text-muted-foreground/50"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 p-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getUserInitials(currentUser?.name)}
                  </AvatarFallback>
                </Avatar>
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
                <div className="relative w-full text-muted-foreground focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <Search className="h-5 w-5 ml-3" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
            
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
                      <Users className="mr-2 h-4 w-4" />
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
                      <X className="mr-2 h-4 w-4" />
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Project Analytics</h1>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Vendors
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Total Vendors Card */}
                <Card className="bg-gradient-to-br from-[#C5D48A] to-[#A6C060] border-0 relative overflow-hidden h-[220px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="absolute inset-0 bg-white/5 w-full h-full">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#B7CC60]/20 to-transparent blur-3xl"></div>
                  </div>
                  <CardHeader className="pb-2 pt-6">
                    <CardTitle className="text-2xl font-medium text-white">
                      Total Projects
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

              {/* Monthly Investment Chart */}
              <Card className="mb-8 bg-gradient-to-br from-white to-[#496E22] border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-2xl font-medium text-[#1E3B0C]">Monthly Investments</CardTitle>
                  <CardDescription className="text-[#1E3B0C]/70 text-base">Investment trends over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[400px] relative">
                    <Chart
                      type="line"
                      data={{
                        labels: analytics.monthlyInvestments.map(item => {
                          const date = new Date(item.month);
                          return date.toLocaleDateString('en-US', { 
                            month: 'short',
                            year: 'numeric'
                          });
                        }),
                        datasets: [
                          {
                            label: 'Total Investment',
                            data: analytics.monthlyInvestments.map(item => item.total),
                            borderColor: '#2E8B57',
                            borderWidth: 4,
                            fill: {
                              target: 'origin',
                              above: (context) => {
                                const chart = context.chart;
                                const {ctx, chartArea} = chart;
                                if (!chartArea) return null;
                                
                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                gradient.addColorStop(0, 'rgba(46, 139, 87, 0.5)');
                                gradient.addColorStop(0.5, 'rgba(46, 139, 87, 0.3)');
                                gradient.addColorStop(1, 'rgba(46, 139, 87, 0)');
                                return gradient;
                              }
                            },
                            tension: 0.4,
                            pointRadius: 5,
                            pointBackgroundColor: '#2E8B57',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 3,
                            cubicInterpolationMode: 'monotone'
                          },
                          {
                            label: 'Average Investment',
                            data: analytics.monthlyInvestments.map(item => item.total * 0.75),
                            borderColor: '#3CB371',
                            borderWidth: 4,
                            fill: {
                              target: '-1',
                              above: (context) => {
                                const chart = context.chart;
                                const {ctx, chartArea} = chart;
                                if (!chartArea) return null;
                                
                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                gradient.addColorStop(0, 'rgba(60, 179, 113, 0.4)');
                                gradient.addColorStop(0.5, 'rgba(60, 179, 113, 0.2)');
                                gradient.addColorStop(1, 'rgba(60, 179, 113, 0)');
                                return gradient;
                              }
                            },
                            tension: 0.4,
                            pointRadius: 5,
                            pointBackgroundColor: '#3CB371',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 3,
                            cubicInterpolationMode: 'monotone'
                          },
                          {
                            label: 'Minimum Investment',
                            data: analytics.monthlyInvestments.map(item => item.total * 0.5),
                            borderColor: '#90EE90',
                            borderWidth: 4,
                            fill: {
                              target: '-1',
                              above: (context) => {
                                const chart = context.chart;
                                const {ctx, chartArea} = chart;
                                if (!chartArea) return null;
                                
                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                gradient.addColorStop(0, 'rgba(144, 238, 144, 0.3)');
                                gradient.addColorStop(0.5, 'rgba(144, 238, 144, 0.15)');
                                gradient.addColorStop(1, 'rgba(144, 238, 144, 0)');
                                return gradient;
                              }
                            },
                            tension: 0.4,
                            pointRadius: 5,
                            pointBackgroundColor: '#90EE90',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 3,
                            cubicInterpolationMode: 'monotone'
                          }
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                          padding: {
                            left: 20,
                            right: 20,
                            top: 40,
                            bottom: 20
                          }
                        },
                        scales: {
                          y: {
                            min: 0,
                            max: 600000,
                            position: 'left',
                            display: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)',
                              drawBorder: false,
                              lineWidth: 1
                            },
                            border: {
                              display: true,
                              color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                              stepSize: 200000,
                              callback: (value) => `₱${value/1000}k`,
                              font: {
                                size: 12,
                                family: "'Inter', sans-serif"
                              },
                              color: 'rgba(0, 0, 0, 0.7)',
                              padding: 10
                            }
                          },
                          x: {
                            display: true,
                            offset: true,
                            grid: {
                              display: true,
                              color: 'rgba(0, 0, 0, 0.05)',
                              drawBorder: false
                            },
                            border: {
                              display: true,
                              color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                              font: {
                                size: 12,
                                family: "'Inter', sans-serif"
                              },
                              color: 'rgba(0, 0, 0, 0.7)',
                              padding: 10,
                              maxRotation: 0,
                              autoSkip: false
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top',
                            align: 'start',
                            labels: {
                              boxWidth: 12,
                              boxHeight: 12,
                              padding: 20,
                              font: {
                                size: 12,
                                family: "'Inter', sans-serif"
                              },
                              color: 'rgba(0, 0, 0, 0.7)',
                              usePointStyle: true,
                              pointStyle: 'circle'
                            }
                          },
                          tooltip: {
                            enabled: true,
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1E3B0C',
                            bodyColor: '#2C4A1B',
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                            borderWidth: 1,
                            padding: 8,
                            boxPadding: 4,
                            callbacks: {
                              label: function(context) {
                                return `${context.dataset.label}: ₱${context.raw.toLocaleString()}`;
                              }
                            }
                          }
                        },
                        interaction: {
                          intersect: false,
                          mode: 'index'
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
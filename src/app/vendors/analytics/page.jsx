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
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ThemeToggle } from "@/components/theme-toggle";
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

    // Create a map to store monthly totals
    const monthlyTotals = new Map();
    
    vendors.forEach(vendor => {
      // Program distribution
      stats.programDistribution[vendor.programName] = 
        (stats.programDistribution[vendor.programName] || 0) + 1;

      // Calculate costs
      const manpowerCost = vendor.manpower?.reduce((sum, worker) => sum + (Number(worker.wage) || 0), 0) || 0;
      const materialsCost = vendor.rawMaterials?.reduce((sum, material) => sum + (Number(material.totalCost) || 0), 0) || 0;
      const equipmentCost = vendor.tools?.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0) || 0;
      
      stats.totalManpowerCost += manpowerCost;
      stats.totalMaterialsCost += materialsCost;
      stats.totalEquipmentCost += equipmentCost;

      // Calculate monthly totals
      if (vendor.createdAt) {
        const date = vendor.createdAt.toDate();
        const monthKey = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
        const monthTotal = monthlyTotals.get(monthKey) || 0;
        monthlyTotals.set(monthKey, monthTotal + manpowerCost + materialsCost + equipmentCost);
      }
    });

    // Convert monthly totals to sorted array
    stats.monthlyInvestments = Array.from(monthlyTotals.entries())
      .map(([date, total]) => ({
        month: new Date(date),
        total: total
      }))
      .sort((a, b) => a.month - b.month)
      .slice(-6); // Get last 6 months

    return stats;
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
              <img src="/images/SLP.png" alt="Logo" className="h-8 w-8" />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                DSWD SLP-PS
              </span>
            </Link>
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
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
                        ? "bg-primary/10 text-primary"
                        : hasAccess
                        ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary"
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
      <div className={`${isMobileMenuOpen ? "fixed inset-0 z-40 flex" : "hidden"} md:hidden`}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={() => setIsMobileMenuOpen(false)} />
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
                <img src="/images/SLP.png" alt="Logo" className="h-8 w-8" />
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  DSWD SLP-PS
                </span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
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
                        ? "bg-primary/10 text-primary"
                        : hasAccess
                        ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary"
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
                <div className="relative w-full text-muted-foreground focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <Search className="h-5 w-5 ml-3" aria-hidden="true" />
                  </div>
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
                <h1 className="text-2xl font-bold">Vendor Analytics</h1>
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

              {/* Monthly Investment Chart */}
              <Card className="mb-8 bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-2xl font-medium text-gray-900">Monthly Investments</CardTitle>
                  <CardDescription className="text-gray-500 text-base">Investment trends over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[400px] relative">
                    <Chart
                      type="line"
                      data={{
                        labels: [
                          'Mar 1', 'Mar 8', 'Mar 15', 'Mar 22', 'Mar 29',
                          'Apr 1'
                        ],
                        datasets: [
                          {
                            label: 'Upper Range',
                            data: [5571.43, 4642.86, 3714.29, 2785.71, 1857.14, 928.57],
                            borderColor: 'rgba(124, 58, 237, 1)',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            pointRadius: 0,
                          },
                          {
                            label: 'Lower Range',
                            data: [4000, 3500, 2800, 2100, 1400, 700],
                            borderColor: 'rgba(124, 58, 237, 0.3)',
                            borderWidth: 2,
                            fill: '-1',
                            tension: 0.4,
                            pointRadius: 0,
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                          }
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                          padding: {
                            left: 10,
                            right: 10
                          }
                        },
                        scales: {
                          y: {
                            position: 'left',
                            grid: {
                              color: 'rgba(0, 0, 0, 0.03)',
                              drawBorder: false,
                            },
                            ticks: {
                              callback: (value) => `₱${value.toFixed(2)}`,
                              stepSize: 928.57,
                              font: {
                                size: 11,
                                family: "'Inter', sans-serif",
                                color: 'rgb(102, 102, 102)'
                              },
                              padding: 10,
                            },
                            min: 0,
                            max: 6500,
                            border: {
                              display: false
                            }
                          },
                          x: {
                            offset: true,
                            grid: {
                              display: false,
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                size: 11,
                                family: "'Inter', sans-serif",
                                color: 'rgb(102, 102, 102)'
                              },
                              padding: 10,
                              maxRotation: 0
                            },
                            border: {
                              display: false
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            enabled: true,
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: 'rgba(0, 0, 0, 0.8)',
                            bodyColor: 'rgba(0, 0, 0, 0.7)',
                            borderColor: 'rgba(124, 58, 237, 0.2)',
                            borderWidth: 1,
                            padding: 8,
                            boxPadding: 4,
                            callbacks: {
                              label: function(context) {
                                return `₱${context.parsed.y.toFixed(2)}`;
                              }
                            }
                          }
                        },
                        interaction: {
                          intersect: false,
                          mode: 'index'
                        },
                        elements: {
                          line: {
                            tension: 0.4
                          }
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
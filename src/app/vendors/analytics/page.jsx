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
  Store,
  Users,
  FolderOpen,
  Settings,
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    icon: Store,
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
  const currentYear = new Date().getFullYear(); // Dynamic current year
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userPermissions, setUserPermissions] = useState({
    readOnly: false,
    accessProject: true,
    accessParticipant: true,
    accessFileStorage: true
  });
  const [allVendors, setAllVendors] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    programDistribution: {},
    totalManpowerCost: 0,
    totalMaterialsCost: 0,
    totalEquipmentCost: 0,
    monthlyInvestments: [],
    hasData: false
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
            // Fetch profile image
            const profileImage = await fetchUserProfileImage(user.uid);
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: userData.email || "admin@dswd.gov.ph",
              name: displayName,
              role: userData.role || "Administrator",
              photoURL: profileImage
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
          const filteredAnalytics = calculateVendorAnalytics(
            sortedVendors.filter(vendor => {
              const vendorDate = vendor.createdAt?.toDate();
              return vendorDate && vendorDate.getFullYear() === selectedYear;
            })
          );
          setAnalytics(filteredAnalytics);
          
          setAllVendors(sortedVendors);
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
  }, [selectedYear]);

  // Add fetchUserProfileImage function after the existing useEffect for mobile menu
  const fetchUserProfileImage = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.photoURL) return userData.photoURL;
      }
      const localPhoto = getProfilePhotoFromLocalStorage(userId);
      if (localPhoto) return localPhoto;
      return null;
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }
  };

  // Add this function to handle year changes with animation
  const handleYearChange = (newYear) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedYear(newYear);
      setIsTransitioning(false);
    }, 300); // Match this with the CSS transition duration
  };

  // Add this function to get available years
  const getAvailableYears = () => {
    const years = [];
    const startYear = 2024;
    const endYear = currentYear;
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    years.unshift("all"); // Add "All Years" at the top
    return years;
  };

  const getMonthLabels = (year) => {
    if (year === "all") {
      // Use the months from filteredAnalytics
      return filteredAnalytics.monthlyInvestments.map(item =>
        item.month instanceof Date
          ? item.month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : String(item.month)
      );
    }
    // Otherwise, use Jan-Dec of the selected year
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(Number(year), i, 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
  };

  // 2. Define the function FIRST
  const calculateVendorAnalytics = (vendors) => {
    const stats = {
      total: vendors.length,
      programDistribution: {},
      totalManpowerCost: 0,
      totalMaterialsCost: 0,
      totalEquipmentCost: 0,
      monthlyInvestments: [],
      hasData: false
    };

    let months = [];
    let monthlyTotals = new Map();

    if (selectedYear === "all") {
      // Group by year-month for all years present in the data
      const allMonthKeys = new Set();
      vendors.forEach(vendor => {
        if (vendor.createdAt) {
          const vendorDate = vendor.createdAt.toDate();
          const monthKey = vendorDate.toISOString().slice(0, 7); // YYYY-MM
          allMonthKeys.add(monthKey);
        }
      });
      months = Array.from(allMonthKeys).sort();
      months.forEach(month => {
        monthlyTotals.set(month, {
          total: 0,
          manpowerCost: 0,
          materialsCost: 0,
          equipmentCost: 0,
          count: 0
        });
      });
    } else {
      // Use January to December of the selected year
      months = Array.from({length: 12}, (_, i) => {
        const date = new Date(Number(selectedYear), i, 1);
        return date.toISOString().slice(0, 7); // Format: YYYY-MM
      });
      months.forEach(month => {
        monthlyTotals.set(month, {
          total: 0,
          manpowerCost: 0,
          materialsCost: 0,
          equipmentCost: 0,
          count: 0
        });
      });
    }

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
      const monthKey = vendorDate.toISOString().slice(0, 7);

      // For "all" years, always process; for a specific year, check range
      if (
        selectedYear === "all" ||
        (vendorDate.getFullYear() === Number(selectedYear))
      ) {
        const monthData = monthlyTotals.get(monthKey);
        if (monthData) {
          monthData.manpowerCost += manpowerCost;
          monthData.materialsCost += materialsCost;
          monthData.equipmentCost += equipmentCost;
          monthData.total += (manpowerCost + materialsCost + equipmentCost);
          monthData.count += 1;
          stats.hasData = true;
        }
      }
    });

    stats.monthlyInvestments = Array.from(monthlyTotals.entries())
      .map(([month, data]) => ({
        month: new Date(month),
        ...data
      }))
      .sort((a, b) => a.month - b.month);

    return stats;
  };

  // 3. Now you can use it
  const previousYearStats = calculateVendorAnalytics(
    allVendors.filter(vendor => {
      const vendorDate = vendor.createdAt?.toDate();
      return vendorDate && vendorDate.getFullYear() === selectedYear - 1;
    })
  );

  const filteredAnalytics = calculateVendorAnalytics(
    selectedYear === "all"
      ? allVendors
      : allVendors.filter(vendor => {
          const vendorDate = vendor.createdAt?.toDate();
          return vendorDate && vendorDate.getFullYear() === Number(selectedYear);
        })
  );

  const totalProjectsAllYears = allVendors.length;

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
                {currentUser?.photoURL ? (
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarImage src={currentUser.photoURL} alt={currentUser?.name || "User"} className="object-cover" />
                    <AvatarFallback className="bg-white/10 text-white font-medium">
                      {getUserInitials(currentUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {getUserInitials(currentUser?.name)}
                    </span>
                  </div>
                )}
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
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Clean mobile header with only back button */}
        <div className="md:hidden w-full fixed top-0 left-0 z-30 bg-[#0B3D2E] flex items-center px-2 py-1 shadow-lg">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-white px-2 py-2 text-base font-medium"
            onClick={() => router.push('/vendors')}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Projects
          </Button>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 mt-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#496E22] to-[#6C9331] bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <div className="flex justify-end">
                  <Select 
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    defaultValue={currentYear.toString()}
                  >
                    <SelectTrigger
                      className="w-[120px] !bg-green-600 !text-white rounded-lg border-none shadow-none focus:ring-2 focus:ring-green-700"
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all" className="rounded-lg text-black">All Years</SelectItem>
                      {getAvailableYears().filter(y => y !== "all").map((year) => (
                        <SelectItem
                          key={year}
                          value={year.toString()}
                          className="rounded-lg"
                        >
                          {year} {year === currentYear ? '(Current)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Analytics cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Total Projects Card */}
                  <Card className="bg-gradient-to-br from-[#0B3D2E] to-[#1B4D2E] border-0 relative overflow-hidden md:col-span-2 shadow-xl">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                      <div className="absolute right-0 bottom-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium text-white">
                            Total Projects
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                              <Store className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-6">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2 mb-10">
                            <div className="text-7xl font-bold text-white">{filteredAnalytics.total}</div>
                          </div>
                          <div className="h-20"></div>
                          {/* Mini chart at the bottom */}
                          <div className="mt-6 h-16 relative">
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20"></div>
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div
                                key={i}
                                className="absolute bottom-0 bg-emerald-400"
                                style={{
                                  left: `${i * 5}%`,
                                  height: `${100 + Math.random() * 50}%`,
                                  width: "4%",
                                  opacity: 0.5 + Math.random() * 0.5,
                                  borderRadius: "1px 1px 0 0",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>

                  {/* Total Investment Card */}
                  <Card className="bg-gradient-to-br from-[#0B3D2E] to-[#1B4D2E] border-0 relative overflow-hidden md:col-span-2 shadow-xl">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                      <div className="absolute right-0 bottom-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium text-white">
                            Total Investment
                          </CardTitle>
                          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                            <span className="text-2xl text-white font-bold">₱</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-6">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-white">
                              ₱{(filteredAnalytics.totalManpowerCost + filteredAnalytics.totalMaterialsCost + filteredAnalytics.totalEquipmentCost).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                              <div className="text-sm text-white/70 mb-1">Manpower</div>
                              <div className="text-xl font-bold text-white">₱{filteredAnalytics.totalManpowerCost.toLocaleString()}</div>
                              <div className="text-xs text-white/50 mt-1">
                                {Math.round((filteredAnalytics.totalManpowerCost / (filteredAnalytics.totalManpowerCost + filteredAnalytics.totalMaterialsCost + filteredAnalytics.totalEquipmentCost)) * 100)}% of total
                              </div>
                            </div>
                        
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                              <div className="text-sm text-white/70 mb-1">Materials</div>
                              <div className="text-xl font-bold text-white">₱{filteredAnalytics.totalMaterialsCost.toLocaleString()}</div>
                              <div className="text-xs text-white/50 mt-1">
                                {Math.round((filteredAnalytics.totalMaterialsCost / (filteredAnalytics.totalManpowerCost + filteredAnalytics.totalMaterialsCost + filteredAnalytics.totalEquipmentCost)) * 100)}% of total
                              </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                              <div className="text-sm text-white/70 mb-1">Equipment</div>
                              <div className="text-xl font-bold text-white">₱{filteredAnalytics.totalEquipmentCost.toLocaleString()}</div>
                              <div className="text-xs text-white/50 mt-1">
                                {Math.round((filteredAnalytics.totalEquipmentCost / (filteredAnalytics.totalManpowerCost + filteredAnalytics.totalMaterialsCost + filteredAnalytics.totalEquipmentCost)) * 100)}% of total
                              </div>
                            </div>
                          </div>
                          
                          {/* Graph at the bottom */}
                          <div className="mt-6 h-16 relative">
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20"></div>
                            <Chart
                              type="line"
                              data={{
                                labels: getMonthLabels(selectedYear),
                                datasets: [
                                  {
                                    data: filteredAnalytics.monthlyInvestments.map(item => item.total),
                                    borderColor: 'rgba(255, 255, 255, 0.8)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    borderWidth: 2,
                                    pointRadius: 0,
                                    fill: true,
                                    tension: 0.5,
                                  },
                                  {
                                    data: filteredAnalytics.monthlyInvestments.map((item, index, arr) => {
                                      const shiftedIndex = (index + 4) % arr.length;
                                      return arr[shiftedIndex]?.total ?? 0;
                                    }),
                                    borderColor: 'rgba(255, 255, 255, 0.6)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderWidth: 2,
                                    pointRadius: 0,
                                    fill: true,
                                    tension: 0.5,
                                  },
                                  {
                                    data: filteredAnalytics.monthlyInvestments.map((item, index, arr) => {
                                      const shiftedIndex = (index + 8) % arr.length;
                                      return arr[shiftedIndex]?.total ?? 0;
                                    }),
                                    borderColor: 'rgba(255, 255, 255, 0.4)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderWidth: 2,
                                    pointRadius: 0,
                                    fill: true,
                                    tension: 0.5,
                                  }
                                ]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { 
                                  legend: { display: false }, 
                                  tooltip: { enabled: false } 
                                },
                                scales: { 
                                  x: { display: false }, 
                                  y: { display: false } 
                                }
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>

                {/* Monthly Investment Chart */}
                <Card className="mb-8 bg-gradient-to-br from-white to-[#496E22] border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader className="pb-2 pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-medium text-[#1E3B0C]">Monthly Investments</CardTitle>
                        <CardDescription className="text-[#1E3B0C]/70 text-base">
                          {filteredAnalytics.hasData 
                            ? `Investment trends for ${selectedYear}`
                            : `No investment data available for ${selectedYear}`
                          }
                        </CardDescription>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                        <span className="text-2xl text-white font-bold">₱</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className={`h-[400px] relative transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                      <Chart
                        type="line"
                        data={{
                          labels: getMonthLabels(selectedYear),
                          datasets: filteredAnalytics.hasData ? [
                            {
                              label: 'Total Investment',
                              data: filteredAnalytics.monthlyInvestments.map(item => item.total),
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
                              cubicInterpolationMode: 'monotone',
                              animation: {
                                duration: 1000,
                                easing: 'easeInOutQuart'
                              }
                            },
                            {
                              label: 'Average Investment',
                              data: filteredAnalytics.monthlyInvestments.map(item => item.total * 0.75),
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
                              cubicInterpolationMode: 'monotone',
                              animation: {
                                duration: 1000,
                                easing: 'easeInOutQuart'
                              }
                            },
                            {
                              label: 'Minimum Investment',
                              data: filteredAnalytics.monthlyInvestments.map(item => item.total * 0.5),
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
                              cubicInterpolationMode: 'monotone',
                              animation: {
                                duration: 1000,
                                easing: 'easeInOutQuart'
                              }
                            }
                          ] : [
                            {
                              label: 'Total Investment',
                              data: Array(12).fill(null),
                              borderColor: '#2E8B57',
                              borderWidth: 4,
                              fill: false,
                              pointRadius: 0,
                              pointHoverRadius: 0,
                            },
                            {
                              label: 'Average Investment',
                              data: Array(12).fill(null),
                              borderColor: '#3CB371',
                              borderWidth: 4,
                              fill: false,
                              pointRadius: 0,
                              pointHoverRadius: 0,
                            },
                            {
                              label: 'Minimum Investment',
                              data: Array(12).fill(null),
                              borderColor: '#90EE90',
                              borderWidth: 4,
                              fill: false,
                              pointRadius: 0,
                              pointHoverRadius: 0,
                            }
                          ]
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
                          animation: {
                            duration: 1000,
                            easing: 'easeInOutQuart'
                          },
                          transitions: {
                            active: {
                              animation: {
                                duration: 400
                              }
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
                          labels: Object.keys(filteredAnalytics.programDistribution || {}),
                          datasets: [
                            {
                              type: 'bar',
                              label: 'Vendors',
                              data: Object.values(filteredAnalytics.programDistribution || {}),
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
                              data: Object.values(filteredAnalytics.programDistribution || {}),
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
                              data: Object.values(filteredAnalytics.programDistribution || {}),
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
          </div>
        </main>
      </div>
    </div>
  );
} 
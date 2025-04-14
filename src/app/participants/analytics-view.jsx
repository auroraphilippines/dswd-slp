"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  Users,
  Menu,
  X,
  Bell,
  Search,
  Building2,
  Store,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth, db } from "@/service/firebase";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { User } from "lucide-react";

export function AnalyticsView() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    pending: 0,
    graduated: 0,
    programDistribution: {},
    addressDistribution: {},
    monthlyRegistrations: {},
    genderDistribution: {
      male: 0,
      female: 0,
      lgbtqia: 0
    },
    sectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0
    },
    previousSectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0
    },
    typeDistribution: {
      "Poor - Exiting 4Ps": 0,
      "Poor - 4Ps": 0,
      "Poor - Listahanan": 0,
      "Non-Poor": 0,
      "No Match": 0,
      "SLP Means Test": 0,
      "N/A": 0
    }
  });
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    const fetchAnalytics = async () => {
      try {
        const participantsRef = collection(db, "participants");
        const q = query(participantsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const participantsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id,
          dateRegistered: doc.data().dateRegistered?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
        }));
        
        setAnalytics(calculateAnalytics(participantsData));
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getUserInitials = (name) => {
    if (!name) return "AD";
    if (name === "Admin DSWD") return "AD";

    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
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
                  <p className="text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.role}
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
        {/* ... Mobile menu content (same as in page.jsx) ... */}
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
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-[#496E22] hover:text-[#6C9331] hover:bg-[#96B54A]/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Participants
              </Button>
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
                        {currentUser?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#496E22] to-[#6C9331] bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>

                {/* Analytics cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Total Participants Card */}
                  <Card className="bg-gradient-to-br from-[#C5D48A] to-[#A6C060] border-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#B7CC60]/30 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">
                        Total Participants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="text-4xl font-bold text-white/90">{analytics.total}</div>
                        <p className="text-sm text-white/90 mt-1">Registered members</p>
                        <div className="mt-2 h-[40px] relative">
                          <svg className="w-full h-full text-black/20">
                            <path 
                              d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              className="animate-wave"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Participants Card */}
                  <Card className="bg-gradient-to-br from-[#96B54A] to-[#79A03A] border-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#8CAF42]/30 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">
                        Active Participants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="text-4xl font-bold text-white/90">{analytics.active}</div>
                        <p className="text-sm text-white/90 mt-1">Current active</p>
                        <div className="mt-2 h-[40px]">
                          <svg className="w-full h-full text-black/20" viewBox="0 0 100 40">
                            <path 
                              d="M0,20 C20,10 40,30 60,20 S80,10 100,20" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              className="animate-wave"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Inactive Participants Card */}
                  <Card className="bg-gradient-to-br from-[#5F862C] to-[#496E22] border-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#557926]/30 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">
                        Inactive Participants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="text-4xl font-bold text-white">{analytics.inactive || 0}</div>
                        <p className="text-sm text-white/70 mt-1">Total inactive</p>
                        <div className="mt-2 h-[40px]">
                          <svg className="w-full h-full text-white/20">
                            <path 
                              d="M0,20 Q25,5 50,20 T100,20" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              className="animate-wave"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pending Participants Card */}
                  <Card className="bg-gradient-to-br from-[#79A03A] to-[#5F862C] border-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#6C9331]/30 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">
                        Pending Participants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="text-4xl font-bold text-white">{analytics.pending}</div>
                        <p className="text-sm text-white/70 mt-1">Awaiting verification</p>
                        <div className="mt-2 h-[40px]">
                          <svg className="w-full h-full text-white/20">
                            <path 
                              d="M0,20 L20,10 L40,25 L60,15 L80,25 L100,10" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              className="animate-wave"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gender Distribution Card */}
                  <Card className="md:col-span-2 bg-gradient-to-br from-[#0A2815] to-[#1B4D2E] border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-white/90">
                        Gender Distribution
                      </CardTitle>
                      <CardDescription className="text-[#90BE6D]/80">
                        Distribution of participants by gender
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-4">
                        {/* Donut Chart */}
                        <div className="col-span-2">
                          <div className="relative w-[200px] h-[200px] mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                              {(() => {
                                const total = analytics.genderDistribution.male + 
                                            analytics.genderDistribution.female + 
                                            analytics.genderDistribution.lgbtqia;
                                let currentAngle = 0;
                                const colors = {
                                  male: '#37794C',
                                  female: '#5BA45F',
                                  lgbtqia: '#90BE6D'
                                };
                                const radius = 70;
                                const circumference = 2 * Math.PI * radius;
                                const center = 100;
                                const strokeWidth = 24;

                                return Object.entries(analytics.genderDistribution).map(([gender, count]) => {
                                  const percentage = (count / total) || 0;
                                  const strokeDasharray = `${percentage * circumference} ${circumference}`;
                                  const rotation = currentAngle * 360;
                                  currentAngle += percentage;

                                  return (
                                    <circle
                                      key={gender}
                                      cx={center}
                                      cy={center}
                                      r={radius}
                                      fill="none"
                                      stroke={colors[gender]}
                                      strokeWidth={strokeWidth}
                                      strokeDasharray={strokeDasharray}
                                      strokeDashoffset="0"
                                      className="opacity-90 hover:opacity-100 transition-opacity"
                                      style={{
                                        transform: `rotate(${rotation}deg)`,
                                        transformOrigin: 'center',
                                      }}
                                    />
                                  );
                                });
                              })()}
                            </svg>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold text-white">
                                {analytics.total}
                              </span>
                              <span className="text-sm text-[#90BE6D]/80">Total</span>
                            </div>
                          </div>
                        </div>

                        {/* Statistics */}
                        <div className="col-span-3 space-y-6 pt-4">
                          {/* Male Stats */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#37794C]"></div>
                                <span className="text-sm font-medium text-white/90">Male</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-[#90BE6D]/80">
                                  {analytics.genderDistribution.male} participants
                                </span>
                                <span className="text-sm font-semibold text-white">
                                  {((analytics.genderDistribution.male / analytics.total) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="h-2 bg-[#37794C]/20 rounded-full">
                              <div 
                                className="h-full bg-[#37794C] rounded-full transition-all duration-500"
                                style={{ width: `${(analytics.genderDistribution.male / analytics.total) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Female Stats */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#5BA45F]"></div>
                                <span className="text-sm font-medium text-white/90">Female</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-[#90BE6D]/80">
                                  {analytics.genderDistribution.female} participants
                                </span>
                                <span className="text-sm font-semibold text-white">
                                  {((analytics.genderDistribution.female / analytics.total) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="h-2 bg-[#5BA45F]/20 rounded-full">
                              <div 
                                className="h-full bg-[#5BA45F] rounded-full transition-all duration-500"
                                style={{ width: `${(analytics.genderDistribution.female / analytics.total) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* LGBTQIA+ Stats */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#90BE6D]"></div>
                                <span className="text-sm font-medium text-white/90">LGBTQIA+</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-[#90BE6D]/80">
                                  {analytics.genderDistribution.lgbtqia} participants
                                </span>
                                <span className="text-sm font-semibold text-white">
                                  {((analytics.genderDistribution.lgbtqia / analytics.total) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="h-2 bg-[#90BE6D]/20 rounded-full">
                              <div 
                                className="h-full bg-[#90BE6D] rounded-full transition-all duration-500"
                                style={{ width: `${(analytics.genderDistribution.lgbtqia / analytics.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Locations Card */}
                  <Card className="md:col-span-2 bg-gradient-to-br from-[#A6C060] to-[#8CAF42] border-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 w-full h-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#96B54A]/30 to-transparent blur-3xl"></div>
                    </div>
                    <CardHeader className="pb-2 relative">
                      <CardTitle className="text-sm font-medium text-white/90">
                        Top Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-3">
                        {Object.entries(analytics.addressDistribution)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([address, count], index) => (
                            <div key={address} className="flex flex-col group">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  <span className="w-5 text-xs text-white/70">#{index + 1}</span>
                                  <span className="text-sm text-white/90">{address}</span>
                                </div>
                                <span className="text-sm font-medium text-white bg-white/10 px-2 py-0.5 rounded-full">
                                  {count}
                                </span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-white/40 to-black/40 rounded-full transition-all duration-500 group-hover:from-white/50 group-hover:to-white/30"
                                  style={{ width: `${(count / analytics.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Registrations Card */}
                  <Card className="md:col-span-4 bg-gradient-to-br from-[#0A2815] to-[#1B4D2E] border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-semibold text-white">
                        Monthly Registrations
                      </CardTitle>
                      <CardDescription className="text-[#90BE6D] text-sm font-medium">
                        Registration trends over the past year
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          {(() => {
                            const maxValue = Math.max(...Object.values(analytics.monthlyRegistrations));
                            // Round up to next multiple of 4 to get nice intervals
                            const roundedMax = Math.ceil(maxValue / 4) * 4;
                            const interval = roundedMax / 4;
                            return [4, 3, 2, 1, 0].map((multiplier) => {
                              const value = Math.round(interval * multiplier);
                              return (
                                <div
                                  key={multiplier}
                                  className="w-full h-px bg-[#90BE6D]/20"
                                  style={{
                                    top: `${((4 - multiplier) * 25)}%`
                                  }}
                                >
                                  <span className="absolute -left-6 -translate-y-1/2 text-sm font-medium text-[#90BE6D]">
                                    {isNaN(value) ? '0' : value}
                                  </span>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* Month labels row */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-2">
                          {Object.entries(analytics.monthlyRegistrations).map(([month, _]) => {
                            const [monthNum, year] = month.split('/');
                            const date = new Date(year, monthNum - 1);
                            const monthName = date.toLocaleString('default', { month: 'short' });
                            return (
                              <div key={month} className="flex-1 text-center">
                                <span className="text-base font-semibold text-white">
                                  {monthName}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Bars */}
                        <div className="absolute inset-0 flex items-end justify-between px-2 pb-8">
                          {Object.entries(analytics.monthlyRegistrations).map(([month, count], index) => {
                            const maxValue = Math.max(...Object.values(analytics.monthlyRegistrations));
                            const roundedMax = Math.ceil(maxValue / 4) * 4;
                            const height = `${(count / roundedMax) * 100}%`;
                            
                            return (
                              <div key={month} className="relative group flex-1 mx-1" style={{ height: 'calc(100% - 30px)' }}>
                                {/* Bar Background - Subtle Glow */}
                                <div
                                  className="w-full absolute bottom-0 rounded-t-lg blur-sm"
                                  style={{
                                    height,
                                    background: 'linear-gradient(to top, #90BE6D30, transparent)',
                                    transform: 'translateY(4px)'
                                  }}
                                />

                                {/* Main Bar */}
                                <div
                                  className="w-full absolute bottom-0 rounded-t-lg transition-all duration-300 group-hover:scale-105 origin-bottom"
                                  style={{
                                    height,
                                    background: `linear-gradient(to top, 
                                      ${index % 2 === 0 ? '#90BE6D' : '#79A03A'}, 
                                      ${index % 2 === 0 ? '#79A03A' : '#5F862C'}
                                    )`,
                                    boxShadow: '0 -4px 6px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  {/* Value on top of bar */}
                                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-white text-sm font-bold bg-[#90BE6D] px-3 py-1 rounded-full min-w-[40px] text-center shadow-lg">
                                    {count}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Bottom Line */}
                        <div className="absolute bottom-8 w-full h-[2px] bg-gradient-to-r from-[#90BE6D]/30 via-[#90BE6D]/50 to-[#90BE6D]/30"></div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Participant Type Distribution Card */}
                  <Card className="md:col-span-4 bg-gradient-to-br from-[#0A2815] to-[#1B4D2E] border-0 rounded-3xl overflow-hidden p-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-white/90">
                        Participant Type Distribution
                      </CardTitle>
                      <CardDescription className="text-[#90BE6D]/80">
                        Distribution of participants across different types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Pie Chart */}
                        <div className="relative">
                          <svg width="500" height="400" viewBox="-250 -200 500 400">
                            {/* Bottom shadow ellipse */}
                            <ellipse
                              cx="0"
                              cy="120"
                              rx="200"
                              ry="20"
                              fill="#0A2815"
                              opacity="0.2"
                              filter="blur(4px)"
                              transform="rotate(-5)"
                            />

                            {/* Main chart group with increased slant */}
                            <g transform="translate(0, -25) scale(1, 0.6) rotate(-25)">
                              {/* Side walls for 3D effect */}
                              {(() => {
                                const data = Object.entries(analytics.typeDistribution)
                                  .map(([type, value]) => ({
                                    type,
                                    value: value || 0
                                  }))
                                  .sort((a, b) => b.value - a.value);

                                const total = data.reduce((sum, item) => sum + item.value, 0);
                                const typeColors = {
                                  "SLP Means Test": "#8CAF42",
                                  "Poor - Exiting 4Ps": "#90BE6D", 
                                  "No Match": "#37794C",
                                  "Poor - 4Ps": "#6C9331",
                                  "Poor - Listahanan": "#496E22",
                                  "Non-Poor": "#5BA45F",
                                  "N/A": "#A6C060"
                                };

                                let currentAngle = -Math.PI / 2;
                                return data.map(({ type, value }) => {
                                  const percentage = total > 0 ? (value / total) * 100 : 0;
                                  const angle = (percentage / 100) * Math.PI * 2;
                                  const radius = 200;
                                  const depth = 65; // Slightly increased depth for better perspective

                                  const startAngle = currentAngle;
                                  const endAngle = currentAngle + angle;
                                  const startX = Math.cos(startAngle) * radius;
                                  const startY = Math.sin(startAngle) * radius;
                                  const endX = Math.cos(endAngle) * radius;
                                  const endY = Math.sin(endAngle) * radius;

                                  const color = typeColors[type];
                                  const darkerColor = adjustColor(color, -25); // Darker sides for better depth perception

                                  const path = [
                                    `M ${startX} ${startY}`,
                                    `L ${startX} ${startY + depth}`,
                                    `A ${radius} ${radius} 0 ${angle > Math.PI ? 1 : 0} 1 ${endX} ${endY + depth}`,
                                    `L ${endX} ${endY}`,
                                    `A ${radius} ${radius} 0 ${angle > Math.PI ? 1 : 0} 0 ${startX} ${startY}`,
                                  ].join(' ');

                                  const element = (
                                    <path
                                      key={`side-${type}`}
                                      d={path}
                                      fill={darkerColor}
                                      opacity="0.75"
                                    />
                                  );

                                  currentAngle += angle;
                                  return element;
                                });
                              })()}

                              {/* Top face of pie */}
                              {(() => {
                                const data = Object.entries(analytics.typeDistribution)
                                  .map(([type, value]) => ({
                                    type,
                                    value: value || 0
                                  }))
                                  .sort((a, b) => b.value - a.value);

                                const total = data.reduce((sum, item) => sum + item.value, 0);
                                const typeColors = {
                                  "SLP Means Test": "#8CAF42",
                                  "Poor - Exiting 4Ps": "#90BE6D",
                                  "No Match": "#37794C",
                                  "Poor - 4Ps": "#6C9331",
                                  "Poor - Listahanan": "#496E22",
                                  "Non-Poor": "#5BA45F",
                                  "N/A": "#A6C060"
                                };

                                let currentAngle = -Math.PI / 2; // Start from top
                                return data.map(({ type, value }) => {
                                  const percentage = total > 0 ? (value / total) * 100 : 0;
                                  const angle = (percentage / 100) * Math.PI * 2;
                                  const radius = 200;

                                  const startX = Math.cos(currentAngle) * radius;
                                  const startY = Math.sin(currentAngle) * radius;
                                  const endX = Math.cos(currentAngle + angle) * radius;
                                  const endY = Math.sin(currentAngle + angle) * radius;

                                  const labelAngle = currentAngle + (angle / 2);
                                  const labelRadius = radius * 0.6;
                                  const labelX = Math.cos(labelAngle) * labelRadius;
                                  const labelY = Math.sin(labelAngle) * labelRadius;

                                  const largeArcFlag = angle > Math.PI ? 1 : 0;
                                  const pathData = [
                                    `M 0 0`,
                                    `L ${startX} ${startY}`,
                                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                    'Z'
                                  ].join(' ');

                                  const element = (
                                    <g key={type}>
                                      <path
                                        d={pathData}
                                        fill={typeColors[type]}
                                        className="transition-all duration-300 hover:opacity-95"
                                      >
                                        <title>{`${type}: ${percentage.toFixed(1)}%`}</title>
                                      </path>
                                      {percentage > 5 && (
                                        <text
                                          x={labelX}
                                          y={labelY}
                                          textAnchor="middle"
                                          dominantBaseline="middle"
                                          fill="#FFFFFF"
                                          fontSize="24"
                                          fontWeight="500"
                                          className="pointer-events-none"
                                        >
                                          {percentage.toFixed(1)}%
                                        </text>
                                      )}
                                    </g>
                                  );

                                  currentAngle += angle;
                                  return element;
                                });
                              })()}
                            </g>
                          </svg>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col justify-center space-y-3">
                          {Object.entries(analytics.typeDistribution)
                            .map(([type, value]) => ({
                              type,
                              value: value || 0,
                              percentage: analytics.total > 0 
                                ? ((value || 0) / analytics.total) * 100 
                                : 0
                            }))
                            .sort((a, b) => b.value - a.value) // Sort by value descending
                            .map(({ type, value, percentage }) => {
                              const typeColors = {
                                "Poor - Exiting 4Ps": "#90BE6D",
                                "Poor - 4Ps": "#6C9331",
                                "Poor - Listahanan": "#496E22",
                                "Non-Poor": "#5BA45F",
                                "No Match": "#37794C",
                                "SLP Means Test": "#8CAF42",
                                "N/A": "#A6C060"
                              };

                              return (
                                <div key={type} className="flex items-center space-x-3">
                                  <div 
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: typeColors[type] }}
                                  />
                                  <span className="text-[#90BE6D] text-sm whitespace-nowrap">
                                    {type}
                                  </span>
                                  <span className="text-white/90 text-sm">
                                    ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sector Distribution Card */}
                  <Card className="md:col-span-4 bg-gradient-to-br from-[#0A2815] to-[#1B4D2E] border-0 rounded-3xl overflow-hidden p-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-white/90">
                        Sector Distribution
                      </CardTitle>
                      <CardDescription className="text-[#90BE6D]/80">
                        Distribution and trends across different sectors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] relative">
                        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
                          {/* Background grid */}
                          <g className="grid-lines">
                            {Array.from({ length: 6 }, (_, i) => (
                              <line
                                key={`grid-${i}`}
                                x1="40"
                                y1={350 - (i * 60)}
                                x2="760"
                                y2={350 - (i * 60)}
                                stroke="#37794C"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                className="opacity-20"
                              />
                            ))}
                          </g>

                          {/* Add Gradients Definition */}
                          <defs>
                            <linearGradient id="barGradientEven" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#90BE6D" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#79A03A" stopOpacity="0.6" />
                            </linearGradient>
                            <linearGradient id="barGradientOdd" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#79A03A" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#5F862C" stopOpacity="0.6" />
                            </linearGradient>
                          </defs>

                          {/* Background Bars */}
                          {Object.entries(analytics.sectorDistribution)
                            .map(([sector, count], index, array) => {
                              const width = 720;
                              const height = 400;
                              const gap = width / (Math.max(array.length - 1, 1));
                              const maxCount = Math.max(1, 
                                ...Object.values(analytics.sectorDistribution),
                                ...Object.values(analytics.previousSectorDistribution || {})
                              );
                              const x = 40 + (index * gap);
                              const barWidth = 40;
                              const barHeight = count ? ((count / maxCount) * (height - 120)) : 0;
                              
                              return (
                                <g key={`bar-group-${sector}`}>
                                  {/* Bar Shadow */}
                                  <rect
                                    x={x - barWidth/2}
                                    y={350 - barHeight + 4}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="#0A2815"
                                    opacity="0.3"
                                    rx="4"
                                    filter="blur(4px)"
                                  />
                                  {/* Main Bar */}
                                  <rect
                                    key={`bar-${sector}`}
                                    x={x - barWidth/2}
                                    y={350 - barHeight}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={`url(#barGradient${index % 2 === 0 ? 'Even' : 'Odd'})`}
                                    rx="4"
                                    className="transition-all duration-500 hover:opacity-90"
                                  />
                                </g>
                              );
                            })}

                          {/* Primary Line (Current Month) */}
                          <path
                            d={(() => {
                              const sectors = Object.entries(analytics.sectorDistribution);
                              if (sectors.length === 0) return '';
                              
                              const width = 720;
                              const height = 400;
                              const gap = width / (Math.max(sectors.length - 1, 1));
                              const maxCount = Math.max(1,
                                ...Object.values(analytics.sectorDistribution),
                                ...Object.values(analytics.previousSectorDistribution || {})
                              );
                              
                              return sectors.map(([sector, count], index) => {
                                const x = 40 + (index * gap);
                                const y = 350 - (((count || 0) / maxCount) * (height - 120));
                                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                              }).join(' ');
                            })()}
                            fill="none"
                            stroke="#90BE6D"
                            strokeWidth="3"
                            className="transition-all duration-500"
                          />

                          {/* Secondary Line (Previous Month) */}
                          <path
                            d={(() => {
                              const sectors = Object.entries(analytics.previousSectorDistribution || {});
                              if (sectors.length === 0) return '';
                              
                              const width = 720;
                              const height = 400;
                              const gap = width / (Math.max(sectors.length - 1, 1));
                              const maxCount = Math.max(1,
                                ...Object.values(analytics.sectorDistribution),
                                ...Object.values(analytics.previousSectorDistribution || {})
                              );
                              
                              return sectors.map(([sector, count], index) => {
                                const x = 40 + (index * gap);
                                const y = 350 - (((count || 0) / maxCount) * (height - 120));
                                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                              }).join(' ');
                            })()}
                            fill="none"
                            stroke="#5BA45F"
                            strokeWidth="3"
                            className="transition-all duration-500"
                          />

                          {/* Data Points and Labels - Current Line */}
                          {Object.entries(analytics.sectorDistribution)
                            .map(([sector, count], index, array) => {
                              const width = 720;
                              const height = 400;
                              const gap = width / (Math.max(array.length - 1, 1));
                              const maxCount = Math.max(1,
                                ...Object.values(analytics.sectorDistribution),
                                ...Object.values(analytics.previousSectorDistribution || {})
                              );
                              const x = 40 + (index * gap);
                              const y = 350 - (((count || 0) / maxCount) * (height - 120));
                              
                              return (
                                <g key={`point-current-${sector}`}>
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill="#0A2815"
                                    stroke="#90BE6D"
                                    strokeWidth="3"
                                    className="transition-all duration-500"
                                  />
                                  <text
                                    x={x}
                                    y={y - 15}
                                    textAnchor="middle"
                                    fill="#90BE6D"
                                    fontSize="14"
                                    fontWeight="600"
                                    className="transition-all duration-500"
                                  >
                                    {count || 0}
                                  </text>
                                </g>
                              );
                            })}

                          {/* Data Points and Labels - Previous Line */}
                          {Object.entries(analytics.previousSectorDistribution || {})
                            .map(([sector, count], index, array) => {
                              const width = 720;
                              const height = 400;
                              const gap = width / (Math.max(array.length - 1, 1));
                              const maxCount = Math.max(1,
                                ...Object.values(analytics.sectorDistribution),
                                ...Object.values(analytics.previousSectorDistribution || {})
                              );
                              const x = 40 + (index * gap);
                              const y = 350 - (((count || 0) / maxCount) * (height - 120));
                              
                              return (
                                <g key={`point-previous-${sector}`}>
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill="#0A2815"
                                    stroke="#5BA45F"
                                    strokeWidth="3"
                                    className="transition-all duration-500"
                                  />
                                  <text
                                    x={x}
                                    y={y + 25}
                                    textAnchor="middle"
                                    fill="#5BA45F"
                                    fontSize="14"
                                    fontWeight="600"
                                    className="transition-all duration-500"
                                  >
                                    {count || 0}
                                  </text>
                                </g>
                              );
                            })}

                          {/* Grid Lines */}
                          <g className="grid-lines">
                            {Array.from({ length: 6 }, (_, i) => (
                              <line
                                key={`grid-${i}`}
                                x1="40"
                                y1={350 - (i * 60)}
                                x2="760"
                                y2={350 - (i * 60)}
                                stroke="#90BE6D"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                className="opacity-10"
                              />
                            ))}
                          </g>

                          {/* X-Axis Line */}
                          <line
                            x1="40"
                            y1="350"
                            x2="760"
                            y2="350"
                            stroke="#90BE6D"
                            strokeWidth="2"
                            opacity="0.3"
                          />

                          {/* X-Axis Labels */}
                          {Object.entries(analytics.sectorDistribution)
                            .map(([sector, count], index, array) => {
                              const width = 720;
                              const gap = width / (Math.max(array.length - 1, 1));
                              const x = 40 + (index * gap);
                              
                              const formatSectorLabel = (sector) => {
                                const sectorMap = {
                                  "Indigenous People (IP)": ["Indigenous", "(IP)"],
                                  "Senior Citizen": ["Senior", "Citizen"],
                                  "Solo Parent": ["Solo", "Parent"],
                                  "Internally Displaced Person (IDP)": ["Displaced", "(IDP)"],
                                  "Overseas Filipino Worker (OFW)": ["OFW", ""],
                                  "Homeless Individual": ["Homeless", "Individual"]
                                };
                                
                                return sectorMap[sector] || [sector, ""];
                              };

                              const [line1, line2] = formatSectorLabel(sector);
                              
                              return (
                                <g key={`x-label-${sector}`}>
                                  <text
                                    x={x}
                                    y={375}
                                    textAnchor="middle"
                                    fill="#90BE6D"
                                    fontSize="11"
                                    fontWeight="500"
                                    className="transition-all duration-500 opacity-80"
                                  >
                                    {line1}
                                  </text>
                                  {line2 && (
                                    <text
                                      x={x}
                                      y={390}
                                      textAnchor="middle"
                                      fill="#90BE6D"
                                      fontSize="11"
                                      fontWeight="500"
                                      className="transition-all duration-500 opacity-80"
                                    >
                                      {line2}
                                    </text>
                                  )}
                                </g>
                              );
                            })}
                        </svg>

                        {/* Legend */}
                        <div className="flex items-center justify-center space-x-8 mt-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-[#90BE6D] mr-2"></div>
                            <span className="text-sm font-medium text-[#90BE6D]/80">Current Month</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-[#5BA45F] mr-2"></div>
                            <span className="text-sm font-medium text-[#90BE6D]/80">Previous Month</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function calculateAnalytics(participants) {
  // Define time periods
  const now = new Date();
  const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
  const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Start of previous month

  const stats = {
    total: participants.length,
    active: 0,
    pending: 0,
    graduated: 0,
    programDistribution: {},
    addressDistribution: {},
    monthlyRegistrations: {},
    genderDistribution: {
      male: 0,
      female: 0,
      lgbtqia: 0
    },
    sectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0
    },
    previousSectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0
    },
    typeDistribution: {
      "Poor - Exiting 4Ps": 0,
      "Poor - 4Ps": 0,
      "Poor - Listahanan": 0,
      "Non-Poor": 0,
      "No Match": 0,
      "SLP Means Test": 0,
      "N/A": 0
    },
    inactive: participants.filter(p => p.status === "Inactive").length,
  };

  // Initialize months in the specific order: April to March
  const monthOrder = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Create ordered monthly registrations
  const orderedRegistrations = {};
  monthOrder.forEach(month => {
    const year = month <= 3 ? currentYear + 1 : currentYear;
    const monthYear = `${month}/${year}`;
    orderedRegistrations[monthYear] = 0;
  });

  participants.forEach(participant => {
    const participantDate = new Date(participant.dateRegistered);
    
    // Determine which period this participant belongs to
    const isCurrentPeriod = participantDate >= currentPeriodStart;
    const isPreviousPeriod = participantDate >= previousPeriodStart && participantDate < currentPeriodStart;

    if (participant.status === "Active") stats.active++;
    else if (participant.status === "Pending") stats.pending++;
    else if (participant.status === "Graduated") stats.graduated++;

    if (participant.gender?.toLowerCase() === 'male') stats.genderDistribution.male++;
    else if (participant.gender?.toLowerCase() === 'female') stats.genderDistribution.female++;
    else if (participant.gender?.toLowerCase() === 'lgbtqia+') stats.genderDistribution.lgbtqia++;

    // Count sector distribution based on actual periods
    if (participant.sector) {
      if (isCurrentPeriod) {
        stats.sectorDistribution[participant.sector] = 
          (stats.sectorDistribution[participant.sector] || 0) + 1;
      } else if (isPreviousPeriod) {
        stats.previousSectorDistribution[participant.sector] = 
          (stats.previousSectorDistribution[participant.sector] || 0) + 1;
      }
    }

    stats.programDistribution[participant.project] = 
      (stats.programDistribution[participant.project] || 0) + 1;

    stats.addressDistribution[participant.address] = 
      (stats.addressDistribution[participant.address] || 0) + 1;

    // Count type distribution
    if (participant.participantType) {
      // Normalize the type string to handle case variations and whitespace
      const normalizedType = participant.participantType.trim();
      console.log('Processing participant type:', normalizedType); // Debug log
      
      // Check for 4Ps variations
      if (normalizedType.toLowerCase().includes('4ps') || 
          normalizedType.toLowerCase().includes('4p') || 
          normalizedType.toLowerCase().includes('4-p')) {
        
        if (normalizedType.toLowerCase().includes('exit')) {
          stats.typeDistribution["Poor - Exiting 4Ps"]++;
          console.log('Matched: Poor - Exiting 4Ps');
        } else {
          stats.typeDistribution["Poor - 4Ps"]++;
          console.log('Matched: Poor - 4Ps');
        }
      }
      // Check for Listahanan
      else if (normalizedType.toLowerCase().includes('listahanan')) {
        stats.typeDistribution["Poor - Listahanan"]++;
        console.log('Matched: Poor - Listahanan');
      }
      // Check for Non-Poor
      else if (normalizedType.toLowerCase().includes('non-poor')) {
        stats.typeDistribution["Non-Poor"]++;
        console.log('Matched: Non-Poor');
      }
      // Check for No Match
      else if (normalizedType.toLowerCase().includes('no match')) {
        stats.typeDistribution["No Match"]++;
        console.log('Matched: No Match');
      }
      // Check for SLP Means Test - Exact match with database value
      else if (normalizedType === 'SLP Means Test') {
        stats.typeDistribution["SLP Means Test"]++;
        console.log('Matched: SLP Means Test');
      }
      // If none of the above, count as N/A
      else {
        stats.typeDistribution["N/A"]++;
        console.log('No match found, counted as N/A. Type was:', normalizedType);
      }
    } else {
      stats.typeDistribution["N/A"]++;
      console.log('No type provided, counted as N/A');
    }

    // Log the current state of typeDistribution after each participant
    console.log('Current type distribution:', JSON.stringify(stats.typeDistribution, null, 2));

    try {
      const monthYear = `${participantDate.getMonth() + 1}/${participantDate.getFullYear()}`;
      if (orderedRegistrations.hasOwnProperty(monthYear)) {
        orderedRegistrations[monthYear]++;
      }
    } catch (error) {
      console.error("Error processing date:", error);
    }
  });

  stats.monthlyRegistrations = orderedRegistrations;
  return stats;
}

function adjustColor(color, amount) {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

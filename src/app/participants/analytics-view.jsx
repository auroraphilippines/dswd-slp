"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Settings, Users, Menu, FolderOpen, Store, ArrowLeft, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { auth, db } from "@/service/firebase"
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore"
import { User } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { RadarChart, PolarAngleAxis, PolarGrid, Radar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Sector, Label, Cell } from "recharts"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResponsiveContainer } from "recharts"
import Image from "next/image"
import { X } from "lucide-react"

export function AnalyticsView() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
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
      lgbtqia: 0,
    },
    sectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0,
      "N/A": 0,
    },
    previousSectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0,
    },
    typeDistribution: {
      "Poor - Exiting 4Ps": 0,
      "Poor - 4Ps": 0,
      "Poor - Listahanan": 0,
      "Non-Poor": 0,
      "No Match": 0,
      "SLP Means Test": 0,
      "N/A": 0,
    },
  })
  const pathname = usePathname()
  const router = useRouter()

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Add fetchUserProfileImage function after the existing useEffect for mobile menu
  const fetchUserProfileImage = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.photoURL) return userData.photoURL
      }
      const localPhoto = getProfilePhotoFromLocalStorage(userId)
      if (localPhoto) return localPhoto
      return null
    } catch (error) {
      console.error("Error fetching profile image:", error)
      return null
    }
  }

  // Update the fetchUserData useEffect to fetch and set the profile image
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const rawName = userData.name || ""
            const displayName = rawName === "255" ? "Admin DSWD" : rawName
            // Fetch profile image
            const profileImage = await fetchUserProfileImage(user.uid)
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: userData.email || "admin@dswd.gov.ph",
              name: displayName,
              role: userData.role || "Administrator",
              photoURL: profileImage,
            })
          }
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const participantsRef = collection(db, "participants")
        const q = query(participantsRef, orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        const participantsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
          dateRegistered: doc.data().dateRegistered?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
        }))

        setAnalytics(calculateAnalytics(participantsData))
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const getUserInitials = (name) => {
    if (!name) return "AD"
    if (name === "Admin DSWD") return "AD"

    const words = name.split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "File Storage", href: "/programs", icon: FolderOpen },
    { name: "Settings", href: "./settings", icon: Settings },
  ]

  // Get all unique sector keys, in a fixed order
  const allSectors = [
    "Indigenous People (IP)",
    "Senior Citizen",
    "Solo Parent",
    "Internally Displaced Person (IDP)",
    "Overseas Filipino Worker (OFW)",
    "Homeless Individual",
    "N/A"
  ]

  // Get top 6 locations (or however many you want)
  const topLocations = Object.entries(analytics.addressDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([location, count]) => ({
      location,
      value: count,
    }))

  const chartData = topLocations // [{ location: "Baler", value: 12 }, ...]
  const chartConfig = {
    value: {
      label: "Participants",
      color: "#90BE6D",
    },
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-white"
                          : "text-white/70 group-hover:text-white"
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
                    <AvatarImage 
                      src={currentUser.photoURL} 
                      alt={currentUser?.name || "User"}
                      className="object-cover" 
                    />
                    <AvatarFallback className="bg-white/10 text-white">
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
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0B3D2E]">
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
                <span className="ml-3 text-xl font-bold text-white">
                  DSWD SLP-PS
                </span>
              </Link>
            </div>
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-white"
                          : "text-white/70 group-hover:text-white"
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
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center">
                {currentUser?.photoURL ? (
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarImage 
                      src={currentUser.photoURL} 
                      alt={currentUser?.name || "User"}
                      className="object-cover" 
                    />
                    <AvatarFallback className="bg-white/10 text-white font-medium">
                      {getUserInitials(currentUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarFallback className="bg-white/10 text-white font-medium">
                      {getUserInitials(currentUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.name || "Admin DSWD"}
                  </p>
                  <p className="text-xs text-gray-300">
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

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-3 rounded-full"
                  >
                    <span className="sr-only">Open user menu</span>
                    {currentUser?.photoURL ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.photoURL || "/placeholder.svg"} alt={currentUser?.name || "User"} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(currentUser?.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {getUserInitials(currentUser?.name)}
                        </span>
                      </div>
                    )}
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
                            Total Participants
                          </CardTitle>
                          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-6">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-white">{analytics.total}</div>
                        
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                              <div className="text-sm text-white/70 mb-1">Active</div>
                              <div className="text-xl font-bold text-white">{analytics.active}</div>
                              <div className="text-xs text-white/50 mt-1">{Math.round((analytics.active / analytics.total) * 100)}% of total</div>
                            </div>
                      
                               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                              <div className="text-sm text-white/70 mb-1">Inactive</div>
                              <div className="text-xl font-bold text-white">{analytics.inactive || 0}</div>
                              <div className="text-xs text-white/50 mt-1">{Math.round(((analytics.inactive || 0) / analytics.total) * 100)}% of total</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                              <div className="text-sm text-white/70 mb-1">Pending</div>
                              <div className="text-xl font-bold text-white">{analytics.pending}</div>
                              <div className="text-xs text-white/50 mt-1">{Math.round((analytics.pending / analytics.total) * 100)}% of total</div>
                            </div>
                                                  
                          </div>
                          
                          {/* Mini chart at the bottom */}
                          <div className="mt-6 h-16 relative">
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20"></div>
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div
                                key={i}
                                className="absolute bottom-0 bg-emerald-400"
                                style={{
                                  left: `${i * 5}%`,
                                  height: `${15 + Math.random() * 50}%`,
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


                  {/* Top Locations Card */}
                  <div className="md:col-span-2 min-h-[320px]">
                    <TopLocationRadarChart topLocations={topLocations} />
                  </div>

                  {/* Participant Type Distribution Card */}
                  <Card className="md:col-span-2 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] border-0 rounded-3xl overflow-hidden p-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-[#1B4D2E]">
                        Participant Type Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center w-full">
                        {/* Pie Chart only, legend removed */}
                        <div className="relative w-full flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="-250 -200 500 400" className="max-w-[400px] md:max-w-[600px] w-full h-auto mx-auto">
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
                                  "Poor - Exiting 4Ps": "#90BE6D",
                                  "Poor - 4Ps": "#6C9331",
                                  "Poor - Listahanan": "#496E22",
                                  "Non-Poor": "#5BA45F",
                                  "No Match": "#37794C",
                                  "SLP Means Test": "#8CAF42",
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
                                        <title>{`${type}: ${value} (${percentage.toFixed(1)}%)`}</title>
                                      </path>
                                      {value > 0 && (
                                        <g>
                                          <text
                                            x={labelX}
                                            y={labelY - 18}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="#FFFFFF"
                                            fontSize="14"
                                            fontWeight="600"
                                            className="pointer-events-none"
                                          >
                                            {type}
                                          </text>
                                          <text
                                            x={labelX}
                                            y={labelY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="#FFFFFF"
                                            fontSize="22"
                                            fontWeight="700"
                                            className="pointer-events-none"
                                          >
                                            {value}
                                          </text>
                                          <text
                                            x={labelX}
                                            y={labelY + 18}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="#FFFFFF"
                                            fontSize="14"
                                            fontWeight="500"
                                            className="pointer-events-none"
                                          >
                                            {percentage.toFixed(1)}%
                                          </text>
                                        </g>
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gender Distribution Card */}
                  <div className="md:col-span-2">
                    <GenderDistributionPieChart genderDistribution={analytics.genderDistribution} />
                  </div>

                  {/* Monthly Registrations Card */}
                  <MonthlyRegistrationsAreaChart participants={analytics._rawParticipants || []} className="md:col-span-4 w-full" />

                  {/* Sector Distribution Card */}
                  <Card className="md:col-span-4 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] border-0 rounded-3xl overflow-hidden p-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-[#1B4D2E]">
                        Sector Distribution
                      </CardTitle>
                      <CardDescription className="text-[#496E22]/80">
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
                          {allSectors.map((sector, index, array) => {
                            const width = 720;
                            const height = 400;
                            const gap = width / (Math.max(array.length - 1, 1));
                            const maxCount = Math.max(1, 
                              ...Object.values(analytics.sectorDistribution),
                              ...Object.values(analytics.previousSectorDistribution || {})
                            );
                            const x = 40 + (index * gap);
                            const barWidth = 40;
                            const currentCount = analytics.sectorDistribution[sector] || 0;
                            const previousCount = (analytics.previousSectorDistribution || {})[sector] || 0;
                            const barHeight = currentCount ? ((currentCount / maxCount) * (height - 120)) : 0;
                            
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
                              const width = 720;
                              const height = 400;
                              const gap = width / (Math.max(allSectors.length - 1, 1));
                              const maxCount = Math.max(
                                1,
                                ...Object.values(analytics.sectorDistribution),
                                ...Object.values(analytics.previousSectorDistribution || {})
                              );
                              return allSectors.map((sector, index) => {
                                const currentCount = analytics.sectorDistribution[sector] || 0;
                                const x = 40 + (index * gap);
                                const y = 350 - (((currentCount || 0) / maxCount) * (height - 120));
                                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                              }).join(' ');
                            })()}
                            fill="none"
                            stroke="#90BE6D"
                            strokeWidth="3"
                            className="transition-all duration-500"
                          />

                          {/* Data Points and Labels - Current Line */}
                          {allSectors.map((sector, index, array) => {
                            const width = 720;
                            const height = 400;
                            const gap = width / (Math.max(array.length - 1, 1));
                            const maxCount = Math.max(1,
                              ...Object.values(analytics.sectorDistribution),
                              ...Object.values(analytics.previousSectorDistribution || {})
                            );
                            const x = 40 + (index * gap);
                            const currentCount = analytics.sectorDistribution[sector] || 0;
                            const previousCount = (analytics.previousSectorDistribution || {})[sector] || 0;
                            const y = 350 - (((currentCount || 0) / maxCount) * (height - 120));
                            
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
                                  fill="#000"
                                  fontSize="14"
                                  fontWeight="600"
                                  className="transition-all duration-500"
                                >
                                  {currentCount || 0}
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
                          {allSectors.map((sector, index, array) => {
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
                                "Homeless Individual": ["Homeless", "Individual"],
                                "N/A": ["N/A", ""]
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
                                  fill="#000"
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
                                    fill="#000"
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
  )
}

function calculateAnalytics(participants) {
  // Define time periods
  const now = new Date()
  const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1) // Start of current month
  const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1) // Start of previous month

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
      lgbtqia: 0,
    },
    sectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0,
      "N/A": 0,
    },
    previousSectorDistribution: {
      "Indigenous People (IP)": 0,
      "Senior Citizen": 0,
      "Solo Parent": 0,
      "Internally Displaced Person (IDP)": 0,
      "Overseas Filipino Worker (OFW)": 0,
      "Homeless Individual": 0,
      "N/A": 0,
    },
    typeDistribution: {
      "Poor - Exiting 4Ps": 0,
      "Poor - 4Ps": 0,
      "Poor - Listahanan": 0,
      "Non-Poor": 0,
      "No Match": 0,
      "SLP Means Test": 0,
      "N/A": 0,
    },
    inactive: participants.filter((p) => p.status === "Inactive").length,
  }

  // Initialize months in the specific order: April to March
  const monthOrder = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]
  const today = new Date()
  const currentYear = today.getFullYear()

  // Create ordered monthly registrations
  const orderedRegistrations = {}
  monthOrder.forEach((month) => {
    const year = month <= 3 ? currentYear + 1 : currentYear
    const monthYear = `${month}/${year}`
    orderedRegistrations[monthYear] = 0
  })

  participants.forEach((participant) => {
    const participantDate = new Date(participant.dateRegistered)

    // Determine which period this participant belongs to
    const isCurrentPeriod = participantDate >= currentPeriodStart
    const isPreviousPeriod = participantDate >= previousPeriodStart && participantDate < currentPeriodStart

    if (participant.status === "Active") stats.active++
    else if (participant.status === "Pending") stats.pending++
    else if (participant.status === "Graduated") stats.graduated++

    if (participant.gender?.toLowerCase() === "male") stats.genderDistribution.male++
    else if (participant.gender?.toLowerCase() === "female") stats.genderDistribution.female++
    else if (participant.gender?.toLowerCase() === "lgbtqia+") stats.genderDistribution.lgbtqia++

    // Count sector distribution based on actual periods
    if (participant.sector) {
      if (isCurrentPeriod) {
        stats.sectorDistribution[participant.sector] = (stats.sectorDistribution[participant.sector] || 0) + 1
      } else if (isPreviousPeriod) {
        stats.previousSectorDistribution[participant.sector] =
          (stats.previousSectorDistribution[participant.sector] || 0) + 1
      }
    }

    stats.programDistribution[participant.project] = (stats.programDistribution[participant.project] || 0) + 1

    stats.addressDistribution[participant.address] = (stats.addressDistribution[participant.address] || 0) + 1

    // Count type distribution
    if (participant.participantType) {
      // Normalize the type string to handle case variations and whitespace
      const normalizedType = participant.participantType.trim()
      console.log("Processing participant type:", normalizedType) // Debug log

      // Check for 4Ps variations
      if (
        normalizedType.toLowerCase().includes("4ps") ||
        normalizedType.toLowerCase().includes("4p") ||
        normalizedType.toLowerCase().includes("4-p")
      ) {
        if (normalizedType.toLowerCase().includes("exit")) {
          stats.typeDistribution["Poor - Exiting 4Ps"]++
          console.log("Matched: Poor - Exiting 4Ps")
        } else {
          stats.typeDistribution["Poor - 4Ps"]++
          console.log("Matched: Poor - 4Ps")
        }
      }
      // Check for Listahanan
      else if (normalizedType.toLowerCase().includes("listahanan")) {
        stats.typeDistribution["Poor - Listahanan"]++
        console.log("Matched: Poor - Listahanan")
      }
      // Check for Non-Poor
      else if (normalizedType.toLowerCase().includes("non-poor")) {
        stats.typeDistribution["Non-Poor"]++
        console.log("Matched: Non-Poor")
      }
      // Check for No Match
      else if (normalizedType.toLowerCase().includes("no match")) {
        stats.typeDistribution["No Match"]++
        console.log("Matched: No Match")
      }
      // Check for SLP Means Test - Exact match with database value
      else if (normalizedType === "SLP Means Test") {
        stats.typeDistribution["SLP Means Test"]++
        console.log("Matched: SLP Means Test")
      }
      // If none of the above, count as N/A
      else {
        stats.typeDistribution["N/A"]++
        console.log("No match found, counted as N/A. Type was:", normalizedType)
      }
    } else {
      stats.typeDistribution["N/A"]++
      console.log("No type provided, counted as N/A")
    }

    // Log the current state of typeDistribution after each participant
    console.log("Current type distribution:", JSON.stringify(stats.typeDistribution, null, 2))

    try {
      const monthYear = `${participantDate.getMonth() + 1}/${participantDate.getFullYear()}`
      if (orderedRegistrations.hasOwnProperty(monthYear)) {
        orderedRegistrations[monthYear]++
      }
    } catch (error) {
      console.error("Error processing date:", error)
    }
  })

  stats.monthlyRegistrations = orderedRegistrations
  stats._rawParticipants = participants

  // After calculating monthlyRegistrations
  const months = Object.keys(stats.monthlyRegistrations);
  const len = months.length;
  const lastMonth = months[len - 2];
  const thisMonth = months[len - 1];
  const lastMonthValue = stats.monthlyRegistrations[lastMonth] || 0;
  const thisMonthValue = stats.monthlyRegistrations[thisMonth] || 0;
  stats.growthPercent = lastMonthValue === 0
    ? 0
    : Math.round(((thisMonthValue - lastMonthValue) / lastMonthValue) * 100);

  return stats
}

function adjustColor(color, amount) {
  const hex = color.replace("#", "")
  const num = Number.parseInt(hex, 16)
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

export function TopLocationRadarChart({ topLocations }) {
  const [loading, setLoading] = useState(true)
  const [locationData, setLocationData] = useState([])
  const [error, setError] = useState(null)

  const extractMainLocation = (address) => {
    if (!address) return null

    // Convert to lowercase for consistent matchingAA
    const lowerAddress = address.toLowerCase()

    // List of Aurora municipalities
    const auroraMunicipalities = ["baler", "casiguran", "dilasag", "dingalan", "dipaculao", "maria aurora", "san luis"]

    // Check for each municipality
    for (const municipality of auroraMunicipalities) {
      if (lowerAddress.includes(municipality)) {
        // Capitalize first letter of each word
        return municipality
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      }
    }

    // If no Aurora municipality is found, return the original address
    return address
  }

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true)
        const participantsRef = collection(db, "participants")
        const q = query(participantsRef)
        const querySnapshot = await getDocs(q)

        // Process location data
        const locationCounts = {}
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.address) {
            const mainLocation = extractMainLocation(data.address)
            if (mainLocation) {
              locationCounts[mainLocation] = (locationCounts[mainLocation] || 0) + 1
            }
          }
        })

        // Convert to array and sort by count
        const sortedLocations = Object.entries(locationCounts)
          .map(([location, count]) => ({
            location,
            value: count,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6) // Get top 6 locations

        setLocationData(sortedLocations)
        setError(null)
      } catch (err) {
        console.error("Error fetching location data:", err)
        setError("Failed to load location data")
      } finally {
        setLoading(false)
      }
    }

    fetchLocationData()
  }, [])

  const chartConfig = {
    value: {
      label: "Participants",
      color: "#496E22",
    },
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border-0 relative overflow-hidden w-full h-full">
        <div className="absolute inset-0 bg-white/30 w-full h-full">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#496E22]/20 to-transparent blur-3xl"></div>
        </div>
        <CardHeader className="items-center pb-4 relative">
          <CardTitle className="text-lg font-medium text-[#1B4D2E]">Top Locations - Radar Chart</CardTitle>
          <CardDescription className="text-[#496E22]/80">Loading location data...</CardDescription>
        </CardHeader>
        <CardContent className="pb-0 relative">
          <div className="relative h-[250px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#496E22]"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/30 w-full h-full">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#496E22]/20 to-transparent blur-3xl"></div>
        </div>
        <CardHeader className="items-center pb-4 relative">
          <CardTitle className="text-lg font-medium text-[#1B4D2E]">Top Locations - Radar Chart</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent className="pb-0 relative">
          <div className="relative h-[250px] flex items-center justify-center">
            <p className="text-[#496E22]/70">Failed to load location data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/30 w-full h-full">
        <div className="absolute -inset-2 bg-gradient-to-r from-[#496E22]/20 to-transparent blur-3xl"></div>
      </div>
      <CardHeader className="items-center pb-4 relative">
        <CardTitle className="text-lg font-medium text-[#1B4D2E]">Top Locations - Radar Chart</CardTitle>
        <CardDescription className="text-[#496E22]/80">Showing top municipalities in Aurora</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#496E22]/10 to-transparent rounded-full blur-2xl"></div>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] relative z-10">
            <RadarChart data={locationData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <PolarGrid className="fill-[#496E22] opacity-20" stroke="#496E22" strokeWidth={1} />
              <PolarAngleAxis dataKey="location" tick={{ fill: "#496E22", fontSize: 12 }} />
              <Radar
                dataKey="value"
                fill="#496E22"
                stroke="#6C9331"
                fillOpacity={0.5}
                className="transition-all duration-300 hover:opacity-75"
              />
            </RadarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm relative">
        <div className="flex items-center gap-2 leading-none text-[#496E22]/80">
          Top {locationData.length} Municipalities
        </div>
      </CardFooter>
    </Card>
  )
}

function GenderDistributionPieChart({ genderDistribution }) {
  const genderData = [
    { key: "male", label: "Male", value: genderDistribution.male, fill: "#14532d" }, // Dark green
    { key: "female", label: "Female", value: genderDistribution.female, fill: "#134e4a" }, // Dark teal
    { key: "lgbtqia", label: "LGBTQIA+", value: genderDistribution.lgbtqia, fill: "#6d28d9" }, // Dark purple
  ];
  const [activeGender, setActiveGender] = useState("all");
  const total = genderData.reduce((sum, g) => sum + g.value, 0);

  // Calculate percentages for each gender
  const genderDataWithPercentage = genderData.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
        </filter>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#22223b"
          strokeWidth={5}
          filter="url(#shadow)"
        />
      </g>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border-0 relative overflow-hidden w-full h-full">
      <div className="absolute inset-0 bg-white/30 w-full h-full">
        <div className="absolute -inset-2 bg-gradient-to-r from-[#496E22]/20 to-transparent blur-3xl"></div>
      </div>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 relative">
        <div>
          <CardTitle className="text-lg font-medium text-[#1B4D2E]">Gender Distribution</CardTitle>
          <CardDescription className="text-[#496E22]/80">Distribution of participants by gender</CardDescription>
        </div>
        <select
          value={activeGender}
          onChange={e => setActiveGender(e.target.value)}
          className="h-9 w-[130px] rounded-md border border-[#C8E6C9] bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
        >
          <option value="all">All Genders</option>
          {genderData.map(g => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="pb-0 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#496E22]/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-center">
            <PieChart width={400} height={250}>
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
                </filter>
              </defs>
              <Pie
                data={genderDataWithPercentage}
                cx={200}
                cy={125}
                innerRadius={70}
                outerRadius={90}
                dataKey="value"
                activeIndex={activeGender !== "all" ? genderData.findIndex(item => item.key === activeGender) : undefined}
                activeShape={renderActiveShape}
                stroke="#22223b"
                strokeWidth={4}
                filter="url(#shadow)"
              >
                {genderDataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="#22223b" strokeWidth={4} filter="url(#shadow)" />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const selectedGender = activeGender !== "all" 
                        ? genderData.find(g => g.key === activeGender) 
                        : null;
                      return (
                        <g>
                          <text x={viewBox.cx} y={viewBox.cy - 15} textAnchor="middle" dominantBaseline="middle">
                            <tspan className="fill-[#1B4D2E] text-3xl font-bold">{total}</tspan>
                          </text>
                          <text x={viewBox.cx} y={viewBox.cy + 15} textAnchor="middle" dominantBaseline="middle">
                            <tspan className="fill-[#496E22] text-base font-medium">
                              Total
                            </tspan>
                          </text>
                          {selectedGender && (
                            <text x={viewBox.cx} y={viewBox.cy + 40} textAnchor="middle" dominantBaseline="middle">
                              <tspan className="fill-[#496E22] text-sm">
                                {selectedGender.label}: {selectedGender.value}
                              </tspan>
                            </text>
                          )}
                        </g>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </div>
        </div>
        {/* Legend */}
        <div className="flex justify-center items-center gap-4 mt-4 bg-white rounded-full px-6 py-2 shadow-sm">
          {genderDataWithPercentage.map((item) => (
            <div 
              key={item.key} 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveGender(item.key === activeGender ? "all" : item.key)}
            >
              <div 
                className={`w-3 h-3 rounded-full ${activeGender === item.key ? 'ring-2 ring-offset-1 ring-[#1B4D2E]' : ''}`} 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium text-[#1B4D2E]">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyRegistrationsAreaChart({ participants, className }) {
  // Transform participants to daily registration counts
  const [timeRange, setTimeRange] = useState("all") // Changed default to "all"
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Generate years array starting from 2024 to current year
  const generateYears = () => {
    const years = []
    const startYear = 2024
    const endYear = currentYear // Only go up to current year
    for (let year = endYear; year >= startYear; year--) {
      years.push(year)
    }
    return years
  }

  // Get available years from participants data and ensure all years from 2024 are included
  const availableYears = [...new Set([
    ...participants.map(p => new Date(p.dateRegistered).getFullYear()),
    ...generateYears()
  ])].sort((a, b) => b - a)

  // Build a map of date => { active }
  const dateMap = {}
  participants.forEach((p) => {
    const date = new Date(p.dateRegistered)
    const dateStr = date.toISOString().slice(0, 10)
    if (!dateMap[dateStr]) dateMap[dateStr] = { date: dateStr, active: 0 }
    if (p.status === "Active") dateMap[dateStr].active++
  })

  // Fill in missing days for the selected year
  const today = new Date()
  const chartData = []
  const startDate = new Date(selectedYear, 0, 1) // January 1st of selected year
  const endDate = selectedYear === currentYear ? today : new Date(selectedYear, 11, 31) // December 31st of selected year or today if current year

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10)
    chartData.push({
      date: dateStr,
      active: dateMap[dateStr]?.active || 0,
    })
  }

  // Filter by time range (monthly)
  const getFilteredData = () => {
    if (timeRange === "all") return chartData

    const month = parseInt(timeRange)
    const year = selectedYear
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0)

    return chartData.filter(item => {
      const date = new Date(item.date)
      return date >= startOfMonth && date <= endOfMonth
    })
  }

  const filteredData = getFilteredData()

  const chartConfig = {
    active: {
      label: "Active",
      color: "#90BE6D",
    },
  }

  // Generate month options
  const monthOptions = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  return (
    <Card className={`bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-white border-0 shadow-md ${typeof className === 'string' ? className : 'md:col-span-4 w-full'}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Monthly Encoded Participants</CardTitle>
          <CardDescription>
            Showing registrations for {selectedYear === currentYear ? 'current year' : selectedYear}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(parseInt(value))}
            defaultValue={currentYear.toString()}
          >
            <SelectTrigger className="w-[120px] rounded-lg" aria-label="Select year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {availableYears.map((year) => (
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg" aria-label="Select month">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {monthOptions.map((month) => (
                <SelectItem 
                  key={month.value} 
                  value={month.value} 
                  className="rounded-lg"
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={filteredData}>
              <defs>
                {/* Area for active registrations */}
                <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#222" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#90BE6D" stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="active"
                type="natural"
                fill="url(#fillActive)"
                stroke="#90BE6D"
                strokeWidth={1.5}
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
  
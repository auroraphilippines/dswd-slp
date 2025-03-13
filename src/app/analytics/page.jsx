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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryTrendsChart } from "./inventory-trends-chart";
import { CategoryDistributionChart } from "./category-distribution-chart";
import { StockLevelMetrics } from "./stock-level-metrics";
import { TopProductsTable } from "./top-products-table";
import { auth, db } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AnalyticsPage() {
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

  if (loading) {
    return <LoadingPage />;
  }

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
                    placeholder="Search"
                    type="search"
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
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
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
            {/* Analytics Dashboard Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Analytics Dashboard
                  </h1>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="inventory">
                      Inventory Analysis
                    </TabsTrigger>
                    <TabsTrigger value="sales">Sales Performance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="col-span-1 md:col-span-2">
                        <CardHeader>
                          <CardTitle>Inventory Trends</CardTitle>
                          <CardDescription>
                            Stock levels and inventory value over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <InventoryTrendsChart />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Category Distribution</CardTitle>
                          <CardDescription>
                            Breakdown of inventory by category
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <CategoryDistributionChart />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Stock Level Metrics</CardTitle>
                          <CardDescription>
                            Current inventory status and alerts
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <StockLevelMetrics />
                        </CardContent>
                      </Card>

                      <Card className="col-span-1 md:col-span-2">
                        <CardHeader>
                          <CardTitle>Top Products</CardTitle>
                          <CardDescription>
                            Best and worst performing products
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <TopProductsTable />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="inventory" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed Inventory Analysis</CardTitle>
                        <CardDescription>
                          In-depth analysis of your inventory data
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          This section provides detailed analytics about your
                          inventory performance, turnover rates, and
                          optimization opportunities.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sales" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sales Performance Analytics</CardTitle>
                        <CardDescription>
                          Comprehensive analysis of sales data and trends
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          View detailed sales analytics including revenue
                          trends, top-selling products, and sales by channel.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LoadingPage from "../loading/page";
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
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  User,
  LogOut,
  FolderOpen,
  ChevronRight,
  MapPin,
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
  CardFooter,
} from "@/components/ui/card";

import { auth, db } from "@/service/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UploadActivity } from "./upload-activity";
import { ActivityFeed } from "./activity-feed";

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();

  // Add municipalities array
  const MUNICIPALITIES = [
    { id: 'baler', name: 'Baler' },
    { id: 'casiguran', name: 'Casiguran' },
    { id: 'dilasag', name: 'Dilasag' },
    { id: 'dinalungan', name: 'Dinalungan' },
    { id: 'dingalan', name: 'Dingalan' },
    { id: 'dipaculao', name: 'Dipaculao' },
    { id: 'maria-aurora', name: 'Maria Aurora' },
    { id: 'san-luis', name: 'San Luis' }
  ];

  // Add search function
  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const activitiesRef = collection(db, "activities");
      const searchTerm = value.toLowerCase();
      
      // Find matching municipalities
      const matchingMunicipalities = MUNICIPALITIES.filter(mun => 
        mun.name.toLowerCase().includes(searchTerm)
      );

      if (matchingMunicipalities.length > 0) {
        const queries = matchingMunicipalities.map(mun => {
          return query(
            activitiesRef,
            where("municipalityName", "==", mun.name)
          );
        });

        const querySnapshots = await Promise.all(
          queries.map(q => getDocs(q))
        );

        const results = [];
        querySnapshots.forEach((querySnapshot, index) => {
          querySnapshot.forEach(doc => {
            results.push({
              id: doc.id,
              ...doc.data(),
              municipality: matchingMunicipalities[index].name
            });
          });
        });

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching activities:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add search results dropdown
  const SearchResultsDropdown = () => {
    if (!searchQuery || searchResults.length === 0) return null;

    return (
      <div className="absolute mt-1 w-full bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
        <div className="p-2">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => {
                // Scroll to the activity with this ID
                const element = document.getElementById(`activity-${result.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  element.classList.add('highlight-activity');
                  setTimeout(() => {
                    element.classList.remove('highlight-activity');
                  }, 2000);
                }
                setSearchResults([]);
                setSearchQuery("");
              }}
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{result.municipalityName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {result.description?.slice(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
    { name: "Projects", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "File Storage", href: "/programs", icon: FolderOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-card/50 backdrop-blur-sm">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
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
                DSWD SLP-PS
              </span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col px-3">
            <nav className="flex-1 space-y-1">
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
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary-foreground"
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
          <div className="flex-shrink-0 p-4 mt-6">
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between">
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
                <ThemeToggle />
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
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary-foreground"
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
        <header className="relative z-10 flex-shrink-0 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center">
          <button
            type="button"
            className="px-4 text-muted-foreground md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex max-w-md">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-muted-foreground">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className={`h-5 w-5 ml-3 ${isSearching ? 'animate-pulse' : ''}`} aria-hidden="true" />
                  </div>
                  <Input
                    id="search-field"
                    className="block w-full h-9 pl-10 pr-3 rounded-full bg-muted/50 border-0 text-sm placeholder:text-muted-foreground/70"
                    placeholder="Search by municipality..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <SearchResultsDropdown />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full flex items-center gap-2 px-2"
                  >
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
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-1 rounded-xl p-1"
                >
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
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-muted/30">
          <div className="py-6">
            {/* Dashboard Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">
                      DSWD Sustainable Livelihood Program - Activity Feed
                    </h1>
                    <p className="text-muted-foreground">
                      Share and view project activities and updates
                    </p>
                  </div>
                </div>

                {/* Activity Feed */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Activity Feed</CardTitle>
                        <CardDescription>
                          Share and view project activities
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <UploadActivity />
                    <div className="border-t pt-6">
                      <ActivityFeed />
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
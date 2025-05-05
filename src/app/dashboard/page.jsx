"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [permissionsLoading, setPermissionsLoading] = useState(true);

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

  // Security: Redirect to / if accessing unauthorized features
  useEffect(() => {
    const allowedPaths = [
      "/dashboard",
      "/vendors",
      "/participants",
      "/programs",
      "/settings"
    ];
    if (!allowedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
      router.push("/");
    }
  }, [pathname, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const rawName = userData.name || "";
            const displayName = rawName === "255" ? "Admin DSWD" : rawName;

            setCurrentUser({
              name: userData.name || user.displayName || "Admin DSWD",
              email: userData.email || user.email || "admin@dswd.gov.ph",
              role: userData.role || "User",
              permissions: userData.permissions || {
                readOnly: false,
                accessProject: false,
                accessParticipant: false,
                accessFileStorage: false
              }
            });
            console.log('CurrentUser (from Firestore):', {
              name: userData.name || user.displayName || "Admin DSWD",
              email: userData.email || user.email || "admin@dswd.gov.ph",
              role: userData.role || "User",
              permissions: userData.permissions || {
                readOnly: false,
                accessProject: false,
                accessParticipant: false,
                accessFileStorage: false
              }
            });
            setPermissionsLoading(false);
          } else {
            // User doc not found, fallback
            setCurrentUser({
              name: user.displayName || "Admin DSWD",
              email: user.email || "admin@dswd.gov.ph",
              role: "User",
              permissions: {
                readOnly: false,
                accessProject: false,
                accessParticipant: false,
                accessFileStorage: false
              }
            });
            console.log('CurrentUser (fallback):', {
              name: user.displayName || "Admin DSWD",
              email: user.email || "admin@dswd.gov.ph",
              role: "User",
              permissions: {
                readOnly: false,
                accessProject: false,
                accessParticipant: false,
                accessFileStorage: false
              }
            });
            setPermissionsLoading(false);
          }
        } else {
          setCurrentUser(null);
          setPermissionsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (permissionsLoading || !currentUser) return; // Wait for permissions to load

    // Strict security check for all paths
    const checkAccess = () => {
      // Always allow dashboard, settings, and participants
      if (pathname === "/dashboard" || pathname === "/settings" || pathname.startsWith("/participants")) {
        return true;
      }

      // Check vendors/projects access
      if (pathname.startsWith("/vendors")) {
        if (!currentUser?.permissions?.accessProject) {
          window.location.href = "/";
          return false;
        }
        return true;
      }

      // Check file storage access
      if (pathname.startsWith("/programs")) {
        if (!currentUser?.permissions?.accessFileStorage) {
          window.location.href = "/";
          return false;
        }
        return true;
      }

      // Default deny for any other paths
      window.location.href = "/";
      return false;
    };

    checkAccess();
  }, [pathname, currentUser, permissionsLoading]);

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

  // Strict module access check
  const hasModuleAccess = (moduleName) => {
    if (!currentUser) return false;
    
    switch (moduleName.toLowerCase()) {
      case 'projects':
        return currentUser.permissions?.accessProject;
      case 'participants':
        return true; // Always allow access to participants
      case 'filestorage':
        return currentUser.permissions?.accessFileStorage;
      default:
        return false; // Default deny
    }
  };

  // Strict write permissions check
  const hasWritePermissions = (moduleName) => {
    if (!currentUser) return false;
    if (currentUser.permissions?.readOnly) return false;
    return hasModuleAccess(moduleName);
  };

  // Show permission denied and redirect
  const showPermissionDenied = (action) => {
    toast.error(`Permission denied: You don't have access to ${action}`);
    window.location.href = "/";
  };

  if (loading || permissionsLoading) {
    return <LoadingPage />;
  }

  // Update navigation with strict access control
  const navigation = [
    { name: "Activities", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store, requiresAccess: "projects" },
    { name: "Participants", href: "/participants", icon: Users }, // Removed requiresAccess for participants
    { name: "File Storage", href: "/programs", icon: FolderOpen, requiresAccess: "filestorage" },
    { name: "Settings", href: "/settings", icon: Settings },
  ].map(item => ({
    ...item,
    disabled: item.requiresAccess ? !hasModuleAccess(item.requiresAccess) : false
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-[#004225]">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard" className="flex items-center">
              <img src="./images/SLP.png" alt="Logo" className="h-8 w-8" />
              <span className="ml-3 text-xl font-bold text-white">
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
                const hasAccess = !item.requiresAccess || hasModuleAccess(item.requiresAccess);
                
                if (!hasAccess) {
                  router.replace("/");
                  return null;
                }

                return (
                  <Link
                    key={item.name}
                    href={item.disabled ? "#" : item.href}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        showPermissionDenied(item.name.toLowerCase());
                      }
                    }}
                    className={`${
                      isActive
                        ? "bg-white/10 text-white"
                        : item.disabled
                        ? "text-gray-300/50 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-white"
                          : item.disabled
                          ? "text-gray-300/50"
                          : "text-gray-300 group-hover:text-white"
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
              <ThemeToggle className="text-white" />
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
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#004225]">
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
                <span className="ml-2 text-xl font-bold text-white">DSWD SLP-PS</span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const hasAccess = !item.requiresAccess || hasModuleAccess(item.requiresAccess);
                
                if (!hasAccess) {
                  router.replace("/");
                  return null;
                }

                return (
                  <Link
                    key={item.name}
                    href={item.disabled ? "#" : item.href}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        showPermissionDenied(item.name.toLowerCase());
                      }
                    }}
                    className={`${
                      isActive
                        ? "bg-white/10 text-white"
                        : item.disabled
                        ? "text-gray-300/50 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-white"
                          : item.disabled
                          ? "text-gray-300/50"
                          : "text-gray-300 group-hover:text-white"
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
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="relative z-10 flex-shrink-0 flex h-16 bg-card shadow">
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
                  
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {/* Dashboard Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1 bg-gradient-to-r from-[#496E22] to-[#6C9331] bg-clip-text text-transparent">
                      DSWD Sustainable Livelihood Program - Activity Feed
                    </h1>
                    <p className="text-[#496E22]/70">
                      Share and view project activities and updates
                    </p>
                  </div>
                </div>

                {/* Activity Feed */}
                <Card className="bg-gradient-to-br from-[#C5D48A]/10 to-[#A6C060]/10 border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-[#496E22] to-[#6C9331] bg-clip-text text-transparent">
                          Activity Feed
                        </CardTitle>
                        <CardDescription className="text-[#496E22]/70">
                          Share and view project activities
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <UploadActivity />
                    <div className="border-t border-[#96B54A]/20 pt-6">
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
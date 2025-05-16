"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LoadingPage from "../loading/page";
import {
  LayoutDashboard,
  Settings,
  Users,
  Menu,
  X,
  Search,
  Store,
  FolderOpen,
  MapPin,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { auth, db } from "@/service/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UploadActivity } from "./upload-activity";
import { ActivityFeed } from "./activity-feed";
import { getProfilePhotoFromLocalStorage } from "@/service/storage";
import { onAuthStateChanged } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
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
      <div className="absolute mt-1 w-full bg-background border rounded-lg shadow-lg z-50 max-h-[60vh] sm:max-h-96 overflow-y-auto">
        <div className="p-2">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => {
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
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{result.municipalityName}</p>
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

  // Add fetchUserProfileImage function
  const fetchUserProfileImage = async (userId) => {
    try {
      // First try to get from Firestore
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.photoURL) {
          return userData.photoURL;
        }
      }

      // If not in Firestore, try localStorage
      const localPhoto = getProfilePhotoFromLocalStorage(userId);
      if (localPhoto) {
        return localPhoto;
      }

      return null;
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }
  };

  // Update the useEffect for fetching user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const rawName = userData.name || "";
          const displayName = rawName === "255" ? "Admin DSWD" : rawName;
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
    });

    return () => unsubscribe();
  }, []);

  // Get user initials from name
  const getUserInitials = (name) => {
    if (!name) return "AD";
    if (name === "Admin DSWD") return "AD";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    // Single word: take first two letters, pad if needed
    return (name.substring(0, 2).toUpperCase()).padEnd(2, 'A');
  };

  if (loading) {
    return <LoadingPage />;
  }

  const navigation = [
    { name: "Activities", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "File Storage", href: "/programs", icon: FolderOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Logout function (copied and adapted from settings/page.jsx)
  const handleLogout = async () => {
    try {
      // Clear any local storage items
      localStorage.clear();
      sessionStorage.clear();
      // Sign out from Firebase
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), { status: "inactive" });
      }
      await signOut(auth);
      // Clear any cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // Force a hard redirect to the login page
      window.location.replace("/");
      // Prevent going back
      window.history.pushState(null, "", "/");
      window.onpopstate = function() {
        window.history.pushState(null, "", "/");
      };
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
      />
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
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
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
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center">
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

      {/* Mobile icon header */}
      <div className="md:hidden w-full fixed top-0 left-0 z-30 bg-[#0B3D2E] flex items-center justify-between px-2 py-1 shadow-lg">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-green-200/80">
            <Image
              src="/images/SLP.png"
              alt="Logo"
              fill
              className="object-contain p-1"
            />
          </div>
        </Link>
        {/* Navigation icons */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <Link
            href="/dashboard"
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              pathname === '/dashboard' ? 'border-2 border-white' : ''
            } hover:bg-green-800/40 transition`}
          >
            <LayoutDashboard className="h-6 w-6 text-white" />
          </Link>
          <Link href="/vendors" className="p-2 rounded-full hover:bg-green-800/40 transition">
            <Store className="h-6 w-6 text-green-50" />
          </Link>
          <Link href="/participants" className="p-2 rounded-full hover:bg-green-800/40 transition">
            <Users className="h-6 w-6 text-green-50" />
          </Link>
          <Link href="/programs" className="p-2 rounded-full hover:bg-green-800/40 transition">
            <FolderOpen className="h-6 w-6 text-green-50" />
          </Link>
          <Link href="/settings" className="p-2 rounded-full hover:bg-green-800/40 transition">
            <Settings className="h-6 w-6 text-green-50" />
          </Link>
        </div>
        {/* Profile avatar with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-2 p-1 rounded-full hover:bg-green-800/40 transition flex items-center justify-center focus:outline-none">
              {currentUser?.photoURL ? (
                <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-green-200/80">
                  <Image
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-9 w-9 rounded-full bg-green-800/80 text-green-50 flex items-center justify-center font-medium text-base border-2 border-green-200/80">
                  {getUserInitials(currentUser?.name)}
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <div className="font-semibold text-base leading-tight">{currentUser?.name}</div>
              <div className="text-xs text-muted-foreground truncate">{currentUser?.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-700 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden pt-12 md:pt-0">
        <header className="relative z-10 flex-shrink-0 h-16 bg-white backdrop-blur-sm border-b border-green-100 flex items-center md:static md:h-16">
          <button
            type="button"
            className="px-4 text-muted-foreground md:hidden hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-2 sm:px-4 flex justify-between">
            <div className="flex-1 flex max-w-md">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-muted-foreground">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className={`h-5 w-5 ml-3 ${isSearching ? 'animate-pulse' : ''}`} aria-hidden="true" />
                  </div>
                  <Input
                    id="search-field"
                    className="block w-full h-9 pl-10 pr-3 rounded-full bg-green-50/50 border-0 text-sm placeholder:text-green-700/70 focus:ring-2 focus:ring-green-200"
                    placeholder="Search by municipality..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <SearchResultsDropdown />
                </div>
              </div>
            </div>
            <div className="ml-2 sm:ml-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
              >
                
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-green-50/30">
          <div className="py-4 sm:py-6">
            {/* Dashboard Content */}
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-4 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-green-900">
                      DSWD Sustainable Livelihood Program - Activity Feed
                    </h1>
                    <p className="text-sm sm:text-base text-green-700">
                      Share and view project activities and updates
                    </p>
                  </div>
                </div>

                {/* Activity Feed */}
                <Card className="border border-green-100 shadow-sm bg-white">
                  <CardHeader className="pb-3 border-b border-green-100 px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-lg text-black">Activity Feed</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-green-700">
                          Share and view project activities
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                    <UploadActivity />
                    <div className="border-t pt-4 sm:pt-6">
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
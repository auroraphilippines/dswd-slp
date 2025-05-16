"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoadingPage from "../loading/page";
import {
  LayoutDashboard,
  Settings,
  Users,
  Menu,
  X,
  Search,
  Building2,
  Store,
  Building,
  CreditCard, 
  Lock,
  FolderOpen,
  User,
  LogOut,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersPermissionsSettings } from "./user-permission";
import { SecuritySettings } from "./security";
import { auth, db } from "@/service/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfilePhotoFromLocalStorage } from "@/service/storage";

export default function SettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Add isAdmin check
  const isAdmin = currentUser?.role === "SLP Administrator";

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Function to fetch user profile image
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          // Fetch profile image
          const profileImage = await fetchUserProfileImage(user.uid);
          
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
              lastActive: userData.lastActive || "Never", 
              photoURL: profileImage
            });

            // After successful login
            await updateDoc(doc(db, "users", user.uid), { 
              status: "active",
              lastActive: serverTimestamp()
            });
          }
        } else {
          // Redirect to login if not authenticated
          window.location.href = "/";
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading user data");
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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Never";
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp.toDate) {
      return new Date(timestamp.toDate()).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    return "Never";
  };

  // Add handleLogout function
  const handleLogout = async () => {
    try {
      // Update user status to offline before logging out
      if (currentUser?.uid) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          status: "offline",
          lastActive: serverTimestamp()
        });
      }
      
      // Sign out from Firebase
      await auth.signOut();
      
      // Clear any local storage items if needed
      localStorage.removeItem('userProfile');
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  const navigation = [
    { name: "Activities", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "File Storage", href: "/programs", icon: FolderOpen },
    { name: "Settings", href: "./settings", icon: Settings },
  ];

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
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarImage 
                      src={currentUser.photoURL} 
                      alt={currentUser?.name || "User"}
                      className="object-cover" 
                    />
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
                    {currentUser?.role}
                  </p>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile icon header (like other pages) */}
      <div className="md:hidden w-full fixed top-0 left-0 z-30 bg-[#0B3D2E] flex items-center justify-between px-2 py-1 shadow-lg">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/images/SLP.png"
              alt="Logo"
              fill
              className="object-contain p-1"
            />
          </div>
        </Link>
        {/* Navigation icons */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <Link href="/dashboard" className={`w-10 h-10 rounded-lg flex items-center justify-center ${pathname === '/dashboard' ? 'border-2 border-white' : ''}`}>
            <LayoutDashboard className="h-6 w-6 text-white" />
          </Link>
          <Link href="/vendors" className={`w-10 h-10 rounded-lg flex items-center justify-center ${pathname === '/vendors' ? 'border-2 border-white' : ''}`}> 
            <Store className="h-6 w-6 text-white" />
          </Link>
          <Link href="/participants" className={`w-10 h-10 rounded-lg flex items-center justify-center ${pathname === '/participants' ? 'border-2 border-white' : ''}`}> 
            <Users className="h-6 w-6 text-white" />
          </Link>
          <Link href="/programs" className={`w-10 h-10 rounded-lg flex items-center justify-center ${pathname === '/programs' ? 'border-2 border-white' : ''}`}> 
            <FolderOpen className="h-6 w-6 text-white" />
          </Link>
          <Link href="/settings" className={`w-10 h-10 rounded-lg flex items-center justify-center ${pathname === '/settings' ? 'border-2 border-white' : ''}`}> 
            <Settings className="h-6 w-6 text-white" />
          </Link>
        </div>
        {/* Profile avatar/initials */}
        <div className="ml-2 w-10 h-10 flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full h-full flex items-center justify-center">
                {currentUser?.photoURL ? (
                  <Image
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    width={32}
                    height={32}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center font-medium text-white">
                    {getUserInitials(currentUser?.name)}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden mt-16 md:mt-0">


        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Settings
                  </h1>
                </div>

                <Tabs defaultValue={isAdmin ? "users" : "security"} className="w-full">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4">
                      <TabsList className="flex flex-col h-auto bg-transparent p-0 justify-start">
                        {isAdmin && (
                          <TabsTrigger
                            value="users"
                            className="justify-start w-full mb-1 data-[state=active]:bg-muted"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Users & Permissions
                          </TabsTrigger>
                        )}
                        <TabsTrigger
                          value="security"
                          className="justify-start w-full mb-1 data-[state=active]:bg-muted"
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Security
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="md:w-3/4">
                      {isAdmin && (
                        <TabsContent value="users" className="mt-0">
                          <div className="space-y-4">
                            <div>
                              <h2 className="text-lg font-medium">
                                Users & Permissions
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Manage users, roles, and access permissions
                              </p>
                            </div>
                            <Separator />
                            <UsersPermissionsSettings />
                          </div>
                        </TabsContent>
                      )}

                      <TabsContent value="security" className="mt-0">
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-lg font-medium">Security</h2>
                            <p className="text-sm text-muted-foreground">
                              Manage your security settings and preferences
                            </p>
                          </div>
                          <Separator />
                          <SecuritySettings />
                        </div>
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
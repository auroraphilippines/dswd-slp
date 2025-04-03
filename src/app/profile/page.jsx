"use client";

import { useState, useEffect, useRef } from "react";
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
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { auth, db, storage } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadProfilePhoto } from "@/service/storage";

export default function ProfilePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [profileUrl, setProfileUrl] = useState(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [updatingContact, setUpdatingContact] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const fileInputRef = useRef(null);

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
              phoneNumber: userData.phoneNumber || "+63 XXX XXX XXXX",
              address: userData.address || "DSWD Office, Manila",
              joinDate: userData.joinDate || "January 2023",
              department: userData.department || "Administration",
            });

            // Add photo URL
            if (userData.photoURL) {
              setProfileUrl(userData.photoURL);
            }
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

  // Handle profile photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser?.uid) {
      toast.error("Please select a file and ensure you're logged in");
      return;
    }

    try {
      // Show loading toast
      toast.loading("Uploading photo...", { id: "photoUpload" });

      // Upload photo and get URL
      const photoURL = await uploadProfilePhoto(file, currentUser.uid);
      console.log("Photo uploaded successfully, URL:", photoURL);

      // Update user document in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        photoURL: photoURL,
        lastUpdated: new Date().toISOString()
      });

      // Update local state
      setProfileUrl(photoURL);
      setCurrentUser(prev => ({
        ...prev,
        photoURL: photoURL
      }));

      // Show success message
      toast.success("Profile photo updated successfully!", { id: "photoUpload" });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo: " + error.message, { id: "photoUpload" });
    }
  };

  // Handle contact info update
  const handleContactUpdate = async () => {
    if (!newPhoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    setUpdatingContact(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        phoneNumber: newPhoneNumber
      });

      setCurrentUser(prev => ({
        ...prev,
        phoneNumber: newPhoneNumber
      }));
      setShowContactDialog(false);
      toast.success("Contact information updated successfully!");
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact information");
    } finally {
      setUpdatingContact(false);
    }
  };

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
                    placeholder="Search..."
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
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                  <Button>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Profile Overview */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Profile Overview</CardTitle>
                      <CardDescription>
                        Your personal information and account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={profileUrl} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                              {getUserInitials(currentUser?.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            {currentUser?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {currentUser?.role}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Email
                          </p>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <p>{currentUser?.email}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Phone
                          </p>
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <p>{currentUser?.phoneNumber}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Department
                          </p>
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            <p>{currentUser?.department}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Location
                          </p>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <p>{currentUser?.address}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Your account status and details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Account Status
                        </p>
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-green-500" />
                          <p className="text-green-500">Active</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Join Date
                        </p>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <p>{currentUser?.joinDate}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Quick Actions
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          <Button variant="outline" className="w-full">
                            Change Password
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowContactDialog(true)}
                          >
                            Update Contact Info
                          </Button>
                          <Button variant="outline" className="w-full">
                            Security Settings
                          </Button>
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

      {/* Contact Update Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Contact Information</DialogTitle>
            <DialogDescription>
              Enter your new contact number below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">
                Phone
              </label>
              <Input
                id="phone"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="+63 XXX XXX XXXX"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowContactDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContactUpdate}
              disabled={updatingContact}
            >
              {updatingContact ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
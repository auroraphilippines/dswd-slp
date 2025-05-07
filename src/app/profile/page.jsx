"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoadingPage from "../loading/page";
import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  FolderOpen,
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
  Upload,
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
import { Separator } from "@/components/ui/separator";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/service/firebase";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import Image from "next/image";
import { uploadProfilePhoto, getProfilePhotoFromLocalStorage } from "@/service/storage";


export default function ProfilePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [updatingContact, setUpdatingContact] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  // Function to fetch user profile image
  const fetchUserProfileImage = async (userId) => {
    try {
      // First try to get from Firestore
      const db = getFirestore();
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
        // Fetch user from Firebase Auth and Firestore
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          // Fetch profile image
          const profileImage = await fetchUserProfileImage(user.uid);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              ...userData,
              name: userData?.name || "Admin DSWD",
              email: userData?.email || user.email || "admin@dswd.gov.ph",
              role: userData?.role || "Administrator",
              joinDate: userData?.joinDate || (user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"),
              status: userData?.status || "Active",
              phoneNumber: userData?.phoneNumber || "",
              address: userData?.address || "",
              department: userData?.department || "SWAD AURORA",
              photoURL: profileImage
            });
          } else {
            // Fallback to Auth user if Firestore doc not found
            setCurrentUser({
              name: user.displayName || "Admin DSWD",
              email: user.email || "admin@dswd.gov.ph",
              role: "Administrator",
              joinDate: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A",
              status: "Active",
              phoneNumber: user.phoneNumber || "",
              address: "",
              department: "SWAD AURORA",
              photoURL: profileImage
            });
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
        toast.error("Failed to load profile data. Some features may be limited.");
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <LoadingPage />
  }

  const navigation = [
    { name: "Activities", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "File Storage", href: "/programs", icon: FolderOpen },
    { name: "Settings", href: "./settings", icon: Settings },
  ];

  // Handle contact info update
  const handleContactUpdate = async () => {
    if (!newPhoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    setUpdatingContact(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const db = getFirestore();
      await updateDoc(doc(db, "users", user.uid), { phoneNumber: newPhoneNumber });
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

  // Handle location/address update
  const handleLocationUpdate = async () => {
    if (!newAddress) {
      toast.error("Please enter a location/address");
      return;
    }
    setUpdatingLocation(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { address: newAddress });
      setCurrentUser(prev => ({
        ...prev,
        address: newAddress
      }));
      setShowLocationDialog(false);
      toast.success("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    } finally {
      setUpdatingLocation(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to sign out. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Sign out error:", error);
    }
  };

  const checkFirebaseConnection = async () => {
    try {
      const db = getFirestore();
      // Try a simple read or write, or just return true for now
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle profile picture upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Use the existing storage implementation
      const photoURL = await uploadProfilePhoto(file, user.uid);
      
      // Update local state
      setCurrentUser(prev => ({
        ...prev,
        photoURL: photoURL
      }));

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
                {currentUser?.photoURL ? (
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarImage 
                      src={currentUser.photoURL} 
                      alt={currentUser?.name || "User"}
                      className="object-cover" 
                    />
                  </Avatar>
                ) : (
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getUserInitials(currentUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                )}
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
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">Profile</h1>  
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
                        <div className="relative group">
                          <Avatar className="h-20 w-20 cursor-pointer">
                            {currentUser?.photoURL ? (
                              <AvatarImage 
                                src={currentUser.photoURL} 
                                alt={currentUser?.name || "User"}
                                className="object-cover" 
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                {getUserInitials(currentUser?.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImage ? "Uploading..." : "Upload"}
                          </Button>
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
                          <p className="text-green-500">{currentUser?.status}</p>
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
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowContactDialog(true)}
                          >
                            Update Contact Info
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowLocationDialog(true)}
                          >
                            Update Location
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
                placeholder=" 09XX XXX XXXX"
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

      {/* Location Update Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Location</DialogTitle>
            <DialogDescription>
              Enter your new address/location below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right">
                Address
              </label>
              <Input
                id="address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter your address"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLocationDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLocationUpdate}
              disabled={updatingLocation}
            >
              {updatingLocation ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
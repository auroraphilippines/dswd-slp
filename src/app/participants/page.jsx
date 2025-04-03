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
  Plus,
  Download,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  UserX,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { ParticipantDetailView } from "./participant-detail-view";
import { auth, db } from "@/service/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, orderBy, getDocs, arrayUnion } from "firebase/firestore";
import { AddParticipantModal } from "./add-participant-modal";
import { EditParticipantModal } from "./edit-participant-modal";
import { AddAssistanceModal } from "./add-assistance-modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ParticipantsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    pending: 0,
    graduated: 0,
    programDistribution: {},
    barangayDistribution: {},
    monthlyRegistrations: {}
  });

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

  // Add this useEffect to fetch participants
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantsRef = collection(db, "participants");
        const q = query(participantsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const participantsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id,
          dateRegistered: doc.data().dateRegistered?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
        }));
        
        setParticipants(participantsData);
        setAnalytics(calculateAnalytics(participantsData));
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
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

  const handleViewDetails = (participant) => {
    setSelectedParticipant(participant);
  };

  const handleCloseDetails = () => {
    setSelectedParticipant(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddParticipant = (newParticipant) => {
    setParticipants((prev) => [newParticipant, ...prev]);
  };

  const handleEditParticipant = async (participantId, updatedData) => {
    try {
      const participantRef = doc(db, "participants", participantId);
      await updateDoc(participantRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });

      setParticipants(prev => 
        prev.map(p => p.docId === participantId ? { ...p, ...updatedData } : p)
      );
      toast.success("Participant updated successfully");
    } catch (error) {
      console.error("Error updating participant:", error);
      toast.error("Failed to update participant");
    }
  };

  const handleStatusChange = async (participant) => {
    const newStatus = participant.status === "Active" ? "Inactive" : "Active";
    try {
      const participantRef = doc(db, "participants", participant.docId);
      await updateDoc(participantRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      setParticipants(prev =>
        prev.map(p => p.docId === participant.docId ? { ...p, status: newStatus } : p)
      );
      toast.success(`Participant ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update participant status");
    }
  };

  const handleAddAssistance = async (participantId, assistanceData) => {
    try {
      const participantRef = doc(db, "participants", participantId);
      const newAssistance = {
        ...assistanceData,
        date: new Date().toISOString(),
      };

      await updateDoc(participantRef, {
        assistanceHistory: arrayUnion(newAssistance),
        updatedAt: serverTimestamp()
      });

      setParticipants(prev =>
        prev.map(p => p.docId === participantId ? {
          ...p,
          assistanceHistory: [...(p.assistanceHistory || []), newAssistance]
        } : p)
      );
      toast.success("Program history updated successfully");
    } catch (error) {
      console.error("Error adding assistance:", error);
      toast.error("Failed to update program history");
    }
  };

  const calculateAnalytics = (participants) => {
    const stats = {
      total: participants.length,
      active: 0,
      pending: 0,
      graduated: 0,
      programDistribution: {},
      barangayDistribution: {},
      monthlyRegistrations: {},
      inactive: participants.filter(p => p.status === "Inactive").length,
    };

    // Initialize months in the specific order: April to March
    const monthOrder = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]; // April to March
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Create ordered monthly registrations
    const orderedRegistrations = {};
    monthOrder.forEach(month => {
      // If month is January-March (1-3), use next year
      const year = month <= 3 ? currentYear + 1 : currentYear;
      const monthYear = `${month}/${year}`;
      orderedRegistrations[monthYear] = 0;
    });

    participants.forEach(participant => {
      // Status counts
      if (participant.status === "Active") stats.active++;
      else if (participant.status === "Pending") stats.pending++;
      else if (participant.status === "Graduated") stats.graduated++;

      // Program distribution
      stats.programDistribution[participant.program] = 
        (stats.programDistribution[participant.program] || 0) + 1;

      // Barangay distribution
      stats.barangayDistribution[participant.barangay] = 
        (stats.barangayDistribution[participant.barangay] || 0) + 1;

      // Monthly registrations
      try {
        const regDate = new Date(participant.dateRegistered);
        const monthYear = `${regDate.getMonth() + 1}/${regDate.getFullYear()}`;
        if (orderedRegistrations.hasOwnProperty(monthYear)) {
          orderedRegistrations[monthYear]++;
        }
      } catch (error) {
        console.error("Error processing date:", error);
      }
    });

    stats.monthlyRegistrations = orderedRegistrations;
    return stats;
  };

  if (loading) {
    return <LoadingPage />;
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vendors", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "Programs", href: "/programs", icon: Building2 },
    { name: "Reports", href: "./reports", icon: FileBarChart },
    { name: "Analytics", href: "./analytics", icon: FileBarChart },
    { name: "Settings", href: "./settings", icon: Settings },
  ];

  // Update the filteredParticipants to use the participants state
  const filteredParticipants = participants.filter((participant) => {
    return (
      searchQuery === "" ||
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.program.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
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
      />

      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-card">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/dashboard" className="flex items-center">
                <img src="./images/SLP.png" alt="Logo" className="h-8 w-8" />
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
                  <p className="text-sm font-medium">{currentUser?.name}</p>
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
                      value={searchQuery}
                      onChange={handleSearchChange}
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
              {/* Participants Content */}
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                      Participant Management
                    </h1>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Participant
                      </Button>
                    </div>
                  </div>

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

                    <Card className="md:col-span-2 bg-gradient-to-br from-[#A6C060] to-[#8CAF42] border-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 w-full h-full">
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#96B54A]/30 to-transparent blur-3xl"></div>
                      </div>
                      <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-white/90">
                          Program Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="space-y-3">
                          {Object.entries(analytics.programDistribution).map(([program, count]) => (
                            <div key={program} className="flex flex-col group">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-white/90">{program}</span>
                                <span className="text-sm font-medium text-white bg-white/10 px-2 py-0.5 rounded-full">
                                  {count}
                                </span>
                              </div>
                              <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-white/40 to-black/40 rounded-full transition-all duration-500 group-hover:from-black/40 group-hover:to-black/30"
                                  style={{ width: `${(count / analytics.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2 bg-gradient-to-br from-[#8CAF42] to-[#6C9331] border-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 w-full h-full">
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#79A03A]/30 to-transparent blur-3xl"></div>
                      </div>
                      <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-white/90">
                          Top Barangays
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="space-y-3">
                          {Object.entries(analytics.barangayDistribution)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 5)
                            .map(([barangay, count], index) => (
                              <div key={barangay} className="flex flex-col group">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center">
                                    <span className="w-5 text-xs text-white/70">#{index + 1}</span>
                                    <span className="text-sm text-white/90">{barangay}</span>
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

                    <Card className="md:col-span-4 bg-gradient-to-br from-[#C5D48A]/10 to-[#A6C060]/10 border-0 rounded-3xl overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-[#496E22] to-[#6C9331] bg-clip-text text-transparent">
                          Monthly Registrations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] relative">
                          {/* Chart content remains the same, updating colors */}
                          <div className="absolute inset-0 flex items-end justify-between px-2">
                            {Object.entries(analytics.monthlyRegistrations).map(([month, count], index) => {
                              const maxCount = Math.max(...Object.values(analytics.monthlyRegistrations)) || 1;
                              const height = `${(count / maxCount) * 100}%`;
                              const [monthNum, year] = month.split('/');
                              const date = new Date(year, monthNum - 1);
                              const monthName = date.toLocaleString('default', { month: 'short' });

                              return (
                                <div key={month} className="relative group flex-1 mx-1" style={{ height: '100%' }}>
                                  <div
                                    className={`w-full absolute bottom-0 rounded-t transition-all duration-200 ${
                                      index % 2 === 0 
                                        ? "bg-gradient-to-t from-[#79A03A] to-[#96B54A]" 
                                        : "bg-gradient-to-t from-[#5F862C] to-[#79A03A]"
                                    }`}
                                    style={{ height }}
                                  />
                                  
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-1 rounded text-xs text-[#496E22]">
                                    {count}
                                  </div>

                                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-[#496E22]">
                                    {monthName}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-[#C5D48A]/10 to-[#A6C060]/10 border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-[#496E22] to-[#6C9331] bg-clip-text text-transparent">
                            Participants
                          </CardTitle>
                          <CardDescription className="text-[#496E22]/70">
                            Manage program participants and their details
                          </CardDescription>
                        </div>
                        <div className="w-full sm:w-72">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#496E22]" />
                            <Input
                              placeholder="Search by name, ID, barangay..."
                              value={searchQuery}
                              onChange={handleSearchChange}
                              className="pl-8 w-full border-[#96B54A]/20 bg-white/50 focus:border-[#96B54A] focus:ring-[#96B54A]/20"
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className={`grid ${selectedParticipant ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-0`}>
                        <div className={`${selectedParticipant ? "border-r border-[#96B54A]/10" : ""}`}>
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gradient-to-r from-[#C5D48A]/20 to-[#A6C060]/10 hover:bg-[#96B54A]/5">
                                <TableHead className="text-[#496E22] font-semibold">ID</TableHead>
                                <TableHead className="text-[#496E22] font-semibold">Name</TableHead>
                                <TableHead className="text-[#496E22] font-semibold">Barangay</TableHead>
                                <TableHead className="text-[#496E22] font-semibold">Program</TableHead>
                                <TableHead className="text-[#496E22] font-semibold">Status</TableHead>
                                <TableHead className="text-right text-[#496E22] font-semibold">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredParticipants.map((participant) => (
                                <TableRow
                                  key={participant.id}
                                  className={`cursor-pointer transition-colors hover:bg-[#96B54A]/5 ${
                                    selectedParticipant?.id === participant.id ? "bg-[#96B54A]/10" : ""
                                  }`}
                                  onClick={() => handleViewDetails(participant)}
                                >
                                  <TableCell className="font-medium text-black">{participant.id}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <div className="h-10 w-10 rounded-full bg-[#96B54A]/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-[#496E22]" />
                                      </div>
                                      <div className="font-medium text-black">{participant.name}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-black/90">{participant.barangay}</TableCell>
                                  <TableCell className="text-black/90">{participant.program}</TableCell>
                                  <TableCell>
                                    <ParticipantStatusBadge status={participant.status} />
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="text-[#496E22] hover:text-[#96B54A] hover:bg-[#96B54A]/10">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>

        <AddParticipantModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddParticipant}
        />

        <EditParticipantModal
          isOpen={!!editingParticipant}
          onClose={() => setEditingParticipant(null)}
          onSubmit={handleEditParticipant}
          participant={editingParticipant}
        />

        <AddAssistanceModal
          isOpen={isAssistanceModalOpen}
          onClose={() => setIsAssistanceModalOpen(false)}
          onSubmit={handleAddAssistance}
          participantId={selectedParticipantId}
        />
      </div>
    </>
  );
}

function ParticipantStatusBadge({ status }) {
  if (status === "Active") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      >
        <UserCheck className="mr-1 h-3 w-3" />
        Active
      </Badge>
    );
  } else if (status === "Pending") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
      >
        <UserPlus className="mr-1 h-3 w-3" />
        Pending
      </Badge>  
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800"
      >
        <UserX className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    );
  }
}
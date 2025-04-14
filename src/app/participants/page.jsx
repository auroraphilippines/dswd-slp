"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Edit,
  Trash2,
  Power,
  Eye,
  Loader2,
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
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, orderBy, getDocs, arrayUnion, deleteDoc } from "firebase/firestore";
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  // Move useMemo before any other logic
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...participants, ...familyDetails];
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Search in participants
    const matchedParticipants = participants.filter((participant) => {
      const fieldsToSearch = [
        participant.name,
        participant.id,
        participant.address,
        participant.project,
        // Add family members search if they exist
        ...(participant.familyMembers?.map(member => 
          `${member.name} ${member.relationship} ${member.occupation}`
        ) || [])
      ];

      return fieldsToSearch
        .filter(Boolean)
        .map(field => field.toLowerCase())
        .some(field => field.includes(query));
    });

    // Search in family details
    const matchedFamilies = familyDetails.filter((family) => {
      const fieldsToSearch = [
        family.familyName,
        family.familyId,
        family.householdHead,
        family.familyAddress,
        family.barangay,
        family.municipality,
        // Add family members if they exist
        ...(family.members?.map(member => 
          `${member.name} ${member.relationship} ${member.occupation}`
        ) || [])
      ];

      return fieldsToSearch
        .filter(Boolean)
        .map(field => field.toLowerCase())
        .some(field => field.includes(query));
    });

    // Combine and return both results
    return [...matchedParticipants, ...matchedFamilies];
  }, [searchQuery, participants, familyDetails]);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Wait for auth state to be determined
        const user = auth.currentUser;
        if (!user) {
          console.error("No authenticated user found");
          toast.error("Please sign in to access this page");
          router.push('/'); // Redirect to login page
          return;
        }

        let fetchedParticipantsData = [];
        let fetchedFamilyData = [];

        // Fetch participants with error handling
        try {
          const participantsRef = collection(db, "participants");
          const q = query(participantsRef, orderBy("createdAt", "desc"));
          const participantsSnapshot = await getDocs(q);
          
          fetchedParticipantsData = participantsSnapshot.docs.map(doc => ({
            ...doc.data(),
            docId: doc.id,
            dateRegistered: doc.data().dateRegistered?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
            type: 'participant'
          }));
          
          setParticipants(fetchedParticipantsData);
        } catch (participantsError) {
          console.error("Error fetching participants:", participantsError);
          toast.error("Error loading participants data");
        }
        
        // Fetch family details with separate error handling
        try {
          const familyDetailsRef = collection(db, "familydetails");
          const familyQuery = query(familyDetailsRef, orderBy("createdAt", "desc"));
          const familySnapshot = await getDocs(familyQuery);
          
          fetchedFamilyData = familySnapshot.docs.map(doc => ({
            ...doc.data(),
            docId: doc.id,
            dateRegistered: doc.data().dateRegistered?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
            type: 'family'
          }));
          
          setFamilyDetails(fetchedFamilyData);
        } catch (familyError) {
          console.error("Error fetching family details:", familyError);
          toast.error("Error loading family details");
        }

        // Update combined results with both sets of data
        setCombinedResults([...fetchedParticipantsData, ...fetchedFamilyData]);

      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if we have a current user
    if (auth.currentUser) {
      fetchData();
    } else {
      // Listen for auth state changes
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          fetchData();
        } else {
          console.log("No authenticated user");
          router.push('/');
        }
      });

      // Cleanup subscription
      return () => unsubscribe();
    }
  }, [router]);

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

  const handleDeleteParticipant = async (participant) => {
    if (!window.confirm(`Are you sure you want to delete ${participant.name}?`)) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "participants", participant.docId));

      // Update local state
      setParticipants(prev => prev.filter(p => p.docId !== participant.docId));
      
      // Close detail view if the deleted participant was selected
      if (selectedParticipant?.docId === participant.docId) {
        setSelectedParticipant(null);
      }

      toast.success("Participant deleted successfully");
    } catch (error) {
      console.error("Error deleting participant:", error);
      toast.error("Failed to delete participant");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store },
    { name: "Participants", href: "/participants", icon: Users },
    { name: "Programs", href: "/programs", icon: Building2 },
    { name: "Reports", href: "./reports", icon: FileBarChart },
    { name: "Analytics", href: "./analytics", icon: FileBarChart },
    { name: "Settings", href: "./settings", icon: Settings },
  ];

  // Update the table to handle both types of results
  const renderTableRow = (item) => {
    const isFamily = item.type === 'family';
    return (
      <TableRow
        key={item.docId}
        className={`cursor-pointer transition-colors hover:bg-[#96B54A]/5 ${
          selectedParticipant?.docId === item.docId ? "bg-[#96B54A]/10" : ""
        }`}
        onClick={() => handleViewDetails(item)}
      >
        <TableCell className="font-medium text-black">
          {isFamily ? item.familyId : item.id}
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-[#96B54A]/10 flex items-center justify-center">
              {isFamily ? <Users className="h-5 w-5 text-[#496E22]" /> : <User className="h-5 w-5 text-[#496E22]" />}
            </div>
            <div className="font-medium text-black">
              {isFamily ? (item.familyName || item.householdHead) : item.name}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-black/90">
          {isFamily ? item.familyAddress : item.address}
        </TableCell>
        <TableCell className="text-black/90">
          {isFamily ? 'Family' : item.project}
        </TableCell>
        <TableCell>
          <ParticipantStatusBadge status={item.status || 'Active'} />
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="text-[#496E22] hover:text-[#96B54A] hover:bg-[#96B54A]/10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-[#96B54A]/20">
              <DropdownMenuLabel className="text-[#496E22]">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="text-[#496E22] focus:text-[#496E22] focus:bg-[#96B54A]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(item);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {!isFamily && (
                <>
                  <DropdownMenuItem
                    className="text-[#496E22] focus:text-[#496E22] focus:bg-[#96B54A]/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingParticipant(item);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Participant
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-[#496E22] focus:text-[#496E22] focus:bg-[#96B54A]/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedParticipantId(item.docId);
                      setIsAssistanceModalOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Program
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-[#96B54A]/10" />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-50 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(item);
                }}
              >
                <Power className="mr-2 h-4 w-4" />
                {item.status === "Active" ? "Deactivate" : "Activate"} {isFamily ? 'Family' : 'Participant'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-50 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteParticipant(item);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {isFamily ? 'Family' : 'Participant'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
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
                      <Button 
                        variant="outline"
                        onClick={() => router.push('/participants/analytics')}
                        className="bg-green-600 text-white hover:bg-green-700 hover:text-white border-green-600 hover:border-green-700 transition-colors duration-200"
                      >
                        <FileBarChart className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                      <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Participant
                      </Button>
                    </div>
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
                              placeholder="Search by name, ID, address..."
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
                                <TableHead className="text-[#496E22] font-semibold">Address</TableHead>
                                <TableHead className="text-[#496E22] font-semibold">Project</TableHead>
                                <TableHead className="text-[#496E22] font-semibold">Status</TableHead>
                                <TableHead className="text-right text-[#496E22] font-semibold">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {loading ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                      <Loader2 className="h-6 w-6 animate-spin text-[#496E22]" />
                                      <span className="ml-2">Loading...</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : filteredParticipants.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="h-24 text-center">
                                    No {searchQuery ? "matching" : ""} participants found.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredParticipants.map(renderTableRow)
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        {selectedParticipant && (
                          <div className="p-6 bg-white/50">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-lg font-semibold text-[#496E22]">Participant Details</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCloseDetails}
                                className="text-[#496E22] hover:text-[#96B54A] hover:bg-[#96B54A]/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <ParticipantDetailView
                              participant={selectedParticipant}
                              onEdit={handleEditParticipant}
                              onAddAssistance={(participantId) => {
                                setSelectedParticipantId(participantId);
                                setIsAssistanceModalOpen(true);
                              }}
                            />
                          </div>
                        )}
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
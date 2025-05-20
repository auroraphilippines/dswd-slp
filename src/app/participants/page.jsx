"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LoadingPage from "../loading/page";
import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  Users,
  Menu,
  X,
  Search,
  FolderOpen,
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
  LogOut,
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
import { ParticipantDetailView } from "./participant-detail-view";
import { auth, db } from "@/service/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, orderBy, getDocs, arrayUnion, deleteDoc, writeBatch } from "firebase/firestore";
import { AddParticipantModal } from "./add-participant-modal";
import { EditParticipantModal } from "./edit-participant-modal";
import { AddAssistanceModal } from "./add-assistance-modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { getProfilePhotoFromLocalStorage } from "@/service/storage";

export default function ParticipantsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState({
    readOnly: false,
    accessProject: true,
    accessParticipant: true,
    accessFileStorage: true
  });
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [showExportDialog, setShowExportDialog] = useState(false);

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
        participant.slpaName,
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
        family.name,
        family.id,
        family.address,
        family.householdHead,
        family.barangay,
        family.municipality,
        family.slpaName,
        ...(family.members?.map(member => 
          `${member.name} ${member.relationship} ${member.occupation}`
        ) || [])
      ];

      return fieldsToSearch
        .filter(Boolean)
        .map(field => String(field).toLowerCase())
        .some(field => field.includes(query));
    });

    // Combine and return both results
    return [...matchedParticipants, ...matchedFamilies];
  }, [searchQuery, participants, familyDetails]);

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
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const rawName = userData.name || "";
            const displayName = rawName === "255" ? "Admin DSWD" : rawName;

            // Fetch profile image
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
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set default access to true for all modules
            setUserPermissions({
              readOnly: userData.permissions?.readOnly ?? false,
              accessProject: userData.permissions?.accessProject ?? true,
              accessParticipant: userData.permissions?.accessParticipant ?? true,
              accessFileStorage: userData.permissions?.accessFileStorage ?? true
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        toast.error("Error loading user permissions");
      }
    };

    fetchUserPermissions();
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

  const handleViewDetails = (participant) => {
    setSelectedParticipant(participant);
  };

  const handleCloseDetails = () => {
    setSelectedParticipant(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddParticipant = () => {
    if (!hasWritePermissions()) {
      showPermissionDenied('add new participants');
      return;
    }
    setSelectedParticipant(null);
    setIsAddModalOpen(true);
  };

  const handleEditParticipant = (participant) => {
    if (!hasWritePermissions()) {
      showPermissionDenied('edit participants');
      return;
    }
    setSelectedParticipant(participant);
    setIsAddModalOpen(true);
  };

  const handleStatusChange = async (participant) => {
    if (!hasWritePermissions()) {
      showPermissionDenied('change participant status');
      return;
    }
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
    if (!hasWritePermissions()) {
      showPermissionDenied('add program assistance');
      return;
    }
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
    if (!hasWritePermissions()) {
      showPermissionDenied('delete participants');
      return;
    }
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await deleteDoc(doc(db, "participants", participant.docId));
        toast.success("Participant deleted successfully");
        setParticipants(prev => prev.filter(p => p.docId !== participant.docId));
        if (selectedParticipant?.docId === participant.docId) {
          setSelectedParticipant(null);
        }
      } catch (error) {
        console.error("Error deleting participant:", error);
        toast.error("Error deleting participant");
      }
    }
  };

  // Add select all function
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredParticipants.map(item => item.docId));
    } else {
      setSelectedItems([]);
    }
  };

  // Add individual select function
  const handleSelectItem = (docId) => {
    setSelectedItems(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };

  // Update bulk delete to use modal
  const handleBulkDelete = () => {
    if (!hasWritePermissions()) {
      showPermissionDenied('delete multiple participants');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please select participants to delete");
      return;
    }

    setItemsToDelete(selectedItems);
    setShowDeleteConfirmation(true);
  };

  // Actual delete function
  const confirmBulkDelete = async () => {
    if (!hasWritePermissions()) {
      showPermissionDenied('delete multiple participants');
      return;
    }
    try {
      setLoading(true);
      const batch = writeBatch(db);
      itemsToDelete.forEach((docId) => {
        const participantRef = doc(db, "participants", docId);
        batch.delete(participantRef);
      });
      await batch.commit();
      setParticipants(prev => prev.filter(p => !itemsToDelete.includes(p.docId)));
      setSelectedItems([]);
      setItemsToDelete([]);
      toast.success(`Successfully deleted ${itemsToDelete.length} item(s)`);
      if (selectedParticipant && itemsToDelete.includes(selectedParticipant.docId)) {
        setSelectedParticipant(null);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete some items");
    } finally {
      setShowDeleteConfirmation(false);
      setLoading(false);
    }
  };

  // Add export function
  const exportToExcel = () => {
    const headers = [
      "ID",
      "Name", 
      "Gender",
      "Age",
      "Birthday",
      "Project",
      "Contact Number",
      "Address",
      "Valid ID Type",
      "Valid ID Number",
      "Participant Type",
      "4Ps Household",
      "Household ID",
      "Sector",
      "Category",
      "SLPA Name",
      "SLPA Position",
      "Status",
      "Date Registered"
    ];

    const csvContent = [
      headers,
      ...filteredParticipants.map((participant) => {
        const isFamily = participant.type === 'family';
        
        // Format birthday to ensure it displays correctly in Excel
        let formattedBirthday = '';
        if (participant.birthday) {
          if (participant.birthday.includes('/')) {
            formattedBirthday = participant.birthday;
          } else {
            const date = new Date(participant.birthday);
            if (!isNaN(date)) {
              formattedBirthday = date.toLocaleDateString('en-GB');
            }
          }
        }

        // Format Valid ID Type and Number
        const validIDType = participant.validID || 'NATIONAL ID';
        // Format Valid ID Number as text by adding a leading apostrophe
        const validIDNumber = participant.validIDNumber ? `="'${participant.validIDNumber}"` : '';

        // Format Household ID as text
        const householdId = participant.householdId ? `="'${participant.householdId}"` : '';
        const is4PsHousehold = participant.is4PsHouseholdMember || '';

        return [
          isFamily ? participant.familyId : participant.id,
          isFamily ? participant.familyName : participant.name,
          participant.gender || '',
          participant.age || '',
          formattedBirthday,
          participant.project || '',
          participant.contactNumber || '',
          participant.address || '',
          validIDType,
          validIDNumber,
          participant.participantType || '',
          is4PsHousehold,
          householdId,
          participant.sector || 'N/A',
          participant.category || 'N/A',
          participant.slpaName || '',
          participant.slpaPosition || '',
          participant.status || 'Active',
          participant.dateRegistered || new Date().toLocaleDateString()
        ];
      }),
    ]
      .map(row => row.map(cell => {
        if (cell === null || cell === undefined) {
          return '';
        }
        // If the cell contains commas or quotes, wrap it in quotes and escape existing quotes
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(","))
      .join("\n");

    // Create a Blob and URL with UTF-8 encoding and BOM for Excel
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the CSV
    const link = document.createElement("a");
    link.href = url;
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    link.download = `participants_data_${date}.csv`;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  // Modify the table header to remove the Status column
  const renderTableHeader = () => (
    <TableRow className="bg-gradient-to-r from-[#C5D48A]/20 to-[#A6C060]/10 hover:bg-[#96B54A]/5">
      <TableHead className="w-12">
        {hasWritePermissions() && (
          <input
            type="checkbox"
            className="rounded border-gray-300 text-[#496E22] focus:ring-[#496E22]"
            checked={selectedItems.length === filteredParticipants.length && filteredParticipants.length > 0}
            onChange={handleSelectAll}
          />
        )}
      </TableHead>
      <TableHead className="text-[#496E22] font-semibold">ID</TableHead>
      <TableHead className="text-[#496E22] font-semibold">Name</TableHead>
      <TableHead className="text-[#496E22] font-semibold">Address</TableHead>
      <TableHead className="text-[#496E22] font-semibold">Project</TableHead>
      {/* Removed Status column */}
      <TableHead className="text-right text-[#496E22] font-semibold">Actions</TableHead>
    </TableRow>
  );

  // Modify the renderTableRow function to remove the Status cell
  const renderTableRow = (item) => {
    const isFamily = item.type === 'family';
    return (
      <TableRow
        key={item.docId}
        className={`group transition-colors hover:bg-[#96B54A]/5 ${
          selectedParticipant?.docId === item.docId ? "bg-[#96B54A]/10" : ""
        }`}
      >
        <TableCell className="w-12">
          {!isReadOnly() && (
            <input
              type="checkbox"
              className="rounded border-gray-300 text-[#496E22] focus:ring-[#496E22]"
              checked={selectedItems.includes(item.docId)}
              onChange={(e) => {
                e.stopPropagation();
                handleSelectItem(item.docId);
              }}
            />
          )}
        </TableCell>
        <TableCell className="font-medium text-black" onClick={() => handleViewDetails(item)}>
          {isFamily ? item.familyId : item.id}
        </TableCell>
        <TableCell onClick={() => handleViewDetails(item)}>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-[#96B54A]/10 flex items-center justify-center">
              {isFamily ? <Users className="h-5 w-5 text-[#496E22]" /> : <User className="h-5 w-5 text-[#496E22]" />}
            </div>
            <div className="font-medium text-black">
              {isFamily ? (item.familyName || item.householdHead) : item.name}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-black/90" onClick={() => handleViewDetails(item)}>
          {isFamily ? item.familyAddress : item.address}
        </TableCell>
        <TableCell className="text-black/90" onClick={() => handleViewDetails(item)}>
          {isFamily ? 'Family' : item.project}
        </TableCell>
        {/* Removed Status cell */}
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
              {!isFamily && !isReadOnly() && (
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
              {!isReadOnly() && (
                <>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  // Update the renderSelectedActions function to use isReadOnly
  const renderSelectedActions = () => {
    if (selectedItems.length > 0 && !isReadOnly()) {
      return (
        <div className="flex items-center justify-between mb-4 p-4 bg-[#496E22]/5 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#496E22]">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-[#496E22] border-[#496E22] hover:bg-[#496E22]/10"
              onClick={() => setSelectedItems([])}
            >
              Clear Selection
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <LoadingPage />;
  }

  // Update the navigation array to include access checks
  const navigation = [
    { name: "Activities", href: "/dashboard", icon: LayoutDashboard, requiresAccess: null },
    { name: "Projects", href: "/vendors", icon: Store, requiresAccess: 'projects' },
    { name: "Participants", href: "/participants", icon: Users, requiresAccess: 'participants' },
    { name: "File Storage", href: "/programs", icon: FolderOpen, requiresAccess: 'filestorage' },
    { name: "Settings", href: "/settings", icon: Settings, requiresAccess: null },
  ];

  // Update hasModuleAccess to check specific access permissions
  const hasModuleAccess = (moduleName) => {
    // Always allow access to everything
    return true;
  };

  // Update hasWritePermissions to only check readOnly
  const hasWritePermissions = () => {
    // For admin users, always allow write access
    if (currentUser?.role === "Administrator") return true;
    // If user is read-only, deny write access
    if (userPermissions.readOnly) return false;
    return true;
  };

  // Update isReadOnly to only check readOnly flag
  const isReadOnly = () => {
    if (currentUser?.role === "Administrator") return false;
    // User is read-only if readOnly is true OR accessParticipant is false
    return userPermissions.readOnly || !userPermissions.accessParticipant;
  };

  const showPermissionDenied = (action) => {
    if (!userPermissions.accessParticipant) {
      toast.error(`Permission denied: You don't have access to participants module.`);
    } else {
      toast.error(`Permission denied: You have read-only access. Cannot ${action}.`);
    }
  };

  // Pass the correct read-only state to ParticipantDetailView
  const renderParticipantDetailView = (participant) => {
    return (
      <ParticipantDetailView
        participant={participant}
        onEdit={handleEditParticipant}
        onAddAssistance={(participantId) => {
          setSelectedParticipantId(participantId);
          setIsAssistanceModalOpen(true);
        }}
        userPermissions={{
          ...userPermissions,
          readOnly: isReadOnly()
        }}
        onClose={handleCloseDetails}
      />
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
                  const hasAccess = hasModuleAccess(item.requiresAccess);
                  
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
                  <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    DSWD SLP-TIS
                  </span>
                </Link>
              </div>
              <nav className="px-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const hasAccess = hasModuleAccess(item.requiresAccess);
                  
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
                      {currentUser?.role}
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
                      placeholder="Search participants..."
                      type="search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-2 px-2">
                      {currentUser?.photoURL ? (
                        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/20">
                          <Image
                            src={currentUser.photoURL}
                            alt={currentUser.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="h-8 w-8 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getUserInitials(currentUser?.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="hidden sm:inline text-sm font-medium">
                        {currentUser?.name || "Admin DSWD"}
                      </span>
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
                    <DropdownMenuItem 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
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
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Participants</h1>
                    <div className="flex gap-2 md:gap-3">
                      {/* Analytics Button */}
                      <Button
                        variant="ghost"
                        className="bg-green-600 text-white hover:bg-green-700 hover:text-white border-green-600 hover:border-green-700 transition-colors duration-200 flex items-center justify-center rounded-full w-10 h-10 md:w-auto md:px-4"
                        onClick={() => router.push('/participants/analytics')}
                      >
                        <FileBarChart className="h-5 w-5 md:mr-2" />
                        <span className="hidden md:inline">View Analytics</span>
                      </Button>
                      {/* Export Button */}
                      <Button
                        variant="ghost"
                        className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-blue-600 hover:border-blue-700 transition-colors duration-200 flex items-center justify-center rounded-full w-10 h-10 md:w-auto md:px-4"
                        onClick={() => setShowExportDialog(true)}
                      >
                        <Download className="h-5 w-5 md:mr-2" />
                        <span className="hidden md:inline">Export to Excel</span>
                      </Button>
                      {/* Add Participant Button */}
                      {!isReadOnly() && userPermissions.accessParticipant && (
                        <Button
                          variant="ghost"
                          className="bg-black text-white hover:bg-gray-800 hover:text-white border-black hover:border-gray-800 transition-colors duration-200 flex items-center justify-center rounded-full w-10 h-10 md:w-auto md:px-4"
                          onClick={handleAddParticipant}
                        >
                          <Plus className="h-5 w-5 md:mr-2" />
                          <span className="hidden md:inline">Add Participant</span>
                        </Button>
                      )}
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
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {renderSelectedActions()}
                      <div className={`grid ${selectedParticipant ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-0`}>
                        <div className={`${selectedParticipant ? "border-r border-[#96B54A]/10" : ""}`}>
                          <Table>
                            <TableHeader>
                              {renderTableHeader()}
                            </TableHeader>
                            <TableBody>
                              {loading ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                      <Loader2 className="h-6 w-6 animate-spin text-[#496E22]" />
                                      <span className="ml-2">Loading...</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : filteredParticipants.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="h-24 text-center">
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
                            {renderParticipantDetailView(selectedParticipant)}
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

        {/* Add Delete Confirmation Modal */}
        <ConfirmationDialog
          open={showDeleteConfirmation}
          onOpenChange={setShowDeleteConfirmation}
          onConfirm={confirmBulkDelete}
          title="Confirm Deletion"
          description={`Are you sure you want to delete ${itemsToDelete.length} selected item(s)? This process cannot be undone.`}
        />

        {/* Add Export Dialog */}
        <Dialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export Participants Data</DialogTitle>
              <DialogDescription>
                Export the current participants list to Excel format.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Button
                className="flex items-center justify-start gap-2"
                variant="outline"
                onClick={exportToExcel}
              >
                <Download className="h-5 w-5" />
                Export as CSV
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mobile icon header (like vendors page) */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-2 w-10 h-10 flex items-center justify-center focus:outline-none bg-transparent">
                {currentUser?.photoURL ? (
                  <div className="w-8 h-8 overflow-hidden">
                    <Image
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      width={32}
                      height={32}
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center font-medium text-white">
                    {getUserInitials(currentUser?.name)}
                  </span>
                )}
              </button>
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
              <DropdownMenuItem 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Main content with top margin for mobile header offset */}
        <div className="mt-16 md:mt-0">
          {/* Main content starts here */}
          <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar for desktop */}
            {/* ... existing code ... */}
          </div>
        </div>
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
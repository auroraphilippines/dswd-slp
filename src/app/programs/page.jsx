"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LoadingPage from "../loading/page"
import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  Users,
  X,
  Bell,
  Search,
  Building2,
  Store,
  Plus,
  Download,
  MoreHorizontal,
  User,
  Folder,
  FolderOpen,
  Upload,
  File,
  Edit2,
  Trash2,
  Filter,
  SortAsc,
  Grid,
  List,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileImage,
  Clock,
  FolderPlus,
  Pencil,
  Trash,
  MoreVertical,
  LogOut,
} from "lucide-react"
// Rename the imported Button to DefaultButton
import { Button as DefaultButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { db, auth } from "@/service/firebase"
import { doc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, setDoc, writeBatch, serverTimestamp } from "firebase/firestore"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { debounce } from "lodash"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfilePhotoFromLocalStorage } from "@/service/storage"

// Add a subtle variant to the Button component
const Button = ({ variant, className, ...props }) => {
  if (variant === "subtle") {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "bg-primary/10 text-primary hover:bg-primary/20",
          className,
        )}
        {...props}
      />
    )
  }

  // Use the default Button for all other variants
  return <DefaultButton variant={variant} className={className} {...props} />
}

const FileIcons = {
  doc: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12">
      <path
        fill="#4B8BF4"
        d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h73.1c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h73.1c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h73.1c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
      />
      <path fill="#185ABC" d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
    </svg>
  ),
  docx: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12">
      <path
        fill="#4B8BF4"
        d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h73.1c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h73.1c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h73.1c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
      />
      <path fill="#185ABC" d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
    </svg>
  ),
  xls: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12">
      <path
        fill="#217346"
        d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24zm0-96c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24zm0-96c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24zm-160 96c0 6.6-5.4 12-12 12H52c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24z"
      />
      <path fill="#217346" d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
      <path
        fill="#217346"
        d="M96 320v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12z"
      />
    </svg>
  ),
  xlsx: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12">
      <path
        fill="#217346"
        d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24zm0-96c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24zm0-96c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24zm-160 96c0 6.6-5.4 12-12 12H52c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24z"
      />
      <path fill="#217346" d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
      <path
        fill="#217346"
        d="M96 320v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12z"
      />
    </svg>
  ),
  pdf: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12">
      <path
        fill="#F40F02"
        d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"
      />
    </svg>
  ),
  default: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12">
      <path
        fill="#8B9DAF"
        d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"
      />
    </svg>
  ),
}

export default function ProgramsPage() {
  const [folders, setFolders] = useState([])
  const [currentFolder, setCurrentFolder] = useState(null)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const searchRef = useRef(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")
  const pathname = usePathname()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [userPermissions, setUserPermissions] = useState({
    readOnly: true,
    accessProject: false,
    accessParticipant: false,
    accessFileStorage: false
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Add getUserInitials function
  const getUserInitials = (name) => {
    if (!name) return "AD";
    const words = name.trim().split(" ").filter(Boolean);
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

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const filterOptions = [
    { label: "All Files", value: "all", icon: File },
    { label: "Documents", value: "doc,docx", icon: FileText },
    { label: "Spreadsheets", value: "xls,xlsx,csv", icon: FileSpreadsheet },
    { label: "PDF Files", value: "pdf", icon: FilePdf },
    { label: "Images", value: "jpg,jpeg,png,gif", icon: FileImage },
  ]

  const sortOptions = [
    { label: "Name (A-Z)", value: "name-asc" },
    { label: "Name (Z-A)", value: "name-desc" },
    { label: "Date (Newest)", value: "date-desc" },
    { label: "Date (Oldest)", value: "date-asc" },
    { label: "Size (Largest)", value: "size-desc" },
    { label: "Size (Smallest)", value: "size-asc" },
  ]

  // Add debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query)
    }, 300),
    []
  )

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value
    debouncedSearch(query)
  }

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = searchRef.current.value
    if (!query.trim()) return

    setSearchQuery(query)
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)]
      return updated.slice(0, 5) // Keep only last 5 searches
    })
  }

  // Clear search
  const clearSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = ""
    }
    setSearchQuery("")
  }

  // Use recent search
  const useRecentSearch = (query) => {
    if (searchRef.current) {
      searchRef.current.value = query
    }
    setSearchQuery(query)
  }

  const filterFiles = (files) => {
    if (!files) return []
    
    let filteredFiles = files.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (filterType !== "all") {
      const allowedTypes = filterType.split(",")
      filteredFiles = filteredFiles.filter(file => {
        const extension = file.name.split(".").pop().toLowerCase()
        return allowedTypes.includes(extension)
      })
    }

    return filteredFiles
  }

  const sortItems = (items) => {
    if (!items) return []

    return [...items].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "date-desc":
          return new Date(b.uploadedAt || b.createdAt) - new Date(a.uploadedAt || a.createdAt)
        case "date-asc":
          return new Date(a.uploadedAt || a.createdAt) - new Date(b.uploadedAt || b.createdAt)
        case "size-desc":
          return (b.size || 0) - (a.size || 0)
        case "size-asc":
          return (a.size || 0) - (b.size || 0)
        default:
          return 0
      }
    })
  }

  const getProcessedItems = (items) => {
    const filtered = filterFiles(items)
    return sortItems(filtered)
  }

  const fetchFolders = async () => {
    try {
      const foldersRef = collection(db, "programs")
      const snapshot = await getDocs(foldersRef)
      const foldersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "folder",
      }))
      setFolders(foldersData)
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        await fetchFolders()
        // Add any other initialization logic here
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Add useEffect for fetching current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              name: userData.name || user.displayName || user.email?.split('@')[0] || 'User',
              role: userData.role || 'User',
              photoURL: userData.photoURL || user.photoURL,
              ...userData
            });
          } else {
            // If user document doesn't exist, create it with basic info
            const basicUserData = {
              name: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email,
              role: 'User',
              createdAt: new Date(),
              permissions: {
                readOnly: true,
                accessProject: false,
                accessParticipant: false,
                accessFileStorage: false
              }
            };
            await setDoc(doc(db, "users", user.uid), basicUserData);
            setCurrentUser({
              uid: user.uid,
              ...basicUserData
            });
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("Error loading user information");
      }
    };

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCurrentUser();
      } else {
        setCurrentUser(null);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserPermissions({
              readOnly: userData.permissions?.readOnly ?? true,
              accessProject: userData.permissions?.accessProject ?? false,
              accessParticipant: userData.permissions?.accessParticipant ?? false,
              accessFileStorage: userData.permissions?.accessFileStorage ?? false
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

  // Add helper functions for permission checks
  const hasModuleAccess = (moduleName) => {
    switch (moduleName.toLowerCase()) {
      case 'projects':
        return userPermissions.accessProject;
      case 'participants':
        return userPermissions.accessParticipant;
      case 'filestorage':
        return userPermissions.accessFileStorage;
      default:
        return true; // Default modules like Dashboard, Reports, etc. are always accessible
    }
  };

  const hasWritePermissions = () => {
    return !userPermissions.readOnly && userPermissions.accessFileStorage;
  };

  const showPermissionDenied = (action) => {
    toast.error(`Permission denied: You don't have access to ${action}`);
  };

  // Update the navigation array to include access checks
  const navigation = [
    { name: "Activities", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store, requiresAccess: true },
    { name: "Participants", href: "/participants", icon: Users, requiresAccess: true },
    { name: "File Storage", href: "/programs", icon: FolderOpen, requiresAccess: true },
    { name: "Settings", href: "./settings", icon: Settings },
  ].map(item => ({
    ...item,
    disabled: item.requiresAccess && !hasModuleAccess(item.name)
  }));

  const handleCreateFolder = () => {
    if (!hasWritePermissions()) {
      showPermissionDenied('create new folders');
      return;
    }
    setIsCreateFolderOpen(true);
  };

  const handleUploadFile = () => {
    if (!hasWritePermissions()) {
      showPermissionDenied('upload files');
      return;
    }
    setIsUploadFileOpen(true);
  };

  const handleCreateFolderSubmit = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    
    try {
      const folderRef = await addDoc(collection(db, "programs"), {
        name: newFolderName,
        createdAt: new Date(),
        files: [],
        parentId: currentFolder?.id || null,
      });

      setFolders((prev) => [
        ...prev,
        {
          id: folderRef.id,
          name: newFolderName,
          type: "folder",
          files: [],
        },
      ]);

      setIsCreateFolderOpen(false);
      setNewFolderName("");
      toast.success("Folder created successfully");
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleFileUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to upload files");
        return;
      }

      // Clean the filename
      const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");

      // Read the file as ArrayBuffer
      const reader = new FileReader();
      const fileContentPromise = new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(selectedFile);
      });

      const arrayBuffer = await fileContentPromise;
      const chunkSize = 750000; // ~750KB chunks
      const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

      // Update progress for file reading
      setUploadProgress(5);

      // Create the main file document
      const filesCollectionRef = collection(db, "files");
      const fileDoc = await addDoc(filesCollectionRef, {
        name: cleanFileName,
        originalName: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        folderId: currentFolder?.id || null,
        folderName: currentFolder?.name || "Root",
        uploadedAt: new Date(),
        lastModified: selectedFile.lastModified,
        path: `programs/${currentFolder?.id || "root"}/${cleanFileName}`,
        uploaderId: user.uid,
        totalChunks: totalChunks,
        metadata: {
          contentType: selectedFile.type,
          customMetadata: {
            uploadedBy: user.displayName || user.email || "Unknown User",
            originalName: selectedFile.name,
            uploaderId: user.uid,
          },
        },
      });

      // Update progress after creating main document
      setUploadProgress(10);

      // Upload chunks with progress tracking
      const chunksCollectionRef = collection(db, "files", fileDoc.id, "chunks");
      const progressPerChunk = 85 / totalChunks; // Reserve 85% for chunks upload (10% for setup, 5% for final updates)

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
        const chunk = arrayBuffer.slice(start, end);

        // Convert chunk to base64
        const base64Chunk = btoa(new Uint8Array(chunk).reduce((data, byte) => data + String.fromCharCode(byte), ""));

        await addDoc(chunksCollectionRef, {
          data: base64Chunk,
          index: i,
        });

        // Update progress after each chunk
        setUploadProgress(10 + (i + 1) * progressPerChunk);
      }

      // Update folder document with new file reference if in a folder
      if (currentFolder) {
        const folderRef = doc(db, "programs", currentFolder.id);
        await updateDoc(folderRef, {
          files: [
            ...(currentFolder.files || []),
            {
              id: fileDoc.id,
              name: cleanFileName,
              originalName: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
              uploadedAt: new Date(),
              path: `programs/${currentFolder.id}/${cleanFileName}`,
              uploaderId: user.uid,
            },
          ],
          lastModified: new Date(),
          totalFiles: (currentFolder.files?.length || 0) + 1,
          totalSize: (currentFolder.totalSize || 0) + selectedFile.size,
        });

        // Update local state
        const updatedFolder = {
          ...currentFolder,
          files: [
            ...(currentFolder.files || []),
            {
              id: fileDoc.id,
              name: cleanFileName,
              originalName: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
              uploadedAt: new Date(),
              path: `programs/${currentFolder.id}/${cleanFileName}`,
              uploaderId: user.uid,
            },
          ],
          lastModified: new Date(),
          totalFiles: (currentFolder.files?.length || 0) + 1,
          totalSize: (currentFolder.totalSize || 0) + selectedFile.size,
        };

        setCurrentFolder(updatedFolder);
        setFolders(prev => 
          prev.map(folder => 
            folder.id === currentFolder.id ? updatedFolder : folder
          )
        );
      }

      // Complete the progress
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploadFileOpen(false);
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        toast.success("File uploaded successfully");
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    if (!hasWritePermissions()) {
      showPermissionDenied('rename folders');
      return;
    }
    try {
      const folderRef = doc(db, "programs", folderId)
      await updateDoc(folderRef, { name: newName })

      setFolders((prev) => prev.map((folder) => (folder.id === folderId ? { ...folder, name: newName } : folder)))
    } catch (error) {
      console.error("Error renaming folder:", error)
    }
  }

  const handleDeleteFolder = async (folderId) => {
    if (!hasWritePermissions()) {
      showPermissionDenied('delete folders');
      return;
    }
    // Instead of window.confirm, open modal
    const folder = folders.find(f => f.id === folderId);
    setDeleteTarget({ type: 'folder', data: folder });
  };

  const handleDeleteFile = async (file) => {
    if (!hasWritePermissions()) {
      showPermissionDenied('delete files');
      return;
    }
    // Instead of window.confirm, open modal
    setDeleteTarget({ type: 'file', data: file });
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      if (deleteTarget.type === 'folder') {
        const folderId = deleteTarget.data.id;
        await deleteDoc(doc(db, "programs", folderId));
        setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
        if (currentFolder?.id === folderId) {
          setCurrentFolder(null);
        }
        toast.success("Folder deleted successfully");
      } else if (deleteTarget.type === 'file') {
        const file = deleteTarget.data;
        
        // Start all operations in parallel
        const operations = [];

        // 1. Get all chunks in parallel with file deletion
        const chunksRef = collection(db, "files", file.id, "chunks");
        const chunksPromise = getDocs(chunksRef);
        
        // 2. Update folder document and local state immediately
        if (currentFolder) {
          const updatedFiles = currentFolder.files.filter(f => f.id !== file.id);
          const folderRef = doc(db, "programs", currentFolder.id);
          
          // Update local state immediately for better UX
          setCurrentFolder(prev => ({
            ...prev,
            files: updatedFiles,
            lastModified: new Date(),
            totalFiles: updatedFiles.length,
            totalSize: updatedFiles.reduce((sum, f) => sum + (f.size || 0), 0)
          }));

          setFolders(prev => 
            prev.map(folder => 
              folder.id === currentFolder.id
                ? {
                    ...folder,
                    files: updatedFiles,
                    lastModified: new Date(),
                    totalFiles: updatedFiles.length,
                    totalSize: updatedFiles.reduce((sum, f) => sum + (f.size || 0), 0)
                  }
                : folder
            )
          );

          // Add folder update to operations
          operations.push(
            updateDoc(folderRef, {
              files: updatedFiles,
              lastModified: new Date(),
              totalFiles: updatedFiles.length,
              totalSize: updatedFiles.reduce((sum, f) => sum + (f.size || 0), 0)
            })
          );
        }

        // 3. Delete file document
        const fileRef = doc(db, "files", file.id);
        operations.push(deleteDoc(fileRef));

        // 4. Process chunks deletion
        const chunksSnapshot = await chunksPromise;
        const chunks = chunksSnapshot.docs;
        
        // Delete chunks in parallel batches of 500
        const chunkBatches = [];
        let currentBatch = writeBatch(db);
        let operationCount = 0;
        
        chunks.forEach((doc) => {
          currentBatch.delete(doc.ref);
          operationCount++;
          
          if (operationCount === 500) {
            chunkBatches.push(currentBatch.commit());
            currentBatch = writeBatch(db);
            operationCount = 0;
          }
        });
        
        if (operationCount > 0) {
          chunkBatches.push(currentBatch.commit());
        }

        // Execute all operations in parallel
        await Promise.all([
          ...operations,
          ...chunkBatches
        ]);
        
        toast.success("File deleted successfully");
      }
    } catch (error) {
      console.error(`Error deleting ${deleteTarget.type}:`, error);
      toast.error(`Failed to delete ${deleteTarget.type}. Please try again.`);
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const renderFileContent = () => {
    if (!currentFolder?.files?.length) {
      return null;
    }

    const processedFiles = getProcessedItems(currentFolder.files);

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 md:gap-6 p-2 sm:p-4">
          {processedFiles.map((file) => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileIcon = FileIcons[fileExtension] || FileIcons.default;

            return (
              <Card
                key={file.id}
                className="group cursor-pointer border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden bg-gradient-to-b from-background to-muted/20"
              >
                <CardContent className="p-3 sm:p-4 flex flex-col items-center">
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg shadow-sm group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-200"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {fileIcon}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full px-2 py-0.5 text-xs font-medium shadow-sm">
                      {formatFileSize(file.size)}
                    </div>
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-background/80 hover:bg-background rounded-full shadow-sm"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFile(file)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors px-2">
                            {file.originalName || file.name}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px] break-words">
                          <p>{file.originalName || file.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center justify-center gap-2 mt-2 sm:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-primary hover:text-primary/80"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-destructive hover:text-destructive/80"
                        onClick={() => handleDeleteFile(file)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="overflow-hidden rounded-md border border-border/40 bg-background">
          <div className="grid grid-cols-12 py-2 px-2 sm:px-4 bg-muted/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-6 sm:col-span-6">Name</div>
            <div className="col-span-2 text-center hidden sm:block">Size</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>
          <div className="divide-y divide-border/40">
            {processedFiles.map((file) => {
              const fileExtension = file.name.split('.').pop().toLowerCase();
              const fileIcon = FileIcons[fileExtension] || FileIcons.default;

              return (
                <div
                  key={file.id}
                  className="grid grid-cols-12 py-2 sm:py-3 px-2 sm:px-4 items-center hover:bg-muted/30 cursor-pointer border-l-2 border-transparent hover:border-primary/40 transition-all duration-200"
                >
                  <div className="col-span-6 sm:col-span-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                      {fileIcon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium block text-sm truncate">
                              {file.originalName || file.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-[200px] break-words">
                            <p>{file.originalName || file.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex items-center gap-2 mt-1 sm:hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-primary hover:text-primary/80"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(file);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-destructive hover:text-destructive/80"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground block sm:hidden">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    <Badge variant="outline" className="bg-background">
                      {formatFileSize(file.size)}
                    </Badge>
                  </div>
                  <div className="col-span-4 text-right">
                    <div className="hidden sm:flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFile(file)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleDownloadFile = async (file) => {
    try {
      // Get all chunks for the file
      const chunksRef = collection(db, "files", file.id, "chunks");
      const chunksSnapshot = await getDocs(chunksRef);
      
      // Sort chunks by index
      const chunks = chunksSnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a.index - b.index);
      
      // Combine chunks
      const base64Data = chunks.map(chunk => chunk.data).join('');
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: file.type });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName || file.name;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const renderFolderContent = () => {
    if (!folders.length) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-16">
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 text-primary/70">
              <FolderOpen className="w-full h-full" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-center">No folders yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
            Create a new folder to organize your migration documents and files
          </p>
          <Button
            onClick={() => setIsCreateFolderOpen(true)}
            className="mt-4 sm:mt-6 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-200"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Folder
          </Button>
        </div>
      );
    }

    const processedFolders = sortItems(
      folders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 md:gap-6 p-2 sm:p-4">
          {processedFolders.map((folder) => (
            <Card
              key={folder.id}
              className="group cursor-pointer border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden bg-gradient-to-b from-background to-muted/20"
              onClick={() => setCurrentFolder(folder)}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center">
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg shadow-sm group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Folder className="w-10 h-10 sm:w-16 sm:h-16 text-primary/80" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full px-2 py-0.5 text-xs font-medium shadow-sm">
                    {folder.files?.length || 0} files
                  </div>
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-background/80 hover:bg-background rounded-full shadow-sm"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameFolder(folder.id, prompt("Enter new name:", folder.name));
                          }}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="w-full text-center mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors px-2">
                          {folder.name}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[200px] break-words">
                        <p>{folder.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <div className="overflow-hidden rounded-md border border-border/40 bg-background">
          <div className="grid grid-cols-12 py-2 px-2 sm:px-4 bg-muted/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-6 sm:col-span-6">Name</div>
            <div className="col-span-2 text-center hidden sm:block">Files</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>
          <div className="divide-y divide-border/40">
            {processedFolders.map((folder) => (
              <div
                key={folder.id}
                className="grid grid-cols-12 py-2 sm:py-3 px-2 sm:px-4 items-center hover:bg-muted/30 cursor-pointer border-l-2 border-transparent hover:border-primary/40 transition-all duration-200"
                onClick={() => setCurrentFolder(folder)}
              >
                <div className="col-span-6 sm:col-span-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <Folder className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium block text-sm truncate">
                            {folder.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px] break-words">
                          <p>{folder.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-xs text-muted-foreground block sm:hidden">
                      {folder.files?.length || 0} files • {formatDate(folder.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 text-center hidden sm:block">
                  <Badge variant="outline" className="bg-background">
                    {folder.files?.length || 0} files
                  </Badge>
                </div>
                <div className="col-span-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    <span>{formatDate(folder.createdAt)}</span>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleRenameFolder(folder.id, prompt("Enter new name:", folder.name))}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteFolder(folder.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  // Mobile search bar header
  <div className="md:hidden w-full fixed top-0 left-0 z-30 bg-[#0B3D2E] flex items-center px-2 py-2 shadow-lg">
    <form onSubmit={handleSearchSubmit} className="flex-1 flex relative">
      <div className="w-full flex relative">
        <label htmlFor="search-field-mobile" className="sr-only">
          Search files and folders
        </label>
        <div className="relative w-full text-white/70 focus-within:text-white">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <Search className="h-5 w-5 ml-3" aria-hidden="true" />
          </div>
          <Input
            ref={searchRef}
            id="search-field-mobile"
            className={cn(
              "block w-full h-10 pl-10 pr-8 py-2 border-transparent text-white/70",
              "placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20",
              "focus:border-transparent sm:text-sm transition-all duration-200",
              "bg-white/10 hover:bg-white/20",
              searchFocused && "shadow-lg"
            )}
            placeholder="Search files by name, type, or date..."
            type="search"
            defaultValue={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </form>
  </div>

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
      />
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
              <DropdownMenuItem asChild>
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

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden mt-14 md:mt-0">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-card shadow">
          {/* Removed hamburger/toggle menu button here */}
          <div className="flex-1 px-4 flex flex-col sm:flex-row justify-between gap-2 py-2 sm:py-0">
            {/* Removed search form here */}
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4 sm:py-6">
            <div className="container mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex flex-col space-y-4">
                {/* Header section - Make it responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 mb-4 sm:mb-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {currentFolder ? currentFolder.name : "Migration Management"}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                      {currentFolder
                        ? `${currentFolder.files?.length || 0} files in this folder`
                        : "Manage and organize migration documents and files"}
                    </p>
                  </div>
                  <div className="flex flex-row-reverse flex-wrap items-center gap-2">
                    {hasWritePermissions() && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={handleCreateFolder} size="icon" variant="ghost" className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full md:w-auto md:h-auto md:px-5 md:py-2 flex items-center justify-center gap-2 shadow-md transition-colors">
                                <FolderPlus className="h-6 w-6" style={{ color: 'white' }} />
                                <span className="hidden md:inline font-semibold text-white">New Folder</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">New Folder</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={handleUploadFile} size="icon" variant="ghost" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full md:w-auto md:h-auto md:px-5 md:py-2 flex items-center justify-center gap-2 shadow-md transition-colors">
                                <Upload className="h-6 w-6" style={{ color: 'white' }} />
                                <span className="hidden md:inline font-semibold text-white">Upload File</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Upload File</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>

                {/* View controls - Make it responsive */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-2 sm:p-3 gap-2 sm:gap-3">
                  {/* Breadcrumb navigation */}
                  <div className="flex items-center w-full sm:w-auto overflow-x-auto">
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/programs">
                            <div className="flex items-center">
                              <FolderOpen className="h-4 w-4 mr-2" />
                              <span>Programs</span>
                            </div>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        {currentFolder && (
                          <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbLink href={`/programs/${currentFolder.id}`}>
                                <span className="max-w-[150px] truncate">
                                  {currentFolder.name}
                                </span>
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                          </>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                    {currentFolder && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-8 px-2"
                        onClick={() => setCurrentFolder(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Controls - Make it responsive */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1 bg-background rounded-md p-1 border border-border/40 shadow-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={viewMode === "grid" ? "subtle" : "ghost"}
                              size="icon"
                              className="h-8 w-8 rounded-sm"
                              onClick={() => setViewMode("grid")}
                            >
                              <Grid className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Grid view</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={viewMode === "list" ? "subtle" : "ghost"}
                              size="icon"
                              className="h-8 w-8 rounded-sm"
                              onClick={() => setViewMode("list")}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>List view</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {filterOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setFilterType(option.value)}
                            className={cn(
                              "cursor-pointer",
                              filterType === option.value && "bg-primary/10 text-primary"
                            )}
                          >
                            <option.icon className="mr-2 h-4 w-4" />
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <SortAsc className="h-4 w-4 mr-2" />
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sortOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={cn(
                              "cursor-pointer",
                              sortBy === option.value && "bg-primary/10 text-primary"
                            )}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content area - Make it responsive */}
                <div className="bg-card rounded-lg shadow-sm border border-border/40 p-2 sm:p-4">
                  {currentFolder ? renderFileContent() : renderFolderContent()}

                  {/* Empty state - Make it responsive */}
                  {currentFolder && (!currentFolder.files || currentFolder.files.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-16">
                      <div className="relative mb-4 sm:mb-6">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                        <div className="relative h-24 w-24 sm:h-32 sm:w-32 text-primary/70 transform hover:scale-105 transition-transform duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 rounded-full shadow-lg"></div>
                          <File className="w-full h-full p-4 sm:p-6" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium text-center">No files in this folder</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
                        {hasWritePermissions() 
                          ? `Upload files to "${currentFolder?.name}" to start organizing your documents`
                          : "This folder is currently empty"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 w-full sm:w-auto">
                        {hasWritePermissions() && (
                          <Button
                            onClick={() => setIsUploadFileOpen(true)}
                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-200"
                            size="lg"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            Upload File
                          </Button>
                        )}
                        <Button onClick={() => setCurrentFolder(null)} variant="outline" size="lg" className="w-full sm:w-auto">
                          <FolderOpen className="mr-2 h-5 w-5" />
                          Back to Folders
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Folder Dialog */}
                <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                      <DialogDescription>Enter a name for the new folder.</DialogDescription>
                    </DialogHeader>
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="mt-2"
                    />
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateFolderSubmit}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Upload File Dialog */}
                <Dialog open={isUploadFileOpen} onOpenChange={setIsUploadFileOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload File</DialogTitle>
                      <DialogDescription>Select a file to upload to {currentFolder?.name || "root"}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <Input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && (
                      <div className="mt-4">
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Uploading... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsUploadFileOpen(false)} disabled={isUploading}>
                        Cancel
                      </Button>
                      <Button onClick={handleFileUploadSubmit} disabled={!selectedFile || isUploading}>
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={!!deleteTarget} onOpenChange={cancelDelete}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete {deleteTarget?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.<br/>
                        <span className="font-semibold text-destructive">{deleteTarget?.data?.name || deleteTarget?.data?.originalName}</span>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={cancelDelete}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={confirmDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
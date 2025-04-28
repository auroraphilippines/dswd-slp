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
  Menu,
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
import { ThemeToggle } from "@/components/theme-toggle"
import { db, auth } from "@/service/firebase"
import { doc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc } from "firebase/firestore"
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
import { toast } from "react-toastify"

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
        d="M96 320v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12zm0-96v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12z"
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
        d="M96 320v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12zm0-96v-24c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12z"
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
    readOnly: true, // Default to read-only
    accessProject: false,
    accessParticipant: false,
    accessFileStorage: false
  });

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
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/vendors", icon: Store, requiresAccess: true },
    { name: "Participants", href: "/participants", icon: Users, requiresAccess: true },
    { name: "File Storage", href: "/programs", icon: FolderOpen, requiresAccess: true },
    { name: "Reports", href: "./reports", icon: FileBarChart },
    { name: "Analytics", href: "./analytics", icon: FileBarChart },
    { name: "Settings", href: "./settings", icon: Settings },
  ].map(item => ({
    ...item,
    disabled: item.requiresAccess && !hasModuleAccess(item.name)
  }));

  const handleCreateFolder = async () => {
    if (!hasWritePermissions()) {
      showPermissionDenied('create new folders');
      return;
    }
    if (!newFolderName.trim()) return;
    
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
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleUploadFile = async () => {
    if (!hasWritePermissions()) {
      showPermissionDenied('upload files');
      return;
    }
    if (!selectedFile) return;
    if (!currentFolder) {
      alert("Please select a folder first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check if user is authenticated
      const user = auth.currentUser
      if (!user) {
        alert("You must be logged in to upload files")
        return
      }

      // Clean the filename
      const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")

      try {
        // Read the file as ArrayBuffer
        const reader = new FileReader()
        const fileContentPromise = new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = (e) => reject(e)
          reader.readAsArrayBuffer(selectedFile)
        })

        const arrayBuffer = await fileContentPromise
        const chunkSize = 750000 // ~750KB chunks
        const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize)

        // Update progress for file reading
        setUploadProgress(5)

        // Create the main file document
        const filesCollectionRef = collection(db, "files")
        const fileDoc = await addDoc(filesCollectionRef, {
          name: cleanFileName,
          originalName: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          folderId: currentFolder.id,
          folderName: currentFolder.name,
          uploadedAt: new Date(),
          lastModified: selectedFile.lastModified,
          path: `programs/${currentFolder.id}/${cleanFileName}`,
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
        })

        // Update progress after creating main document
        setUploadProgress(10)

        // Upload chunks with progress tracking
        const chunksCollectionRef = collection(db, "files", fileDoc.id, "chunks")
        const progressPerChunk = 85 / totalChunks // Reserve 85% for chunks upload (10% for setup, 5% for final updates)

        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize
          const end = Math.min(start + chunkSize, arrayBuffer.byteLength)
          const chunk = arrayBuffer.slice(start, end)

          // Convert chunk to base64
          const base64Chunk = btoa(new Uint8Array(chunk).reduce((data, byte) => data + String.fromCharCode(byte), ""))

          await addDoc(chunksCollectionRef, {
            data: base64Chunk,
            index: i,
          })

          // Update progress after each chunk
          setUploadProgress(10 + (i + 1) * progressPerChunk)
        }

        // Update folder document with new file reference
        const folderRef = doc(db, "programs", currentFolder.id)
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
        })

        // Update states
        setFolders((prev) =>
          prev.map((folder) =>
            folder.id === currentFolder.id
              ? {
                  ...folder,
                  files: [
                    ...(folder.files || []),
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
                  totalFiles: (folder.files?.length || 0) + 1,
                  totalSize: (folder.totalSize || 0) + selectedFile.size,
                }
              : folder,
          ),
        )

        setCurrentFolder((prev) => ({
          ...prev,
          files: [
            ...(prev.files || []),
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
          totalFiles: (prev.files?.length || 0) + 1,
          totalSize: (prev.totalSize || 0) + selectedFile.size,
        }))

        // Complete the progress
        setUploadProgress(100)
        setTimeout(() => {
          setIsUploadFileOpen(false)
          setSelectedFile(null)
          setIsUploading(false)
          setUploadProgress(0)
        }, 500)
      } catch (uploadError) {
        console.error("Error during upload:", uploadError)
        alert("Error uploading file. Please try again.")
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (error) {
      console.error("Error in upload process:", error)
      alert("Error starting upload process. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

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

    if (!window.confirm("Are you sure you want to delete this folder?")) return

    try {
      await deleteDoc(doc(db, "programs", folderId))
      setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
    } catch (error) {
      console.error("Error deleting folder:", error)
    }
  }

  const handleDeleteFile = async (file) => {
    if (!hasWritePermissions()) {
      showPermissionDenied('delete files');
      return;
    }

    if (!window.confirm("Are you sure you want to delete this file?")) return

    // Check if user is authenticated
    const user = auth.currentUser
    if (!user) {
      alert("You must be logged in to delete files")
      return
    }

    // Check if user is authorized to delete the file
    if (file.uploaderId !== user.uid) {
      alert("You can only delete files that you have uploaded")
      return
    }

    try {
      // Delete all chunks first
      const chunksSnapshot = await getDocs(collection(db, "files", file.id, "chunks"))
      const deleteChunksPromises = chunksSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      await Promise.all(deleteChunksPromises)

      // Delete the file document from Firestore
      await deleteDoc(doc(db, "files", file.id))

      // Update folder document by removing the file
      const folderRef = doc(db, "programs", currentFolder.id)
      const updatedFiles = currentFolder.files.filter((f) => f.name !== file.name)

      await updateDoc(folderRef, {
        files: updatedFiles,
        lastModified: new Date(),
        totalFiles: (currentFolder.files?.length || 0) - 1,
        totalSize: (currentFolder.totalSize || 0) - file.size,
      })

      // Update local state
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === currentFolder.id
            ? {
                ...folder,
                files: updatedFiles,
                lastModified: new Date(),
                totalFiles: (folder.files?.length || 0) - 1,
                totalSize: (folder.totalSize || 0) - file.size,
              }
            : folder,
        ),
      )

      // Also update current folder state
      setCurrentFolder((prev) => ({
        ...prev,
        files: updatedFiles,
        lastModified: new Date(),
        totalFiles: (prev.files?.length || 0) - 1,
        totalSize: (prev.totalSize || 0) - file.size,
      }))
    } catch (error) {
      console.error("Error deleting file:", error)
      alert("Error deleting file. Please try again.")
    }
  }

  const renderFolderContent = () => {
    if (!folders.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
            <div className="relative h-28 w-28 text-primary/70">
              <FolderOpen className="w-full h-full" />
            </div>
          </div>
          <h3 className="text-xl font-medium">No folders yet</h3>
          <p className="text-muted-foreground text-sm mt-2 max-w-md text-center">
            Create a new folder to organize your migration documents and files
          </p>
          <Button
            onClick={() => setIsCreateFolderOpen(true)}
            className="mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-200"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Folder
          </Button>
        </div>
      )
    }

    const processedFolders = sortItems(
      folders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 p-4">
          {processedFolders.map((folder) => (
            <Card
              key={folder.id}
              className="group cursor-pointer border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden bg-gradient-to-b from-background to-muted/20"
              onClick={() => setCurrentFolder(folder)}
            >
              <CardContent className="p-4 flex flex-col items-center">
                {/* Folder icon with enhanced gradient */}
                <div className="relative w-24 h-24 mx-auto mb-3 group-hover:scale-105 transition-transform duration-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg shadow-sm group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Folder className="w-16 h-16 text-primary/80" />
                  </div>

                  {/* File count badge */}
                  <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full px-2 py-0.5 text-xs font-medium shadow-sm">
                    {folder.files?.length || 0} files
                  </div>

                  {/* Actions dropdown - only show on hover */}
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
                            e.stopPropagation()
                            handleRenameFolder(folder.id, prompt("Enter new name:", folder.name))
                          }}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFolder(folder.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Folder name with better styling */}
                <div className="w-full text-center mt-2">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {folder.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(folder.createdAt || new Date())}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    } else {
      // List view
      return (
        <div className="overflow-hidden rounded-md border border-border/40 bg-background">
          <div className="grid grid-cols-12 py-2 px-4 bg-muted/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-6">Name</div>
            <div className="col-span-2 text-center">Files</div>
            <div className="col-span-3 text-center">Created</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-border/40">
            {processedFolders.map((folder) => (
              <div
                className="grid grid-cols-12 py-3 px-4 items-center hover:bg-muted/30 cursor-pointer border-l-2 border-transparent hover:border-primary/40 transition-all duration-200"
                onClick={() => setCurrentFolder(folder)}
              >
                <div className="col-span-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <Folder className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium truncate block">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Created {folder.createdAt ? new Date(folder.createdAt.toDate()).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <Badge variant="outline" className="bg-background">
                    {folder.files?.length || 0} files
                  </Badge>
                </div>
                <div className="col-span-3 text-center text-sm">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    <span>{folder.createdAt ? new Date(folder.createdAt.toDate()).toLocaleDateString() : "N/A"}</span>
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
      )
    }
  }

  const getFileIcon = (fileType) => {
    const getFileExtension = (type) => {
      if (!type) return "default"

      // Check for specific MIME types first
      if (type.includes("wordprocessingml.document") || type.includes("msword") || type.includes("word")) return "doc"
      if (type.includes("spreadsheetml.sheet") || type.includes("excel") || type.includes("sheet")) return "xls"
      if (type.includes("pdf")) return "pdf"

      // Then check file extensions from the type string
      const extensionMatch = type.match(/\.([0-9a-z]+)$/i)
      if (extensionMatch) {
        const ext = extensionMatch[1].toLowerCase()
        if (["doc", "docx"].includes(ext)) return "doc"
        if (["xls", "xlsx", "csv"].includes(ext)) return "xls"
        if (ext === "pdf") return "pdf"
      }

      return "default"
    }

    const extension = getFileExtension(fileType)
    const icon = FileIcons[extension] || FileIcons.default

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {icon}
        <div className="absolute bottom-1 right-1 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 rounded uppercase">
          {extension}
        </div>
      </div>
    )
  }

  const handleFileDownload = async (file) => {
    try {
      // Get the file document from Firestore
      const fileDoc = await getDoc(doc(db, "files", file.id))
      if (!fileDoc.exists()) {
        throw new Error("File not found")
      }

      const fileData = fileDoc.data()

      // Get all chunks
      const chunksSnapshot = await getDocs(query(collection(db, "files", file.id, "chunks"), orderBy("index")))

      // Combine chunks
      const chunks = chunksSnapshot.docs.map((doc) => doc.data().data)
      const base64Data = chunks.join("")

      // Convert base64 to blob
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: fileData.type })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.originalName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading file:", error)
      alert("Error downloading file. Please try again.")
    }
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    // Handle both Firestore Timestamp and regular Date objects
    const dateObj = date instanceof Date ? date : date.toDate?.() || new Date(date)
    return dateObj.toLocaleDateString()
  }

  const renderFileContent = () => {
    if (!currentFolder) return null

    const processedFiles = getProcessedItems(currentFolder.files)

    if (viewMode === "grid") {
      return (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 p-4">
            {processedFiles.map((file, index) => (
              <Card
                key={index}
                className="group cursor-pointer border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden bg-gradient-to-b from-background to-muted/20"
              >
                <CardContent className="p-4 flex flex-col items-center">
                  {/* File icon with enhanced styling */}
                  <div className="relative w-24 h-24 mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-muted/50 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>

                    {/* Enhanced file size badge */}
                    <div className="absolute -bottom-1 -right-1 bg-background/95 backdrop-blur-sm border border-border/40 rounded-full px-2.5 py-1 text-xs font-medium shadow-lg">
                      {formatFileSize(file.size)}
                    </div>

                    {/* Enhanced quick action buttons */}
                    <div className="absolute -bottom-12 left-0 right-0 group-hover:bottom-0 transition-all duration-300 flex justify-center gap-1.5 p-1.5 bg-background/95 backdrop-blur-sm border-t border-border/40">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileDownload(file);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Download file</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {hasWritePermissions() && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(file);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Delete file</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  {/* File name with better styling */}
                  <div className="w-full text-center mt-2">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(file.uploadedAt || new Date())}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    } else {
      // List view
      return (
        <div className="overflow-hidden rounded-md border border-border/40 bg-background">
          <div className="grid grid-cols-12 py-2 px-4 bg-muted/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-6">Name</div>
            <div className="col-span-2 text-center">Size</div>
            <div className="col-span-3 text-center">Uploaded</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-border/40">
            {processedFiles.map((file, index) => (
              <div
                key={index}
                className="grid grid-cols-12 py-3 px-4 items-center hover:bg-muted/30 border-l-2 border-transparent hover:border-primary/40 transition-all duration-200 group"
              >
                <div className="col-span-6 flex items-center gap-2">
                  <div className="w-9 h-9 rounded-md bg-background border border-border/40 flex items-center justify-center shadow-sm">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <span className="font-medium truncate block">{file.name}</span>
                    <span className="text-xs text-muted-foreground">Uploaded {formatDate(file.uploadedAt)}</span>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <Badge variant="outline" className="bg-background">
                    {formatFileSize(file.size)}
                  </Badge>
                </div>
                <div className="col-span-3 text-center text-sm">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleFileDownload(file)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleFileDownload(file)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      {hasWritePermissions() && (
                        <DropdownMenuItem onClick={() => handleDeleteFile(file)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Get user initials from name
  const getUserInitials = (name) => {
    if (!name) return "AD"
    if (name === "Admin DSWD") return "AD"

    const words = name.split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-card">
          <div className="flex items-center flex-shrink-0 px-4 py-2">
            <Link href="/dashboard" className="flex items-center group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/90 to-primary/60 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/25">
                <img 
                  src="./images/SLP.png" 
                  alt="Logo" 
                  className="h-8 w-8 object-contain transform group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  DSWD SLP-PS
                </span>
                <span className="text-xs text-muted-foreground">File Storage</span>
              </div>
            </Link>
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="text-sm font-medium">{getUserInitials(currentUser?.name)}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{currentUser?.name || "Admin DSWD"}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.role || "Administrator"}</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isMobileMenuOpen ? "fixed inset-0 z-40 flex" : "hidden"} md:hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
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
              <Link href="/dashboard" className="flex items-center group">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/90 to-primary/60 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105">
                  <img 
                    src="./images/SLP.png" 
                    alt="Logo" 
                    className="h-8 w-8 object-contain transform group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  DSWD SLP-PS
                </span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="text-sm font-medium">{getUserInitials(currentUser?.name)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser?.name || "Admin DSWD"}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role || "Administrator"}</p>
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
            <form onSubmit={handleSearchSubmit} className="flex-1 flex relative">
              <div className="w-full flex md:ml-0 max-w-2xl relative">
                <label htmlFor="search-field" className="sr-only">
                  Search files and folders
                </label>
                <div className="relative w-full text-muted-foreground focus-within:text-foreground">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 ml-3" aria-hidden="true" />
                  </div>
                  <Input
                    ref={searchRef}
                    id="search-field"
                    className={cn(
                      "block w-full h-10 pl-10 pr-8 py-2 border-transparent text-muted-foreground",
                      "placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
                      "focus:border-transparent sm:text-sm transition-all duration-200",
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
                      className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-foreground"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Search suggestions dropdown */}
                {searchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background rounded-md border shadow-lg z-50">
                    <div className="p-2">
                      {recentSearches.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            Recent Searches
                          </div>
                          {recentSearches.map((query, index) => (
                            <button
                              key={index}
                              onClick={() => useRecentSearch(query)}
                              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded-sm"
                            >
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              {query}
                            </button>
                          ))}
                          <div className="border-t my-1" />
                        </>
                      )}
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        <span className="font-medium">Pro tip:</span> Use type: to filter by file type (e.g. "type:xlsx")
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Search filters */}
            {searchQuery && (
              <div className="ml-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-background">
                  {currentFolder ? 'Current folder' : 'All folders'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {currentFolder ? currentFolder.name : "Migration Management"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {currentFolder
                        ? `${currentFolder.files?.length || 0} files in this folder`
                        : "Manage and organize migration documents and files"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasWritePermissions() && (
                      <>
                        <Button onClick={handleCreateFolder}>
                          <FolderPlus className="mr-2 h-4 w-4" />
                          New Folder
                        </Button>
                        <Button onClick={handleUploadFile}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* View controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-3 gap-3">
                  {/* Breadcrumb navigation */}
                  <div className="flex items-center">
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

                  {/* Controls */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
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

                {/* Content area */}
                <div className="bg-card rounded-lg shadow-sm border border-border/40 p-4">
                  {currentFolder ? renderFileContent() : renderFolderContent()}

                  {/* Empty state */}
                  {currentFolder && (!currentFolder.files || currentFolder.files.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                        <div className="relative h-32 w-32 text-primary/70 transform hover:scale-105 transition-transform duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 rounded-full shadow-lg"></div>
                          <File className="w-full h-full p-6" />
                        </div>
                      </div>
                      <h3 className="text-xl font-medium">No files in this folder</h3>
                      <p className="text-muted-foreground text-sm mt-2 max-w-md text-center">
                        {hasWritePermissions() 
                          ? `Upload files to "${currentFolder?.name}" to start organizing your documents`
                          : "This folder is currently empty"}
                      </p>
                      <div className="flex gap-3 mt-6">
                        {hasWritePermissions() && (
                          <Button
                            onClick={() => setIsUploadFileOpen(true)}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-200"
                            size="lg"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            Upload File
                          </Button>
                        )}
                        <Button onClick={() => setCurrentFolder(null)} variant="outline" size="lg">
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
                      <Button onClick={handleCreateFolder}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Upload File Dialog */}
                <Dialog
                  open={isUploadFileOpen}
                  onOpenChange={(open) => {
                    if (!isUploading) setIsUploadFileOpen(open)
                  }}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload File</DialogTitle>
                      <DialogDescription>Select a file to upload to {currentFolder?.name}</DialogDescription>
                    </DialogHeader>
                    <div
                      className={`mt-4 border-2 border-dashed ${selectedFile ? "border-primary/30 bg-primary/5" : "border-muted-foreground/25"} rounded-lg p-8 text-center transition-all duration-200`}
                    >
                      <Input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="file-upload"
                        className={`cursor-pointer block ${isUploading ? "pointer-events-none" : ""}`}
                      >
                        {!isUploading && !selectedFile && (
                          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}

                        {selectedFile && !isUploading && (
                          <div className="mt-4 p-4 bg-background/95 backdrop-blur-sm rounded-xl border border-border/40 inline-block min-w-[240px] shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 p-2 flex items-center justify-center">
                                {getFileIcon(selectedFile.type)}
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-sm truncate max-w-[180px]">{selectedFile.name}</p>
                                <p className="text-muted-foreground text-xs">{formatFileSize(selectedFile.size)}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="mt-2 text-base font-medium">
                          {isUploading
                            ? "Uploading file..."
                            : selectedFile
                              ? "File selected"
                              : "Drag and drop a file here"}
                        </p>
                        {!isUploading && !selectedFile && (
                          <>
                            <p className="mt-1 text-sm text-muted-foreground">or click to browse files</p>
                            <p className="mt-3 text-xs text-muted-foreground">Supports any file type up to 10MB</p>
                          </>
                        )}
                      </label>

                      {isUploading && (
                        <div className="mt-6 max-w-md mx-auto">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">Uploading {selectedFile.name}</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-500">{Math.round(uploadProgress)}%</span>
                            </div>
                            <Progress 
                              value={uploadProgress} 
                              className="h-2.5 bg-muted"
                              indicatorClassName="bg-emerald-600 dark:bg-emerald-500" 
                            />
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse"></div>
                              <p>Please don't close this window while uploading</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsUploadFileOpen(false)} disabled={isUploading}>
                        Cancel
                      </Button>
                      <Button onClick={handleUploadFile} disabled={!selectedFile || isUploading}>
                        {isUploading ? `Uploading ${Math.round(uploadProgress)}%` : "Upload"}
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
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Key,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { auth, db } from "@/service/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  doc,
  updateDoc,
  where,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";

export function UsersPermissionsSettings() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingPermissions, setEditingPermissions] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "SLP Member",
    password: "",
    permissions: {
      readOnly: true,
      accessProject: false,
      accessParticipant: false,
      accessFileStorage: false
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    role: "SLP Member",
    permissions: {
      readOnly: true,
      accessProject: false,
      accessParticipant: false,
      accessFileStorage: false
    }
  });
  const [userToDelete, setUserToDelete] = useState(null);

  // Add permission check
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role !== "SLP Administrator") {
              // Redirect non-admin users
              window.location.href = "/settings";
              return;
            }
            setCurrentUser(userData);
          }
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        toast.error("Error checking permissions");
      }
    };

    checkAdminAccess();
  }, []);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetchedUsers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "No Name",
          email: data.email || "No Email",
          role: data.role || "User",
          status: data.status || "Active",
          lastActive: data.lastActive ? new Date(data.lastActive.toDate()).toLocaleString() : "Never",
          avatar: data.photoURL || "/placeholder.svg?height=40&width=40",
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          permissions: data.permissions || {
            readOnly: true,
            accessProject: false,
            accessParticipant: false,
            accessFileStorage: false
          }
        };
      });

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercaseQuery = query.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.role.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredUsers(filtered);
  };

  // Load initial data when authenticated
  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  // Update user permissions
  const updateUserPermissions = async (userId, permissions) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        permissions: permissions
      });
      toast.success("User permissions updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user permissions:", error);
      toast.error("Failed to update user permissions");
    }
  };

  // User Permissions Dialog Component
  const UserPermissionsDialog = ({ user, open, onOpenChange }) => {
    const [permissions, setPermissions] = useState(user?.permissions || {
      readOnly: true,
      accessProject: false,
      accessParticipant: false,
      accessFileStorage: false
    });

    const handleTogglePermission = (permission) => {
      if (permission === 'readOnly') {
        // When enabling readOnly, disable all other permissions
        if (!permissions.readOnly) {
          setPermissions({
            readOnly: true,
            accessProject: false,
            accessParticipant: false,
            accessFileStorage: false
          });
        } else {
          // When disabling readOnly, keep other permissions as they are
          setPermissions(prev => ({
            ...prev,
            readOnly: false
          }));
        }
      } else {
        // When enabling any other permission, disable readOnly
        setPermissions(prev => ({
          ...prev,
          [permission]: !prev[permission],
          readOnly: false
        }));
      }
    };

    const handleSave = async () => {
      await updateUserPermissions(user.id, permissions);
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Permissions - {user?.name}</DialogTitle>
            <DialogDescription>
              Manage individual permissions for this user
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`readonly-${user?.id}`} className="flex items-center">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  Read Only
                </Label>
                <Switch
                  id={`readonly-${user?.id}`}
                  checked={permissions.readOnly}
                  onCheckedChange={() => handleTogglePermission('readOnly')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`project-${user?.id}`} className="flex items-center">
                  <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                  Access Project
                </Label>
                <Switch
                  id={`project-${user?.id}`}
                  checked={permissions.accessProject}
                  onCheckedChange={() => handleTogglePermission('accessProject')}
                  disabled={permissions.readOnly}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`participant-${user?.id}`} className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  Access Participant
                </Label>
                <Switch
                  id={`participant-${user?.id}`}
                  checked={permissions.accessParticipant}
                  onCheckedChange={() => handleTogglePermission('accessParticipant')}
                  disabled={permissions.readOnly}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`storage-${user?.id}`} className="flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  Access File Storage
                </Label>
                <Switch
                  id={`storage-${user?.id}`}
                  checked={permissions.accessFileStorage}
                  onCheckedChange={() => handleTogglePermission('accessFileStorage')}
                  disabled={permissions.readOnly}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // User Table Row Component
  const UserTableRow = ({ user }) => (
    <TableRow key={user.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#96B54A]/20 text-[#496E22] flex items-center justify-center">
            <span className="text-sm font-medium">
              {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">
              {user.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={user.status === "Active" ? "outline" : "secondary"}
          className={
            user.status === "Active"
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              : "bg-muted text-muted-foreground"
          }
        >
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>{user.lastActive}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setSelectedUser(user);
              setEditingPermissions(true);
            }}
            className="group"
          >
            <Key className="h-4 w-4 text-green-600 group-hover:text-green-700" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setEditingUser(user);
              setIsEditUserOpen(true);
            }}
            className="group"
          >
            <Edit className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setUserToDelete(user)}
            className="group"
          >
            <Trash2 className="h-4 w-4 text-red-600 group-hover:text-red-700" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  // Add function to handle user creation
  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password || !newUserData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.password
      );

      // Add user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        status: "Active",
        createdAt: new Date(),
        lastActive: new Date(),
        permissions: newUserData.permissions
      });

      toast.success("User created successfully");
      setIsAddUserOpen(false);
      setNewUserData({
        name: "",
        email: "",
        role: "SLP Member",
        password: "",
        permissions: {
          readOnly: true,
          accessProject: false,
          accessParticipant: false,
          accessFileStorage: false
        }
      });
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add User Dialog Component
  const AddUserDialog = ({ open, onOpenChange }) => {
    const [localUserData, setLocalUserData] = useState({
      name: "",
      email: "",
      role: "SLP Member",
      password: "",
      permissions: {
        readOnly: true,
        accessProject: false,
        accessParticipant: false,
        accessFileStorage: false
      }
    });

    const handleSubmit = async () => {
      if (!localUserData.email || !localUserData.password || !localUserData.name) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          localUserData.email,
          localUserData.password
        );

        // Add user data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: localUserData.name,
          email: localUserData.email,
          role: localUserData.role,
          status: "Active",
          createdAt: new Date(),
          lastActive: new Date(),
          permissions: localUserData.permissions
        });

        toast.success("User created successfully");
        onOpenChange(false);
        setLocalUserData({
          name: "",
          email: "",
          role: "SLP Member",
          password: "",
          permissions: {
            readOnly: true,
            accessProject: false,
            accessParticipant: false,
            accessFileStorage: false
          }
        });
        fetchUsers(); // Refresh the users list
      } catch (error) {
        console.error("Error creating user:", error);
        toast.error(error.message || "Failed to create user");
      } finally {
        setIsSubmitting(false);
      }
    };

    // Reset form when dialog closes
    useEffect(() => {
      if (!open) {
        setLocalUserData({
          name: "",
          email: "",
          role: "SLP Member",
          password: "",
          permissions: {
            readOnly: true,
            accessProject: false,
            accessParticipant: false,
            accessFileStorage: false
          }
        });
      }
    }, [open]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={localUserData.name}
                onChange={(e) => setLocalUserData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={localUserData.email}
                onChange={(e) => setLocalUserData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={localUserData.password}
                onChange={(e) => setLocalUserData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={localUserData.role}
                onValueChange={(value) => {
                  setLocalUserData(prev => ({
                    ...prev,
                    role: value,
                    permissions: value === "SLP Administrator" ? {
                      readOnly: false,
                      accessProject: true,
                      accessParticipant: true,
                      accessFileStorage: true
                    } : {
                      readOnly: true,
                      accessProject: false,
                      accessParticipant: false,
                      accessFileStorage: false
                    }
                  }));
                }}  
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SLP Administrator">SLP ADMINISTRATOR</SelectItem>
                  <SelectItem value="SLP Member">SLP MEMBER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label>Initial Permissions</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="readonly" className="flex items-center">
                    <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                    Read Only
                  </Label>
                  <Switch
                    id="readonly"
                    checked={localUserData.permissions.readOnly}
                    onCheckedChange={(checked) => {
                      setLocalUserData(prev => ({
                        ...prev,
                        permissions: checked ? {
                          readOnly: true,
                          accessProject: false,
                          accessParticipant: false,
                          accessFileStorage: false
                        } : {
                          ...prev.permissions,
                          readOnly: false
                        }
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="accessProject" className="flex items-center">
                    <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                    Access Project
                  </Label>
                  <Switch
                    id="accessProject"
                    checked={localUserData.permissions.accessProject}
                    onCheckedChange={(checked) => {
                      setLocalUserData(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          readOnly: false,
                          accessProject: checked
                        }
                      }));
                    }}
                    disabled={localUserData.permissions.readOnly}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="accessParticipant" className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    Access Participant
                  </Label>
                  <Switch
                    id="accessParticipant"
                    checked={localUserData.permissions.accessParticipant}
                    onCheckedChange={(checked) => {
                      setLocalUserData(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          readOnly: false,
                          accessParticipant: checked
                        }
                      }));
                    }}
                    disabled={localUserData.permissions.readOnly}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="accessFileStorage" className="flex items-center">
                    <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    Access File Storage
                  </Label>
                  <Switch
                    id="accessFileStorage"
                    checked={localUserData.permissions.accessFileStorage}
                    onCheckedChange={(checked) => {
                      setLocalUserData(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          readOnly: false,
                          accessFileStorage: checked
                        }
                      }));
                    }}
                    disabled={localUserData.permissions.readOnly}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Update the Add User button click handler
  const handleAddUserClick = () => {
    setIsAddUserOpen(true);
  };

  // Add function to handle user updates
  const handleUpdateUser = async () => {
    if (!editingUser || !editUserData.name || !editUserData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user data in Firestore
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, {
        name: editUserData.name,
        email: editUserData.email,
        role: editUserData.role,
        permissions: editUserData.permissions,
        updatedAt: new Date()
      });

      toast.success("User updated successfully");
      setIsEditUserOpen(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Edit User Dialog Component
  const EditUserDialog = ({ user, open, onOpenChange }) => {
    const [localUserData, setLocalUserData] = useState({
      name: "",
      email: "",
      role: "SLP Member",
      permissions: {
        readOnly: true,
        accessProject: false,
        accessParticipant: false,
        accessFileStorage: false
      }
    });

    // Initialize form with user data when opened
    useEffect(() => {
      if (user && open) {
        setLocalUserData({
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        });
      }
    }, [user, open]);

    const handleSubmit = async () => {
      if (!user || !localUserData.name || !localUserData.email) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
          name: localUserData.name,
          role: localUserData.role,
          permissions: localUserData.permissions,
          updatedAt: new Date()
        });

        toast.success("User updated successfully");
        onOpenChange(false);
        fetchUsers(); // Refresh the users list
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error(error.message || "Failed to update user");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify user details and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={localUserData.name}
                onChange={(e) => setLocalUserData({ ...localUserData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={localUserData.email}
                onChange={(e) => setLocalUserData({ ...localUserData, email: e.target.value })}
                disabled // Email cannot be changed
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={localUserData.role}
                onValueChange={(value) => {
                  setLocalUserData({ 
                    ...localUserData, 
                    role: value,
                    permissions: value === "SLP Administrator" ? {
                      readOnly: false,
                      accessProject: true,
                      accessParticipant: true,
                      accessFileStorage: true
                    } : {
                      readOnly: true,
                      accessProject: false,
                      accessParticipant: false,
                      accessFileStorage: false
                    }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SLP Administrator">SLP ADMINISTRATOR</SelectItem>
                  <SelectItem value="SLP Member">SLP MEMBER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
           
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Delete user function
  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      toast.success("User deleted successfully");
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users & Permissions</h2>
        <p className="text-muted-foreground">
          Manage users and their permissions
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button 
          className="bg-[#496E22] text-white hover:bg-[#96B54A]"
          onClick={handleAddUserClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-[#C5D48A]/10 to-[#A6C060]/10 border-0 rounded-3xl shadow-green-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#C5D48A]/20 to-[#A6C060]/10">
                <TableHead className="text-[#496E22] font-semibold">User</TableHead>
                <TableHead className="text-[#496E22] font-semibold">Role</TableHead>
                <TableHead className="text-[#496E22] font-semibold">Status</TableHead>
                <TableHead className="text-[#496E22] font-semibold">Last Active</TableHead>
                <TableHead className="text-[#496E22] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchQuery ? "No users found matching your search" : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <UserTableRow key={user.id} user={user} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* User Permissions Dialog */}
      {selectedUser && (
        <UserPermissionsDialog
          user={selectedUser}
          open={editingPermissions}
          onOpenChange={(open) => {
            setEditingPermissions(open);
            if (!open) setSelectedUser(null);
          }}
        />
      )}
      
      {/* Add User Dialog */}
      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={(open) => {
          setIsAddUserOpen(open);
          if (!open) {
            setNewUserData({
              name: "",
              email: "",
              role: "SLP Member",
              password: "",
              permissions: {
                readOnly: true,
                accessProject: false,
                accessParticipant: false,
                accessFileStorage: false
              }
            });
          }
        }}
      />
      
      {/* Edit User Dialog */}
      <EditUserDialog
        user={editingUser}
        open={isEditUserOpen}
        onOpenChange={(open) => {
          setIsEditUserOpen(open);
          if (!open) {
            setEditingUser(null);
            setEditUserData({
              name: "",
              email: "",
              role: "SLP Member",
              permissions: {
                readOnly: true,
                accessProject: false,
                accessParticipant: false,
                accessFileStorage: false
              }
            });
          }
        }}
      />
      
      {/* Delete User Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => { if (!open) setUserToDelete(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#496E22]">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <b>{userToDelete?.name}</b>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={async () => {
                await deleteUser(userToDelete.id);
                setUserToDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
    </div>
  );
}
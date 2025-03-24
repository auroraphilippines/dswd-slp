"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  UserPlus,
  Key,
} from "lucide-react";

export function UsersPermissionsSettings() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "2 hours ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Manager",
      status: "Active",
      lastActive: "1 day ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Editor",
      status: "Inactive",
      lastActive: "1 week ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Viewer",
      status: "Active",
      lastActive: "3 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Admin",
      description: "Full access to all features and settings",
      userCount: 1,
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
        manage_users: true,
        manage_billing: true,
      },
    },
    {
      id: 2,
      name: "Manager",
      description: "Can manage content and some settings",
      userCount: 1,
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: false,
        manage_users: false,
        manage_billing: false,
      },
    },
    {
      id: 3,
      name: "Editor",
      description: "Can create and edit content",
      userCount: 1,
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: false,
        manage_users: false,
        manage_billing: false,
      },
    },
    {
      id: 4,
      name: "Viewer",
      description: "Read-only access to content",
      userCount: 1,
      permissions: {
        create: false,
        read: true,
        update: false,
        delete: false,
        manage_users: false,
        manage_billing: false,
      },
    },
  ]);

  const togglePermission = (roleId, permission) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [permission]: !role.permissions[permission],
              },
            }
          : role
      )
    );
  };

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList>
        <TabsTrigger value="users" className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Users
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Roles
        </TabsTrigger>
        <TabsTrigger value="invitations" className="flex items-center">
          <UserPlus className="h-4 w-4 mr-2" />
          Invitations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "Admin"
                            ? "default"
                            : user.role === "Manager"
                            ? "secondary"
                            : user.role === "Editor"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" ? "outline" : "secondary"
                        }
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
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing {users.length} of {users.length} users
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
      </TabsContent>

      <TabsContent value="roles" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Role Management</h3>
            <p className="text-sm text-muted-foreground">
              Define roles and their permissions
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>

        {roles.map((role) => (
          <Card key={role.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                <Badge variant="outline">
                  {role.userCount} {role.userCount === 1 ? "User" : "Users"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`create-${role.id}`}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2 text-muted-foreground" />
                    Create
                  </Label>
                  <Switch
                    id={`create-${role.id}`}
                    checked={role.permissions.create}
                    onCheckedChange={() => togglePermission(role.id, "create")}
                    disabled={role.name === "Admin"}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`read-${role.id}`}
                    className="flex items-center"
                  >
                    <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                    Read
                  </Label>
                  <Switch
                    id={`read-${role.id}`}
                    checked={role.permissions.read}
                    onCheckedChange={() => togglePermission(role.id, "read")}
                    disabled={role.name === "Admin"}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`update-${role.id}`}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                    Update
                  </Label>
                  <Switch
                    id={`update-${role.id}`}
                    checked={role.permissions.update}
                    onCheckedChange={() => togglePermission(role.id, "update")}
                    disabled={role.name === "Admin"}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`delete-${role.id}`}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    Delete
                  </Label>
                  <Switch
                    id={`delete-${role.id}`}
                    checked={role.permissions.delete}
                    onCheckedChange={() => togglePermission(role.id, "delete")}
                    disabled={role.name === "Admin"}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`manage-users-${role.id}`}
                    className="flex items-center"
                  >
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    Manage Users
                  </Label>
                  <Switch
                    id={`manage-users-${role.id}`}
                    checked={role.permissions.manage_users}
                    onCheckedChange={() =>
                      togglePermission(role.id, "manage_users")
                    }
                    disabled={role.name === "Admin"}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`manage-billing-${role.id}`}
                    className="flex items-center"
                  >
                    <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                    Manage Billing
                  </Label>
                  <Switch
                    id={`manage-billing-${role.id}`}
                    checked={role.permissions.manage_billing}
                    onCheckedChange={() =>
                      togglePermission(role.id, "manage_billing")
                    }
                    disabled={role.name === "Admin"}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t">
              <Button
                variant="outline"
                size="sm"
                disabled={role.name === "Admin"}
              >
                Edit Role
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={role.name === "Admin"}
              >
                Delete Role
              </Button>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="invitations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Invite New Users</CardTitle>
            <CardDescription>
              Send invitations to new team members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-invites">Email Addresses</Label>
              <Input
                id="email-invites"
                placeholder="Enter email addresses separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                You can invite multiple users at once by separating email
                addresses with commas.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-select">Role</Label>
              <Select defaultValue="viewer">
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-message">
                Personal Message (Optional)
              </Label>
              <Input
                id="invite-message"
                placeholder="Add a personal message to your invitation"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitations
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>Track and manage sent invitations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>michael.brown@example.com</TableCell>
                  <TableCell>
                    <Badge variant="outline">Editor</Badge>
                  </TableCell>
                  <TableCell>2 days ago</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Resend
                    </Button>
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sarah.wilson@example.com</TableCell>
                  <TableCell>
                    <Badge variant="outline">Viewer</Badge>
                  </TableCell>
                  <TableCell>5 days ago</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Resend
                    </Button>
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
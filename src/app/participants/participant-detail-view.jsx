"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, AlertTriangle, Plus, Pencil, Save, Trash } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, storage, auth } from "@/service/firebase";
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp 
} from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';

// Add date formatting function
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export function ParticipantDetailView({ participant, onEdit, onAddAssistance }) {
  const [familyMembers, setFamilyMembers] = useState(participant.familyMembers || []);
  const [isEditingFamily, setIsEditingFamily] = useState(false);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: "",
    relationship: "",
    age: "",
    occupation: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(participant.members || []);
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    contactNumber: "",
    address: "",
    status: "Active"
  });
  const [editingMember, setEditingMember] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState(null);

  // Family member handlers
  const handleAddFamilyMember = async () => {
    if (!newFamilyMember.name || !newFamilyMember.relationship) {
      toast.error("Name and relationship are required");
      return;
    }

    setIsLoading(true);
    try {
      const participantRef = doc(db, "participants", participant.docId);
      
      if (editingFamilyMember) {
        // Update existing member
        const updatedMembers = familyMembers.map(member =>
          member.id === editingFamilyMember.id 
            ? { ...newFamilyMember, id: member.id }
            : member
        );

        await updateDoc(participantRef, {
          familyMembers: updatedMembers,
          updatedAt: serverTimestamp()
        });

        setFamilyMembers(updatedMembers);
        toast.success("Family member updated successfully");
      } else {
        // Add new member
        const newMember = { ...newFamilyMember, id: Date.now() };
        
        await updateDoc(participantRef, {
          familyMembers: arrayUnion(newMember),
          updatedAt: serverTimestamp()
        });

        setFamilyMembers([...familyMembers, newMember]);
        toast.success("Family member added successfully");
      }

      handleCancelFamilyAdd();
    } catch (error) {
      console.error("Error managing family member:", error);
      toast.error(editingFamilyMember ? "Failed to update family member" : "Failed to add family member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFamilyMember = (member) => {
    setEditingFamilyMember(member);
    setNewFamilyMember({
      name: member.name || "",
      relationship: member.relationship || "",
      age: member.age || "",
      occupation: member.occupation || ""
    });
    setShowFamilyForm(true);
  };

  const handleCancelFamilyAdd = () => {
    setShowFamilyForm(false);
    setEditingFamilyMember(null);
    setNewFamilyMember({
      name: "",
      relationship: "",
      age: "",
      occupation: ""
    });
  };

  const handleRemoveFamilyMember = async (memberId) => {
    setIsLoading(true);
    try {
      const updatedMembers = familyMembers.filter(member => member.id !== memberId);
      const participantRef = doc(db, "participants", participant.docId);
      
      await updateDoc(participantRef, {
        familyMembers: updatedMembers,
        updatedAt: serverTimestamp()
      });

      setFamilyMembers(updatedMembers);
      toast.success("Family member removed successfully");
    } catch (error) {
      console.error("Error removing family member:", error);
      toast.error("Failed to remove family member");
    } finally {
      setIsLoading(false);
    }
  };

  // Program History Functions
  const handleAddProgram = async (programData) => {
    setIsLoading(true);
    try {
      const participantRef = doc(db, "participants", participant.docId);
      const now = new Date();
      // Convert to Philippine time
      const phTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
      const newProgram = {
        ...programData,
        date: phTime.toISOString(),
        status: "Ongoing",
        id: Date.now()
      };

      await updateDoc(participantRef, {
        programHistory: arrayUnion(newProgram),
        updatedAt: serverTimestamp()
      });

      toast.success("Program added successfully");
    } catch (error) {
      console.error("Error adding program:", error);
      toast.error("Failed to add program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProgramStatus = async (programId, newStatus) => {
    setIsLoading(true);
    try {
      const participantRef = doc(db, "participants", participant.docId);
      const updatedPrograms = participant.programHistory.map(program => 
        program.id === programId ? { ...program, status: newStatus } : program
      );

      await updateDoc(participantRef, {
        programHistory: updatedPrograms,
        updatedAt: serverTimestamp()
      });

      toast.success("Program status updated successfully");
    } catch (error) {
      console.error("Error updating program status:", error);
      toast.error("Failed to update program status");
    } finally {
      setIsLoading(false);
    }
  };

  // Add these helper functions for other toast notifications
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Add member handler
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.position) {
      toast.error("Name and position are required");
      return;
    }

    setIsLoading(true);
    try {
      const participantRef = doc(db, "participants", participant.docId);
      const memberToAdd = {
        id: Date.now().toString(),
        name: newMember.name || "",
        position: newMember.position || "",
        contactNumber: newMember.contactNumber || "",
        address: newMember.address || "",
        status: "Active",
        createdAt: new Date().toISOString()
      };

      // Get current members array or initialize it
      const currentMembers = participant.members || [];
      const updatedMembers = [...currentMembers, memberToAdd];

      await updateDoc(participantRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp()
      });

      setMembers(updatedMembers);
      // Reset form with empty strings
      setNewMember({
        name: "",
        position: "",
        contactNumber: "",
        address: "",
        status: "Active"
      });
      setEditingMember(null);
      toast.success("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit member handler
  const handleEditMember = (member) => {
    setEditingMember(member);
    // Ensure all values are strings when setting form data
    setNewMember({
      name: member.name || "",
      position: member.position || "",
      contactNumber: member.contactNumber || "",
      address: member.address || "",
      status: member.status || "Active"
    });
  };

  // Update member handler
  const handleUpdateMember = async () => {
    if (!editingMember || !newMember.name || !newMember.position) {
      toast.error("Name and position are required");
      return;
    }

    setIsLoading(true);
    try {
      const updatedMember = {
        id: editingMember.id,
        name: newMember.name || "",
        position: newMember.position || "",
        contactNumber: newMember.contactNumber || "",
        address: newMember.address || "",
        status: "Active",
        createdAt: editingMember.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedMembers = members.map(member =>
        member.id === editingMember.id ? updatedMember : member
      );

      const participantRef = doc(db, "participants", participant.docId);
      await updateDoc(participantRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp()
      });

      setMembers(updatedMembers);
      // Reset form with empty strings
      setNewMember({
        name: "",
        position: "",
        contactNumber: "",
        address: "",
        status: "Active"
      });
      setEditingMember(null);
      toast.success("Member updated successfully");
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit handler
  const handleCancelEdit = () => {
    setEditingMember(null);
    // Reset form with empty strings
    setNewMember({
      name: "",
      position: "",
      contactNumber: "",
      address: "",
      status: "Active"
    });
  };

  // Remove member handler
  const handleRemoveMember = async (memberId) => {
    if (!memberId) return;

    setIsLoading(true);
    try {
      const updatedMembers = members.filter(member => member.id !== memberId);
      const participantRef = doc(db, "participants", participant.docId);

      await updateDoc(participantRef, {
        members: updatedMembers || [],
        updatedAt: serverTimestamp()
      });

      setMembers(updatedMembers);
      toast.success("Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  };

  if (!participant) return null;

  return (
    <>
      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="family">Family Details</TabsTrigger>
          <TabsTrigger value="program">Member details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Participant ID:
                  </dt>
                  <dd className="text-sm font-medium">{participant.id}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Name:
                  </dt>
                  <dd className="text-sm font-medium">{participant.name}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Gender:
                  </dt>
                  <dd className="text-sm font-medium">{participant.gender}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Birthday:
                  </dt>
                  <dd className="text-sm font-medium">{participant.birthday}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Age:
                  </dt>
                  <dd className="text-sm font-medium">{participant.age}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Status:
                  </dt>
                  <dd className="text-sm font-medium">
                    <Badge
                      variant={
                        participant.status === "Active" ? "outline" : "secondary"
                      }
                      className={
                        participant.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          : ""
                      }
                    >
                      {participant.status}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Date Registered:
                  </dt>
                  <dd className="text-sm font-medium">
                    {participant.dateRegistered}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Project & Category Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Project:
                  </dt>
                  <dd className="text-sm font-medium">{participant.project}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Category:
                  </dt>
                  <dd className="text-sm font-medium">{participant.category}</dd>
                </div>
                {participant.category === "GROUP" && (
                  <div className="flex justify-between sm:block">
                    <dt className="text-sm font-medium text-muted-foreground">
                      SLPA Name:
                    </dt>
                    <dd className="text-sm font-medium">{participant.slpaName}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Contact Number:
                  </dt>
                  <dd className="text-sm font-medium">
                    {participant.contactNumber}
                  </dd>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Address:
                  </dt>
                  <dd className="text-sm font-medium">
                    {participant.address}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Identification Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Valid ID Type:
                  </dt>
                  <dd className="text-sm font-medium">{participant.validID}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Valid ID Number:
                  </dt>
                  <dd className="text-sm font-medium">
                    {participant.validIDNumber}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Program Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Type of Participant:
                  </dt>
                  <dd className="text-sm font-medium">{participant.participantType}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Sector:
                  </dt>
                  <dd className="text-sm font-medium">{participant.sector}</dd>
                </div>
                {(participant.participantType === "Poor - Exiting 4Ps" || participant.participantType === "Poor - 4Ps") && (
                  <>
                    <div className="flex justify-between sm:block">
                      <dt className="text-sm font-medium text-muted-foreground">
                        4Ps Household Member:
                      </dt>
                      <dd className="text-sm font-medium">{participant.is4PsHouseholdMember}</dd>
                    </div>
                    {participant.is4PsHouseholdMember === "Yes" && (
                      <div className="flex justify-between sm:block">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Household ID:
                        </dt>
                        <dd className="text-sm font-medium">{participant.householdId}</dd>
                      </div>
                    )}
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  Family Information
                </CardTitle>
                <div className="flex gap-2">
                  {!showFamilyForm && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowFamilyForm(true)}
                      className="text-[#496E22] hover:text-[#96B54A] hover:bg-[#96B54A]/10"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Family Member
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showFamilyForm && (
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newFamilyMember.name}
                      onChange={(e) => setNewFamilyMember({
                        ...newFamilyMember,
                        name: e.target.value
                      })}
                      placeholder="Enter family member name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newFamilyMember.relationship}
                      onChange={(e) => setNewFamilyMember({
                        ...newFamilyMember,
                        relationship: e.target.value
                      })}
                      placeholder="Enter relationship"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={newFamilyMember.age}
                      onChange={(e) => setNewFamilyMember({
                        ...newFamilyMember,
                        age: e.target.value
                      })}
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={newFamilyMember.occupation}
                      onChange={(e) => setNewFamilyMember({
                        ...newFamilyMember,
                        occupation: e.target.value
                      })}
                      placeholder="Enter occupation"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleCancelFamilyAdd}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddFamilyMember}
                      disabled={isLoading}
                    >
                      {editingFamilyMember ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Update Family Member
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Family Member
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familyMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.relationship}</TableCell>
                      <TableCell>{member.age}</TableCell>
                      <TableCell>{member.occupation}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFamilyMember(member)}
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFamilyMember(member.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {familyMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No family members added yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  Member Management
                </CardTitle>
                {!editingMember && !showMemberForm && (
                  <Button 
                    onClick={() => {
                      setShowMemberForm(true);
                      setEditingMember(null);
                    }}
                    className="text-[#496E22] hover:text-[#96B54A] hover:bg-[#96B54A]/10"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Member
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {(showMemberForm || editingMember) && (
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="memberName">Name</Label>
                    <Input
                      id="memberName"
                      value={newMember.name || ""}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        name: e.target.value
                      })}
                      placeholder="Enter member name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newMember.position || ""}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        position: e.target.value
                      })}
                      placeholder="Enter position"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberContact">Contact Number</Label>
                    <Input
                      id="memberContact"
                      value={newMember.contactNumber || ""}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        contactNumber: e.target.value
                      })}
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newMember.address || ""}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        address: e.target.value
                      })}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleCancelEdit();
                        setShowMemberForm(false);
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={async () => {
                        if (editingMember) {
                          await handleUpdateMember();
                        } else {
                          await handleAddMember();
                        }
                        setShowMemberForm(false);
                      }}
                      disabled={isLoading}
                    >
                      {editingMember ? (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Update Member
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Member
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.contactNumber}</TableCell>
                      <TableCell>{member.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMember(member)}
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {members.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No members added yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
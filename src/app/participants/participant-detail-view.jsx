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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';

export function ParticipantDetailView({ participant, onEdit, onAddAssistance }) {
  const [familyMembers, setFamilyMembers] = useState(participant.familyMembers || []);
  const [isEditingFamily, setIsEditingFamily] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: "",
    relationship: "",
    age: "",
    occupation: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Family member handlers
  const handleAddFamilyMember = async () => {
    if (!newFamilyMember.name || !newFamilyMember.relationship) {
      toast.error("Name and relationship are required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const participantRef = doc(db, "participants", participant.docId);
      const newMember = { ...newFamilyMember, id: Date.now() };
      
      await updateDoc(participantRef, {
        familyMembers: arrayUnion(newMember),
        updatedAt: serverTimestamp()
      });

      setFamilyMembers([...familyMembers, newMember]);
      setNewFamilyMember({ name: "", relationship: "", age: "", occupation: "" });
      toast.success("Family member added successfully");
    } catch (error) {
      console.error("Error adding family member:", error);
      toast.error("Failed to add family member");
    } finally {
      setIsLoading(false);
    }
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

  const handleSaveFamilyChanges = () => {
    onEdit(participant.docId, { familyMembers });
    setIsEditingFamily(false);
  };

  // Program History Functions
  const handleAddProgram = async (programData) => {
    setIsLoading(true);
    try {
      const participantRef = doc(db, "participants", participant.docId);
      const newProgram = {
        ...programData,
        date: new Date().toISOString(),
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

  if (!participant) return null;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="family">Family Details</TabsTrigger>
          <TabsTrigger value="program">Program History</TabsTrigger>
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
                    Age:
                  </dt>
                  <dd className="text-sm font-medium">{participant.age}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Program:
                  </dt>
                  <dd className="text-sm font-medium">{participant.program}</dd>
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
                  <dd className="text-sm">{participant.address}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Barangay:
                  </dt>
                  <dd className="text-sm font-medium">{participant.barangay}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participant.emergencyContact ? (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex justify-between sm:block">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Name:
                    </dt>
                    <dd className="text-sm font-medium">
                      {participant.emergencyContact.name}
                    </dd>
                  </div>
                  <div className="flex justify-between sm:block">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Relationship:
                    </dt>
                    <dd className="text-sm font-medium">
                      {participant.emergencyContact.relationship}
                    </dd>
                  </div>
                  <div className="flex justify-between sm:block">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Contact Number:
                    </dt>
                    <dd className="text-sm font-medium">
                      {participant.emergencyContact.contactNumber}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No emergency contact information available
                </p>
              )}
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
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsEditingFamily(!isEditingFamily)}
                >
                  {isEditingFamily ? (
                    <><Save className="h-4 w-4 mr-2" /> Save Changes</>
                  ) : (
                    <><Pencil className="h-4 w-4 mr-2" /> Edit Details</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingFamily && (
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
                    />
                  </div>
                  <Button 
                    className="col-span-2" 
                    onClick={handleAddFamilyMember}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Family Member
                  </Button>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Occupation</TableHead>
                    {isEditingFamily && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familyMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.relationship}</TableCell>
                      <TableCell>{member.age}</TableCell>
                      <TableCell>{member.occupation}</TableCell>
                      {isEditingFamily && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFamilyMember(member.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
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
                  Program History
                </CardTitle>
                <Button size="sm" onClick={() => onAddAssistance(participant.docId)}>
                  Add Program
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {participant.assistanceHistory &&
              participant.assistanceHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Program Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participant.assistanceHistory.map((program, index) => (
                      <TableRow key={index}>
                        <TableCell>{program.date}</TableCell>
                        <TableCell>{program.type}</TableCell>
                        <TableCell>{program.description}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={
                            program.status === "Completed" 
                              ? "bg-green-50 text-green-700" 
                              : "bg-amber-50 text-amber-700"
                          }>
                            {program.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No program history available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
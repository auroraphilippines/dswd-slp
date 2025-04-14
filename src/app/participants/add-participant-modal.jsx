"use client";

import { useState } from "react";
import { db } from "@/service/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export function AddParticipantModal({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    birthday: "",
    project: "",
    contactNumber: "",
    address: "",
    validID: "",
    validIDNumber: "",
    participantType: "",
    is4PsHouseholdMember: "",
    householdId: "",
    sector: ""
  });

  const calculateAge = (birthday) => {
    if (!birthday) return "";
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for birthday to update age
    if (name === "birthday") {
      const age = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        birthday: value,
        age: age,
        // Update sector if age is 65 or above
        sector: parseInt(age) >= 65 ? "Senior Citizen" : prev.sector
      }));
    } else if (name === "age") {
      const age = parseInt(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        sector: age >= 65 ? "Senior Citizen" : prev.sector
      }));
    } else if (name.includes("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.age || !formData.address || !formData.contactNumber || !formData.project) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Generate random 5-digit number starting from 99999
      const min = 99999;
      const max = 999999;
      const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
      
      // Create new participant object
      const newParticipant = {
        ...formData,
        id: `SLP ID-${randomId}`,
        status: "Pending",
        dateRegistered: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Add additional metadata
        metadata: {
          isSeniorCitizen: parseInt(formData.age) >= 65,
          is4PsParticipant: formData.participantType === "4Ps",
          registrationType: "New Registration"
        }
      };

      // Add to Firestore
      const participantsRef = collection(db, "participants");
      const docRef = await addDoc(participantsRef, newParticipant);

      // Update the participant with the Firestore document ID
      const participantWithId = {
        ...newParticipant,
        docId: docRef.id,
        dateRegistered: new Date().toLocaleDateString(),
      };

      // Show success message
      toast.success("Participant added successfully!");

      // Call the onSubmit prop with the new participant data
      onSubmit(participantWithId);
      onClose();
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error("Failed to add participant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Participant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "gender", value } })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="LGBTQIA+">LGBTQIA+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full"
                  readOnly
                />
              </div>
            </div>

            {/* Address field - full width */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="Enter complete address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{11}"
                  maxLength={11}
                  placeholder="Enter 11-digit number"
                  value={formData.contactNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleChange({
                      target: {
                        name: 'contactNumber',
                        value: value
                      }
                    });
                  }}
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Please enter 11 digits (e.g., 09123456789)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validID">Valid ID Type</Label>
                <Input
                  id="validID"
                  name="validID"
                  value={formData.validID}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validIDNumber">Valid ID Number</Label>
                <Input
                  id="validIDNumber"
                  name="validIDNumber"
                  value={formData.validIDNumber}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participantType">Type of Participant *</Label>
                <Select
                  name="participantType"
                  value={formData.participantType}
                  onValueChange={(value) => {
                    handleChange({ target: { name: "participantType", value } });
                    if (!value.includes("4Ps")) {
                      setFormData(prev => ({
                        ...prev,
                        is4PsHouseholdMember: "",
                        householdId: ""
                      }));
                    }
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type of participant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poor - Exiting 4Ps">Poor - Exiting 4Ps</SelectItem>
                    <SelectItem value="Poor - 4Ps">Poor - 4Ps</SelectItem>
                    <SelectItem value="Poor - Listahanan">Poor - Listahanan</SelectItem>
                    <SelectItem value="Non-Poor">Non-Poor</SelectItem>
                    <SelectItem value="No Match">No Match</SelectItem>
                    <SelectItem value="SLP Means Test">SLP Means Test</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector *</Label>
                <Select
                  name="sector"
                  value={formData.sector}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "sector", value } })
                  }
                  required
                  disabled={formData.age >= 60}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indigenous People (IP)">Indigenous People (IP)</SelectItem>
                    <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                    <SelectItem value="Solo Parent">Solo Parent</SelectItem>
                    <SelectItem value="Internally Displaced Person (IDP)">Internally Displaced Person (IDP)</SelectItem>
                    <SelectItem value="Overseas Filipino Worker (OFW)">Overseas Filipino Worker (OFW)</SelectItem>
                    <SelectItem value="Homeless Individual">Homeless Individual</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Show 4Ps fields only when relevant participant type is selected */}
            {(formData.participantType === "Poor - Exiting 4Ps" || formData.participantType === "Poor - 4Ps") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">4Ps Household Member? *</Label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is4PsHouseholdMember"
                        value="Yes"
                        checked={formData.is4PsHouseholdMember === "Yes"}
                        onChange={handleChange}
                        className="form-radio text-primary h-4 w-4"
                        required
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is4PsHouseholdMember"
                        value="No"
                        checked={formData.is4PsHouseholdMember === "No"}
                        onChange={handleChange}
                        className="form-radio text-primary h-4 w-4"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {formData.is4PsHouseholdMember === "Yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="householdId">Household ID *</Label>
                    <Input
                      id="householdId"
                      name="householdId"
                      value={formData.householdId}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
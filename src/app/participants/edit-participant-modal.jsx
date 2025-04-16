"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

export function EditParticipantModal({ isOpen, onClose, onSubmit, participant }) {
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

  const fieldsToUpperCase = ['name', 'address', 'project', 'validID'];

  // Load participant data when modal opens
  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || "",
        gender: participant.gender || "",
        age: participant.age || "",
        birthday: participant.birthday || "",
        project: participant.project || "",
        contactNumber: participant.contactNumber || "",
        address: participant.address || "",
        validID: participant.validID || "",
        validIDNumber: participant.validIDNumber || "",
        participantType: participant.participantType || "",
        is4PsHouseholdMember: participant.is4PsHouseholdMember || "",
        householdId: participant.householdId || "",
        sector: participant.sector || ""
      });
    }
  }, [participant]);

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
    
    // Convert text to uppercase for specific fields
    const processedValue = fieldsToUpperCase.includes(name) ? value.toUpperCase() : value;
    
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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
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

      await onSubmit(participant.docId, {
        ...formData,
        updatedAt: new Date(),
      });
      
      toast.success("Participant updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating participant:", error);
      toast.error("Failed to update participant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Participant</DialogTitle>
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
                    <SelectItem value="MALE">MALE</SelectItem>
                    <SelectItem value="FEMALE">FEMALE</SelectItem>
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
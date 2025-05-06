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
import { checkDuplicates } from "@/utils/duplicateCheck";
import { DuplicateMatchModal } from "./DuplicateMatchModal";

export function AddParticipantModal({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [pendingParticipant, setPendingParticipant] = useState(null);
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
    sector: "",
    category: "",
    slpaName: "",
    slpaPosition: ""
  });

  const fieldsToUpperCase = ['name', 'address', 'project', 'validID', 'slpaName', 'slpaPosition', 'category'];

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
    
    if (name === "category") {
      setFormData(prev => ({
        ...prev,
        category: processedValue,
        // Only clear SLPA name and position when switching to INDIVIDUAL
        ...(processedValue === "INDIVIDUAL" && { slpaName: "", slpaPosition: "" })
      }));
    } else if (name === "birthday") {
      const age = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        birthday: value,
        age: age,
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
          [field]: processedValue,
        },
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

      // Generate random 5-digit number starting from 99999
      const min = 99999;
      const max = 999999;
      const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
      
      // Create new participant object
      const newParticipant = {
        ...formData,
        id: `SLP ID-${randomId}`,
        status: "Active",
        dateRegistered: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {
          isSeniorCitizen: parseInt(formData.age) >= 65,
          is4PsParticipant: formData.participantType === "4Ps",
          registrationType: "New Registration"
        }
      };

      // Check for duplicates before adding
      const duplicateResults = await checkDuplicates(newParticipant);
      
      if (duplicateResults.hasDuplicates) {
        setDuplicateData(duplicateResults);
        setShowDuplicateModal(true);
        setPendingParticipant(newParticipant);
        return;
      }

      // If no duplicates, proceed with adding the participant
      await addParticipant(newParticipant);

    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error("Failed to add participant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (participant) => {
    try {
      // Add to Firestore
      const participantsRef = collection(db, "participants");
      const docRef = await addDoc(participantsRef, participant);

      // Update the participant with the Firestore document ID
      const participantWithId = {
        ...participant,
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
    }
  };

  const handleDuplicateConfirm = async () => {
    if (pendingParticipant) {
      await addParticipant(pendingParticipant);
    }
    setShowDuplicateModal(false);
    setPendingParticipant(null);
    setDuplicateData(null);
  };

  const handleDuplicateCancel = () => {
    setShowDuplicateModal(false);
    setPendingParticipant(null);
    setDuplicateData(null);
    setLoading(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold">Add New Participant</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill in the participant details. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-foreground/80">Personal Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter full name"
                      className="border-input/50 focus:border-primary h-10 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm">
                      Gender *
                    </Label>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleChange({ target: { name: "gender", value } })
                      }
                      required
                    >
                      <SelectTrigger className="h-10 w-full">
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

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="birthday" className="text-sm">
                      Birthday *
                    </Label>
                    <Input
                      id="birthday"
                      name="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={handleChange}
                      required
                      className="border-input/50 focus:border-primary h-10 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm">
                      Age
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      readOnly
                      className="bg-muted/50 border-input/50 h-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-foreground/80">Location & Contact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm">
                      Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter complete address"
                      className="border-input/50 focus:border-primary h-10 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-sm">
                      Contact Number *
                    </Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{11}"
                      maxLength={11}
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
                      placeholder="Enter 11-digit number"
                      className="border-input/50 focus:border-primary h-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Project & Category */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-foreground/80">Project & Category</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm">
                      Group/Individual *
                    </Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) =>
                        handleChange({ target: { name: "category", value: value.toUpperCase() } })
                      }
                      required
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GROUP">GROUP</SelectItem>
                        <SelectItem value="INDIVIDUAL">INDIVIDUAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project" className="text-sm">
                      Project *
                    </Label>
                    <Input
                      id="project"
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      required
                      placeholder="Enter project name"
                      className="border-input/50 focus:border-primary h-10 w-full uppercase"
                    />
                  </div>
                </div>
                {formData.category === "GROUP" && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="slpaName" className="text-sm">
                        SLPA Name *
                      </Label>
                      <Input
                        id="slpaName"
                        name="slpaName"
                        value={formData.slpaName}
                        onChange={handleChange}
                        required
                        placeholder="Enter SLPA name (e.g., SLPA-NAME)"
                        className="border-input/50 focus:border-primary h-10 w-full uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slpaPosition" className="text-sm">
                        Position *
                      </Label>
                      <Input
                        id="slpaPosition"
                        name="slpaPosition"
                        value={formData.slpaPosition}
                        onChange={handleChange}
                        required
                        placeholder="Enter position"
                        className="border-input/50 focus:border-primary h-10 w-full uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Contact & Identification */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-foreground/80">Identification</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="validID" className="text-sm">
                      Valid ID Type *
                    </Label>
                    <Input
                      id="validID"
                      name="validID"
                      value={formData.validID}
                      onChange={handleChange}
                      required
                      placeholder="Enter ID type"
                      className="border-input/50 focus:border-primary h-10 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validIDNumber" className="text-sm">
                      Valid ID Number *
                    </Label>
                    <Input
                      id="validIDNumber"
                      name="validIDNumber"
                      value={formData.validIDNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter ID number"
                      className="border-input/50 focus:border-primary h-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Program Details */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-foreground/80">Program Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="participantType" className="text-sm">
                      Type of Participant *
                    </Label>
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
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select type" />
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
                    <Label htmlFor="sector" className="text-sm">
                      Sector *
                    </Label>
                    <Select
                      name="sector"
                      value={formData.sector}
                      onValueChange={(value) =>
                        handleChange({ target: { name: "sector", value } })
                      }
                      required
                      disabled={formData.age >= 60}
                    >
                      <SelectTrigger className="h-10 w-full">
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

                {(formData.participantType === "Poor - Exiting 4Ps" || formData.participantType === "Poor - 4Ps") && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm">4Ps Household Member? *</Label>
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="is4PsHouseholdMember"
                            value="Yes"
                            checked={formData.is4PsHouseholdMember === "Yes"}
                            onChange={handleChange}
                            className="text-primary focus:ring-primary"
                            required
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="is4PsHouseholdMember"
                            value="No"
                            checked={formData.is4PsHouseholdMember === "No"}
                            onChange={handleChange}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>

                    {formData.is4PsHouseholdMember === "Yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="householdId" className="text-sm">
                          Household ID *
                        </Label>
                        <Input
                          id="householdId"
                          name="householdId"
                          value={formData.householdId}
                          onChange={handleChange}
                          required
                          placeholder="Enter household ID"
                          className="border-input/50 focus:border-primary h-10 w-full"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <DialogFooter className="p-6 pt-4 border-t">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Participant"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DuplicateMatchModal
        isOpen={showDuplicateModal}
        onClose={handleDuplicateCancel}
        duplicateData={duplicateData}
        onConfirm={handleDuplicateConfirm}
      />
    </>
  );
} 
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

export function EditParticipantModal({ isOpen, onClose, onSubmit, participant }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    program: "",
    contactNumber: "",
    address: "",
    barangay: "",
    validID: "",
    validIDNumber: "",
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
  });

  // Load participant data when modal opens
  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || "",
        gender: participant.gender || "",
        age: participant.age || "",
        program: participant.program || "",
        contactNumber: participant.contactNumber || "",
        address: participant.address || "",
        barangay: participant.barangay || "",
        validID: participant.validID || "",
        validIDNumber: participant.validIDNumber || "",
        emergencyContact: {
          name: participant.emergencyContact?.name || "",
          relationship: participant.emergencyContact?.relationship || "",
          contactNumber: participant.emergencyContact?.contactNumber || "",
        },
      });
    }
  }, [participant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("emergencyContact.")) {
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
      await onSubmit(participant.docId, {
        ...formData,
        updatedAt: new Date(),
      });
      onClose();
    } catch (error) {
      console.error("Error updating participant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Participant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select
                name="program"
                value={formData.program}
                onValueChange={(value) =>
                  handleChange({ target: { name: "program", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disaster Relief Program">
                    Disaster Relief Program
                  </SelectItem>
                  <SelectItem value="Food Security Program">
                    Food Security Program
                  </SelectItem>
                  <SelectItem value="Educational Assistance">
                    Educational Assistance
                  </SelectItem>
                </SelectContent>
              </Select>
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay</Label>
              <Input
                id="barangay"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
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
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Emergency Contact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Name</Label>
                <Input
                  id="emergencyName"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact Number</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact.contactNumber"
                value={formData.emergencyContact.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
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
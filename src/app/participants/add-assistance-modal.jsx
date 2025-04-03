"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function AddAssistanceModal({ isOpen, onClose, onSubmit, participantId }) {
  const [formData, setFormData] = useState({
    type: "",
    program: "",
    quantity: 1,
    value: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(participantId, formData);
      onClose();
    } catch (error) {
      console.error("Error adding assistance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Assistance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* Add form fields for assistance details */}
          <div className="space-y-4">
            <div>
              <Label>Assistance Type</Label>
              <Input
                name="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>
            {/* Add more fields as needed */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Assistance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
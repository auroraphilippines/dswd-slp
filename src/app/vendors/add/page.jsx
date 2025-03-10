"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddVendorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectCode: "",
    programName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    // Navigate back to vendors page
    router.push("/vendors");
  };

  const handleCancel = () => {
    router.push("/vendors");
  };

  const handleNextClick = () => {
    // Handle form submission here
    console.log(formData);
    // Navigate to raw-materials page
    router.push("/vendors/raw-materials");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Vendor</CardTitle>
            <CardDescription>
              Enter vendor details for the program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectCode">Project Code</Label>
                <Input
                  id="projectCode"
                  placeholder="Enter project code"
                  value={formData.projectCode}
                  onChange={(e) =>
                    setFormData({ ...formData, projectCode: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input
                  id="programName"
                  placeholder="Enter program name (e.g., Goat Raising, Rice Store)"
                  value={formData.programName}
                  onChange={(e) =>
                    setFormData({ ...formData, programName: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleNextClick}>
                  Next
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from "@/service/auth";

// Safe localStorage functions
const getLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Function to get all existing project codes
const getExistingProjectCodes = () => {
  const existingCodes = getLocalStorage('existingProjectCodes');
  return existingCodes ? JSON.parse(existingCodes) : [];
};

// Function to generate unique project code
const generateProjectCode = () => {
  const currentYear = new Date().getFullYear();
  const randomId = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  return `SLPA GAA - ${currentYear} - ${randomId}`;
};

// Function to generate a unique project code that doesn't exist
const generateUniqueProjectCode = () => {
  const existingCodes = getExistingProjectCodes();
  let newCode;
  do {
    newCode = generateProjectCode();
  } while (existingCodes.includes(newCode));
  return newCode;
};

// Function to save project code to existing codes
const saveProjectCode = (code) => {
  const existingCodes = getExistingProjectCodes();
  existingCodes.push(code);
  setLocalStorage('existingProjectCodes', JSON.stringify(existingCodes));
};

export default function AddVendorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(() => {
    // Try to get saved form data from localStorage
    const savedData = getLocalStorage('vendorFormData');
    const tempData = savedData ? JSON.parse(savedData) : {
      projectCode: generateUniqueProjectCode(),
      programName: "",
      name: "",
      email: "",
    };
    return tempData;
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const currentUser = await getCurrentUser();
        console.log("Current user data:", currentUser);
        
        if (!currentUser) {
          console.log("No user found, redirecting to login");
          router.push('/login');
          return;
        }

        setUser(currentUser);
        
        // Update form data with user information, preserving existing program name
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || currentUser.name || '',
          email: currentUser.email || ''
        }));

      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data: " + error.message);
      }
    };

    fetchUser();
  }, []); // Run only on mount

  // Save form data whenever it changes
  useEffect(() => {
    if (formData.programName.trim()) { // Only save if there's a program name
      setLocalStorage('vendorFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to continue");
      router.push('/login');
      return;
    }

    // Basic validation
    if (!formData.programName.trim()) {
      toast.error("Please enter a program name");
      return;
    }

    // Check if project code exists
    const existingCodes = getExistingProjectCodes();
    if (existingCodes.includes(formData.projectCode)) {
      toast.error("This project code already exists. Please regenerate a new one.");
      return;
    }

    setLoading(true);
    try {
      // Ensure all required fields are present
      const vendorData = {
        ...formData,
        userId: user.uid || '',
        userDisplayName: user.displayName || '',
        userEmail: user.email || '',
        createdAt: new Date().toISOString()
      };

      // Log the data for debugging
      console.log("Storing vendor data:", vendorData);

      // Store vendor data in localStorage for the next steps
      setLocalStorage('tempVendorData', JSON.stringify(vendorData));
      
      // Only save project code when form is successfully submitted
      saveProjectCode(formData.projectCode);
      
      toast.success("Vendor details stored successfully!");
      router.push("/vendors/raw-materials");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear form data from localStorage when canceling
    removeLocalStorage('vendorFormData');
    removeLocalStorage('tempVendorData');
    router.push("/vendors");
  };

  // Function to handle key press for form navigation
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      const next = form.elements[index + 1];
      if (next) {
        next.focus();
      }
    }
  };

  // Function to generate new project code
  const handleRegenerateProjectCode = () => {
    const newCode = generateUniqueProjectCode();
    setFormData(prev => ({
      ...prev,
      projectCode: newCode
    }));
    toast.success("New project code generated successfully");
  };

  return (
    <div className="container mx-auto px-4 py-6">
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
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
            <CardDescription>
              Enter project details for the program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="projectCode">Project Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="projectCode"
                    value={formData.projectCode}
                    readOnly
                    className="flex-1"
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleRegenerateProjectCode}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input
                  id="programName"
                  placeholder="Enter program name (e.g., Goat Raising, Rice Store)"
                  value={formData.programName}
                  onChange={(e) =>
                    setFormData({ ...formData, programName: e.target.value.toUpperCase() })
                  }
                  onKeyPress={handleKeyPress}
                  required
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Loading user data..."
                  value={formData.name}
                  readOnly
                  className="bg-gray-50"
                  onKeyPress={handleKeyPress}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Loading user data..."
                  value={formData.email}
                  readOnly
                  className="bg-gray-50"
                  onKeyPress={handleKeyPress}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !user}
                >
                  {loading ? "Saving..." : "Next"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
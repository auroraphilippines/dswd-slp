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
  CardFooter,
} from "@/components/ui/card";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  ArrowRight,   
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { saveVendorDetails } from "@/service/vendor";
import { getCurrentUser } from "@/service/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initial material state
const initialMaterial = {
  id: 1,
  name: "",
  quantity: 0,
  unit: "",
  unitPrice: 0,
  frequency: "",
  totalCost: 0,
};

export default function RawMaterialsPage() {
  const router = useRouter();
  const [formId] = useState("100002");
  const MAX_MATERIALS = 50;
  const [isClient, setIsClient] = useState(false);
  const [rawMaterials, setRawMaterials] = useState([initialMaterial]);
  const [loading, setLoading] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
    // Load saved data after component mounts
    const savedData = localStorage.getItem('rawMaterialsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Ensure all numeric fields are properly converted
      const processedData = parsedData.map(material => ({
        ...material,
        quantity: Number(material.quantity) || 0,
        unitPrice: Number(material.unitPrice) || 0,
        totalCost: Number(material.totalCost) || 0,
      }));
      setRawMaterials(processedData);
    }
  }, []);

  // Save raw materials data whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('rawMaterialsData', JSON.stringify(rawMaterials));
    }
  }, [rawMaterials, isClient]);

  const handleInputChange = (index, field, value) => {
    const updatedMaterials = [...rawMaterials];
    updatedMaterials[index][field] = value;

    // Recalculate total cost if quantity or unit price changes
    if (field === "quantity" || field === "unitPrice") {
      const quantity = Number(updatedMaterials[index].quantity) || 0;
      const unitPrice = Number(updatedMaterials[index].unitPrice) || 0;
      updatedMaterials[index].totalCost = quantity * unitPrice;
    }

    setRawMaterials(updatedMaterials);
  };

  const handleAddMaterial = () => {
    if (rawMaterials.length >= MAX_MATERIALS) {
      return;
    }

    setRawMaterials([
      ...rawMaterials,
      {
        ...initialMaterial,
        id: rawMaterials.length + 1,
      },
    ]);
  };

  const handleRemoveMaterial = (index) => {
    const updatedMaterials = [...rawMaterials];
    updatedMaterials.splice(index, 1);
    // Update the id/numbering for all materials after the removed one
    for (let i = index; i < updatedMaterials.length; i++) {
      updatedMaterials[i].id = i + 1;
    }
    setRawMaterials(updatedMaterials);
  };

  const handleIncrement = (index, field) => {
    const updatedMaterials = [...rawMaterials];
    if (field === "quantity") {
      updatedMaterials[index].quantity += 1;
      updatedMaterials[index].totalCost =
        updatedMaterials[index].quantity * updatedMaterials[index].unitPrice;
    } else if (field === "unitPrice") {
      updatedMaterials[index].unitPrice += 250;
      updatedMaterials[index].totalCost =
        updatedMaterials[index].quantity * updatedMaterials[index].unitPrice;
    }
    setRawMaterials(updatedMaterials);
  };

  const handleDecrement = (index, field) => {
    const updatedMaterials = [...rawMaterials];
    if (field === "quantity" && updatedMaterials[index].quantity > 0) {
      updatedMaterials[index].quantity -= 1;
      updatedMaterials[index].totalCost =
        updatedMaterials[index].quantity * updatedMaterials[index].unitPrice;
    } else if (
      field === "unitPrice" &&
      updatedMaterials[index].unitPrice >= 250
    ) {
      updatedMaterials[index].unitPrice -= 250;
      updatedMaterials[index].totalCost =
        updatedMaterials[index].quantity * updatedMaterials[index].unitPrice;
    }
    setRawMaterials(updatedMaterials);
  };

  const handlePrev = () => {
    // Save current state before navigating
    localStorage.setItem('rawMaterialsData', JSON.stringify(rawMaterials));
    router.back();
  };

  // Function to handle key press for form navigation
  const handleKeyPress = (e, index, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Define the field order
      const fieldOrder = ['name', 'quantity', 'unit', 'unitPrice', 'frequency'];
      const currentIndex = fieldOrder.indexOf(currentField);
      
      if (currentIndex < fieldOrder.length - 1) {
        // Move to next field in the same material
        document.getElementById(`${fieldOrder[currentIndex + 1]}-${index}`).focus();
      } else if (index < rawMaterials.length - 1) {
        // Move to first field of next material
        document.getElementById(`name-${index + 1}`).focus();
      }

      // Get the temporary vendor data from localStorage
      const tempVendorData = JSON.parse(localStorage.getItem('tempVendorData'));
      if (!tempVendorData) {
        alert("Vendor data not found. Please start from the beginning.");
        router.push('/vendors/add');
        return;
      }

      // Save vendor data along with raw materials
      const result = await saveVendorDetails({
        ...tempVendorData,
        rawMaterials: rawMaterials.map(material => ({
          name: material.name,
          quantity: material.quantity,
          unit: material.unit,
          unitPrice: material.unitPrice,
          frequency: material.frequency,
          totalCost: material.totalCost
        })),
      }, user.uid);

      if (result.success) {
        // Clear temporary data
        localStorage.removeItem('tempVendorData');
        // Store the vendor ID for the next step
        localStorage.setItem('currentVendorId', result.vendorId);
        router.push("/vendors/man-power");
      } else {
        console.error("Failed to save vendor details:", result.error);
        alert("Failed to save vendor details. Please try again.");
      }
    } catch (error) {
      console.error("Error saving vendor data:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Just navigate to the next page without validation or saving
    router.push("/vendors/man-power");
  };

  // Calculate total cost of all materials
  const totalProjectCost = isClient ? rawMaterials.reduce(
    (sum, material) => sum + (Number(material.totalCost) || 0),
    0
  ) : 0;

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
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-card border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Raw Materials
                </CardTitle>
                <CardDescription>
                  Add raw materials for your project (maximum {MAX_MATERIALS})
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                ID: {formId}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {rawMaterials.map((material, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-card shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Material #{material.id}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveMaterial(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>
                        Raw Material #{material.id}
                      </Label>
                      <Input
                        id={`name-${index}`}
                        value={material.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyPress(e, index, "name")}
                        placeholder="Enter material name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>
                        Quantity #{material.id}
                      </Label>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-r-none"
                          onClick={() => handleDecrement(index, "quantity")}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          value={material.quantity}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "quantity",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          onKeyDown={(e) => handleKeyPress(e, index, "quantity")}
                          className="rounded-none text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-l-none"
                          onClick={() => handleIncrement(index, "quantity")}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`unit-${index}`}>
                        Unit #{material.id}
                      </Label>
                      <Input
                        id={`unit-${index}`}
                        value={material.unit}
                        onChange={(e) =>
                          handleInputChange(index, "unit", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyPress(e, index, "unit")}
                        placeholder="e.g., Pcs, Liter, Kg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`unit-price-${index}`}>
                        Unit Price (PHP) #{material.id}
                      </Label>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-r-none"
                          onClick={() => handleDecrement(index, "unitPrice")}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`unit-price-${index}`}
                          type="number"
                          value={material.unitPrice}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "unitPrice",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          onKeyDown={(e) => handleKeyPress(e, index, "unitPrice")}
                          className="rounded-none text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-l-none"
                          onClick={() => handleIncrement(index, "unitPrice")}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`frequency-${index}`}>
                        Frequency of Production #{material.id}
                      </Label>
                      <Input
                        id={`frequency-${index}`}
                        value={material.frequency}
                        onChange={(e) =>
                          handleInputChange(index, "frequency", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyPress(e, index, "frequency")}
                        placeholder="e.g., Once, Monthly, Quarterly"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`total-cost-${index}`}>
                        Total Cost (PHP) #{material.id}
                      </Label>
                      <Input
                        id={`total-cost-${index}`}
                        type="number"
                        value={material.totalCost}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {rawMaterials.length < MAX_MATERIALS ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddMaterial}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Raw Material
                </Button>
              ) : (
                <Alert
                  variant="warning"
                  className="bg-amber-50 border-amber-200"
                >
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    Maximum limit of {MAX_MATERIALS} materials reached.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              {isClient && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Project Cost:</span>
                  <span className="text-xl font-bold">
                    ₱ {totalProjectCost.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-card">
            <Button variant="outline" onClick={handlePrev} disabled={loading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Next
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

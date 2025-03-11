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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Minus,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RawMaterialsPage() {
  const router = useRouter();
  const [formId] = useState("100002");
  const MAX_MATERIALS = 30;
  const [rawMaterials, setRawMaterials] = useState([
    {
      id: 1,
      name: "",
      quantity: "",
      unit: "",
      unitPrice: "",
      frequency: "",
      totalCost: "",
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedMaterials = [...rawMaterials];
    updatedMaterials[index][field] = value;

    // Recalculate total cost if quantity or unit price changes
    if (field === "quantity" || field === "unitPrice") {
      updatedMaterials[index].totalCost =
        updatedMaterials[index].quantity * updatedMaterials[index].unitPrice;
    }

    setRawMaterials(updatedMaterials);
  };

  const handleAddMaterial = () => {
    if (rawMaterials.length >= MAX_MATERIALS) {
      return; // Don't add more if limit reached
    }

    setRawMaterials([
      ...rawMaterials,
      {
        id: rawMaterials.length + 1,
        name: "",
        quantity: 0,
        unit: "",
        unitPrice: 0,
        frequency: "Once",
        totalCost: 0,
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
    router.back();
  };

  const handleNext = () => {
    console.log(rawMaterials);
    router.push("/vendors");
  };

  // Calculate total cost of all materials
  const totalProjectCost = rawMaterials.reduce(
    (sum, material) => sum + material.totalCost,
    0
  );

  return (
    <div className="container mx-auto px-4 py-6">
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
                      <Label htmlFor={`material-name-${index}`}>
                        Raw Material #{material.id}
                      </Label>
                      <Input
                        id={`material-name-${index}`}
                        value={material.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
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

              <div className="flex justify-between items-center">
                <span className="font-medium">Total Project Cost:</span>
                <span className="text-xl font-bold">
                  ₱ {totalProjectCost.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-card">
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              <Save className="h-4 w-4 mr-2" />
              Save and Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

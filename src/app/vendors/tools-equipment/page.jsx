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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { saveToolsEquipment } from "@/service/vendor";
import { getCurrentUser } from "@/service/auth";

export default function ToolsEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formId] = useState("100002");
  const MAX_TOOLS = 5;
  const [tools, setTools] = useState([
    {
      id: 1,
      name: "",
      quantity: 0,
      unit: "",
      unitPrice: 0,
      totalCost: 0,
      lifeSpan: 0,
      productionCycle: 0,
      depreciationCost: 0,
    },
  ]);

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }
    };
    checkAuth();
  }, [router]);

  const handleInputChange = (index, field, value) => {
    const updatedTools = [...tools];
    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value,
    };

    // Recalculate total cost if quantity or unit price changes
    if (field === "quantity" || field === "unitPrice") {
      updatedTools[index].totalCost =
        updatedTools[index].quantity * updatedTools[index].unitPrice;
    }

    // Calculate depreciation cost when relevant fields change
    if (
      field === "totalCost" ||
      field === "lifeSpan" ||
      field === "productionCycle"
    ) {
      if (
        updatedTools[index].lifeSpan > 0 &&
        updatedTools[index].productionCycle > 0
      ) {
        updatedTools[index].depreciationCost =
          (updatedTools[index].totalCost *
            updatedTools[index].productionCycle) /
          (updatedTools[index].lifeSpan * 12);
      }
    }

    setTools(updatedTools);
  };

  const handleAddTool = () => {
    if (tools.length >= MAX_TOOLS) {
      return; // Don't add more if limit reached
    }

    setTools([
      ...tools,
      {
        id: tools.length + 1,
        name: "",
        quantity: 0,
        unit: "",
        unitPrice: 0,
        totalCost: 0,
        lifeSpan: 0,
        productionCycle: 0,
        depreciationCost: 0,
      },
    ]);
  };

  const handleRemoveTool = (index) => {
    const updatedTools = [...tools];
    updatedTools.splice(index, 1);
    // Update the id/numbering for all tools after the removed one
    for (let i = index; i < updatedTools.length; i++) {
      updatedTools[i].id = i + 1;
    }
    setTools(updatedTools);
  };

  const handleIncrement = (index, field) => {
    const updatedTools = [...tools];
    const tool = updatedTools[index];

    switch (field) {
      case "quantity":
        tool.quantity += 1;
        tool.totalCost = tool.quantity * tool.unitPrice;
        break;
      case "unitPrice":
        tool.unitPrice += 100;
        tool.totalCost = tool.quantity * tool.unitPrice;
        break;
      case "lifeSpan":
        tool.lifeSpan += 1;
        break;
      case "productionCycle":
        tool.productionCycle += 1;
        break;
    }

    // Update depreciation cost
    if (tool.lifeSpan > 0 && tool.productionCycle > 0) {
      tool.depreciationCost =
        (tool.totalCost * tool.productionCycle) / (tool.lifeSpan * 12);
    }

    setTools(updatedTools);
  };

  const handleDecrement = (index, field) => {
    const updatedTools = [...tools];
    const tool = updatedTools[index];

    switch (field) {
      case "quantity":
        if (tool.quantity > 0) {
          tool.quantity -= 1;
          tool.totalCost = tool.quantity * tool.unitPrice;
        }
        break;
      case "unitPrice":
        if (tool.unitPrice >= 100) {
          tool.unitPrice -= 100;
          tool.totalCost = tool.quantity * tool.unitPrice;
        }
        break;
      case "lifeSpan":
        if (tool.lifeSpan > 0) {
          tool.lifeSpan -= 1;
        }
        break;
      case "productionCycle":
        if (tool.productionCycle > 0) {
          tool.productionCycle -= 1;
        }
        break;
    }

    // Update depreciation cost
    if (tool.lifeSpan > 0 && tool.productionCycle > 0) {
      tool.depreciationCost =
        (tool.totalCost * tool.productionCycle) / (tool.lifeSpan * 12);
    }

    setTools(updatedTools);
  };

  const handlePrev = () => {
    router.back();
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      // Check authentication before saving
      const user = await getCurrentUser();
      if (!user) {
        alert("Please login to continue");
        router.push('/login');
        return;
      }

      const vendorId = localStorage.getItem('currentVendorId');
      if (!vendorId) {
        alert("Vendor ID not found. Please start from the beginning.");
        router.push("/vendors/add");
        return;
      }

      const result = await saveToolsEquipment(
        vendorId,
        tools.map(tool => ({
          name: tool.name,
          quantity: tool.quantity,
          unit: tool.unit,
          unitPrice: tool.unitPrice,
          lifeSpan: tool.lifeSpan,
          productionCycle: tool.productionCycle,
          totalCost: tool.totalCost,
          depreciationCost: tool.depreciationCost
        })),
        user.uid // Pass the user ID as the third argument
      );

      if (result.success) {
        // Clear the vendorId from localStorage since we're done with the flow
        localStorage.removeItem('currentVendorId');
        router.push("/vendors");
      } else {
        console.error("Failed to save tools data:", result.error);
        alert("Failed to save tools data. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total costs
  const totalEquipmentCost = tools.reduce(
    (sum, tool) => sum + tool.totalCost,
    0
  );
  const totalDepreciationCost = tools.reduce(
    (sum, tool) => sum + tool.depreciationCost,
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
                  Tools and Equipment
                </CardTitle>
                <CardDescription>
                  Add tools and equipment for your project (maximum {MAX_TOOLS})
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                ID: {formId}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-card shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Tool/Equipment #{tool.id}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveTool(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`tool-name-${index}`}>
                        Tool/Equipment Name #{tool.id}
                      </Label>
                      <Input
                        id={`tool-name-${index}`}
                        value={tool.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                        placeholder="Enter tool/equipment name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>
                        Quantity #{tool.id}
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
                          value={tool.quantity}
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
                      <Label htmlFor={`unit-${index}`}>Unit #{tool.id}</Label>
                      <Input
                        id={`unit-${index}`}
                        value={tool.unit}
                        onChange={(e) =>
                          handleInputChange(index, "unit", e.target.value)
                        }
                        placeholder="e.g., Pcs, Set, Unit"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`unit-price-${index}`}>
                        Unit Price (PHP) #{tool.id}
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
                          value={tool.unitPrice}
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
                      <Label htmlFor={`life-span-${index}`}>
                        Life Span (Years) #{tool.id}
                      </Label>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-r-none"
                          onClick={() => handleDecrement(index, "lifeSpan")}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`life-span-${index}`}
                          type="number"
                          value={tool.lifeSpan}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "lifeSpan",
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
                          onClick={() => handleIncrement(index, "lifeSpan")}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`production-cycle-${index}`}>
                        Production Cycle (Months) #{tool.id}
                      </Label>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-r-none"
                          onClick={() =>
                            handleDecrement(index, "productionCycle")
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`production-cycle-${index}`}
                          type="number"
                          value={tool.productionCycle}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "productionCycle",
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
                          onClick={() =>
                            handleIncrement(index, "productionCycle")
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`total-cost-${index}`}>
                        Total Cost (PHP) #{tool.id}
                      </Label>
                      <Input
                        id={`total-cost-${index}`}
                        type="number"
                        value={tool.totalCost}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`depreciation-cost-${index}`}>
                        Depreciation Cost (PHP) #{tool.id}
                      </Label>
                      <Input
                        id={`depreciation-cost-${index}`}
                        type="number"
                        value={tool.depreciationCost.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {tools.length < MAX_TOOLS ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddTool}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Add Another Tool/Equipment
                </Button>
              ) : (
                <Alert
                  variant="warning"
                  className="bg-amber-50 border-amber-200"
                >
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    Maximum limit of {MAX_TOOLS} tools/equipment reached.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Equipment Cost:</span>
                  <span className="text-xl font-bold">
                    ₱ {totalEquipmentCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Depreciation Cost:</span>
                  <span className="text-xl font-bold">
                    ₱ {totalDepreciationCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-card">
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

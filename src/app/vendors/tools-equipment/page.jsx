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
import { saveToolsEquipment, saveVendorDetails } from "@/service/vendor";
import { getCurrentUser } from "@/service/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initial tool state
const initialTool = {
  id: 1,
  name: "",
  quantity: 0,
  unit: "",
  unitPrice: 0,
  totalCost: 0,
  lifeSpan: 0,
  productionCycle: 0,
  depreciationCost: 0,
};

export default function ToolsEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formId] = useState("100002");
  const [isClient, setIsClient] = useState(false);
  const MAX_TOOLS = 5;
  const [tools, setTools] = useState([initialTool]);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);

    // Load saved tool data after component mounts
    const savedData = localStorage.getItem('toolsData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure all numeric fields are properly converted
        const processedData = parsedData.map(tool => ({
          ...tool,
          quantity: Number(tool.quantity) || 0,
          unitPrice: Number(tool.unitPrice) || 0,
          totalCost: Number(tool.totalCost) || 0,
          lifeSpan: Number(tool.lifeSpan) || 0,
          productionCycle: Number(tool.productionCycle) || 0,
          depreciationCost: Number(tool.depreciationCost) || 0,
        }));
        setTools(processedData);
      } catch (error) {
        console.error("Error loading saved tool data:", error);
      }
    }

    // Check authentication
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }
    };
    checkAuth();
  }, [router]);

  // Save tool data whenever it changes
  useEffect(() => {
    if (isClient && tools.length > 0) {
      localStorage.setItem('toolsData', JSON.stringify(tools));
    }
  }, [tools, isClient]);

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
        ...initialTool,
        id: tools.length + 1,
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
    // Save current state before navigating back
    localStorage.setItem('toolsData', JSON.stringify(tools));
    router.back();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Check authentication before saving
      const user = await getCurrentUser();
      if (!user) {
        toast.error("Please login to continue");
        router.push('/login');
        return;
      }

      // Get vendor data from all steps
      const tempVendorData = JSON.parse(localStorage.getItem('tempVendorData')) || {};
      const rawMaterialsData = JSON.parse(localStorage.getItem('rawMaterialsData')) || [];
      const workerData = JSON.parse(localStorage.getItem('workerData')) || [];
      
      // Get or create vendorId
      const vendorId = localStorage.getItem('currentVendorId') || `VEN${Date.now()}`;

      // Format worker data properly
      const formattedWorkers = workerData.map(worker => ({
        numberOfWorkers: Number(worker.numberOfWorkers) || 0,
        task: worker.task?.trim() || '',
        wage: Number(worker.wage) || 0,
        totalWage: (Number(worker.numberOfWorkers) || 0) * (Number(worker.wage) || 0)
      }));

      // Format tool data properly
      const formattedTools = tools.map(tool => ({
        name: tool.name?.trim() || '',
        quantity: Number(tool.quantity) || 0,
        unit: tool.unit?.trim() || '',
        unitPrice: Number(tool.unitPrice) || 0,
        totalCost: Number(tool.totalCost) || 0,
        lifeSpan: Number(tool.lifeSpan) || 0,
        productionCycle: Number(tool.productionCycle) || 0,
        depreciationCost: Number(tool.depreciationCost) || 0
      }));

      // Prepare the consolidated vendor data with all information
      const vendorDataToSave = {
        ...tempVendorData,
        userId: user.uid,
        vendorId: vendorId,
        userDisplayName: user.displayName || '',
        userEmail: user.email || '',
        createdAt: new Date().toISOString(),
        // Raw materials from step 1
        rawMaterials: rawMaterialsData,
        // Workers from step 2
        manpower: formattedWorkers,
        // Tools from current step
        tools: formattedTools,
        // Add summary data
        summary: {
          totalManpowerCost: formattedWorkers.reduce((sum, worker) => sum + worker.totalWage, 0),
          totalMaterialsCost: rawMaterialsData.reduce((sum, material) => sum + (Number(material.totalCost) || 0), 0),
          totalEquipmentCost: formattedTools.reduce((sum, tool) => sum + (Number(tool.totalCost) || 0), 0),
          totalDepreciationCost: formattedTools.reduce((sum, tool) => sum + (Number(tool.depreciationCost) || 0), 0)
        }
      };

      // Log data before saving for debugging
      console.log("========== DEBUG LOGS ==========");
      console.log("Raw Worker Data:", workerData);
      console.log("Formatted Workers:", formattedWorkers);
      console.log("Raw Tools Data:", tools);
      console.log("Formatted Tools:", formattedTools);
      console.log("Raw Materials Data:", rawMaterialsData);
      console.log("Complete vendor data to save:", vendorDataToSave);
      console.log("==============================");

      // Save all vendor data
      const result = await saveVendorDetails(vendorDataToSave, user.uid);

      if (result.success) {
        toast.success("All vendor details saved successfully!");
        
        // Clear all temporary data from localStorage
        localStorage.removeItem('tempVendorData');
        localStorage.removeItem('rawMaterialsData');
        localStorage.removeItem('workerData');
        localStorage.removeItem('toolsData');
        localStorage.removeItem('currentVendorId');
        
        // Navigate back to vendors list
        setTimeout(() => {
          router.push("/vendors");
        }, 2000);
      } else {
        toast.error(result.error || "Failed to save vendor details. Please try again.");
      }
    } catch (error) {
      console.error("Error saving vendor data:", error);
      toast.error(error.message || "An error occurred while saving. Please try again.");
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

  // Function to handle key press for form navigation
  const handleKeyPress = (e, index, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Define the field order
      const fieldOrder = ['name', 'quantity', 'unit', 'unitPrice', 'lifeSpan', 'productionCycle'];
      const currentIndex = fieldOrder.indexOf(currentField);
      
      if (currentIndex < fieldOrder.length - 1) {
        // Move to next field in the same tool
        const nextFieldId = 
          currentField === 'name' ? `tool-name-${index}` :
          currentField === 'quantity' ? `quantity-${index}` :
          currentField === 'unit' ? `unit-${index}` :
          currentField === 'unitPrice' ? `unit-price-${index}` :
          currentField === 'lifeSpan' ? `life-span-${index}` :
          `production-cycle-${index}`;
          
        const nextField = document.getElementById(nextFieldId);
        if (nextField) nextField.focus();
      } else if (index < tools.length - 1) {
        // Move to first field of next tool
        const nextToolField = document.getElementById(`tool-name-${index + 1}`);
        if (nextToolField) nextToolField.focus();
      }
    }
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
                          handleInputChange(index, "name", e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) => handleKeyPress(e, index, "name")}
                        placeholder="Enter tool/equipment name"
                        className="uppercase"
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
                      <Label htmlFor={`unit-${index}`}>Unit #{tool.id}</Label>
                      <Input
                        id={`unit-${index}`}
                        value={tool.unit}
                        onChange={(e) =>
                          handleInputChange(index, "unit", e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) => handleKeyPress(e, index, "unit")}
                        placeholder="e.g., Pcs, Set, Unit"
                        className="uppercase"
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
                          onKeyDown={(e) => handleKeyPress(e, index, "lifeSpan")}
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
                          onKeyDown={(e) => handleKeyPress(e, index, "productionCycle")}
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
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
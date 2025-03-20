"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export function VendorDetailView({ vendor, onUpdate }) {
  const [editingSection, setEditingSection] = useState(null);
  const [editedManpower, setEditedManpower] = useState([]);
  const [editedTools, setEditedTools] = useState([]);
  const [editedMaterials, setEditedMaterials] = useState([]);

  // Generate a unique vendor ID based on timestamp and random number
  const vendorId = `VEN${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10000)}`;

  // Calculate total manpower cost - updated to handle both wage and numberOfWorkers
  const totalManpowerCost = vendor?.manpower?.reduce((sum, worker) => {
    const wage = Number(worker.wage) || 0;
    const numberOfWorkers = Number(worker.numberOfWorkers) || 0;
    const totalWage = wage * numberOfWorkers;
    return sum + totalWage;
  }, 0) || 0;
  
  // Calculate total raw materials cost
  const totalMaterialsCost = vendor?.rawMaterials?.reduce((sum, material) => sum + (material.totalCost || 0), 0) || 0;

  // Calculate total equipment cost
  const totalEquipmentCost = vendor?.tools?.reduce((sum, item) => {
    const itemCost = Number(item.totalCost) || 0;
    return sum + itemCost;
  }, 0) || 0;

  // Debug log to check the data
  console.log("========== VENDOR DETAIL VIEW LOGS ==========");
  console.log("Complete Vendor Object:", vendor);
  console.log("Tools Array:", vendor?.tools);
  console.log("Tools Length:", vendor?.tools?.length);
  console.log("First Tool Item:", vendor?.tools?.[0]);
  console.log("Manpower Array:", vendor?.manpower);
  console.log("Raw Materials Array:", vendor?.rawMaterials);
  console.log("==========================================");

  // Handler for starting edit mode
  const handleEdit = (section, data) => {
    setEditingSection(section);
    switch(section) {
      case 'manpower':
        setEditedManpower([...data]);
        break;
      case 'tools':
        setEditedTools([...data]);
        break;
      case 'materials':
        setEditedMaterials([...data]);
        break;
    }
  };

  // Handler for saving changes
  const handleSave = async (section) => {
    try {
      let updatedVendor = { ...vendor };
      switch(section) {
        case 'manpower':
          updatedVendor.manpower = editedManpower;
          break;
        case 'tools':
          updatedVendor.tools = editedTools;
          break;
        case 'materials':
          updatedVendor.rawMaterials = editedMaterials;
          break;
      }
      
      await onUpdate(updatedVendor);
      setEditingSection(null);
      toast.success(`${section} updated successfully!`);
    } catch (error) {
      toast.error(`Failed to update ${section}`);
      console.error(error);
    }
  };

  // Handler for canceling edit mode
  const handleCancel = () => {
    setEditingSection(null);
    setEditedManpower([]);
    setEditedTools([]);
    setEditedMaterials([]);
  };

  // Handlers for adding new items
  const handleAddManpower = () => {
    setEditedManpower([...editedManpower, {
      numberOfWorkers: 0,
      task: '',
      wage: 0,
      totalWage: 0
    }]);
  };

  const handleAddTool = () => {
    setEditedTools([...editedTools, {
      name: '',
      quantity: 0,
      unit: '',
      unitPrice: 0,
      lifeSpan: 0,
      productionCycle: 0,
      totalCost: 0,
      depreciationCost: 0
    }]);
  };

  const handleAddMaterial = () => {
    setEditedMaterials([...editedMaterials, {
      name: '',
      quantity: 0,
      unit: '',
      unitPrice: 0,
      totalCost: 0,
      frequency: ''
    }]);
  };

  // Handlers for removing items
  const handleRemoveManpower = (index) => {
    setEditedManpower(editedManpower.filter((_, i) => i !== index));
  };

  const handleRemoveTool = (index) => {
    setEditedTools(editedTools.filter((_, i) => i !== index));
  };

  const handleRemoveMaterial = (index) => {
    setEditedMaterials(editedMaterials.filter((_, i) => i !== index));
  };

  // Handlers for updating item fields
  const handleManpowerChange = (index, field, value) => {
    const updated = [...editedManpower];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'wage' || field === 'numberOfWorkers') {
      updated[index].totalWage = Number(updated[index].wage || 0) * Number(updated[index].numberOfWorkers || 0);
    }
    setEditedManpower(updated);
  };

  const handleToolChange = (index, field, value) => {
    const updated = [...editedTools];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate total cost when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = Number(updated[index].quantity || 0);
      const unitPrice = Number(updated[index].unitPrice || 0);
      updated[index].totalCost = quantity * unitPrice;
    }

    // Calculate depreciation cost when total cost, life span, or production cycle changes
    if (field === 'quantity' || field === 'unitPrice' || field === 'lifeSpan' || field === 'productionCycle') {
      const totalCost = Number(updated[index].totalCost || 0);
      const lifeSpan = Number(updated[index].lifeSpan || 0);
      const productionCycle = Number(updated[index].productionCycle || 0);
      
      // Convert life span from years to months for calculation
      const lifeSpanInMonths = lifeSpan * 12;
      
      // Calculate monthly depreciation
      if (lifeSpanInMonths > 0 && productionCycle > 0) {
        // Monthly depreciation = Total Cost / Life Span in months
        const monthlyDepreciation = totalCost / lifeSpanInMonths;
        // Total depreciation for the production cycle
        updated[index].depreciationCost = monthlyDepreciation * productionCycle;
      } else {
        updated[index].depreciationCost = 0;
      }
    }
    
    setEditedTools(updated);
  };

  const handleMaterialChange = (index, field, value) => {
    const updated = [...editedMaterials];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].totalCost = Number(updated[index].quantity || 0) * Number(updated[index].unitPrice || 0);
    }
    setEditedMaterials(updated);
  };

  return (
    <Tabs defaultValue="basic-info" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
        <TabsTrigger value="manpower">Man Power</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Name:</label>
                  <p className="font-medium">{vendor?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Project Code:</label>
                  <p className="font-medium">{vendor?.projectCode || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Program Name:</label>
                  <p className="font-medium">{vendor?.programName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email:</label>
                  <p className="font-medium">{vendor?.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Registration Date:</label>
                  <p className="font-medium">
                    {vendor?.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Costs Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Total Manpower Cost:</label>
                  <p className="font-medium">₱ {totalManpowerCost.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Total Materials Cost:</label>
                  <p className="font-medium">₱ {totalMaterialsCost.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Total Equipment Cost:</label>
                  <p className="font-medium">₱ {totalEquipmentCost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manpower">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Man Power Details</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">Total: ₱ {totalManpowerCost.toLocaleString()}</Badge>
                  {editingSection === 'manpower' ? (
                    <>
                      <Button onClick={() => handleSave('manpower')} size="sm">Save</Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
                      <Button onClick={handleAddManpower} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />Add Worker
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit('manpower', vendor?.manpower || [])} variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />Edit
                    </Button>
                  )}
                </div>
              </div>
              
              {editingSection === 'manpower' ? (
                <div className="space-y-4">
                  {editedManpower.map((worker, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Worker {index + 1}</h4>
                        <Button onClick={() => handleRemoveManpower(index)} variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Number of Workers:</label>
                          <Input
                            type="number"
                            value={worker.numberOfWorkers}
                            onChange={(e) => handleManpowerChange(index, 'numberOfWorkers', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Task:</label>
                          <Input
                            value={worker.task}
                            onChange={(e) => handleManpowerChange(index, 'task', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Daily Wage:</label>
                          <Input
                            type="number"
                            value={worker.wage}
                            onChange={(e) => handleManpowerChange(index, 'wage', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Total Wage:</label>
                          <p className="font-medium">₱ {(worker.totalWage || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                vendor?.manpower && vendor.manpower.length > 0 ? (
                  <div className="space-y-4">
                    {vendor.manpower.map((worker, index) => {
                      // Ensure numeric values
                      const numberOfWorkers = Number(worker.numberOfWorkers) || 0;
                      const wage = Number(worker.wage) || 0;
                      const totalWage = numberOfWorkers * wage;

                      return (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-muted-foreground">Number of Workers:</label>
                              <p className="font-medium">{numberOfWorkers}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Task:</label>
                              <p className="font-medium">{worker.task || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Daily Wage:</label>
                              <p className="font-medium">₱ {wage.toLocaleString()}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Total Wage:</label>
                              <p className="font-medium">₱ {totalWage.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No manpower details added yet.</p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="materials">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Raw Materials</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">Total: ₱ {totalMaterialsCost.toLocaleString()}</Badge>
                  {editingSection === 'materials' ? (
                    <>
                      <Button onClick={() => handleSave('materials')} size="sm">Save</Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
                      <Button onClick={handleAddMaterial} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />Add Material
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit('materials', vendor?.rawMaterials || [])} variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />Edit
                    </Button>
                  )}
                </div>
              </div>
              
              {editingSection === 'materials' ? (
                <div className="space-y-4">
                  {editedMaterials.map((material, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Material {index + 1}</h4>
                        <Button onClick={() => handleRemoveMaterial(index)} variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Material Name:</label>
                          <Input
                            value={material.name}
                            onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Quantity:</label>
                          <Input
                            type="number"
                            value={material.quantity}
                            onChange={(e) => handleMaterialChange(index, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Unit:</label>
                          <Input
                            value={material.unit}
                            onChange={(e) => handleMaterialChange(index, 'unit', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Unit Price:</label>
                          <Input
                            type="number"
                            value={material.unitPrice}
                            onChange={(e) => handleMaterialChange(index, 'unitPrice', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Frequency:</label>
                          <Input
                            value={material.frequency}
                            onChange={(e) => handleMaterialChange(index, 'frequency', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Total Cost:</label>
                          <p className="font-medium">₱ {(material.totalCost || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                vendor?.rawMaterials && vendor.rawMaterials.length > 0 ? (
                  <div className="space-y-4">
                    {vendor.rawMaterials.map((material, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-muted-foreground">Material Name:</label>
                            <p className="font-medium">{material.name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Quantity:</label>
                            <p className="font-medium">{material.quantity} {material.unit}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Unit Price:</label>
                            <p className="font-medium">₱ {material.unitPrice?.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Total Cost:</label>
                            <p className="font-medium">₱ {material.totalCost?.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Frequency:</label>
                            <p className="font-medium">{material.frequency}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No raw materials added yet.</p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="equipment">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tools and Equipment</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">Total: ₱ {totalEquipmentCost.toLocaleString()}</Badge>
                  {editingSection === 'tools' ? (
                    <>
                      <Button onClick={() => handleSave('tools')} size="sm">Save</Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
                      <Button onClick={handleAddTool} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />Add Tool
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit('tools', vendor?.tools || [])} variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />Edit
                    </Button>
                  )}
                </div>
              </div>
              
              {editingSection === 'tools' ? (
                <div className="space-y-4">
                  {editedTools.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Tool {index + 1}</h4>
                        <Button onClick={() => handleRemoveTool(index)} variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Item Name:</label>
                          <Input
                            value={item.name}
                            onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Quantity:</label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleToolChange(index, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Unit:</label>
                          <Input
                            value={item.unit}
                            onChange={(e) => handleToolChange(index, 'unit', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Unit Price:</label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleToolChange(index, 'unitPrice', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Life Span (Years):</label>
                          <Input
                            type="number"
                            value={item.lifeSpan}
                            onChange={(e) => handleToolChange(index, 'lifeSpan', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Production Cycle (Months):</label>
                          <Input
                            type="number"
                            value={item.productionCycle}
                            onChange={(e) => handleToolChange(index, 'productionCycle', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Total Cost:</label>
                          <p className="font-medium">₱ {(item.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Depreciation Cost:</label>
                          <p className="font-medium">₱ {(item.depreciationCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Monthly depreciation: ₱ {((item.totalCost || 0) / ((item.lifeSpan || 0) * 12)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                vendor?.tools && vendor.tools.length > 0 ? (
                  <div className="space-y-4">
                    {vendor.tools.map((item, index) => {
                      // Ensure numeric values
                      const quantity = Number(item.quantity) || 0;
                      const unitPrice = Number(item.unitPrice) || 0;
                      const totalCost = Number(item.totalCost) || (quantity * unitPrice);
                      const depreciationCost = Number(item.depreciationCost) || 0;

                      return (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-muted-foreground">Item Name:</label>
                              <p className="font-medium">{item.name || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Quantity:</label>
                              <p className="font-medium">{quantity} {item.unit || ""}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Unit:</label>
                              <p className="font-medium">{item.unit || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Unit Price:</label>
                              <p className="font-medium">₱ {unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Life Span (Years):</label>
                              <p className="font-medium">{Number(item.lifeSpan) || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Production Cycle (Months):</label>
                              <p className="font-medium">{Number(item.productionCycle) || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Total Cost:</label>
                              <p className="font-medium">₱ {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">Depreciation Cost:</label>
                              <p className="font-medium">₱ {depreciationCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tools and equipment added yet.</p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

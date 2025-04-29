"use client";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function VendorDetailView({ vendor, onUpdate, readOnly }) {
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
    if (readOnly) {
      toast.error("You have read-only access. Cannot modify vendor details.");
      return;
    }
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
    if (readOnly) {
      toast.error("You have read-only access. Cannot modify vendor details.");
      return;
    }
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
    if (readOnly) {
      toast.error("You have read-only access. Cannot add manpower.");
      return;
    }
    setEditedManpower([...editedManpower, {
      numberOfWorkers: 0,
      task: '',
      wage: 0,
      totalWage: 0
    }]);
  };

  const handleAddTool = () => {
    if (readOnly) {
      toast.error("You have read-only access. Cannot add tools.");
      return;
    }
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
    if (readOnly) {
      toast.error("You have read-only access. Cannot add materials.");
      return;
    }
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
    if (readOnly) {
      toast.error("You have read-only access. Cannot remove manpower.");
      return;
    }
    setEditedManpower(editedManpower.filter((_, i) => i !== index));
  };

  const handleRemoveTool = (index) => {
    if (readOnly) {
      toast.error("You have read-only access. Cannot remove tools.");
      return;
    }
    setEditedTools(editedTools.filter((_, i) => i !== index));
  };

  const handleRemoveMaterial = (index) => {
    if (readOnly) {
      toast.error("You have read-only access. Cannot remove materials.");
      return;
    }
    setEditedMaterials(editedMaterials.filter((_, i) => i !== index));
  };

  // Handlers for updating item fields
  const handleManpowerChange = (index, field, value) => {
    if (readOnly) {
      toast.error("You have read-only access. Cannot modify manpower details.");
      return;
    }
    const updated = [...editedManpower];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'wage' || field === 'numberOfWorkers') {
      updated[index].totalWage = Number(updated[index].wage || 0) * Number(updated[index].numberOfWorkers || 0);
    }
    setEditedManpower(updated);
  };

  const handleToolChange = (index, field, value) => {
    if (readOnly) {
      toast.error("You have read-only access. Cannot modify tool details.");
      return;
    }
    const updated = [...editedTools];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate total cost when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = Number(updated[index].quantity || 0);
      const unitPrice = Number(updated[index].unitPrice || 0);
      updated[index].totalCost = quantity * unitPrice;
    }

    // Calculate depreciation cost
    if (field === 'quantity' || field === 'unitPrice' || field === 'lifeSpan' || field === 'productionCycle') {
      const totalCost = Number(updated[index].totalCost || 0);
      const lifeSpan = Number(updated[index].lifeSpan || 0);
      const productionCycle = Number(updated[index].productionCycle || 0);
      
      if (lifeSpan > 0 && productionCycle > 0) {
        const monthlyDepreciation = totalCost / (lifeSpan * 12);
        updated[index].depreciationCost = monthlyDepreciation * productionCycle;
      } else {
        updated[index].depreciationCost = 0;
      }
    }
    
    setEditedTools(updated);
  };

  const handleMaterialChange = (index, field, value) => {
    if (readOnly) {
      toast.error("You have read-only access. Cannot modify material details.");
      return;
    }
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
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-lg">Manpower Details</CardTitle>
              {!readOnly && (
                <div className="flex gap-2">
                  {editingSection === 'manpower' ? (
                    <>
                      <Button onClick={() => handleSave('manpower')}>
                        <Save className="h-4 w-4 mr-2" />Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />Cancel
                      </Button>
                      <Button variant="outline" onClick={handleAddManpower}>
                        <Plus className="h-4 w-4 mr-2" />Add Worker
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => handleEdit('manpower', vendor?.manpower || [])}>
                      <Edit2 className="h-4 w-4 mr-2" />Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
              
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number of Workers</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Daily Wage</TableHead>
                  <TableHead>Total Wage</TableHead>
                  {!readOnly && editingSection === 'manpower' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(editingSection === 'manpower' ? editedManpower : vendor?.manpower || []).map((worker, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editingSection === 'manpower' ? (
                        <Input
                          type="number"
                          value={worker.numberOfWorkers}
                          onChange={(e) => handleManpowerChange(index, 'numberOfWorkers', Number(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        worker.numberOfWorkers
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'manpower' ? (
                        <Input
                          value={worker.task}
                          onChange={(e) => handleManpowerChange(index, 'task', e.target.value)}
                        />
                      ) : (
                        worker.task
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'manpower' ? (
                        <Input
                          type="number"
                          value={worker.wage}
                          onChange={(e) => handleManpowerChange(index, 'wage', Number(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        `₱${worker.wage}`
                      )}
                    </TableCell>
                    <TableCell>₱{worker.totalWage}</TableCell>
                    {!readOnly && editingSection === 'manpower' && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveManpower(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="materials">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-lg">Raw Materials</CardTitle>
              {!readOnly && (
                <div className="flex gap-2">
                  {editingSection === 'materials' ? (
                    <>
                      <Button onClick={() => handleSave('materials')}>
                        <Save className="h-4 w-4 mr-2" />Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />Cancel
                      </Button>
                      <Button variant="outline" onClick={handleAddMaterial}>
                        <Plus className="h-4 w-4 mr-2" />Add Material
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => handleEdit('materials', vendor?.rawMaterials || [])}>
                      <Edit2 className="h-4 w-4 mr-2" />Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
              
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Cost</TableHead>
                  {!readOnly && editingSection === 'materials' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(editingSection === 'materials' ? editedMaterials : vendor?.rawMaterials || []).map((material, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editingSection === 'materials' ? (
                        <Input
                          value={material.name}
                          onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                        />
                      ) : (
                        material.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'materials' ? (
                        <Input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => handleMaterialChange(index, 'quantity', Number(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        material.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'materials' ? (
                        <Input
                          value={material.unit}
                          onChange={(e) => handleMaterialChange(index, 'unit', e.target.value)}
                          className="w-24"
                        />
                      ) : (
                        material.unit
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'materials' ? (
                        <Input
                          type="number"
                          value={material.unitPrice}
                          onChange={(e) => handleMaterialChange(index, 'unitPrice', Number(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        `₱${material.unitPrice}`
                      )}
                    </TableCell>
                    <TableCell>₱{material.totalCost}</TableCell>
                    {!readOnly && editingSection === 'materials' && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMaterial(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="equipment">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-lg">Tools and Equipment</CardTitle>
              {!readOnly && (
                <div className="flex gap-2">
                  {editingSection === 'tools' ? (
                    <>
                      <Button onClick={() => handleSave('tools')}>
                        <Save className="h-4 w-4 mr-2" />Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />Cancel
                      </Button>
                      <Button variant="outline" onClick={handleAddTool}>
                        <Plus className="h-4 w-4 mr-2" />Add Tool
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => handleEdit('tools', vendor?.tools || [])}>
                      <Edit2 className="h-4 w-4 mr-2" />Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
              
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Depreciation Cost</TableHead>
                  {!readOnly && editingSection === 'tools' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(editingSection === 'tools' ? editedTools : vendor?.tools || []).map((tool, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editingSection === 'tools' ? (
                        <Input
                          value={tool.name}
                          onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                        />
                      ) : (
                        tool.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'tools' ? (
                        <Input
                          type="number"
                          value={tool.quantity}
                          onChange={(e) => handleToolChange(index, 'quantity', Number(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        tool.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'tools' ? (
                        <Input
                          value={tool.unit}
                          onChange={(e) => handleToolChange(index, 'unit', e.target.value)}
                          className="w-24"
                        />
                      ) : (
                        tool.unit
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSection === 'tools' ? (
                        <Input
                          type="number"
                          value={tool.unitPrice}
                          onChange={(e) => handleToolChange(index, 'unitPrice', Number(e.target.value))}
                          className="w-24"
                        />
                      ) : (
                        `₱${tool.unitPrice}`
                      )}
                    </TableCell>
                    <TableCell>₱{tool.totalCost}</TableCell>
                    <TableCell>₱{tool.depreciationCost}</TableCell>
                    {!readOnly && editingSection === 'tools' && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTool(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

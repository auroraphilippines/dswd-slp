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

export function VendorDetailView({ vendor }) {
  // Generate a unique vendor ID based on timestamp and random number
  const vendorId = `VEN${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10000)}`;

  // Calculate total manpower cost
  const totalManpowerCost = vendor?.workers?.reduce((sum, worker) => sum + (worker.wage || 0), 0) || 0;
  
  // Calculate total raw materials cost
  const totalMaterialsCost = vendor?.rawMaterials?.reduce((sum, material) => sum + (material.totalCost || 0), 0) || 0;

  // Calculate total equipment cost
  const totalEquipmentCost = vendor?.toolsAndEquipment?.reduce((sum, item) => {
    const itemCost = Number(item.totalCost) || 0;
    return sum + itemCost;
  }, 0) || 0;

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
                  <label className="text-sm text-muted-foreground">Vendor ID:</label>
                  <p className="font-medium">{vendorId}</p>
                </div>
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
                    {vendor?.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "N/A"}
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
                <Badge variant="outline">Total: ₱ {totalManpowerCost.toLocaleString()}</Badge>
              </div>
              
              {vendor?.workers && vendor.workers.length > 0 ? (
                <div className="space-y-4">
                  {vendor.workers.map((worker, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Worker Name:</label>
                          <p className="font-medium">{worker.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Task:</label>
                          <p className="font-medium">{worker.task}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Daily Wage:</label>
                          <p className="font-medium">₱ {worker.wage?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No manpower details added yet.</p>
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
                <Badge variant="outline">Total: ₱ {totalMaterialsCost.toLocaleString()}</Badge>
              </div>
              
              {vendor?.rawMaterials && vendor.rawMaterials.length > 0 ? (
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
                <Badge variant="outline">Total: ₱ {totalEquipmentCost.toLocaleString()}</Badge>
              </div>
              
              {vendor?.toolsAndEquipment && vendor.toolsAndEquipment.length > 0 ? (
                <div className="space-y-4">
                  {vendor.toolsAndEquipment.map((item, index) => {
                    // Ensure numeric values
                    const quantity = Number(item.quantity) || 0;
                    const unitCost = Number(item.unitCost) || 0;
                    const totalCost = Number(item.totalCost) || (quantity * unitCost);
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
                            <label className="text-sm text-muted-foreground">Unit Cost:</label>
                            <p className="font-medium">₱ {unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

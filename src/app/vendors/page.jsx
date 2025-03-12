"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, Plus, Search, Download, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VendorDetailView } from "./vendor-detail-view";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { subscribeToVendors } from "@/service/vendor";
import { getCurrentUser } from "@/service/auth";

export default function VendorsPage() {
  const router = useRouter();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const setupVendorsSubscription = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        unsubscribe = subscribeToVendors(user.uid, (fetchedVendors) => {
          setVendors(fetchedVendors);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up vendors subscription:", error);
        setLoading(false);
      }
    };

    setupVendorsSubscription();

    return () => {
      unsubscribe();
    };
  }, [router]);

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleCloseDetails = () => {
    setSelectedVendor(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddVendor = () => {
    router.push("./vendors/add");
  };

  const exportToGoogleSheets = () => {
    const headers = [
      "Project Code",
      "Program Name",
      "Name",
      "Email",
      "Created At",
      // Manpower Headers
      "Total Manpower Cost",
      "Number of Workers",
      // Materials Headers
      "Total Materials Cost",
      "Number of Materials",
      // Equipment Headers
      "Total Equipment Cost",
      "Number of Equipment",
      "Total Depreciation Cost"
    ];

    const csvContent = [
      headers,
      ...vendors.map((vendor) => {
        // Calculate totals
        const totalManpowerCost = vendor.workers?.reduce((sum, worker) => sum + (Number(worker.wage) || 0), 0) || 0;
        const totalMaterialsCost = vendor.rawMaterials?.reduce((sum, material) => sum + (Number(material.totalCost) || 0), 0) || 0;
        const totalEquipmentCost = vendor.toolsAndEquipment?.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0) || 0;
        const totalDepreciationCost = vendor.toolsAndEquipment?.reduce((sum, item) => sum + (Number(item.depreciationCost) || 0), 0) || 0;

        return [
          vendor.projectCode || "",
          vendor.programName || "",
          vendor.name || "",
          vendor.email || "",
          vendor.createdAt?.toDate().toLocaleDateString() || "",
          totalManpowerCost.toFixed(2),
          vendor.workers?.length || 0,
          totalMaterialsCost.toFixed(2),
          vendor.rawMaterials?.length || 0,
          totalEquipmentCost.toFixed(2),
          vendor.toolsAndEquipment?.length || 0,
          totalDepreciationCost.toFixed(2)
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob and URL
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the CSV
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors_detailed.csv";
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const exportToExcelOnline = () => {
    // Create workbook data with multiple sheets
    let csvContent = "";

    // Main Vendors Sheet
    const mainHeaders = [
      "Project Code",
      "Program Name",
      "Name",
      "Email",
      "Created At",
      "Total Manpower Cost",
      "Total Materials Cost",
      "Total Equipment Cost",
      "Total Depreciation Cost"
    ];

    csvContent += "Vendors Summary\n";
    csvContent += mainHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      const totalManpowerCost = vendor.workers?.reduce((sum, worker) => sum + (Number(worker.wage) || 0), 0) || 0;
      const totalMaterialsCost = vendor.rawMaterials?.reduce((sum, material) => sum + (Number(material.totalCost) || 0), 0) || 0;
      const totalEquipmentCost = vendor.toolsAndEquipment?.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0) || 0;
      const totalDepreciationCost = vendor.toolsAndEquipment?.reduce((sum, item) => sum + (Number(item.depreciationCost) || 0), 0) || 0;

      const row = [
        vendor.projectCode || "",
        vendor.programName || "",
        vendor.name || "",
        vendor.email || "",
        vendor.createdAt?.toDate().toLocaleDateString() || "",
        totalManpowerCost.toFixed(2),
        totalMaterialsCost.toFixed(2),
        totalEquipmentCost.toFixed(2),
        totalDepreciationCost.toFixed(2)
      ];
      csvContent += row.join(",") + "\n";
    });

    // Add a blank line between sheets
    csvContent += "\n\nManpower Details\n";
    
    // Manpower Sheet
    const manpowerHeaders = ["Project Code", "Program Name", "Worker Name", "Task", "Daily Wage"];
    csvContent += manpowerHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      if (vendor.workers && vendor.workers.length > 0) {
        vendor.workers.forEach((worker) => {
          const row = [
            vendor.projectCode || "",
            vendor.programName || "",
            worker.name || "",
            worker.task || "",
            (worker.wage || 0).toFixed(2)
          ];
          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Materials Sheet
    csvContent += "\n\nRaw Materials Details\n";
    const materialsHeaders = ["Project Code", "Program Name", "Material Name", "Quantity", "Unit", "Unit Price", "Total Cost", "Frequency"];
    csvContent += materialsHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      if (vendor.rawMaterials && vendor.rawMaterials.length > 0) {
        vendor.rawMaterials.forEach((material) => {
          const row = [
            vendor.projectCode || "",
            vendor.programName || "",
            material.name || "",
            material.quantity || "0",
            material.unit || "",
            (material.unitPrice || 0).toFixed(2),
            (material.totalCost || 0).toFixed(2),
            material.frequency || ""
          ];
          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Equipment Sheet
    csvContent += "\n\nTools and Equipment Details\n";
    const equipmentHeaders = [
      "Project Code",
      "Program Name",
      "Item Name",
      "Quantity",
      "Unit",
      "Unit Cost",
      "Life Span (Years)",
      "Production Cycle (Months)",
      "Total Cost",
      "Depreciation Cost"
    ];
    csvContent += equipmentHeaders.join(",") + "\n";

    vendors.forEach((vendor) => {
      if (vendor.toolsAndEquipment && vendor.toolsAndEquipment.length > 0) {
        vendor.toolsAndEquipment.forEach((item) => {
          const row = [
            vendor.projectCode || "",
            vendor.programName || "",
            item.name || "",
            item.quantity || "0",
            item.unit || "",
            (item.unitCost || 0).toFixed(2),
            item.lifeSpan || "0",
            item.productionCycle || "0",
            (item.totalCost || 0).toFixed(2),
            (item.depreciationCost || 0).toFixed(2)
          ];
          csvContent += row.join(",") + "\n";
        });
      }
    });

    // Create Blob with UTF-8 BOM for Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors_detailed.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const exportVendorToExcel = (vendor) => {
    let csvContent = "";

    // Vendor Basic Information
    csvContent += "Basic Information\n";
    csvContent += "Vendor ID," + (vendor.vendorId || "") + "\n";
    csvContent += "Project Code," + (vendor.projectCode || "") + "\n";
    csvContent += "Program Name," + (vendor.programName || "") + "\n";
    csvContent += "Name," + (vendor.name || "") + "\n";
    csvContent += "Email," + (vendor.email || "") + "\n";
    csvContent += "Registration Date," + (vendor.createdAt?.toDate().toLocaleDateString() || "") + "\n\n";

    // Manpower Details
    csvContent += "\nManpower Details\n";
    csvContent += "Worker Name,Task,Daily Wage\n";
    if (vendor.workers && vendor.workers.length > 0) {
      vendor.workers.forEach(worker => {
        csvContent += `${worker.name || ""},${worker.task || ""},${(worker.wage || 0).toFixed(2)}\n`;
      });
    }
    const totalManpowerCost = vendor.workers?.reduce((sum, worker) => sum + (Number(worker.wage) || 0), 0) || 0;
    csvContent += `Total Manpower Cost,${totalManpowerCost.toFixed(2)}\n\n`;

    // Raw Materials Details
    csvContent += "\nRaw Materials Details\n";
    csvContent += "Material Name,Quantity,Unit,Unit Price,Total Cost,Frequency\n";
    if (vendor.rawMaterials && vendor.rawMaterials.length > 0) {
      vendor.rawMaterials.forEach(material => {
        csvContent += `${material.name || ""},${material.quantity || "0"},${material.unit || ""},${(material.unitPrice || 0).toFixed(2)},${(material.totalCost || 0).toFixed(2)},${material.frequency || ""}\n`;
      });
    }
    const totalMaterialsCost = vendor.rawMaterials?.reduce((sum, material) => sum + (Number(material.totalCost) || 0), 0) || 0;
    csvContent += `Total Materials Cost,${totalMaterialsCost.toFixed(2)}\n\n`;

    // Tools and Equipment Details
    csvContent += "\nTools and Equipment Details\n";
    csvContent += "Item Name,Quantity,Unit,Unit Cost,Life Span (Years),Production Cycle (Months),Total Cost,Depreciation Cost\n";
    if (vendor.toolsAndEquipment && vendor.toolsAndEquipment.length > 0) {
      vendor.toolsAndEquipment.forEach(item => {
        csvContent += `${item.name || ""},${item.quantity || "0"},${item.unit || ""},${(item.unitCost || 0).toFixed(2)},${item.lifeSpan || "0"},${item.productionCycle || "0"},${(item.totalCost || 0).toFixed(2)},${(item.depreciationCost || 0).toFixed(2)}\n`;
      });
    }
    const totalEquipmentCost = vendor.toolsAndEquipment?.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0) || 0;
    const totalDepreciationCost = vendor.toolsAndEquipment?.reduce((sum, item) => sum + (Number(item.depreciationCost) || 0), 0) || 0;
    csvContent += `Total Equipment Cost,${totalEquipmentCost.toFixed(2)}\n`;
    csvContent += `Total Depreciation Cost,${totalDepreciationCost.toFixed(2)}\n\n`;

    // Summary of Costs
    csvContent += "\nTotal Costs Summary\n";
    csvContent += `Total Manpower Cost,${totalManpowerCost.toFixed(2)}\n`;
    csvContent += `Total Materials Cost,${totalMaterialsCost.toFixed(2)}\n`;
    csvContent += `Total Equipment Cost,${totalEquipmentCost.toFixed(2)}\n`;
    csvContent += `Total Depreciation Cost,${totalDepreciationCost.toFixed(2)}\n`;
    csvContent += `Grand Total,${(totalManpowerCost + totalMaterialsCost + totalEquipmentCost).toFixed(2)}\n`;

    // Create Blob with UTF-8 BOM for Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `vendor_${vendor.vendorId || vendor.id}_details.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  };

  // Filter vendors based on search query
  const filteredVendors = vendors.filter((vendor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      (vendor.projectCode && vendor.projectCode.toLowerCase().includes(searchLower)) ||
      (vendor.programName && vendor.programName.toLowerCase().includes(searchLower)) ||
      (vendor.name && vendor.name.toLowerCase().includes(searchLower)) ||
      (vendor.email && vendor.email.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Vendor Management
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowExportDialog(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAddVendor}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>
                  Manage your suppliers and vendor details
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              className={`grid ${
                selectedVendor ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              } gap-0`}
            >
              <div className={`${selectedVendor ? "border-r" : ""}`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Project Code</TableHead>
                      <TableHead>Program Name</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <TableRow
                          key={vendor.id}
                          className={`cursor-pointer ${
                            selectedVendor?.id === vendor.id ? "bg-muted" : ""
                          }`}
                          onClick={() => handleViewDetails(vendor)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span>{vendor.projectCode}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  exportVendorToExcel(vendor);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                <Store className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="font-medium">{vendor.programName}</div>
                            </div>
                          </TableCell>
                          <TableCell>{vendor.name || "-"}</TableCell>
                          <TableCell>{vendor.email || "-"}</TableCell>
                          <TableCell>
                            {vendor.createdAt?.toDate().toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(vendor);
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Edit Vendor
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Delete Vendor
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          {searchQuery
                            ? "No vendors found. Try adjusting your search."
                            : "No vendors added yet. Click 'Add Vendor' to get started."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {selectedVendor && (
                <div className="p-4 overflow-auto max-h-[800px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Vendor Details</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseDetails}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Close
                    </Button>
                  </div>

                  <VendorDetailView vendor={selectedVendor} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Vendors Data</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              className="flex items-center justify-start gap-2"
              variant="outline"
              onClick={exportToGoogleSheets}
            >
              <img
                src="https://www.google.com/images/about/sheets-icon.svg"
                alt="Google Sheets"
                className="w-5 h-5"
              />
              Export to Google Sheets
            </Button>
            <Button
              className="flex items-center justify-start gap-2"
              variant="outline"
              onClick={exportToExcelOnline}
            >
              <img
                src="https://img.icons8.com/color/48/000000/microsoft-excel-2019--v1.png"
                alt="Microsoft Excel"
                className="w-5 h-5"
              />
              Export to Microsoft Excel Online
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

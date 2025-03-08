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
import {
  ShoppingCart,
  Users,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";

export function DisbursementDetailView({ disbursement }) {
  if (!disbursement) return null;

  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
        <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Disbursement Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Disbursement ID:
                </dt>
                <dd className="text-sm font-medium">{disbursement.id}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Program:
                </dt>
                <dd className="text-sm font-medium">{disbursement.program}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Barangay:
                </dt>
                <dd className="text-sm font-medium">{disbursement.barangay}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Status:
                </dt>
                <dd className="text-sm font-medium">
                  <Badge
                    variant={
                      disbursement.status === "Completed"
                        ? "outline"
                        : "secondary"
                    }
                    className={
                      disbursement.status === "Completed"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        : disbursement.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                        : disbursement.status === "Scheduled"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                        : ""
                    }
                  >
                    {disbursement.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Scheduled Date:
                </dt>
                <dd className="text-sm font-medium">
                  {disbursement.scheduledDate}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Scheduled Time:
                </dt>
                <dd className="text-sm font-medium">
                  {disbursement.scheduledTime}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Beneficiary Count:
                </dt>
                <dd className="text-sm font-medium">
                  {disbursement.beneficiaryCount}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Total Value:
                </dt>
                <dd className="text-sm font-medium">
                  ₱{disbursement.totalValue.toLocaleString()}
                </dd>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Location:
                </dt>
                <dd className="text-sm">{disbursement.location}</dd>
              </div>
              {disbursement.notes && (
                <div className="col-span-1 sm:col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Notes:
                  </dt>
                  <dd className="text-sm">{disbursement.notes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Coordinator Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Name:
                </dt>
                <dd className="text-sm font-medium">
                  {disbursement.coordinator}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact Number:
                </dt>
                <dd className="text-sm font-medium">
                  {disbursement.contactNumber}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="items" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Disbursement Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {disbursement.items && disbursement.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Value (₱)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disbursement.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.value.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="text-right font-medium">
                      {disbursement.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₱
                      {disbursement.items
                        .reduce((total, item) => total + item.value, 0)
                        .toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No items in this disbursement
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Manifest
          </Button>
          <Button size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Verify Inventory
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="beneficiaries" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Beneficiary List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {disbursement.beneficiaries &&
            disbursement.beneficiaries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Assistance Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disbursement.beneficiaries.map((beneficiary, index) => (
                    <TableRow key={index}>
                      <TableCell>{beneficiary.id}</TableCell>
                      <TableCell>{beneficiary.name}</TableCell>
                      <TableCell>{beneficiary.assistanceType}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No beneficiaries listed for this disbursement
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Print Beneficiary List
          </Button>
          <Button size="sm">
            <Users className="mr-2 h-4 w-4" />
            Manage Beneficiaries
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="timeline" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Disbursement Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {disbursement.timeline && disbursement.timeline.length > 0 ? (
              <div className="space-y-4">
                {disbursement.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {event.action.includes("Created") ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : event.action.includes("Prepared") ? (
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      ) : event.action.includes("Dispatched") ? (
                        <MapPin className="h-5 w-5 text-primary" />
                      ) : event.action.includes("Completed") ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Clock className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {event.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} at {event.time} by {event.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No timeline events recorded
              </p>
            )}
          </CardContent>
        </Card>

        {disbursement.status !== "Completed" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Update the status of this disbursement using the buttons below.
              </p>
              <div className="flex space-x-2">
                {disbursement.status === "Scheduled" && (
                  <Button size="sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Start Processing
                  </Button>
                )}
                {disbursement.status === "Pending" && (
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  Cancel Disbursement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}

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
import { CheckCircle, X, AlertTriangle } from "lucide-react";

export function ParticipantsDetailView({ participants }) {
  if (!participants) return null;

  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="family">Family Details</TabsTrigger>
        <TabsTrigger value="assistance">Assistance History</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Participants ID:
                </dt>
                <dd className="text-sm font-medium">{participants.id}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Name:
                </dt>
                <dd className="text-sm font-medium">{participants.name}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Gender:
                </dt>
                <dd className="text-sm font-medium">{participants.gender}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Age:
                </dt>
                <dd className="text-sm font-medium">{participants.age}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Program:
                </dt>
                <dd className="text-sm font-medium">{participants.program}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Status:
                </dt>
                <dd className="text-sm font-medium">
                  <Badge
                    variant={
                      participants.status === "Active" ? "outline" : "secondary"
                    }
                    className={
                      participants.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        : ""
                    }
                  >
                    {participants.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Date Registered:
                </dt>
                <dd className="text-sm font-medium">
                  {participants.dateRegistered}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Valid ID Type:
                </dt>
                <dd className="text-sm font-medium">{participants.validID}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Valid ID Number:
                </dt>
                <dd className="text-sm font-medium">
                  {participants.validIDNumber}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact Number:
                </dt>
                <dd className="text-sm font-medium">
                  {participants.contactNumber}
                </dd>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Address:
                </dt>
                <dd className="text-sm">{participants.address}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Barangay:
                </dt>
                <dd className="text-sm font-medium">{participants.barangay}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participants.emergencyContact ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Name:
                  </dt>
                  <dd className="text-sm font-medium">
                    {participants.emergencyContact.name}
                  </dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Relationship:
                  </dt>
                  <dd className="text-sm font-medium">
                    {participants.emergencyContact.relationship}
                  </dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Contact Number:
                  </dt>
                  <dd className="text-sm font-medium">
                    {participants.emergencyContact.contactNumber}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                No emergency contact information available
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="family" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Family Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Number of Family Members:
                </dt>
                <dd className="text-sm font-medium">
                  {participants.familyMembers}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Family member details would be displayed here. This would
                include names, ages, relationships, and other relevant
                information about the participant's family members.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assistance" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Assistance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participants.assistanceHistory &&
            participants.assistanceHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Value (₱)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.assistanceHistory.map((assistance, index) => (
                    <TableRow key={index}>
                      <TableCell>{assistance.date}</TableCell>
                      <TableCell>{assistance.type}</TableCell>
                      <TableCell>{assistance.program}</TableCell>
                      <TableCell className="text-right">
                        {assistance.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {assistance.value.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {participants.assistanceHistory.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₱
                      {participants.assistanceHistory
                        .reduce((total, item) => total + item.value, 0)
                        .toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No assistance history available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Assistance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No upcoming assistance scheduled. Use the button below to schedule
              new assistance.
            </p>
            <Button className="mt-4" size="sm">
              Schedule Assistance
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Submitted Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participants.documents && participants.documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.documents.map((document, index) => (
                    <TableRow key={index}>
                      <TableCell>{document.name}</TableCell>
                      <TableCell>{document.dateSubmitted}</TableCell>
                      <TableCell>
                        <DocumentStatusBadge status={document.status} />
                      </TableCell>
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
                No documents submitted
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Upload New Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload additional documents for this participants using the button
              below.
            </p>
            <Button className="mt-4" size="sm">
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function DocumentStatusBadge({ status }) {
  if (status === "Verified") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      >
        <CheckCircle className="mr-1 h-3 w-3" />
        Verified
      </Badge>
    );
  } else if (status === "Pending") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
      >
        <AlertTriangle className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      >
        <X className="mr-1 h-3 w-3" />
        Rejected
      </Badge>
    );
  }
}

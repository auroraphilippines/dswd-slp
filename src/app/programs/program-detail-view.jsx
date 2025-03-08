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
import { Progress } from "@/components/ui/progress";

export function ProgramDetailView({ program }) {
  if (!program) return null;

  const budgetUtilization = (program.disbursed / program.budget) * 100;

  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="budget">Budget</TabsTrigger>
        <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
        <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Program Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Program ID:
                </dt>
                <dd className="text-sm font-medium">{program.id}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Name:
                </dt>
                <dd className="text-sm font-medium">{program.name}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Category:
                </dt>
                <dd className="text-sm font-medium">{program.category}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Status:
                </dt>
                <dd className="text-sm font-medium">
                  <Badge
                    variant={
                      program.status === "Active" ? "outline" : "secondary"
                    }
                    className={
                      program.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        : program.status === "Planned"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                        : ""
                    }
                  >
                    {program.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Start Date:
                </dt>
                <dd className="text-sm font-medium">{program.startDate}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  End Date:
                </dt>
                <dd className="text-sm font-medium">{program.endDate}</dd>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Description:
                </dt>
                <dd className="text-sm">{program.description}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Location:
                </dt>
                <dd className="text-sm font-medium">{program.location}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Program Coordinator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Name:
                </dt>
                <dd className="text-sm font-medium">{program.coordinator}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact Number:
                </dt>
                <dd className="text-sm font-medium">{program.contactNumber}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Email:
                </dt>
                <dd className="text-sm font-medium">{program.email}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {program.eligibilityCriteria &&
            program.eligibilityCriteria.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {program.eligibilityCriteria.map((criteria, index) => (
                  <li key={index} className="text-sm">
                    {criteria}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No eligibility criteria specified
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="budget" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Total Budget:
                </dt>
                <dd className="text-sm font-medium">
                  ₱{program.budget.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Disbursed Amount:
                </dt>
                <dd className="text-sm font-medium">
                  ₱{program.disbursed.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Remaining Budget:
                </dt>
                <dd className="text-sm font-medium">
                  ₱{program.remaining.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Budget Utilization:
                </dt>
                <dd className="text-sm font-medium">
                  {budgetUtilization.toFixed(1)}%
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <Progress value={budgetUtilization} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {budgetUtilization.toFixed(1)}% of budget utilized
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Assistance Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {program.assistanceTypes && program.assistanceTypes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Value (₱)</TableHead>
                    <TableHead>Frequency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {program.assistanceTypes.map((assistance, index) => (
                    <TableRow key={index}>
                      <TableCell>{assistance.type}</TableCell>
                      <TableCell className="text-right">
                        {assistance.value.toLocaleString()}
                      </TableCell>
                      <TableCell>{assistance.frequency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No assistance types defined
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="beneficiaries" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Beneficiary Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Total Beneficiaries:
                </dt>
                <dd className="text-sm font-medium">
                  {program.beneficiaryCount}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-sm font-medium text-muted-foreground">
                  Active Beneficiaries:
                </dt>
                <dd className="text-sm font-medium">
                  {program.status === "Active" ? program.beneficiaryCount : 0}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <Button size="sm">View Beneficiary List</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Beneficiary Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Beneficiary distribution by location, age group, and other
              demographics would be displayed here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="disbursements" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Disbursements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {program.recentDisbursements &&
            program.recentDisbursements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Barangay</TableHead>
                    <TableHead className="text-right">Beneficiaries</TableHead>
                    <TableHead className="text-right">Amount (₱)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {program.recentDisbursements.map((disbursement, index) => (
                    <TableRow key={index}>
                      <TableCell>{disbursement.date}</TableCell>
                      <TableCell>{disbursement.barangay}</TableCell>
                      <TableCell className="text-right">
                        {disbursement.beneficiaries}
                      </TableCell>
                      <TableCell className="text-right">
                        {disbursement.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {program.recentDisbursements.reduce(
                        (total, item) => total + item.beneficiaries,
                        0
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₱
                      {program.recentDisbursements
                        .reduce((total, item) => total + item.amount, 0)
                        .toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent disbursements
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Schedule Disbursement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the button below to schedule a new disbursement for this
              program.
            </p>
            <Button className="mt-4" size="sm">
              Schedule Disbursement
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

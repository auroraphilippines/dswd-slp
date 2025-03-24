"use client";

import { useState } from "react";
import { format, formatDate } from "date-fns";
import { CalendarIcon, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ReportGenerator() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState("inventory");
  const [fileFormat, setFileFormat] = useState("pdf");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Custom Report</CardTitle>
        <CardDescription>
          Create a custom report by selecting parameters below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Report Type</Label>
          <RadioGroup
            defaultValue="inventory"
            onValueChange={setReportType}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inventory" id="inventory" />
              <Label htmlFor="inventory" className="font-normal">
                Inventory Report
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sales" id="sales" />
              <Label htmlFor="sales" className="font-normal">
                Sales Report
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="activity" id="activity" />
              <Label htmlFor="activity" className="font-normal">
                Activity Log
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Data to Include</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="products" defaultChecked />
              <label
                htmlFor="products"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Products
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="categories" defaultChecked />
              <label
                htmlFor="categories"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Categories
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="suppliers" defaultChecked />
              <label
                htmlFor="suppliers"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Suppliers
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="locations" defaultChecked />
              <label
                htmlFor="locations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Locations
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Format</Label>
          <Select defaultValue="pdf" onValueChange={setFileFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <FileBarChart className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
}
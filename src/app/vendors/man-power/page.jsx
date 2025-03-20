"use client";

import { CardFooter } from "@/components/ui/card";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Users,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { saveManPower } from "@/service/vendor";
import { getCurrentUser } from "@/service/auth";

// Initial worker state
const initialWorker = {
  id: 1,
  numberOfWorkers: 0,
  task: "",
  wage: 0,
};

export default function ManPowerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formId] = useState("100002");
  const [isClient, setIsClient] = useState(false);
  const MAX_WORKERS = 5;
  const [workers, setWorkers] = useState([initialWorker]);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);

    // Load saved worker data after component mounts
    const savedData = localStorage.getItem('workerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure all numeric fields are properly converted
        const processedData = parsedData.map(worker => ({
          ...worker,
          numberOfWorkers: Number(worker.numberOfWorkers) || 0,
          wage: Number(worker.wage) || 0,
        }));
        setWorkers(processedData);
      } catch (error) {
        console.error("Error loading saved worker data:", error);
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

  // Save worker data whenever it changes
  useEffect(() => {
    if (isClient && workers.length > 0) {
      localStorage.setItem('workerData', JSON.stringify(workers));
    }
  }, [workers, isClient]);

  const handleInputChange = (index, field, value) => {
    const updatedWorkers = [...workers];
    updatedWorkers[index][field] = value;
    setWorkers(updatedWorkers);
  };

  const handleAddWorker = () => {
    if (workers.length >= MAX_WORKERS) {
      return; // Don't add more if limit reached
    }

    setWorkers([
      ...workers,
      {
        id: workers.length + 1,
        numberOfWorkers: 0,
        task: "",
        wage: 0,
      },
    ]);
  };

  const handleRemoveWorker = (index) => {
    const updatedWorkers = [...workers];
    updatedWorkers.splice(index, 1);
    // Update the id/numbering for all workers after the removed one
    for (let i = index; i < updatedWorkers.length; i++) {
      updatedWorkers[i].id = i + 1;
    }
    setWorkers(updatedWorkers);
  };

  const handleIncrement = (index, field) => {
    const updatedWorkers = [...workers];
    updatedWorkers[index][field] += 1;
    setWorkers(updatedWorkers);
  };

  const handleDecrement = (index, field) => {
    const updatedWorkers = [...workers];
    if (updatedWorkers[index][field] > 0) {
      updatedWorkers[index][field] -= 1;
      setWorkers(updatedWorkers);
    }
  };

  const handlePrev = () => {
    // Save current state before navigating back
    localStorage.setItem('workerData', JSON.stringify(workers));
    router.back();
  };

  const handleNext = async () => {
    setLoading(true);
    try {
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

      const result = await saveManPower(
        vendorId,
        workers.map(worker => ({
          name: worker.name,
          task: worker.task,
          wage: worker.wage
        })),
        user.uid // Pass the user ID as the third argument
      );

      if (result.success) {
        router.push("/vendors/tools-equipment");
      } else {
        console.error("Failed to save manpower data:", result.error);
        alert("Failed to save manpower data. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total daily wages
  const totalDailyWages = workers.reduce((sum, worker) => 
    sum + (worker.wage * worker.numberOfWorkers), 0
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-card border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Man Power</CardTitle>
                <CardDescription>
                  Add workers and their specific tasks in the microenterprise
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                ID: {formId}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {workers.map((worker, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-card shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Worker #{worker.id}</h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveWorker(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`worker-number-${index}`}>
                        Number of Workers #{worker.id}
                      </Label>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-r-none"
                          onClick={() => handleDecrement(index, "numberOfWorkers")}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`worker-number-${index}`}
                          type="number"
                          value={worker.numberOfWorkers}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "numberOfWorkers",
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
                          onClick={() => handleIncrement(index, "numberOfWorkers")}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`worker-task-${index}`}>
                        Specific Task in the Microenterprise #{worker.id}
                      </Label>
                      <Input
                        id={`worker-task-${index}`}
                        value={worker.task}
                        onChange={(e) =>
                          handleInputChange(index, "task", e.target.value)
                        }
                        placeholder="Enter worker's specific task"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`worker-wage-${index}`}>
                        Daily Wage/Salary per Worker #{worker.id}
                      </Label>
                      <div className="flex">
                        <div className="flex items-center border rounded-l-md px-3 bg-muted">
                          <span>Php</span>
                        </div>
                        <Input
                          id={`worker-wage-${index}`}
                          type="number"
                          value={worker.wage}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "wage",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          className="rounded-none text-center"
                        />
                        <div className="flex border rounded-r-md">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-none border-r"
                            onClick={() => handleDecrement(index, "wage")}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-none"
                            onClick={() => handleIncrement(index, "wage")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {workers.length < MAX_WORKERS ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddWorker}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Another Worker
                </Button>
              ) : (
                <Alert
                  variant="warning"
                  className="bg-amber-50 border-amber-200"
                >
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    Maximum limit of {MAX_WORKERS} workers reached.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-medium">Total Daily Wages:</span>
                <span className="text-xl font-bold">
                  ₱ {totalDailyWages.toLocaleString()}
                </span>
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

"use client";

import { useState } from "react";
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
import { Minus, Plus, Trash2, Save, ArrowLeft, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ManPowerPage() {
  const router = useRouter();
  const [formId] = useState("100002");
  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: "",
      task: "",
      wage: 0,
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedWorkers = [...workers];
    updatedWorkers[index][field] = value;
    setWorkers(updatedWorkers);
  };

  const handleAddWorker = () => {
    setWorkers([
      ...workers,
      {
        id: workers.length + 1,
        name: "",
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

  const handleIncrement = (index) => {
    const updatedWorkers = [...workers];
    updatedWorkers[index].wage += 50; // Increment by 50 pesos
    setWorkers(updatedWorkers);
  };

  const handleDecrement = (index) => {
    const updatedWorkers = [...workers];
    if (updatedWorkers[index].wage >= 50) {
      updatedWorkers[index].wage -= 50; // Decrement by 50 pesos
      setWorkers(updatedWorkers);
    }
  };

  const handlePrev = () => {
    router.back();
  };

  const handleNext = () => {
    console.log(workers);
    router.push("/vendors");
  };

  // Calculate total daily wages
  const totalDailyWages = workers.reduce((sum, worker) => sum + worker.wage, 0);

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
                      <Label htmlFor={`worker-name-${index}`}>
                        Name of Worker in Microenterprise #{worker.id}
                      </Label>
                      <Input
                        id={`worker-name-${index}`}
                        value={worker.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                        placeholder="Enter worker's name"
                      />
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
                        Daily Wage/Salary #{worker.id}
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
                            onClick={() => handleDecrement(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-none"
                            onClick={() => handleIncrement(index)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddWorker}
              >
                <Users className="h-4 w-4 mr-2" />
                Add Another Worker
              </Button>

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
              <Save className="h-4 w-4 mr-2" />
              Save and Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

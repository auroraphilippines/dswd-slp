"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Globe, Clock, FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    language: "en",
    timezone: "utc-8",
    dateFormat: "mm/dd/yyyy",
    autoSave: true,
    darkMode: false,
    compactView: false,
    notifications: true,
  });

  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Language & Region</CardTitle>
          </div>
          <CardDescription>
            Configure your language, timezone, and regional preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) =>
                  handleSettingChange("language", value)
                }
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) =>
                  handleSettingChange("timezone", value)
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="utc+0">UTC</SelectItem>
                  <SelectItem value="utc+1">
                    Central European Time (UTC+1)
                  </SelectItem>
                  <SelectItem value="utc+8">
                    China Standard Time (UTC+8)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <RadioGroup
              id="date-format"
              value={settings.dateFormat}
              onValueChange={(value) =>
                handleSettingChange("dateFormat", value)
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mm/dd/yyyy" id="mm/dd/yyyy" />
                <Label htmlFor="mm/dd/yyyy">
                  MM/DD/YYYY (e.g., 12/31/2023)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dd/mm/yyyy" id="dd/mm/yyyy" />
                <Label htmlFor="dd/mm/yyyy">
                  DD/MM/YYYY (e.g., 31/12/2023)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yyyy-mm-dd" id="yyyy-mm-dd" />
                <Label htmlFor="yyyy-mm-dd">
                  YYYY-MM-DD (e.g., 2023-12-31)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Regional Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Display & Interface</CardTitle>
          </div>
          <CardDescription>
            Customize how the application looks and behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme for the interface
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) =>
                handleSettingChange("darkMode", checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-view">Compact View</Label>
              <p className="text-sm text-muted-foreground">
                Display more content with reduced spacing
              </p>
            </div>
            <Switch
              id="compact-view"
              checked={settings.compactView}
              onCheckedChange={(checked) =>
                handleSettingChange("compactView", checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-Save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes as you work
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) =>
                handleSettingChange("autoSave", checked)
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Display Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Default Working Hours</CardTitle>
          </div>
          <CardDescription>
            Set your standard working hours for scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Select defaultValue="9">
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i === 0
                        ? "12:00 AM"
                        : i < 12
                        ? `${i}:00 AM`
                        : i === 12
                        ? "12:00 PM"
                        : `${i - 12}:00 PM`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Select defaultValue="17">
                <SelectTrigger id="end-time">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i === 0
                        ? "12:00 AM"
                        : i < 12
                        ? `${i}:00 AM`
                        : i === 12
                        ? "12:00 PM"
                        : `${i - 12}:00 PM`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label>Working Days</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <Button
                  key={day}
                  variant={
                    day === "Saturday" || day === "Sunday"
                      ? "outline"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {day.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Working Hours</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

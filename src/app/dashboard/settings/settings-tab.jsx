"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your basic system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <Input
                id="organization"
                defaultValue="DSWD Sustainable Livelihood Program"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="contact@dswd.gov.ph"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" type="tel" defaultValue="+63 (2) 8931-8101" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-backup" />
              <Label htmlFor="auto-backup">Enable automatic data backup</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="low-stock-alerts" defaultChecked />
              <Label htmlFor="low-stock-alerts">Low stock alerts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="new-shipment" defaultChecked />
              <Label htmlFor="new-shipment">New shipment notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="price-changes" />
              <Label htmlFor="price-changes">Price change alerts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="system-updates" defaultChecked />
              <Label htmlFor="system-updates">
                System update notifications
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>
              Customize the look and feel of your system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="w-full">
                  Light
                </Button>
                <Button variant="outline" className="w-full">
                  Dark
                </Button>
                <Button variant="outline" className="w-full">
                  System
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Table Density</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="w-full">
                  Compact
                </Button>
                <Button variant="outline" className="w-full">
                  Default
                </Button>
                <Button variant="outline" className="w-full">
                  Comfortable
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure advanced system settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value="••••••••••••••••"
                readOnly
              />
              <Button variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="debug-mode" />
              <Label htmlFor="debug-mode">Enable debug mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="export-logs" />
              <Label htmlFor="export-logs">Export system logs</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-retention">
                Data Retention Period (days)
              </Label>
              <Input id="data-retention" type="number" defaultValue="90" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

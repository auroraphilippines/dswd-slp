"use client";

import {
  Settings,
  Users,
  Building,
  CreditCard,
  Bell,
  Lock,
  Layers,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./general";
import { UsersPermissionsSettings } from "./user-permission";
import { NotificationsSettings } from "./notifications";
import { SecuritySettings } from "./security";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/4">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 justify-start">
                <TabsTrigger
                  value="general"
                  className="justify-start w-full mb-1 data-[state=active]:bg-muted"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="justify-start w-full mb-1 data-[state=active]:bg-muted"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users & Permissions
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start w-full mb-1 data-[state=active]:bg-muted"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="justify-start w-full mb-1 data-[state=active]:bg-muted"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="md:w-3/4">
              <TabsContent value="general" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">General Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your general application preferences
                    </p>
                  </div>
                  <Separator />
                  <GeneralSettings />
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">Users & Permissions</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage users, roles, and access permissions
                    </p>
                  </div>
                  <Separator />
                  <UsersPermissionsSettings />
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">Notifications</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure your notification preferences
                    </p>
                  </div>
                  <Separator />
                  <NotificationsSettings />
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">Security</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your security settings and preferences
                    </p>
                  </div>
                  <Separator />
                  <SecuritySettings />
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

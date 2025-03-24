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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Bell,
  Smartphone,
  FileText,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Clock,
  Users,
  ShoppingCart,
} from "lucide-react";

export function NotificationsSettings() {
  const [channels, setChannels] = useState([
    {
      id: "email",
      name: "Email Notifications",
      description: "Receive updates and alerts via email",
      icon: Mail,
      enabled: true,
      lastUpdated: "2 days ago",
    },
    {
      id: "push",
      name: "Push Notifications",
      description: "Get real-time notifications in your browser",
      icon: Bell,
      enabled: true,
      lastUpdated: "1 week ago",
    },
    {
      id: "sms",
      name: "SMS Notifications",
      description: "Receive text messages for critical alerts",
      icon: Smartphone,
      enabled: false,
      lastUpdated: null,
    },
  ]);

  const [notificationTypes, setNotificationTypes] = useState([
    {
      id: "system",
      name: "System Alerts",
      description: "Important system updates and maintenance notifications",
      icon: AlertTriangle,
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "activity",
      name: "Activity Updates",
      description: "Notifications about actions taken in your account",
      icon: Clock,
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "comments",
      name: "Comments & Mentions",
      description: "When someone comments or mentions you",
      icon: MessageSquare,
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "team",
      name: "Team Updates",
      description: "Changes to your team or team members",
      icon: Users,
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "orders",
      name: "Order Updates",
      description: "Status changes for your orders",
      icon: ShoppingCart,
      email: true,
      push: true,
      sms: false,
    },
  ]);

  const toggleChannel = (id) => {
    setChannels(
      channels.map((channel) =>
        channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  const toggleNotificationType = (id, channel) => {
    setNotificationTypes(
      notificationTypes.map((type) =>
        type.id === id ? { ...type, [channel]: !type[channel] } : type
      )
    );
  };

  return (
    <Tabs defaultValue="channels" className="space-y-6">
      <TabsList>
        <TabsTrigger value="channels" className="flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Notification Channels
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Notification Preferences
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Delivery Schedule
        </TabsTrigger>
      </TabsList>

      <TabsContent value="channels" className="space-y-4">
        <div className="grid gap-4">
          {channels.map((channel) => (
            <Card key={channel.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-md bg-primary/10">
                      <channel.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    {channel.enabled ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      >
                        Enabled
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-muted text-muted-foreground"
                      >
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <Switch
                    checked={channel.enabled}
                    onCheckedChange={() => toggleChannel(channel.id)}
                  />
                </div>
                <CardDescription>{channel.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {channel.enabled && channel.lastUpdated && (
                  <div className="text-sm text-muted-foreground">
                    Last notification: {channel.lastUpdated}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Configure
                </Button>
                {channel.enabled && (
                  <Button variant="secondary" size="sm">
                    Test Notification
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="preferences" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Choose which notifications you want to receive and how
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {notificationTypes.map((type) => (
                <div key={type.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <type.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-medium">{type.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    {type.description}
                  </p>
                  <div className="grid grid-cols-3 gap-4 ml-7 mt-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`${type.id}-email`}
                        className="flex items-center"
                      >
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        Email
                      </Label>
                      <Switch
                        id={`${type.id}-email`}
                        checked={type.email}
                        onCheckedChange={() =>
                          toggleNotificationType(type.id, "email")
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`${type.id}-push`}
                        className="flex items-center"
                      >
                        <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                        Push
                      </Label>
                      <Switch
                        id={`${type.id}-push`}
                        checked={type.push}
                        onCheckedChange={() =>
                          toggleNotificationType(type.id, "push")
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`${type.id}-sms`}
                        className="flex items-center"
                      >
                        <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                        SMS
                      </Label>
                      <Switch
                        id={`${type.id}-sms`}
                        checked={type.sms}
                        onCheckedChange={() =>
                          toggleNotificationType(type.id, "sms")
                        }
                      />
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="schedule" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Schedule</CardTitle>
            <CardDescription>
              Control when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">
                During quiet hours, only critical notifications will be
                delivered
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Select defaultValue="22">
                    <SelectTrigger id="quiet-start">
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
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Select defaultValue="7">
                    <SelectTrigger id="quiet-end">
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
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Digest Settings</Label>
              <p className="text-sm text-muted-foreground">
                Receive a summary of notifications instead of individual alerts
              </p>
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-digest">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary of notifications once a day
                    </p>
                  </div>
                  <Switch id="daily-digest" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary of notifications once a week
                    </p>
                  </div>
                  <Switch id="weekly-digest" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Schedule</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
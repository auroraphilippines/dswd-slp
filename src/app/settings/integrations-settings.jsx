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
import { ShoppingBag, CreditCard, BarChart4, Package } from "lucide-react";

export function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState([
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect your Shopify store to sync inventory and orders",
      icon: ShoppingBag,
      connected: true,
      lastSync: "2 hours ago",
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description:
        "Integrate with QuickBooks for accounting and financial tracking",
      icon: CreditCard,
      connected: true,
      lastSync: "1 day ago",
    },
    {
      id: "amazon",
      name: "Amazon",
      description: "Connect your Amazon seller account to manage FBA inventory",
      icon: Package,
      connected: false,
      lastSync: null,
    },
    {
      id: "tableau",
      name: "Tableau",
      description:
        "Export data to Tableau for advanced analytics and visualization",
      icon: BarChart4,
      connected: false,
      lastSync: null,
    },
  ]);

  const toggleConnection = (id) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  return (
    <div className="grid gap-4">
      {integrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <integration.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                {integration.connected ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                  >
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground"
                  >
                    Disconnected
                  </Badge>
                )}
              </div>
              <Switch
                checked={integration.connected}
                onCheckedChange={() => toggleConnection(integration.id)}
              />
            </div>
            <CardDescription>{integration.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {integration.connected && (
              <div className="text-sm text-muted-foreground">
                Last synchronized: {integration.lastSync}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              Configure
            </Button>
            {integration.connected && (
              <Button variant="secondary" size="sm">
                Sync Now
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

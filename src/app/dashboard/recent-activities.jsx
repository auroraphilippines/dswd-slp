import {
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Users,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "inventory_update",
    description: "Added 200 units of 'Rice (5kg bags)'",
    timestamp: "10 minutes ago",
    icon: Package,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    id: 2,
    type: "disbursement_created",
    description: "New disbursement #D-2023-124 for Barangay Matatag",
    timestamp: "25 minutes ago",
    icon: ShoppingCart,
    iconColor: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    id: 3,
    type: "low_stock",
    description: "Low stock alert for 'Hygiene Kits' (15 remaining)",
    timestamp: "1 hour ago",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
  },
  {
    id: 4,
    type: "disbursement_completed",
    description: "Disbursement #D-2023-118 has been delivered to beneficiaries",
    timestamp: "2 hours ago",
    icon: CheckCircle,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  {
    id: 5,
    type: "beneficiary_added",
    description: "50 new beneficiaries added to Disaster Relief Program",
    timestamp: "3 hours ago",
    icon: Users,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
];

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className={`${activity.bgColor} p-2 rounded-full`}>
            <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function StockLevelMetrics() {
  const metrics = [
    {
      name: "Healthy Stock",
      value: 75,
      description: "Products with adequate inventory levels",
      icon: CheckCircle,
      color: "text-green-500",
      progressColor: "bg-green-500",
    },
    {
      name: "Low Stock",
      value: 18,
      description: "Products below minimum threshold",
      icon: AlertTriangle,
      color: "text-amber-500",
      progressColor: "bg-amber-500",
    },
    {
      name: "Out of Stock",
      value: 7,
      description: "Products with zero inventory",
      icon: XCircle,
      color: "text-red-500",
      progressColor: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {metrics.map((metric) => (
        <div key={metric.name} className="space-y-2">
          <div className="flex items-center">
            <metric.icon className={`h-5 w-5 ${metric.color} mr-2`} />
            <div>
              <h4 className="font-medium">{metric.name}</h4>
              <p className="text-sm text-muted-foreground">
                {metric.description}
              </p>
            </div>
            <div className="ml-auto font-bold">{metric.value}%</div>
          </div>
          <Progress value={metric.value} className={metric.progressColor} />
        </div>
      ))}
    </div>
  );
}

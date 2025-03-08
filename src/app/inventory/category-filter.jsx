"use client";

import {
  Package,
  ShoppingBag,
  Stethoscope,
  BookOpen,
  Droplets,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CategoryFilter({ activeCategory, onCategoryChange }) {
  const categories = [
    { id: "all", name: "All Categories", icon: Package },
    { id: "Food Items", name: "Food Items", icon: ShoppingBag },
    { id: "Medical Supplies", name: "Medical Supplies", icon: Stethoscope },
    {
      id: "Educational Materials",
      name: "Educational Materials",
      icon: BookOpen,
    },
    { id: "Hygiene Supplies", name: "Hygiene Supplies", icon: Droplets },
    { id: "Shelter Materials", name: "Shelter Materials", icon: Home },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-15rem)]">
      <div className="px-1 py-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <Button
              key={category.id}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {category.name}
              {isActive && (
                <span className="ml-auto bg-primary/20 text-primary text-xs rounded-full px-2 py-0.5">
                  {category.id === "all"
                    ? "All"
                    : getItemCountByCategory(category.id)}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

// Helper function to count items by category
function getItemCountByCategory(category) {
  if (category === "all") return "All";

  // This would typically come from a database or API
  const categoryCounts = {
    "Food Items": 2,
    "Medical Supplies": 1,
    "Educational Materials": 1,
    "Hygiene Supplies": 1,
    "Shelter Materials": 0,
  };

  return categoryCounts[category] || 0;
}

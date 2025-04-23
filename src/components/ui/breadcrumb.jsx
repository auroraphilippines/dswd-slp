import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef(({ ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" className="flex items-center text-sm" {...props} />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(({ className, href, ...props }, ref) => (
  <Link
    ref={ref}
    href={href}
    className={cn(
      "text-muted-foreground hover:text-foreground transition-colors",
      className
    )}
    {...props}
  />
))
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbSeparator = ({ className, ...props }) => (
  <div
    role="presentation"
    aria-hidden="true"
    className={cn("text-muted-foreground", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </div>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } 
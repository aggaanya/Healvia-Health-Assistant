import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline:
          "text-foreground",
        tech: "border-blue-200 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 backdrop-blur-sm shadow-sm",
        techPrimary: "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm",
        glass: "border border-white/30 dark:border-white/10 bg-white/10 dark:bg-gray-900/30 backdrop-blur-md text-foreground shadow-sm",
        glow: "border-transparent bg-blue-500/80 text-white shadow-[0_0_5px_rgba(59,130,246,0.5)]",
        neutral: "border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
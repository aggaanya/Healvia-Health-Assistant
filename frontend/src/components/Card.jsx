import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"

const cardVariants = cva(
  "rounded-xl text-card-foreground",
  {
    variants: {
      variant: {
        default: "border bg-card shadow",
        tech: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-100/50 dark:border-gray-800/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300",
        glass: "bg-white/10 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-800/30 shadow-xl",
        outline: "border shadow-sm",
        ghost: "border-none shadow-none",
        glow: "border bg-card shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

const Card = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants }
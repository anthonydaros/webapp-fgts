import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-slate-700 text-slate-100 hover:bg-slate-700/50",
        destructive:
          "bg-red-900/50 text-red-100 border border-red-800 hover:bg-red-900/75",
        outline:
          "border border-slate-700 text-slate-100 hover:bg-slate-700/50",
        secondary:
          "border border-slate-700 bg-slate-800/50 text-slate-100 hover:bg-slate-700/50",
        ghost: 
          "text-slate-100 hover:bg-slate-700/50",
        link: 
          "text-slate-100 underline-offset-4 hover:underline",
        success:
          "bg-emerald-900/50 text-emerald-100 border border-emerald-800 hover:bg-emerald-900/75",
        warning:
          "bg-amber-900/50 text-amber-100 border border-amber-800 hover:bg-amber-900/75",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 
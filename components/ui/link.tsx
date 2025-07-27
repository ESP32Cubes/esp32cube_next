import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const linkVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default: "text-primary underline underline-offset-2 hover:text-primary/80",
                secondary: "text-secondary-foreground underline underline-offset-2 hover:text-secondary-foreground/80",
                muted: "text-muted-foreground underline underline-offset-2 hover:text-muted-foreground/80",
                destructive: "text-destructive underline underline-offset-2 hover:text-destructive/80",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                noUnderline: "text-primary hover:text-primary/80",
            },
            size: {
                default: "h-auto p-0",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-8 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
    asChild?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <a
                className={cn(linkVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Link.displayName = "Link"

export { Link, linkVariants } 
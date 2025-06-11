import { cn } from "../../lib/utils";
import React from "react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                    variant === "default" &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    variant === "outline" &&
                        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    variant === "ghost" &&
                        "hover:bg-accent hover:text-accent-foreground",
                    variant === "link" &&
                        "underline-offset-4 hover:underline text-primary",
                    variant === "destructive" &&
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

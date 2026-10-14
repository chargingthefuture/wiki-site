import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-primary-foreground border-border",
      accent: "bg-accent text-black border-border",
      outline: "bg-transparent text-white border-white hover:bg-white hover:text-black",
      ghost: "bg-transparent text-gray-300 border-transparent hover:text-white hover:bg-white/10"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-lg",
      lg: "px-8 py-4 text-xl"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-heading font-semibold rounded-xl transition-colors duration-200 hover:opacity-90",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant !== 'ghost' && variant !== 'outline' && "border",
          variant === 'outline' && "border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

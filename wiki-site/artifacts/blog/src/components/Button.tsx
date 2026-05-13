import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-white border-black comic-shadow-sm hover:shadow-[4px_4px_0_0_#000]",
      accent: "bg-accent text-black border-black comic-shadow-sm hover:shadow-[4px_4px_0_0_#000]",
      outline: "bg-transparent text-white border-white hover:bg-white hover:text-black",
      ghost: "bg-transparent text-gray-300 border-transparent hover:text-white hover:bg-white/10"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-lg",
      lg: "px-8 py-4 text-2xl"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-heading font-bold uppercase tracking-wider transition-all duration-200",
          "hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
          variant !== 'ghost' && variant !== 'outline' && "border-4",
          variant === 'outline' && "border-4",
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

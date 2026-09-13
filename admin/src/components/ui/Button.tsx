import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-egypt-red hover:bg-egypt-red-dark text-white shadow-sm hover:shadow-md disabled:bg-egypt-red/50 disabled:cursor-not-allowed",
  gold: "bg-gradient-to-l from-pharaoh-gold-dark via-pharaoh-gold to-pharaoh-gold-light text-egypt-black font-semibold shadow-sm hover:shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed border border-pharaoh-gold-dark/20",
  secondary:
    "bg-white hover:bg-sand-50 text-gray-700 border border-sand-300 hover:border-pharaoh-gold/50 disabled:opacity-50",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-sm disabled:bg-red-300 disabled:cursor-not-allowed",
  ghost: "bg-transparent hover:bg-sand-100 text-gray-700 disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:ring-offset-1",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
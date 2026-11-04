import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-surface-muted text-text-muted",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
};

const dotColors: Record<BadgeVariant, string> = {
  neutral: "bg-text-muted",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  icon?: LucideIcon;
  /** Small colored dot before the label. */
  dot?: boolean;
}

export function Badge({
  variant = "neutral",
  size = "md",
  icon: Icon,
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dotColors[variant])} aria-hidden />}
      {Icon && <Icon className={size === "sm" ? "size-3" : "size-3.5"} aria-hidden />}
      {children}
    </span>
  );
}
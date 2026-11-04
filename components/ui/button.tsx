import type { ComponentProps } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "border border-border bg-surface text-text hover:bg-surface-muted",
  ghost: "text-text-muted hover:bg-surface-muted hover:text-text",
  danger: "bg-danger text-danger-foreground hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

const iconOnlySizes: Record<ButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-11",
};

interface VariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
}

/** Class names for a button. Use on <Link> to get a link that looks like a button. */
export function buttonVariants({ variant = "primary", size = "md", iconOnly = false, className }: VariantOptions = {}): string {
  return cn(base, variants[variant], iconOnly ? iconOnlySizes[size] : sizes[size], className);
}

export interface ButtonProps extends ComponentProps<"button">, Omit<VariantOptions, "className"> {
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

/** Icon-only buttons (iconOnly) must pass an aria-label. */
export function Button({
  variant,
  size,
  iconOnly,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, iconOnly, className })}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
      ) : LeftIcon ? (
        <LeftIcon className="size-4" aria-hidden />
      ) : null}
      {children}
      {!loading && RightIcon ? <RightIcon className="size-4" aria-hidden /> : null}
    </button>
  );
}
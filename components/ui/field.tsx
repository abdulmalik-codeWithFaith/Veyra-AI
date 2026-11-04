import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared control styling for Input, Textarea and Select. */
export function controlClass(invalid?: boolean): string {
  return cn(
    "w-full rounded-xl border bg-surface px-3.5 text-sm text-text placeholder:text-text-muted transition-colors focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
    invalid ? "border-danger" : "border-border hover:border-text-muted/50",
  );
}

interface FormFieldProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint/error. Ids line up with aria-describedby set by the control. */
export function FormField({ id, label, hint, error, required, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** aria-describedby value matching the ids rendered by FormField. */
export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
import { useId, type ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { controlClass, describedBy, FormField } from "./field";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: LucideIcon;
}

export function Input({ label, hint, error, leftIcon: LeftIcon, className, id, required, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FormField id={inputId} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
        )}
        <input
          id={inputId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(controlClass(Boolean(error)), "h-10", LeftIcon && "pl-10")}
          {...props}
        />
      </div>
    </FormField>
  );
}
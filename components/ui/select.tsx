import { useId, type ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { controlClass, describedBy, FormField } from "./field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends ComponentProps<"select"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  /** Shown as a disabled first option, e.g. "Choose a department". */
  placeholder?: string;
}

/** Native <select> with consistent styling: keeps mobile pickers and keyboard behaviour for free. */
export function Select({ label, hint, error, options, placeholder, className, id, required, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <FormField id={selectId} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy(selectId, error, hint)}
          className={cn(controlClass(Boolean(error)), "h-10 appearance-none pr-10")}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
      </div>
    </FormField>
  );
}
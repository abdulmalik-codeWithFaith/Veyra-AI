import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClass, describedBy, FormField } from "./field";

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className, id, required, rows = 4, ...props }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <FormField id={textareaId} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(textareaId, error, hint)}
        className={cn(controlClass(Boolean(error)), "resize-y py-2.5 leading-relaxed")}
        {...props}
      />
    </FormField>
  );
}
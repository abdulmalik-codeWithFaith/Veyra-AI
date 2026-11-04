"use client";

import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { Overlay } from "./overlay";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Buttons shown in the footer, usually a cancel and a confirm. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Overlay
      open={open}
      onClose={onClose}
      variant="center"
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      className={cn("max-h-[90dvh]", widths[size])}
    >
      <div className="flex items-start justify-between gap-4 p-6 pb-3">
        <div>
          <h2 id={titleId} className="text-lg font-semibold tracking-tight">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="mt-1 text-sm text-text-muted">
              {description}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" iconOnly leftIcon={X} aria-label="Close" onClick={onClose} />
      </div>
      {children && <div className="overflow-y-auto px-6 py-3 text-sm">{children}</div>}
      {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-border p-4">{footer}</div>}
    </Overlay>
  );
}
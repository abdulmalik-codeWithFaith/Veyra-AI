"use client";

import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { Overlay } from "./overlay";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: "md" | "lg";
}

const widths = { md: "sm:max-w-md", lg: "sm:max-w-xl" };

/** Right-side panel. Used later for task details. */
export function Drawer({ open, onClose, title, description, children, footer, width = "md" }: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Overlay
      open={open}
      onClose={onClose}
      variant="right"
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      className={cn(widths[width])}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-5">
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
      <div className="flex-1 overflow-y-auto p-5 text-sm">{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-border p-4">{footer}</div>}
    </Overlay>
  );
}
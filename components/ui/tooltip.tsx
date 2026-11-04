"use client";

import { cloneElement, isValidElement, useId, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface TooltipProps {
  content: string;
  side?: "top" | "bottom";
  /** A single focusable element, e.g. a Button. */
  children: ReactElement<{ "aria-describedby"?: string }>;
}

/** Shows on hover and keyboard focus; Escape hides it. */
export function Tooltip({ content, side = "top", children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const trigger = isValidElement(children)
    ? cloneElement(children, { "aria-describedby": open ? id : undefined })
    : children;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 w-max max-w-60 -translate-x-1/2 rounded-lg bg-text px-2.5 py-1.5 text-xs font-medium text-background shadow-lift",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
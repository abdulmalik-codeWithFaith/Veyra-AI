"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useMounted } from "@/lib/use-mounted";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  /** "center" for a Modal, "right" for a Drawer, "left" for the mobile navigation. */
  variant: "center" | "right" | "left";
  labelledBy: string;
  describedBy?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Shared behaviour for Modal and Drawer: portal, backdrop, Escape to close, focus trap,
 * scroll lock, and returning focus to the trigger when closed.
 */
export function Overlay({ open, onClose, variant, labelledBy, describedBy, className, children }: OverlayProps) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    (focusables()[0] ?? panel)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!mounted) return null;

  const isDrawer = variant !== "center";
  const offscreen = variant === "left" ? "-100%" : "100%";

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div className={cn("fixed inset-0 z-50 flex", variant === "right" ? "justify-end" : isDrawer ? "justify-start" : "items-center justify-center p-4")}>
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={onClose}
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              tabIndex={-1}
              initial={isDrawer ? { x: offscreen } : { opacity: 0, scale: 0.97, y: 8 }}
              animate={isDrawer ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isDrawer ? { x: offscreen } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "relative flex max-h-full flex-col bg-surface shadow-lift outline-none",
                isDrawer ? cn("h-full w-full", variant === "left" ? "border-r border-border" : "border-l border-border") : "w-full rounded-2xl border border-border",
                className,
              )}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}
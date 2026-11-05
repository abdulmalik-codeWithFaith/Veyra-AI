"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type DropdownItem =
  | {
      type?: "item";
      label: string;
      icon?: LucideIcon;
      onSelect?: () => void;
      /** Renders a link instead of a button. */
      href?: string;
      danger?: boolean;
      disabled?: boolean;
    }
  | { type: "separator" }
  | { type: "label"; label: string };

interface DropdownProps {
  /** Accessible name for the trigger button, e.g. "Account menu". */
  label: string;
  /** Visual content of the trigger (an Avatar, an icon, text). Should not be interactive itself. */
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  /** Classes for the wrapper, e.g. "w-full" to stretch the trigger. */
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
}

const itemClass = (danger?: boolean) =>
  cn(
    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors",
    "focus-visible:bg-surface-muted aria-disabled:pointer-events-none aria-disabled:opacity-50",
    danger ? "text-danger hover:bg-danger-soft focus-visible:bg-danger-soft" : "hover:bg-surface-muted",
  );

/** Menu button with arrow-key navigation, Escape to close, and click-outside to dismiss. */
export function Dropdown({ label, trigger, items, align = "end", className, triggerClassName, menuClassName }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const menuItems = useCallback(
    () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []),
    [],
  );

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Close when clicking or tapping anywhere outside
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Move focus into the menu when it opens
  useEffect(() => {
    if (open) menuItems()[0]?.focus();
  }, [open, menuItems]);

  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const list = menuItems();
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list[(index + 1) % list.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[(index - 1 + list.length) % list.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      list[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn("inline-flex items-center rounded-xl transition-colors", triggerClassName)}
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute top-full z-50 mt-2 min-w-52 rounded-xl border border-border bg-surface p-1.5 shadow-lift",
              align === "end" ? "right-0" : "left-0",
              menuClassName,
            )}
          >
            {items.map((item, i) => {
              if (item.type === "separator") {
                return <div key={i} role="separator" className="-mx-1.5 my-1.5 h-px bg-border" />;
              }
              if (item.type === "label") {
                return (
                  <p key={i} className="px-2.5 py-1.5 text-xs font-medium text-text-muted">
                    {item.label}
                  </p>
                );
              }
              const Icon = item.icon;
              const content = (
                <>
                  {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
                  {item.label}
                </>
              );
              if (item.href) {
                return (
                  <Link
                    key={i}
                    href={item.href}
                    role="menuitem"
                    tabIndex={-1}
                    aria-disabled={item.disabled || undefined}
                    onClick={() => close(false)}
                    className={itemClass(item.danger)}
                  >
                    {content}
                  </Link>
                );
              }
              return (
                <button
                  key={i}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled || undefined}
                  onClick={() => {
                    close(true);
                    item.onSelect?.();
                  }}
                  className={itemClass(item.danger)}
                >
                  {content}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  /** Accessible name for the tab list. */
  label: string;
  /** Pass the same prefix to tabPanelProps() so tabs and panels are linked for screen readers. */
  idPrefix?: string;
  className?: string;
}

/** Props for the panel that belongs to a tab. */
export function tabPanelProps(idPrefix: string, id: string) {
  return {
    role: "tabpanel" as const,
    id: `${idPrefix}-panel-${id}`,
    "aria-labelledby": `${idPrefix}-tab-${id}`,
    tabIndex: 0,
  };
}

export function Tabs({ items, value, onValueChange, label, idPrefix, className }: TabsProps) {
  const generatedPrefix = useId();
  const prefix = idPrefix ?? generatedPrefix;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
    const current = enabled.findIndex(({ item }) => item.id === value);
    let next = current;
    if (e.key === "ArrowRight") next = (current + 1) % enabled.length;
    else if (e.key === "ArrowLeft") next = (current - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = enabled.length - 1;
    else return;

    e.preventDefault();
    const target = enabled[next];
    onValueChange(target.item.id);
    refs.current[target.index]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn("flex gap-1 overflow-x-auto border-b border-border", className)}
    >
      {items.map((item, index) => {
        const active = item.id === value;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            role="tab"
            id={`${prefix}-tab-${item.id}`}
            aria-selected={active}
            aria-controls={`${prefix}-panel-${item.id}`}
            tabIndex={active ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onValueChange(item.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
              active ? "text-text" : "text-text-muted hover:text-text",
            )}
          >
            {Icon && <Icon className="size-4" aria-hidden />}
            {item.label}
            {item.count !== undefined && (
              <span className="rounded-full bg-surface-muted px-1.5 text-[11px] text-text-muted">{item.count}</span>
            )}
            {active && (
              <motion.span
                layoutId={`${prefix}-underline`}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
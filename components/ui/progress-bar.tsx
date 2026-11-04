"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";

type Tone = "primary" | "success" | "warning" | "danger" | "info";

const toneClass: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

interface ProgressBarProps {
  /** 0-100 */
  value: number;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** Accessible name, e.g. "Engineering progress". Also shown when showLabel is set. */
  label: string;
  showLabel?: boolean;
  className?: string;
}

const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };

export function ProgressBar({ value, tone = "primary", size = "md", label, showLabel = false, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-text-muted">{label}</span>
          <span className="font-medium">{formatPercent(clamped)}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        className={cn("overflow-hidden rounded-full bg-surface-muted", heights[size])}
      >
        <motion.div
          className={cn("h-full rounded-full", toneClass[tone])}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
import type { ISODate } from "@/types";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "2 hours ago", "yesterday", "in 3 days". Falls back to a date after ~a month. */
export function formatRelativeTime(iso: ISODate, now: number = Date.now()): string {
  const diff = new Date(iso).getTime() - now;
  const abs = Math.abs(diff);

  if (abs < MINUTE) return "just now";
  if (abs < HOUR) return relativeFormatter.format(Math.round(diff / MINUTE), "minute");
  if (abs < DAY) return relativeFormatter.format(Math.round(diff / HOUR), "hour");
  if (abs < 30 * DAY) return relativeFormatter.format(Math.round(diff / DAY), "day");
  return formatDate(iso);
}

/** "31 Oct 2026" */
export function formatDate(iso: ISODate): string {
  return new Date(iso).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}

/** "$45", "$1,200.50", or "$45/month" when recurring. */
export function formatCurrency(
  amount: number,
  currency: string,
  recurring?: "monthly" | "yearly",
): string {
  const hasCents = !Number.isInteger(amount);
  const text = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  if (!recurring) return text;
  return `${text}/${recurring === "monthly" ? "month" : "year"}`;
}

/** 0-100 value to "58%". */
export function formatPercent(value: number): string {
  return `${Math.round(Math.min(100, Math.max(0, value)))}%`;
}

/** 4280000 -> "4.3M" */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

/** "Today", "Yesterday", or "Monday, 27 Oct". Used to group timelines by day. */
export function formatDayLabel(iso: ISODate, now: number = Date.now()): string {
  const startOfDay = (time: number) => {
    const d = new Date(time);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const days = Math.round((startOfDay(now) - startOfDay(new Date(iso).getTime())) / DAY);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return new Date(iso).toLocaleDateString("en", { weekday: "long", day: "numeric", month: "short" });
}
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface DashboardCardProps {
  title: string;
  /** Optional "View all" link shown top right. */
  href?: string;
  linkLabel?: string;
  className?: string;
  children: ReactNode;
}

export function DashboardCard({ title, href, linkLabel = "View all", className, children }: DashboardCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <h2 className="text-sm font-semibold">{title}</h2>
        {href && (
          <Link href={href} className="text-xs font-medium text-primary hover:text-primary-hover">
            {linkLabel}
          </Link>
        )}
      </div>
      <div className="flex-1 p-5 pt-4">{children}</div>
    </Card>
  );
}

/** Rows of grey bars used as a loading placeholder inside a card. */
export function RowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="size-9 shrink-0 animate-pulse rounded-full bg-surface-muted motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded-lg bg-surface-muted motion-reduce:animate-none" />
            <div className="h-3 w-1/3 animate-pulse rounded-lg bg-surface-muted motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
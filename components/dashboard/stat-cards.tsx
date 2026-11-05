"use client";

import Link from "next/link";
import { CheckCircle2, CircleDollarSign, Loader2, ShieldCheck, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import type { AsyncState } from "@/lib/use-async";
import type { Task, UsageSummary } from "@/types";

const IN_PROGRESS = new Set(["working", "waiting_team"]);

interface StatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone: "primary" | "success" | "warning" | "info";
  href?: string;
  footer?: React.ReactNode;
}

const toneIcon: Record<StatProps["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
};

function Stat({ icon: Icon, label, value, hint, tone, href, footer }: StatProps) {
  const body = (
    <Card interactive={Boolean(href)} className="h-full p-5">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-9 place-items-center rounded-lg", toneIcon[tone])}>
          <Icon className="size-[18px]" aria-hidden />
        </span>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      {footer}
    </Card>
  );
  return href ? (
    <Link href={href} className="block rounded-2xl">
      {body}
    </Link>
  ) : (
    body
  );
}

function StatSkeleton() {
  return (
    <Card className="p-5" aria-hidden>
      <Skeleton className="size-9 rounded-lg" />
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-24" />
    </Card>
  );
}

interface StatCardsProps {
  startupId: string;
  tasks: AsyncState<Task[]>;
  usage: AsyncState<UsageSummary>;
  pendingApprovals: number;
}

export function StatCards({ startupId, tasks, usage, pendingApprovals }: StatCardsProps) {
  const t = tasks.data;
  const completed = t?.filter((x) => x.status === "completed").length ?? 0;
  const inProgress = t?.filter((x) => IN_PROGRESS.has(x.status)).length ?? 0;
  const blocked = t?.filter((x) => x.status === "blocked" || x.status === "failed").length ?? 0;
  const u = usage.data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tasks.loading || !t ? (
        <>
          <StatSkeleton />
          <StatSkeleton />
        </>
      ) : (
        <>
          <Stat icon={CheckCircle2} label="Tasks completed" value={String(completed)} hint={`of ${t.length} tasks`} tone="success" href={`/s/${startupId}/tasks`} />
          <Stat
            icon={Loader2}
            label="In progress"
            value={String(inProgress)}
            hint={blocked > 0 ? `${blocked} need attention` : "Nothing is stuck"}
            tone="primary"
            href={`/s/${startupId}/tasks`}
          />
        </>
      )}

      <Stat
        icon={ShieldCheck}
        label="Waiting on you"
        value={String(pendingApprovals)}
        hint={pendingApprovals === 1 ? "approval to review" : "approvals to review"}
        tone="warning"
        href={`/s/${startupId}/approvals`}
      />

      {usage.loading || !u ? (
        <StatSkeleton />
      ) : (
        <Stat
          icon={CircleDollarSign}
          label="Spent so far"
          value={formatCurrency(u.totalCost, u.currency)}
          hint={u.budgetLimit ? `of ${formatCurrency(u.budgetLimit, u.currency)} budget` : "No budget set"}
          tone="info"
          href={`/s/${startupId}/settings`}
          footer={
            u.budgetLimit ? (
              <ProgressBar label="Budget used" value={(u.totalCost / u.budgetLimit) * 100} size="sm" className="mt-3" />
            ) : undefined
          }
        />
      )}
    </div>
  );
}
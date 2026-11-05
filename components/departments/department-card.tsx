"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AvatarGroup } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsync } from "@/lib/use-async";
import { departmentService } from "@/services";
import type { Department } from "@/types";

export function departmentPercent(d: Department): number {
  const total = d.taskCounts.active + d.taskCounts.completed + d.taskCounts.pending;
  return total === 0 ? 0 : (d.taskCounts.completed / total) * 100;
}

export function DepartmentCard({ department, startupId }: { department: Department; startupId: string }) {
  const agents = useAsync(() => departmentService.listAgents(department.id), [department.id]);
  const { active, completed, pending } = department.taskCounts;

  return (
    <Link href={`/s/${startupId}/departments/${department.id}`} className="block rounded-2xl">
      <Card interactive className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight">{department.name}</h2>
          <StatusBadge type="department" status={department.status} size="sm" />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{department.description}</p>

        <ProgressBar
          label={`${department.name} progress`}
          value={departmentPercent(department)}
          size="sm"
          tone={department.status === "completed" ? "success" : "primary"}
          className="mt-5"
        />
        <dl className="mt-3 flex gap-5 text-xs">
          <div>
            <dt className="text-text-muted">In progress</dt>
            <dd className="mt-0.5 text-sm font-semibold">{active}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Done</dt>
            <dd className="mt-0.5 text-sm font-semibold">{completed}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Up next</dt>
            <dd className="mt-0.5 text-sm font-semibold">{pending}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center gap-2 pt-5">
          {agents.data ? (
            <>
              <AvatarGroup people={agents.data.map((a) => ({ name: a.name, variant: "agent" as const }))} />
              <span className="text-xs text-text-muted">
                {agents.data.length} AI team {agents.data.length === 1 ? "member" : "members"}
              </span>
            </>
          ) : (
            <Skeleton className="h-8 w-28 rounded-full" />
          )}
        </div>
      </Card>
    </Link>
  );
}
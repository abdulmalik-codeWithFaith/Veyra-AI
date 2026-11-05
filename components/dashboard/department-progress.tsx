"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { AsyncView } from "@/components/ui/async-view";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AsyncState } from "@/lib/use-async";
import type { Department } from "@/types";
import { DashboardCard, RowsSkeleton } from "./dashboard-card";

function percentDone(d: Department): number {
  const total = d.taskCounts.active + d.taskCounts.completed + d.taskCounts.pending;
  return total === 0 ? 0 : (d.taskCounts.completed / total) * 100;
}

export function DepartmentProgress({ startupId, departments }: { startupId: string; departments: AsyncState<Department[]> }) {
  return (
    <DashboardCard title="Departments" href={`/s/${startupId}/departments`}>
      <AsyncView
        state={departments}
        loading={<RowsSkeleton rows={4} />}
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={Building2}
            title="No departments yet"
            description="Veyra creates your departments once the business analysis is ready."
            className="py-8"
          />
        }
      >
        {(list) => (
          <ul className="space-y-5">
            {list.map((d) => {
              const total = d.taskCounts.active + d.taskCounts.completed + d.taskCounts.pending;
              return (
                <li key={d.id}>
                  <Link href={`/s/${startupId}/departments/${d.id}`} className="group block rounded-lg">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium group-hover:text-primary">{d.name}</span>
                      <StatusBadge type="department" status={d.status} size="sm" />
                    </div>
                    <ProgressBar
                      label={`${d.name} progress`}
                      value={percentDone(d)}
                      size="sm"
                      tone={d.status === "completed" ? "success" : "primary"}
                    />
                    <p className="mt-1.5 text-xs text-text-muted">
                      {d.taskCounts.completed} of {total} tasks done
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </AsyncView>
    </DashboardCard>
  );
}
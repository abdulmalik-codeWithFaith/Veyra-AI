"use client";

import { Flag } from "lucide-react";
import { AsyncView } from "@/components/ui/async-view";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDate } from "@/lib/format";
import { MILESTONE_STATUS_LABEL } from "@/lib/labels";
import type { AsyncState } from "@/lib/use-async";
import type { Milestone } from "@/types";
import { DashboardCard, RowsSkeleton } from "./dashboard-card";

const VARIANT: Record<Milestone["status"], BadgeVariant> = {
  done: "success",
  in_progress: "primary",
  upcoming: "neutral",
};

export function MilestonesCard({ milestones }: { milestones: AsyncState<Milestone[]> }) {
  return (
    <DashboardCard title="Milestones">
      <AsyncView
        state={milestones}
        loading={<RowsSkeleton rows={4} />}
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={Flag}
            title="No milestones yet"
            description="Key goals on the way to launch will be listed here."
            className="py-8"
          />
        }
      >
        {(list) => (
          <ol className="space-y-5">
            {list.map((m) => (
              <li key={m.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug">{m.title}</p>
                    {m.dueDate && (
                      <p className="mt-0.5 text-xs text-text-muted">
                        {m.status === "done" ? "Finished" : "Due"} {formatDate(m.dueDate)}
                      </p>
                    )}
                  </div>
                  <Badge variant={VARIANT[m.status]} size="sm">
                    {MILESTONE_STATUS_LABEL[m.status]}
                  </Badge>
                </div>
                <ProgressBar
                  label={`${m.title} progress`}
                  value={m.progress}
                  size="sm"
                  tone={m.status === "done" ? "success" : "primary"}
                  className="mt-2.5"
                />
              </li>
            ))}
          </ol>
        )}
      </AsyncView>
    </DashboardCard>
  );
}
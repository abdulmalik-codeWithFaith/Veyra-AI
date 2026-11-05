"use client";

import { ActivityIcon, ActivityRow } from "@/components/activity/activity-row";
import { AsyncView } from "@/components/ui/async-view";
import { EmptyState } from "@/components/ui/empty-state";
import type { AsyncState } from "@/lib/use-async";
import type { ActivityItem, Department } from "@/types";
import { DashboardCard, RowsSkeleton } from "./dashboard-card";

interface ActivityFeedProps {
  startupId: string;
  activity: AsyncState<ActivityItem[]>;
  departments: AsyncState<Department[]>;
}

export function ActivityFeed({ startupId, activity, departments }: ActivityFeedProps) {
  const names = new Map((departments.data ?? []).map((d) => [d.id, d.name]));

  return (
    <DashboardCard title="Recent activity" href={`/s/${startupId}/activity`}>
      <AsyncView
        state={activity}
        loading={<RowsSkeleton rows={5} />}
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={ActivityIcon}
            title="Nothing has happened yet"
            description="Updates from your team will appear here as work begins."
            className="py-8"
          />
        }
      >
        {(list) => (
          <ul className="space-y-1">
            {list.map((item) => (
              <ActivityRow
                key={item.id}
                item={item}
                startupId={startupId}
                departmentName={item.departmentId ? names.get(item.departmentId) : undefined}
              />
            ))}
          </ul>
        )}
      </AsyncView>
    </DashboardCard>
  );
}
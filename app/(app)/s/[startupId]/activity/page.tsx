"use client";

import { Fragment, useState } from "react";
import { ActivityIcon, ActivityRow } from "@/components/activity/activity-row";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { AsyncView } from "@/components/ui/async-view";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDayLabel } from "@/lib/format";
import { useAsync } from "@/lib/use-async";
import { departmentName, useDirectory } from "@/lib/use-directory";
import { activityService } from "@/services";
import type { ActivityItem } from "@/types";

function groupByDay(items: ActivityItem[]): { label: string; items: ActivityItem[] }[] {
  const groups: { label: string; items: ActivityItem[] }[] = [];
  for (const item of items) {
    const label = formatDayLabel(item.at);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

export default function ActivityPage() {
  const { startup } = useStartup();
  const [department, setDepartment] = useState("all");
  const directory = useDirectory(startup.id);
  const activity = useAsync(
    () => activityService.list(startup.id, { departmentId: department === "all" ? undefined : department }),
    [startup.id, department],
  );

  const options = [
    { value: "all", label: "All departments" },
    ...(directory.data?.departments ?? []).map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <>
      <PageHeader title="Activity" description="A plain-language timeline of everything your team has done." />

      <div className="mb-6 max-w-xs">
        <Select
          aria-label="Filter by department"
          options={options}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>

      <AsyncView
        state={activity}
        loading={
          <Card className="space-y-5 p-5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </Card>
        }
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={ActivityIcon}
            title="No activity yet"
            description={
              department === "all"
                ? "Updates from your team will appear here as work begins."
                : "This department has not reported any activity yet."
            }
          />
        }
      >
        {(list) => (
          <Card className="p-5">
            {groupByDay(list).map((group, index) => (
              <Fragment key={group.label}>
                <h2 className={`mb-2 text-xs font-semibold text-text-muted ${index > 0 ? "mt-6" : ""}`}>{group.label}</h2>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <ActivityRow
                      key={item.id}
                      item={item}
                      startupId={startup.id}
                      departmentName={item.departmentId ? departmentName(directory.data, item.departmentId) : undefined}
                    />
                  ))}
                </ul>
              </Fragment>
            ))}
          </Card>
        )}
      </AsyncView>
    </>
  );
}
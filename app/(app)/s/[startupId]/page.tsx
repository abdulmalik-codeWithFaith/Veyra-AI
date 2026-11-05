"use client";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DepartmentProgress } from "@/components/dashboard/department-progress";
import { MilestonesCard } from "@/components/dashboard/milestones-card";
import { PendingApprovals } from "@/components/dashboard/pending-approvals";
import { StatCards } from "@/components/dashboard/stat-cards";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { STARTUP_STAGE_LABEL } from "@/lib/labels";
import { useAsync } from "@/lib/use-async";
import {
  activityService,
  approvalService,
  departmentService,
  milestoneService,
  taskService,
  usageService,
} from "@/services";

export default function DashboardPage() {
  const { startup, pendingApprovals } = useStartup();
  const id = startup.id;

  // Each section loads on its own, so one slow or failing request never blocks the rest
  const tasks = useAsync(() => taskService.list(id), [id]);
  const usage = useAsync(() => usageService.get(id), [id]);
  const departments = useAsync(() => departmentService.list(id), [id]);
  const activity = useAsync(() => activityService.list(id, { limit: 8 }), [id]);
  const approvals = useAsync(() => approvalService.list(id, "pending"), [id]);
  const milestones = useAsync(() => milestoneService.list(id), [id]);

  return (
    <>
      <PageHeader title={startup.name} description={startup.tagline ?? startup.ideaSummary} />

      <div className="space-y-6">
        <Card className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">Overall progress</p>
            <Badge variant="primary">{STARTUP_STAGE_LABEL[startup.stage]} stage</Badge>
          </div>
          <ProgressBar label="Overall progress" value={startup.progress} size="lg" showLabel />
        </Card>

        <StatCards startupId={id} tasks={tasks} usage={usage} pendingApprovals={pendingApprovals} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <DepartmentProgress startupId={id} departments={departments} />
            <ActivityFeed startupId={id} activity={activity} departments={departments} />
          </div>
          <div className="space-y-6">
            <PendingApprovals startupId={id} approvals={approvals} departments={departments} />
            <MilestonesCard milestones={milestones} />
          </div>
        </div>
      </div>
    </>
  );
}
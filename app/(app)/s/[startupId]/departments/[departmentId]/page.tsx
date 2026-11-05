"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, FileText, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { TaskRow } from "@/components/tasks/task-row";
import { Avatar } from "@/components/ui/avatar";
import { AsyncView } from "@/components/ui/async-view";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, tabPanelProps } from "@/components/ui/tabs";
import { departmentPercent } from "@/components/departments/department-card";
import { formatRelativeTime } from "@/lib/format";
import { DELIVERABLE_TYPE_LABEL } from "@/lib/labels";
import { useAsync } from "@/lib/use-async";
import { assigneeOf, useDirectory } from "@/lib/use-directory";
import { deliverableService, departmentService, taskService } from "@/services";

export default function DepartmentDetailPage() {
  // Client page: reading the param here avoids awaiting params on the server (Next.js 16 needs Suspense for that)
  const { departmentId } = useParams<{ departmentId: string }>();
  const { startup } = useStartup();

  const department = useAsync(() => departmentService.get(departmentId), [departmentId]);
  const agents = useAsync(() => departmentService.listAgents(departmentId), [departmentId]);
  const tasks = useAsync(() => taskService.list(startup.id), [startup.id]);
  const deliverables = useAsync(() => deliverableService.list(startup.id, { departmentId }), [startup.id, departmentId]);
  const directory = useDirectory(startup.id);

  const [tab, setTab] = useState("tasks");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const deptTasks = (tasks.data ?? []).filter((t) => t.departmentId === departmentId);
  const taskTitles = new Map((tasks.data ?? []).map((t) => [t.id, t.title]));

  const back = (
    <Link href={`/s/${startup.id}/departments`} className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-2 mb-4" })}>
      <ArrowLeft className="size-4" aria-hidden />
      All departments
    </Link>
  );

  return (
    <>
      {back}
      <AsyncView
        state={department}
        loading={
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-3 h-4 w-96 max-w-full" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        }
      >
        {(d) => (
          <>
            <PageHeader title={d.name} description={d.description} actions={<StatusBadge type="department" status={d.status} />} />

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="p-5 lg:col-span-2">
                <h2 className="text-sm font-semibold">Progress</h2>
                <ProgressBar
                  label={`${d.name} progress`}
                  value={departmentPercent(d)}
                  showLabel
                  tone={d.status === "completed" ? "success" : "primary"}
                  className="mt-4"
                />
                <dl className="mt-5 grid grid-cols-3 gap-4">
                  {[
                    { l: "In progress", v: d.taskCounts.active },
                    { l: "Done", v: d.taskCounts.completed },
                    { l: "Up next", v: d.taskCounts.pending },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-surface-muted p-3.5">
                      <dt className="text-xs text-text-muted">{s.l}</dt>
                      <dd className="mt-1 text-2xl font-semibold">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <Card className="p-5">
                <h2 className="text-sm font-semibold">Responsibilities</h2>
                <ul className="mt-4 space-y-2.5">
                  {d.responsibilities.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <section className="mt-8" aria-labelledby="team-heading">
              <h2 id="team-heading" className="mb-4 text-sm font-semibold">
                AI team
              </h2>
              <AsyncView
                state={agents}
                loading={
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                }
                isEmpty={(list) => list.length === 0}
                empty={<EmptyState icon={Building2} title="No team members yet" className="py-8" />}
              >
                {(list) => (
                  <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {list.map((a) => (
                      <li key={a.id}>
                        <Card className="h-full p-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={a.name} variant="agent" size="md" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{a.name}</p>
                              <p className="truncate text-xs text-text-muted">{a.role}</p>
                            </div>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-text-muted">{a.description}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge type="agent" status={a.status} size="sm" />
                            {a.currentTaskId && taskTitles.get(a.currentTaskId) && (
                              <span className="truncate text-xs text-text-muted">{taskTitles.get(a.currentTaskId)}</span>
                            )}
                          </div>
                        </Card>
                      </li>
                    ))}
                  </ul>
                )}
              </AsyncView>
            </section>

            <section className="mt-10">
              <Tabs
                label="Department work"
                idPrefix="dept"
                value={tab}
                onValueChange={setTab}
                items={[
                  { id: "tasks", label: "Tasks", icon: ListChecks, count: tasks.data ? deptTasks.length : undefined },
                  { id: "deliverables", label: "Deliverables", icon: FileText, count: deliverables.data?.length },
                ]}
              />
              <div {...tabPanelProps("dept", tab)} className="mt-5 outline-none">
                {tab === "tasks" ? (
                  <AsyncView
                    state={tasks}
                    loading={<Skeleton className="h-48 w-full rounded-2xl" />}
                    isEmpty={() => deptTasks.length === 0}
                    empty={<EmptyState icon={ListChecks} title="No tasks yet" description="Tasks for this department will appear here." className="py-10" />}
                  >
                    {() => (
                      <Card>
                        <ul className="divide-y divide-border">
                          {deptTasks.map((t) => (
                            <TaskRow
                              key={t.id}
                              task={t}
                              departmentName={d.name}
                              assignee={assigneeOf(directory.data, t)}
                              onOpen={(id) => {
                                setSelectedId(id);
                                setDrawerOpen(true);
                              }}
                            />
                          ))}
                        </ul>
                      </Card>
                    )}
                  </AsyncView>
                ) : (
                  <AsyncView
                    state={deliverables}
                    loading={<Skeleton className="h-48 w-full rounded-2xl" />}
                    isEmpty={(list) => list.length === 0}
                    empty={<EmptyState icon={FileText} title="Nothing delivered yet" description="Finished work from this department will be listed here." className="py-10" />}
                  >
                    {(list) => (
                      <ul className="grid gap-4 md:grid-cols-2">
                        {list.map((x) => (
                          <li key={x.id}>
                            <Card className="h-full p-4">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold">{x.title}</p>
                                <Badge size="sm">{DELIVERABLE_TYPE_LABEL[x.type]}</Badge>
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed text-text-muted">{x.summary}</p>
                              <p className="mt-3 text-xs text-text-muted">Delivered {formatRelativeTime(x.createdAt)}</p>
                            </Card>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AsyncView>
                )}
              </div>
            </section>
          </>
        )}
      </AsyncView>

      <TaskDrawer
        task={tasks.data?.find((t) => t.id === selectedId)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        allTasks={tasks.data ?? []}
        directory={directory.data}
        onChanged={tasks.reload}
      />
    </>
  );
}
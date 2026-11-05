"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ListChecks, SearchX } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { TaskRow } from "@/components/tasks/task-row";
import { AsyncView } from "@/components/ui/async-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL } from "@/lib/labels";
import { useAsync } from "@/lib/use-async";
import { assigneeOf, departmentName, useDirectory } from "@/lib/use-directory";
import { taskService } from "@/services";
import type { TaskPriority, TaskStatus } from "@/types";
import { Search } from "lucide-react";

const STATUS_FILTER = [
  { value: "all", label: "All statuses" },
  ...(Object.keys(TASK_STATUS_LABEL) as TaskStatus[]).map((s) => ({ value: s, label: TASK_STATUS_LABEL[s] })),
];
const PRIORITY_FILTER = [
  { value: "all", label: "All priorities" },
  ...(Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]).map((p) => ({ value: p, label: TASK_PRIORITY_LABEL[p] })),
];

function ListSkeleton() {
  return (
    <Card className="divide-y divide-border">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-4">
          <Skeleton className="size-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      ))}
    </Card>
  );
}

export default function TasksPage() {
  const { startup } = useStartup();
  const tasks = useAsync(() => taskService.list(startup.id), [startup.id]);
  const directory = useDirectory(startup.id);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [department, setDepartment] = useState("all");
  const deferredSearch = useDeferredValue(search);

  // The drawer keeps showing the last task while it slides closed
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return (tasks.data ?? []).filter(
      (t) =>
        (status === "all" || t.status === status) &&
        (priority === "all" || t.priority === priority) &&
        (department === "all" || t.departmentId === department) &&
        (!q || `${t.title} ${t.description}`.toLowerCase().includes(q)),
    );
  }, [tasks.data, deferredSearch, status, priority, department]);

  const departmentOptions = [
    { value: "all", label: "All departments" },
    ...(directory.data?.departments ?? []).map((d) => ({ value: d.id, label: d.name })),
  ];
  const hasFilters = search !== "" || status !== "all" || priority !== "all" || department !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setDepartment("all");
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Every task across your startup, with owners and statuses. Select a task to see its full story."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          aria-label="Search tasks"
          placeholder="Search tasks"
          leftIcon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select aria-label="Filter by status" options={STATUS_FILTER} value={status} onChange={(e) => setStatus(e.target.value)} />
        <Select aria-label="Filter by priority" options={PRIORITY_FILTER} value={priority} onChange={(e) => setPriority(e.target.value)} />
        <Select aria-label="Filter by department" options={departmentOptions} value={department} onChange={(e) => setDepartment(e.target.value)} />
      </div>

      <AsyncView
        state={tasks}
        loading={<ListSkeleton />}
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={ListChecks}
            title="No tasks yet"
            description="Once the plan is ready, your departments will create tasks here."
          />
        }
      >
        {(all) =>
          filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No tasks match these filters"
              description="Try a different search or clear the filters."
              action={
                hasFilters ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="mb-3 text-xs text-text-muted" aria-live="polite">
                Showing {filtered.length} of {all.length} tasks
              </p>
              <Card>
                <ul className="divide-y divide-border">
                  {filtered.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      departmentName={departmentName(directory.data, task.departmentId)}
                      assignee={assigneeOf(directory.data, task)}
                      onOpen={(id) => {
                        setSelectedId(id);
                        setDrawerOpen(true);
                      }}
                    />
                  ))}
                </ul>
              </Card>
            </>
          )
        }
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
"use client";

import { useState, type ReactNode } from "react";
import { AlertTriangle, Link2, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AsyncView } from "@/components/ui/async-view";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { DELIVERABLE_TYPE_LABEL, TASK_STATUS_LABEL } from "@/lib/labels";
import { useAsync } from "@/lib/use-async";
import { assigneeOf, creatorOf, departmentName, type DirectoryData } from "@/lib/use-directory";
import { deliverableService, taskService } from "@/services";
import type { Task, TaskStatus } from "@/types";

const STATUS_OPTIONS = (Object.keys(TASK_STATUS_LABEL) as TaskStatus[]).map((s) => ({
  value: s,
  label: TASK_STATUS_LABEL[s],
}));

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{children}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2.5 text-xs font-semibold text-text-muted">{title}</h3>
      {children}
    </section>
  );
}

interface TaskDrawerProps {
  task: Task | undefined;
  open: boolean;
  onClose: () => void;
  allTasks: Task[];
  directory: DirectoryData | undefined;
  /** Called after the status changes so the list can refresh. */
  onChanged: () => void;
}

export function TaskDrawer({ task, open, onClose, allTasks, directory, onChanged }: TaskDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="lg"
      title={task?.title ?? "Task"}
      description={task ? departmentName(directory, task.departmentId) : undefined}
    >
      {task && <TaskDetails key={task.id} task={task} allTasks={allTasks} directory={directory} onChanged={onChanged} />}
    </Drawer>
  );
}

function TaskDetails({ task, allTasks, directory, onChanged }: Omit<TaskDrawerProps, "open" | "onClose" | "task"> & { task: Task }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const assignee = assigneeOf(directory, task);

  // Status is in the deps so the timeline refreshes after a change
  const events = useAsync(() => taskService.listEvents(task.id), [task.id, task.status]);
  const deliverables = useAsync(() => deliverableService.list(task.startupId, { taskId: task.id }), [task.id, task.startupId]);

  const dependencies = task.dependencyIds
    .map((id) => allTasks.find((t) => t.id === id))
    .filter((t): t is Task => t !== undefined);

  async function changeStatus(status: TaskStatus) {
    setSaving(true);
    try {
      await taskService.updateStatus(task.id, status);
      toast({ title: "Status updated", description: `Now "${TASK_STATUS_LABEL[status]}".`, variant: "success" });
      onChanged();
    } catch {
      toast({ title: "Could not update the status", description: "Please try again.", variant: "danger" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge type="task" status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {task.blockedReason && (
        <div role="note" className="flex gap-3 rounded-xl bg-danger-soft p-3.5 text-sm text-danger">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{task.blockedReason}</p>
        </div>
      )}

      <p className="leading-relaxed text-text-muted">{task.description}</p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
        <Fact label="Assigned to">
          <span className="flex items-center gap-2">
            <Avatar name={assignee.name} variant={assignee.variant} size="xs" />
            {assignee.name}
          </span>
        </Fact>
        <Fact label="Department">{departmentName(directory, task.departmentId)}</Fact>
        <Fact label="Due">{task.dueDate ? formatDate(task.dueDate) : "No due date"}</Fact>
        <Fact label="Created">{formatRelativeTime(task.createdAt)}</Fact>
      </dl>

      {task.creationReason && (
        <Section title="Why this task exists">
          <div className="flex gap-3 rounded-xl bg-primary-soft p-3.5 text-sm">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p>
              <span className="font-medium">{creatorOf(directory, task)}</span> created this task. {task.creationReason}
            </p>
          </div>
        </Section>
      )}

      <Select
        label="Change status"
        value={task.status}
        options={STATUS_OPTIONS}
        disabled={saving}
        onChange={(e) => void changeStatus(e.target.value as TaskStatus)}
        hint="Updating the status is recorded in the timeline."
      />

      {dependencies.length > 0 && (
        <Section title="Depends on">
          <ul className="space-y-2">
            {dependencies.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5">
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <Link2 className="size-4 shrink-0 text-text-muted" aria-hidden />
                  <span className="truncate">{d.title}</span>
                </span>
                <StatusBadge type="task" status={d.status} size="sm" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Deliverables">
        <AsyncView
          state={deliverables}
          loading={<Skeleton className="h-14 w-full rounded-xl" />}
          isEmpty={(list) => list.length === 0}
          empty={<p className="text-sm text-text-muted">Nothing delivered for this task yet.</p>}
        >
          {(list) => (
            <ul className="space-y-2">
              {list.map((d) => (
                <li key={d.id} className="rounded-xl border border-border px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{d.title}</p>
                    <Badge size="sm">{DELIVERABLE_TYPE_LABEL[d.type]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{d.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </AsyncView>
      </Section>

      <Section title="Timeline">
        <AsyncView
          state={events}
          loading={<Skeleton className="h-32 w-full rounded-xl" />}
          isEmpty={(list) => list.length === 0}
          empty={<p className="text-sm text-text-muted">No activity on this task yet.</p>}
        >
          {(list) => (
            <ol className="relative space-y-5 border-l border-border pl-5">
              {list.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-surface" aria-hidden />
                  <p className="text-sm leading-snug">{e.summary}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {e.actor.name} · {formatRelativeTime(e.at)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </AsyncView>
      </Section>
    </div>
  );
}   
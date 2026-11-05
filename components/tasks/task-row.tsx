import { Avatar } from "@/components/ui/avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelativeTime } from "@/lib/format";
import type { PersonRef } from "@/lib/use-directory";
import type { Task } from "@/types";

interface TaskRowProps {
  task: Task;
  departmentName: string;
  assignee: PersonRef;
  onOpen: (taskId: string) => void;
}

/** One task in a list. The whole row opens the task drawer. */
export function TaskRow({ task, departmentName, assignee, onOpen }: TaskRowProps) {
  const overdue = task.dueDate && task.status !== "completed" && new Date(task.dueDate).getTime() < Date.now();

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(task.id)}
        className="flex w-full flex-col gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={assignee.name} variant={assignee.variant} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{task.title}</span>
            <span className="mt-0.5 block truncate text-xs text-text-muted">
              {departmentName} · {assignee.name}
              {task.dueDate && (
                <span className={overdue ? "text-danger" : undefined}>
                  {" "}
                  · Due {formatRelativeTime(task.dueDate)}
                </span>
              )}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 flex-wrap items-center gap-2 pl-11 sm:pl-0">
          <PriorityBadge priority={task.priority} size="sm" />
          <StatusBadge type="task" status={task.status} size="sm" />
        </span>
      </button>
    </li>
  );
}
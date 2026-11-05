import Link from "next/link";
import {
  Activity as ActivityIcon,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  FileCheck,
  Flag,
  Info,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/lib/format";
import type { ActivityItem } from "@/types";

const KIND: Record<ActivityItem["kind"], { icon: LucideIcon; tone: string }> = {
  task_completed: { icon: CheckCircle2, tone: "bg-success-soft text-success" },
  task_started: { icon: PlayCircle, tone: "bg-primary-soft text-primary" },
  issue_found: { icon: AlertTriangle, tone: "bg-warning-soft text-warning" },
  deliverable_ready: { icon: FileCheck, tone: "bg-info-soft text-info" },
  approval_needed: { icon: Clock, tone: "bg-warning-soft text-warning" },
  milestone: { icon: Flag, tone: "bg-primary-soft text-primary" },
  blocker: { icon: Ban, tone: "bg-danger-soft text-danger" },
  info: { icon: Info, tone: "bg-surface-muted text-text-muted" },
};

/** Fallback icon, exported for empty states. */
export { ActivityIcon };

interface ActivityRowProps {
  item: ActivityItem;
  startupId: string;
  departmentName?: string;
}

/** One line of the activity timeline. Links to the related approval or task when there is one. */
export function ActivityRow({ item, startupId, departmentName }: ActivityRowProps) {
  const { icon: Icon, tone } = KIND[item.kind];
  const target = item.approvalId
    ? `/s/${startupId}/approvals`
    : item.taskId
      ? `/s/${startupId}/tasks`
      : undefined;

  const body = (
    <>
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", tone)}>
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-snug">{item.message}</span>
        <span className="mt-0.5 block text-xs text-text-muted">
          {departmentName ? `${departmentName} · ` : ""}
          {formatRelativeTime(item.at)}
        </span>
      </span>
    </>
  );

  return (
    <li>
      {target ? (
        <Link
          href={target}
          className="-mx-2 flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface-muted"
        >
          {body}
        </Link>
      ) : (
        <div className="-mx-2 flex items-start gap-3 px-2 py-2.5">{body}</div>
      )}
    </li>
  );
}
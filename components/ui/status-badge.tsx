import {
  Ban,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  Hourglass,
  Loader2,
  UserCheck,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import {
  AGENT_STATUS_LABEL,
  APPROVAL_STATUS_LABEL,
  DEPARTMENT_STATUS_LABEL,
  TASK_STATUS_LABEL,
} from "@/lib/labels";
import { cn } from "@/lib/cn";
import type { AgentStatus, ApprovalStatus, DepartmentStatus, TaskStatus } from "@/types";
import { Badge, type BadgeVariant } from "./badge";

interface Look {
  label: string;
  variant: BadgeVariant;
  icon: LucideIcon;
  spin?: boolean;
}

const TASK: Record<TaskStatus, Look> = {
  planned: { label: TASK_STATUS_LABEL.planned, variant: "neutral", icon: CalendarClock },
  pending: { label: TASK_STATUS_LABEL.pending, variant: "neutral", icon: Hourglass },
  working: { label: TASK_STATUS_LABEL.working, variant: "primary", icon: Loader2, spin: true },
  waiting_team: { label: TASK_STATUS_LABEL.waiting_team, variant: "info", icon: Users },
  waiting_approval: { label: TASK_STATUS_LABEL.waiting_approval, variant: "warning", icon: UserCheck },
  blocked: { label: TASK_STATUS_LABEL.blocked, variant: "danger", icon: Ban },
  completed: { label: TASK_STATUS_LABEL.completed, variant: "success", icon: CheckCircle2 },
  failed: { label: TASK_STATUS_LABEL.failed, variant: "danger", icon: XCircle },
};

const DEPARTMENT: Record<DepartmentStatus, Look> = {
  planned: { label: DEPARTMENT_STATUS_LABEL.planned, variant: "neutral", icon: CalendarClock },
  working: { label: DEPARTMENT_STATUS_LABEL.working, variant: "primary", icon: Loader2, spin: true },
  waiting: { label: DEPARTMENT_STATUS_LABEL.waiting, variant: "warning", icon: Clock },
  completed: { label: DEPARTMENT_STATUS_LABEL.completed, variant: "success", icon: CheckCircle2 },
  blocked: { label: DEPARTMENT_STATUS_LABEL.blocked, variant: "danger", icon: Ban },
};

const AGENT: Record<AgentStatus, Look> = {
  idle: { label: AGENT_STATUS_LABEL.idle, variant: "neutral", icon: Circle },
  working: { label: AGENT_STATUS_LABEL.working, variant: "primary", icon: Loader2, spin: true },
  waiting: { label: AGENT_STATUS_LABEL.waiting, variant: "warning", icon: Clock },
  blocked: { label: AGENT_STATUS_LABEL.blocked, variant: "danger", icon: Ban },
};

const APPROVAL: Record<ApprovalStatus, Look> = {
  pending: { label: APPROVAL_STATUS_LABEL.pending, variant: "warning", icon: Clock },
  approved: { label: APPROVAL_STATUS_LABEL.approved, variant: "success", icon: CheckCircle2 },
  rejected: { label: APPROVAL_STATUS_LABEL.rejected, variant: "danger", icon: XCircle },
  info_requested: { label: APPROVAL_STATUS_LABEL.info_requested, variant: "info", icon: HelpCircle },
};

export type StatusBadgeProps = (
  | { type: "task"; status: TaskStatus }
  | { type: "department"; status: DepartmentStatus }
  | { type: "agent"; status: AgentStatus }
  | { type: "approval"; status: ApprovalStatus }
) & { size?: "sm" | "md"; className?: string };

function lookFor(props: StatusBadgeProps): Look {
  switch (props.type) {
    case "task":
      return TASK[props.status];
    case "department":
      return DEPARTMENT[props.status];
    case "agent":
      return AGENT[props.status];
    case "approval":
      return APPROVAL[props.status];
  }
}

/** Maps any status enum to a color, icon and human-readable label. */
export function StatusBadge(props: StatusBadgeProps) {
  const { label, variant, icon: Icon, spin } = lookFor(props);
  return (
    <Badge variant={variant} size={props.size} className={props.className}>
      <Icon className={cn(props.size === "sm" ? "size-3" : "size-3.5", spin && "animate-spin motion-reduce:animate-none")} aria-hidden />
      {label}
    </Badge>
  );
}
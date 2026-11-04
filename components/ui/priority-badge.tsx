import { ArrowDown, ArrowUp, Flame, Minus, type LucideIcon } from "lucide-react";
import { TASK_PRIORITY_LABEL } from "@/lib/labels";
import type { TaskPriority } from "@/types";
import { Badge, type BadgeVariant } from "./badge";

const LOOK: Record<TaskPriority, { variant: BadgeVariant; icon: LucideIcon }> = {
  low: { variant: "neutral", icon: ArrowDown },
  medium: { variant: "info", icon: Minus },
  high: { variant: "warning", icon: ArrowUp },
  urgent: { variant: "danger", icon: Flame },
};

export function PriorityBadge({
  priority,
  size,
  className,
}: {
  priority: TaskPriority;
  size?: "sm" | "md";
  className?: string;
}) {
  const { variant, icon } = LOOK[priority];
  return (
    <Badge variant={variant} icon={icon} size={size} className={className}>
      {TASK_PRIORITY_LABEL[priority]}
    </Badge>
  );
}
import { KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import { APPROVAL_CATEGORY_LABEL } from "@/lib/labels";
import type { ApprovalRequest } from "@/types";

interface ApprovalCardProps {
  approval: ApprovalRequest;
  departmentName: string;
  onOpen: (id: string) => void;
}

export function ApprovalCard({ approval, departmentName, onOpen }: ApprovalCardProps) {
  const { costEstimate } = approval;
  return (
    <li>
      <button type="button" onClick={() => onOpen(approval.id)} className="block w-full rounded-2xl text-left">
        <Card interactive className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold leading-snug">{approval.title}</h2>
              <p className="mt-1 text-xs text-text-muted">
                {departmentName} · {formatRelativeTime(approval.createdAt)}
              </p>
            </div>
            <StatusBadge type="approval" status={approval.status} size="sm" />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">{approval.what}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge size="sm">{APPROVAL_CATEGORY_LABEL[approval.category]}</Badge>
            {costEstimate && (
              <Badge variant="warning" size="sm">
                {formatCurrency(costEstimate.amount, costEstimate.currency, costEstimate.recurring)}
              </Badge>
            )}
            {approval.requiresSecureInput && (
              <Badge variant="info" size="sm" icon={KeyRound}>
                Secure entry
              </Badge>
            )}
          </div>
        </Card>
      </button>
    </li>
  );
}
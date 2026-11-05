"use client";

import Link from "next/link";
import { KeyRound, PartyPopper } from "lucide-react";
import { AsyncView } from "@/components/ui/async-view";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import { APPROVAL_CATEGORY_LABEL } from "@/lib/labels";
import type { AsyncState } from "@/lib/use-async";
import type { ApprovalRequest, Department } from "@/types";
import { DashboardCard, RowsSkeleton } from "./dashboard-card";

interface PendingApprovalsProps {
  startupId: string;
  approvals: AsyncState<ApprovalRequest[]>;
  departments: AsyncState<Department[]>;
}

export function PendingApprovals({ startupId, approvals, departments }: PendingApprovalsProps) {
  const names = new Map((departments.data ?? []).map((d) => [d.id, d.name]));

  return (
    <DashboardCard title="Needs your approval" href={`/s/${startupId}/approvals`}>
      <AsyncView
        state={approvals}
        loading={<RowsSkeleton rows={3} />}
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={PartyPopper}
            title="You are all caught up"
            description="When your team needs a decision, it will show up here."
            className="py-8"
          />
        }
      >
        {(list) => (
          <ul className="space-y-3">
            {list.slice(0, 3).map((a) => (
              <li key={a.id}>
                <Link
                  href={`/s/${startupId}/approvals`}
                  className="block rounded-xl border border-border p-3.5 transition-colors hover:bg-surface-muted"
                >
                  <p className="text-sm font-medium leading-snug">{a.title}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {names.get(a.departmentId) ?? "Your team"} · {formatRelativeTime(a.createdAt)}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <Badge variant="neutral" size="sm">
                      {APPROVAL_CATEGORY_LABEL[a.category]}
                    </Badge>
                    {a.costEstimate && (
                      <Badge variant="warning" size="sm">
                        {formatCurrency(a.costEstimate.amount, a.costEstimate.currency, a.costEstimate.recurring)}
                      </Badge>
                    )}
                    {a.requiresSecureInput && (
                      <Badge variant="info" size="sm" icon={KeyRound}>
                        Secure entry
                      </Badge>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AsyncView>
    </DashboardCard>
  );
}
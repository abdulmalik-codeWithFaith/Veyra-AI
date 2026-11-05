"use client";

import { useState } from "react";
import { ExternalLink, FileText, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { AsyncView } from "@/components/ui/async-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Select } from "@/components/ui/select";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { Tabs, tabPanelProps } from "@/components/ui/tabs";
import { formatCompactNumber, formatCurrency, formatDate, formatRelativeTime } from "@/lib/format";
import { DELIVERABLE_TYPE_LABEL } from "@/lib/labels";
import { useAsync } from "@/lib/use-async";
import { departmentName, useDirectory } from "@/lib/use-directory";
import { deliverableService, usageService } from "@/services";
import type { DeliverableType } from "@/types";

const TYPE_FILTER = [
  { value: "all", label: "All types" },
  ...(Object.keys(DELIVERABLE_TYPE_LABEL) as DeliverableType[]).map((t) => ({ value: t, label: DELIVERABLE_TYPE_LABEL[t] })),
];

export default function ReportsPage() {
  const { startup } = useStartup();
  const [tab, setTab] = useState("spending");
  const [type, setType] = useState("all");

  const usage = useAsync(() => usageService.get(startup.id), [startup.id]);
  const deliverables = useAsync(() => deliverableService.list(startup.id), [startup.id]);
  const directory = useDirectory(startup.id);

  const shownDeliverables = (deliverables.data ?? []).filter((d) => type === "all" || d.type === type);

  return (
    <>
      <PageHeader title="Reports" description="What your startup has spent and everything your team has delivered." />

      <Tabs
        label="Report sections"
        idPrefix="reports"
        value={tab}
        onValueChange={setTab}
        items={[
          { id: "spending", label: "Spending", icon: TrendingUp },
          { id: "deliverables", label: "Deliverables", icon: FileText, count: deliverables.data?.length },
        ]}
      />

      <div {...tabPanelProps("reports", tab)} className="mt-6 outline-none">
        {tab === "spending" ? (
          <AsyncView
            state={usage}
            loading={
              <div className="grid gap-4 md:grid-cols-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            }
            isEmpty={(u) => u.totalCost === 0}
            empty={
              <EmptyState
                icon={TrendingUp}
                title="No spending yet"
                description="Costs from your team's work will appear here as soon as they start."
              />
            }
          >
            {(u) => {
              const sorted = [...u.byDepartment].sort((a, b) => b.cost - a.cost);
              const max = sorted[0]?.cost ?? 1;
              return (
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="h-fit p-5">
                    <p className="text-sm text-text-muted">Spent this period</p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCurrency(u.totalCost, u.currency)}</p>
                    {u.budgetLimit ? (
                      <>
                        <ProgressBar
                          label="Budget used"
                          value={(u.totalCost / u.budgetLimit) * 100}
                          showLabel
                          tone={u.totalCost / u.budgetLimit > 0.85 ? "danger" : "primary"}
                          className="mt-5"
                        />
                        <p className="mt-3 text-xs text-text-muted">
                          {formatCurrency(u.budgetLimit - u.totalCost, u.currency)} left of your {formatCurrency(u.budgetLimit, u.currency)} budget
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-xs text-text-muted">No budget limit is set.</p>
                    )}
                    <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
                      <div>
                        <dt className="text-xs text-text-muted">Work processed</dt>
                        <dd className="mt-1 font-semibold">{formatCompactNumber(u.tokensUsed)} tokens</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-text-muted">Period</dt>
                        <dd className="mt-1 font-semibold">
                          {formatDate(u.periodStart)} to {formatDate(u.periodEnd)}
                        </dd>
                      </div>
                    </dl>
                  </Card>

                  <Card className="p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold">Spending by department</h2>
                    <ul className="mt-5 space-y-5">
                      {sorted.map((row) => (
                        <li key={row.departmentId}>
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="font-medium">{departmentName(directory.data, row.departmentId)}</span>
                            <span className="text-text-muted">{formatCurrency(row.cost, u.currency)}</span>
                          </div>
                          <ProgressBar
                            label={`${departmentName(directory.data, row.departmentId)} spending`}
                            value={(row.cost / max) * 100}
                            size="sm"
                          />
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              );
            }}
          </AsyncView>
        ) : (
          <>
            <div className="mb-5 max-w-xs">
              <Select aria-label="Filter by type" options={TYPE_FILTER} value={type} onChange={(e) => setType(e.target.value)} />
            </div>
            <AsyncView
              state={deliverables}
              loading={<Skeleton className="h-64 w-full rounded-2xl" />}
              isEmpty={() => shownDeliverables.length === 0}
              empty={
                <EmptyState
                  icon={FileText}
                  title={type === "all" ? "Nothing delivered yet" : "No deliverables of this type"}
                  description={
                    type === "all"
                      ? "Finished work from your departments will be listed here with proof of completion."
                      : "Try another type."
                  }
                />
              }
            >
              {() => (
                <ul className="grid gap-4 md:grid-cols-2">
                  {shownDeliverables.map((d) => (
                    <li key={d.id}>
                      <Card className="flex h-full flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-sm font-semibold leading-snug">{d.title}</h2>
                          <Badge size="sm">{DELIVERABLE_TYPE_LABEL[d.type]}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-text-muted">{d.summary}</p>
                        {d.evidence && (
                          <p className="mt-3 rounded-lg bg-success-soft px-3 py-2 text-xs text-success">
                            Proof of completion: {d.evidence}
                          </p>
                        )}
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-xs text-text-muted">
                          <span>
                            {departmentName(directory.data, d.departmentId)} · {formatRelativeTime(d.createdAt)}
                          </span>
                          {d.url && (
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover"
                            >
                              Open
                              <ExternalLink className="size-3" aria-hidden />
                              <span className="sr-only">(opens in a new tab)</span>
                            </a>
                          )}
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </AsyncView>
          </>
        )}
      </div>
    </>
  );
}
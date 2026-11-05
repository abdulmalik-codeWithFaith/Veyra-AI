"use client";

import { useState } from "react";
import { ExternalLink, FileSearch } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { AsyncView } from "@/components/ui/async-view";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { Tabs, tabPanelProps } from "@/components/ui/tabs";
import { formatRelativeTime } from "@/lib/format";
import { ANALYSIS_KIND_LABEL, ANALYSIS_STATUS_LABEL } from "@/lib/labels";
import { useAsync } from "@/lib/use-async";
import { analysisService } from "@/services";
import type { AnalysisItemKind } from "@/types";

const KIND_VARIANT: Record<AnalysisItemKind, BadgeVariant> = {
  verified: "success",
  assumption: "warning",
  recommendation: "primary",
};

const KIND_HELP: Record<AnalysisItemKind, string> = {
  verified: "Backed by a source you can check.",
  assumption: "Something we believe but have not proven yet. Worth challenging.",
  recommendation: "What Veyra suggests you do about it.",
};

export default function AnalysisPage() {
  const { startup } = useStartup();
  const analysis = useAsync(() => analysisService.get(startup.id), [startup.id]);
  const [tab, setTab] = useState("all");

  return (
    <>
      <PageHeader
        title="Business Analysis"
        description="What is verified, what is assumed, and what Veyra recommends."
        actions={
          analysis.data && (
            <Badge variant={analysis.data.status === "ready" ? "success" : "neutral"} dot>
              {ANALYSIS_STATUS_LABEL[analysis.data.status]}
            </Badge>
          )
        }
      />

      <AsyncView
        state={analysis}
        loading={
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }
        isEmpty={(a) => a.status === "not_started" || a.sections.length === 0}
        empty={
          <EmptyState
            icon={FileSearch}
            title="The analysis has not started yet"
            description="Veyra researches your market once your idea is submitted. The results will appear here."
          />
        }
      >
        {(a) => {
          const all = a.sections.flatMap((s) => s.items);
          const count = (k: AnalysisItemKind) => all.filter((i) => i.kind === k).length;
          const visibleKind = tab === "all" ? null : (tab as AnalysisItemKind);

          return (
            <>
              <p className="mb-5 text-xs text-text-muted">Last updated {formatRelativeTime(a.updatedAt)}</p>

              <ul className="mb-6 grid gap-3 sm:grid-cols-3">
                {(Object.keys(KIND_VARIANT) as AnalysisItemKind[]).map((k) => (
                  <li key={k}>
                    <Card className="h-full p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={KIND_VARIANT[k]}>{ANALYSIS_KIND_LABEL[k]}</Badge>
                        <span className="text-2xl font-semibold">{count(k)}</span>
                      </div>
                      <p className="mt-2 text-xs text-text-muted">{KIND_HELP[k]}</p>
                    </Card>
                  </li>
                ))}
              </ul>

              <Tabs
                label="Filter analysis"
                idPrefix="analysis"
                value={tab}
                onValueChange={setTab}
                items={[
                  { id: "all", label: "All", count: all.length },
                  { id: "verified", label: "Verified", count: count("verified") },
                  { id: "assumption", label: "Assumptions", count: count("assumption") },
                  { id: "recommendation", label: "Recommendations", count: count("recommendation") },
                ]}
              />

              <div {...tabPanelProps("analysis", tab)} className="mt-6 space-y-5 outline-none">
                {a.sections.map((section) => {
                  const items = section.items.filter((i) => !visibleKind || i.kind === visibleKind);
                  if (items.length === 0) return null;
                  return (
                    <Card key={section.id} className="p-5">
                      <h2 className="text-sm font-semibold">{section.title}</h2>
                      <ul className="mt-4 divide-y divide-border">
                        {items.map((item) => (
                          <li key={item.id} className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
                            <Badge variant={KIND_VARIANT[item.kind]} size="sm" className="w-fit sm:mt-0.5 sm:w-32 sm:justify-center">
                              {ANALYSIS_KIND_LABEL[item.kind]}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm leading-relaxed">{item.text}</p>
                              {item.sourceUrl && (
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
                                >
                                  View source
                                  <ExternalLink className="size-3" aria-hidden />
                                  <span className="sr-only">(opens in a new tab)</span>
                                </a>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  );
                })}
              </div>
            </>
          );
        }}
      </AsyncView>
    </>
  );
}
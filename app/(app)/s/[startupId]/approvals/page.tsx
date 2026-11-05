"use client";

import { useState } from "react";
import { PartyPopper, ShieldCheck } from "lucide-react";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { ApprovalDrawer } from "@/components/approvals/approval-drawer";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { AsyncView } from "@/components/ui/async-view";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Tabs, tabPanelProps } from "@/components/ui/tabs";
import { useAsync } from "@/lib/use-async";
import { departmentName, useDirectory } from "@/lib/use-directory";
import { approvalService } from "@/services";

export default function ApprovalsPage() {
  const { startup, refreshApprovals, refreshNotifications } = useStartup();
  const approvals = useAsync(() => approvalService.list(startup.id), [startup.id]);
  const directory = useDirectory(startup.id);

  const [tab, setTab] = useState("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const all = approvals.data ?? [];
  const waiting = all.filter((a) => a.status === "pending");
  const decided = all.filter((a) => a.status !== "pending");
  const shown = tab === "pending" ? waiting : decided;

  function open(id: string) {
    setSelectedId(id);
    setDrawerOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Approvals"
        description="Spending, publishing and account access always wait for you. Each request explains what, why and what changes."
      />

      <Tabs
        label="Approval status"
        idPrefix="approvals"
        value={tab}
        onValueChange={setTab}
        items={[
          { id: "pending", label: "Waiting for you", count: approvals.data ? waiting.length : undefined },
          { id: "decided", label: "Decided", count: approvals.data ? decided.length : undefined },
        ]}
      />

      <div {...tabPanelProps("approvals", tab)} className="mt-6 outline-none">
        <AsyncView
          state={approvals}
          loading={
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
          isEmpty={() => shown.length === 0}
          empty={
            tab === "pending" ? (
              <EmptyState
                icon={PartyPopper}
                title="You are all caught up"
                description="When your team needs a decision from you, it will show up here."
              />
            ) : (
              <EmptyState
                icon={ShieldCheck}
                title="No decisions yet"
                description="Requests you approve or decline will be listed here."
              />
            )
          }
        >
          {() => (
            <ul className="space-y-4">
              {shown.map((a) => (
                <ApprovalCard key={a.id} approval={a} departmentName={departmentName(directory.data, a.departmentId)} onOpen={open} />
              ))}
            </ul>
          )}
        </AsyncView>
      </div>

      <ApprovalDrawer
        approval={all.find((a) => a.id === selectedId)}
        departmentName={departmentName(directory.data, all.find((a) => a.id === selectedId)?.departmentId ?? "")}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onDecided={() => {
          approvals.reload();
          refreshApprovals();
          refreshNotifications();
        }}
      />
    </>
  );
}
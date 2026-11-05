"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, HelpCircle, Lock, ShieldAlert, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/format";
import { APPROVAL_CATEGORY_LABEL } from "@/lib/labels";
import { approvalService } from "@/services";
import type { ApprovalDecision } from "@/services";
import type { ApprovalRequest } from "@/types";

type Decision = ApprovalDecision["decision"];

function Block({ title, tone, children }: { title: string; tone?: "success" | "danger"; children: ReactNode }) {
  const toneClass = tone === "success" ? "bg-success-soft" : tone === "danger" ? "bg-danger-soft" : "bg-surface-muted";
  return (
    <div className={`rounded-xl px-4 py-3.5 ${toneClass}`}>
      <h3 className="text-xs font-medium text-text-muted">{title}</h3>
      <div className="mt-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

interface ApprovalDrawerProps {
  approval: ApprovalRequest | undefined;
  departmentName: string;
  open: boolean;
  onClose: () => void;
  /** Called after a decision so lists and the sidebar badge refresh. */
  onDecided: () => void;
}

export function ApprovalDrawer({ approval, departmentName, open, onClose, onDecided }: ApprovalDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} width="lg" title={approval?.title ?? "Approval"} description={approval ? departmentName : undefined}>
      {approval && <ApprovalDetails key={approval.id} approval={approval} onClose={onClose} onDecided={onDecided} />}
    </Drawer>
  );
}

function ApprovalDetails({
  approval,
  onClose,
  onDecided,
}: {
  approval: ApprovalRequest;
  onClose: () => void;
  onDecided: () => void;
}) {
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string>();
  const [secret, setSecret] = useState("");
  const [secretError, setSecretError] = useState<string>();
  const [confirmingDecline, setConfirmingDecline] = useState(false);
  const [submitting, setSubmitting] = useState<Decision | null>(null);

  const pending = approval.status === "pending";
  const { costEstimate } = approval;

  async function decide(decision: Decision) {
    if (decision === "approved" && approval.requiresSecureInput && !secret.trim()) {
      setSecretError("Enter the details in the secure form to approve.");
      return;
    }
    if (decision === "info_requested" && !note.trim()) {
      setNoteError("Write your question so the team knows what to clarify.");
      return;
    }

    setSubmitting(decision);
    try {
      // The secret is intentionally NOT passed to decide(): a real backend receives it through a
      // dedicated secure endpoint, and it must never appear in activity, logs or this decision record.
      await approvalService.decide(approval.id, { decision, note: note.trim() || undefined });
      setSecret("");
      toast({
        title: decision === "approved" ? "Approved" : decision === "rejected" ? "Declined" : "Question sent",
        description:
          decision === "approved"
            ? "Your team can continue."
            : decision === "rejected"
              ? "Your team has been told."
              : "Your team will reply with more information.",
        variant: decision === "approved" ? "success" : "info",
      });
      onDecided();
      onClose();
    } catch {
      toast({ title: "Could not save your decision", description: "Please try again.", variant: "danger" });
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge type="approval" status={approval.status} />
        <Badge>{APPROVAL_CATEGORY_LABEL[approval.category]}</Badge>
      </div>

      <div className="space-y-3">
        <Block title="What">{approval.what}</Block>
        <Block title="Why it is needed">{approval.why}</Block>
        <Block title="If you approve" tone="success">
          {approval.ifApproved}
        </Block>
        <Block title="If you decline" tone="danger">
          {approval.ifRejected}
        </Block>
      </div>

      {costEstimate && (
        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
          <span className="text-sm text-text-muted">Estimated cost</span>
          <span className="text-base font-semibold">
            {formatCurrency(costEstimate.amount, costEstimate.currency, costEstimate.recurring)}
          </span>
        </div>
      )}

      {approval.risks && approval.risks.length > 0 && (
        <section>
          <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-text-muted">
            <ShieldAlert className="size-4" aria-hidden />
            Things to be aware of
          </h3>
          <ul className="space-y-2">
            {approval.risks.map((r) => (
              <li key={r} className="flex gap-2.5 text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warning" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!pending && (
        <div className="rounded-xl border border-border p-4 text-sm">
          <p className="font-medium">
            {approval.decidedAt ? `Decided on ${formatDate(approval.decidedAt)}` : "Decision recorded"}
          </p>
          {approval.founderNote && <p className="mt-1.5 text-text-muted">Your note: {approval.founderNote}</p>}
        </div>
      )}

      {pending && (
        <div className="space-y-5 border-t border-border pt-6">
          {approval.requiresSecureInput && (
            <div className="rounded-xl border border-border bg-surface-muted p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Lock className="size-4 text-primary" aria-hidden />
                Secure entry
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                What you enter here is sent securely and is never shown in activity, reports or logs.
              </p>
              <Input
                label="Payment provider secret key"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                  setSecretError(undefined);
                }}
                error={secretError}
                placeholder="Paste your key"
                className="mt-4"
              />
            </div>
          )}

          <Textarea
            label="Add a note (optional)"
            placeholder="Tell your team why, or ask your question here"
            rows={3}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteError(undefined);
            }}
            error={noteError}
          />

          {confirmingDecline ? (
            <div role="alertdialog" aria-label="Confirm decline" className="rounded-xl bg-danger-soft p-4">
              <p className="text-sm font-medium text-danger">Decline this request?</p>
              <p className="mt-1 text-xs text-text-muted">{approval.ifRejected}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="danger" size="sm" loading={submitting === "rejected"} onClick={() => void decide("rejected")}>
                  Yes, decline
                </Button>
                <Button variant="ghost" size="sm" disabled={submitting !== null} onClick={() => setConfirmingDecline(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button leftIcon={CheckCircle2} loading={submitting === "approved"} disabled={submitting !== null} onClick={() => void decide("approved")}>
                Approve
              </Button>
              <Button variant="secondary" leftIcon={HelpCircle} loading={submitting === "info_requested"} disabled={submitting !== null} onClick={() => void decide("info_requested")}>
                Ask a question
              </Button>
              <Button variant="ghost" leftIcon={XCircle} disabled={submitting !== null} onClick={() => setConfirmingDecline(true)} className="text-danger hover:text-danger">
                Decline
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
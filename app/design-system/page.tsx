"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  FileText,
  Inbox,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Drawer,
  Dropdown,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  PriorityBadge,
  ProgressBar,
  Select,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  StatusBadge,
  Tabs,
  tabPanelProps,
  Textarea,
  Tooltip,
  useToast,
  type BadgeVariant,
  type ButtonVariant,
} from "@/components/ui";
import type { AgentStatus, ApprovalStatus, DepartmentStatus, TaskPriority, TaskStatus } from "@/types";

/* Sample values used only to demonstrate components on this page. */
const BUTTON_VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "danger"];
const BADGE_VARIANTS: BadgeVariant[] = ["neutral", "primary", "success", "warning", "danger", "info"];
const TASK_STATUSES: TaskStatus[] = [
  "planned",
  "pending",
  "working",
  "waiting_team",
  "waiting_approval",
  "blocked",
  "completed",
  "failed",
];
const DEPARTMENT_STATUSES: DepartmentStatus[] = ["planned", "working", "waiting", "completed", "blocked"];
const AGENT_STATUSES: AgentStatus[] = ["idle", "working", "waiting", "blocked"];
const APPROVAL_STATUSES: ApprovalStatus[] = ["pending", "approved", "rejected", "info_requested"];
const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];
const DEPARTMENT_OPTIONS = [
  { value: "pm", label: "Product Management" },
  { value: "eng", label: "Engineering" },
  { value: "design", label: "Design" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold text-text-muted">{title}</h3>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2.5">{children}</div>;
}

/** Every component, in one column. Rendered twice (light and dark) by the page. */
function Showcase() {
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function simulateLoading() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="space-y-9">
      <Section title="Buttons">
        <Row>
          {BUTTON_VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v[0].toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Row>
        <Row>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button leftIcon={Plus}>With icon</Button>
          <Button variant="secondary" iconOnly leftIcon={Settings} aria-label="Settings" />
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={simulateLoading}>
            {loading ? "Saving" : "Click to load"}
          </Button>
        </Row>
      </Section>

      <Section title="Badges">
        <Row>
          {BADGE_VARIANTS.map((v) => (
            <Badge key={v} variant={v} dot>
              {v}
            </Badge>
          ))}
          <Badge variant="primary" icon={Sparkles} size="sm">
            Small with icon
          </Badge>
        </Row>
      </Section>

      <Section title="Task status">
        <Row>
          {TASK_STATUSES.map((s) => (
            <StatusBadge key={s} type="task" status={s} />
          ))}
        </Row>
      </Section>

      <Section title="Department, agent and approval status">
        <Row>
          {DEPARTMENT_STATUSES.map((s) => (
            <StatusBadge key={s} type="department" status={s} />
          ))}
        </Row>
        <Row>
          {AGENT_STATUSES.map((s) => (
            <StatusBadge key={s} type="agent" status={s} size="sm" />
          ))}
        </Row>
        <Row>
          {APPROVAL_STATUSES.map((s) => (
            <StatusBadge key={s} type="approval" status={s} />
          ))}
        </Row>
      </Section>

      <Section title="Priority">
        <Row>
          {PRIORITIES.map((p) => (
            <PriorityBadge key={p} priority={p} />
          ))}
        </Row>
      </Section>

      <Section title="Form controls">
        <div className="grid gap-4">
          <Input label="Startup name" placeholder="e.g. LocalFix" hint="You can change this later." />
          <Input label="Search" leftIcon={Search} placeholder="Search tasks" />
          <Input label="Email" defaultValue="not-an-email" error="Enter a valid email address." />
          <Select label="Department" options={DEPARTMENT_OPTIONS} placeholder="Choose a department" defaultValue="" />
          <Textarea label="Note to the team" placeholder="Add context for your decision" rows={3} />
          <Input label="Disabled" disabled defaultValue="Cannot edit" />
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs
          label="Example tabs"
          idPrefix="ds-tabs"
          value={tab}
          onValueChange={setTab}
          items={[
            { id: "overview", label: "Overview" },
            { id: "tasks", label: "Tasks", count: 12 },
            { id: "files", label: "Deliverables", count: 4 },
            { id: "locked", label: "Locked", disabled: true },
          ]}
        />
        <div {...tabPanelProps("ds-tabs", tab)} className="rounded-xl bg-surface-muted p-4 text-sm text-text-muted">
          Showing the &ldquo;{tab}&rdquo; panel. Use the arrow keys to move between tabs.
        </div>
      </Section>

      <Section title="Progress">
        <div className="space-y-4">
          <ProgressBar label="Overall progress" value={58} showLabel />
          <ProgressBar label="Design" value={100} tone="success" showLabel />
          <ProgressBar label="Budget used" value={36} tone="warning" size="sm" showLabel />
          <ProgressBar label="Over budget" value={92} tone="danger" size="lg" showLabel />
        </div>
      </Section>

      <Section title="Avatars">
        <Row>
          <Avatar name="Ada Okafor" size="lg" />
          <Avatar name="Tunde Bello" size="md" />
          <Avatar name="Kemi" variant="agent" size="lg" />
          <Avatar name="Maya" variant="agent" size="md" />
          <Avatar name="Leo" variant="agent" size="sm" />
          <Avatar name="Iris" variant="agent" size="xs" />
          <AvatarGroup
            people={[
              { name: "Maya", variant: "agent" },
              { name: "Kemi", variant: "agent" },
              { name: "Ada Okafor" },
              { name: "Tunde Bello" },
              { name: "Leo", variant: "agent" },
            ]}
          />
        </Row>
      </Section>

      <Section title="Cards">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Engineering</CardTitle>
              <CardDescription>Builds and ships the product.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBar label="Engineering progress" value={48} />
            </CardContent>
            <CardFooter>
              <StatusBadge type="department" status="working" size="sm" />
            </CardFooter>
          </Card>
          <Card interactive className="p-5">
            <p className="text-sm font-semibold">Interactive card</p>
            <p className="mt-1 text-sm text-text-muted">Lifts gently on hover.</p>
          </Card>
        </div>
      </Section>

      <Section title="Loading skeletons">
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <div className="space-y-3 rounded-2xl border border-border p-5">
            <Skeleton className="h-5 w-1/3" />
            <SkeletonText lines={3} />
          </div>
        </div>
      </Section>

      <Section title="Empty and error states">
        <div className="grid gap-4">
          <EmptyState
            icon={Inbox}
            title="No approvals waiting"
            description="When your team needs a decision from you, it will show up here."
            action={<Button leftIcon={FileText}>View past approvals</Button>}
          />
          <ErrorState onRetry={() => toast({ title: "Retrying", variant: "info" })} />
        </div>
      </Section>

      <Section title="Tooltip and dropdown">
        <Row>
          <Tooltip content="Notifications">
            <Button variant="secondary" iconOnly leftIcon={Bell} aria-label="Notifications" />
          </Tooltip>
          <Dropdown
            label="Account menu"
            trigger={<Avatar name="Ada Okafor" size="sm" />}
            triggerClassName="rounded-full"
            align="start"
            items={[
              { type: "label", label: "ada@localfix.io" },
              { label: "Profile", icon: UserIcon, onSelect: () => toast({ title: "Profile selected" }) },
              { label: "Settings", icon: Settings, onSelect: () => toast({ title: "Settings selected" }) },
              { type: "separator" },
              { label: "Sign out", icon: LogOut, danger: true, onSelect: () => toast({ title: "Signed out", variant: "warning" }) },
            ]}
          />
        </Row>
      </Section>

      <Section title="Modal, drawer and toasts">
        <Row>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open drawer
          </Button>
          <Button variant="ghost" onClick={() => toast({ title: "Task completed", description: "Design finished the brand kit.", variant: "success" })}>
            Success toast
          </Button>
          <Button variant="ghost" onClick={() => toast({ title: "Needs your approval", variant: "warning" })}>
            Warning toast
          </Button>
          <Button variant="ghost" onClick={() => toast({ title: "Could not save", description: "Please try again.", variant: "danger" })}>
            Error toast
          </Button>
        </Row>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Decline this request?"
        description="Engineering will pause this task until you decide otherwise."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              leftIcon={Trash2}
              onClick={() => {
                setModalOpen(false);
                toast({ title: "Request declined", variant: "info" });
              }}
            >
              Decline
            </Button>
          </>
        }
      >
        <Textarea label="Add a note (optional)" placeholder="Tell the team why" rows={3} />
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Build the booking system"
        description="Engineering · In progress"
      >
        <div className="space-y-4">
          <Row>
            <StatusBadge type="task" status="working" />
            <PriorityBadge priority="high" />
          </Row>
          <p className="text-text-muted">
            Let customers pick a time and a technician, and confirm a booking. Task details will live here.
          </p>
          <ProgressBar label="Task progress" value={64} showLabel />
        </div>
      </Drawer>
    </div>
  );
}

function ThemePanel({ theme }: { theme: "light" | "dark" }) {
  return (
    // Forcing the .light / .dark class re-scopes all colour tokens for this subtree only
    <div className={`${theme} rounded-3xl border border-border bg-background p-6 text-text sm:p-8`}>
      <p className="mb-8 text-sm font-semibold">{theme === "light" ? "Light mode" : "Dark mode"}</p>
      <Showcase />
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Veyra design system</h1>
          <p className="mt-1 text-sm text-text-muted">
            Every component and variant, shown in light and dark. Temporary page, not part of the navigation.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <ThemePanel theme="light" />
        <ThemePanel theme="dark" />
      </div>

      <p className="mt-6 text-xs text-text-muted">
        The modal, drawer and toasts open above the page, so they follow the page theme (use the toggle above) rather
        than the panel they were triggered from.
      </p>
    </div>
  );
}
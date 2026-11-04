/**
 * Shared domain types for Veyra.
 * A backend will be built to match these exactly: do NOT rename fields.
 */

export type ID = string;
export type ISODate = string;

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: ISODate;
}

export type StartupStage =
  | "idea"
  | "analysis"
  | "planning"
  | "building"
  | "launching"
  | "live"
  | "growing";

export interface Startup {
  id: ID;
  name: string;
  tagline?: string;
  ideaSummary: string;
  stage: StartupStage;
  progress: number; // 0-100
  createdAt: ISODate;
  ownerId: ID;
}

export type DepartmentStatus = "planned" | "working" | "waiting" | "completed" | "blocked";

export interface Department {
  id: ID;
  startupId: ID;
  name: string;
  description: string;
  responsibilities: string[];
  status: DepartmentStatus;
  agentIds: ID[];
  memberIds: ID[]; // human members
  taskCounts: { active: number; completed: number; pending: number };
  createdAt: ISODate;
}

export type AgentStatus = "idle" | "working" | "waiting" | "blocked";

export interface Agent {
  id: ID;
  departmentId: ID;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  model?: string; // display only
  currentTaskId?: ID;
}

export type TaskStatus =
  | "planned"
  | "pending"
  | "working"
  | "waiting_team"
  | "waiting_approval"
  | "blocked"
  | "completed"
  | "failed";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: ID;
  startupId: ID;
  title: string;
  description: string;
  departmentId: ID;
  assigneeType: "agent" | "human";
  assigneeId: ID;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: ISODate;
  dueDate?: ISODate;
  dependencyIds: ID[];
  deliverableIds: ID[];
  createdBy: { type: "founder" | "agent" | "human"; id: ID };
  creationReason?: string;
  blockedReason?: string;
}

export interface TaskEvent {
  id: ID;
  taskId: ID;
  at: ISODate;
  actor: { type: "founder" | "agent" | "human" | "system"; id?: ID; name: string };
  type:
    | "created"
    | "status_changed"
    | "assigned"
    | "comment"
    | "deliverable_added"
    | "handoff"
    | "blocker_reported"
    | "approval_requested";
  summary: string; // plain-language, founder-friendly
}

export type DeliverableType = "report" | "document" | "design" | "code" | "link" | "dataset" | "other";

export interface Deliverable {
  id: ID;
  startupId: ID;
  taskId?: ID;
  departmentId: ID;
  title: string;
  type: DeliverableType;
  summary: string;
  url?: string;
  evidence?: string; // proof of completion
  createdAt: ISODate;
  createdByAgentId?: ID;
}

export type ApprovalStatus = "pending" | "approved" | "rejected" | "info_requested";

export type ApprovalCategory =
  | "spending"
  | "credentials"
  | "publishing"
  | "email_campaign"
  | "deployment"
  | "external_account"
  | "business_decision"
  | "other";

export interface ApprovalRequest {
  id: ID;
  startupId: ID;
  departmentId: ID;
  taskId?: ID;
  category: ApprovalCategory;
  title: string;
  what: string;
  why: string;
  ifApproved: string;
  ifRejected: string;
  costEstimate?: { amount: number; currency: string; recurring?: "monthly" | "yearly" };
  risks?: string[];
  status: ApprovalStatus;
  requiresSecureInput?: boolean; // credentials entered via secure form, never as plain text in logs
  createdAt: ISODate;
  decidedAt?: ISODate;
  founderNote?: string;
}

export interface ActivityItem {
  id: ID;
  startupId: ID;
  at: ISODate;
  departmentId?: ID;
  kind:
    | "task_completed"
    | "task_started"
    | "issue_found"
    | "deliverable_ready"
    | "approval_needed"
    | "milestone"
    | "blocker"
    | "info";
  message: string; // non-technical
  taskId?: ID;
  approvalId?: ID;
}

export interface Milestone {
  id: ID;
  startupId: ID;
  title: string;
  status: "upcoming" | "in_progress" | "done";
  dueDate?: ISODate;
  progress: number;
}

export interface Notification {
  id: ID;
  startupId: ID;
  at: ISODate;
  type:
    | "task_done"
    | "agent_needs_info"
    | "task_blocked"
    | "approval_waiting"
    | "milestone"
    | "deployment_failed"
    | "report_ready";
  title: string;
  body: string;
  read: boolean;
  link?: string;
}

export type AnalysisItemKind = "verified" | "assumption" | "recommendation";

export interface AnalysisSection {
  id: ID;
  title: string;
  items: { id: ID; text: string; kind: AnalysisItemKind; sourceUrl?: string }[];
}

export interface BusinessAnalysis {
  startupId: ID;
  status: "not_started" | "in_progress" | "ready";
  sections: AnalysisSection[];
  updatedAt: ISODate;
}

export interface UsageSummary {
  startupId: ID;
  periodStart: ISODate;
  periodEnd: ISODate;
  totalCost: number;
  currency: string;
  budgetLimit?: number;
  byDepartment: { departmentId: ID; cost: number }[];
  tokensUsed: number;
}

export interface Member {
  id: ID;
  startupId: ID;
  userId: ID;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  departmentIds: ID[];
}
import type {
  AgentStatus,
  AnalysisItemKind,
  ApprovalCategory,
  ApprovalStatus,
  DepartmentStatus,
  StartupStage,
  TaskPriority,
  TaskStatus,
} from "@/types";

/**
 * Human-readable labels for every enum. Never show raw values like "waiting_team" in the UI.
 */

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  planned: "Planned",
  pending: "Pending",
  working: "In progress",
  waiting_team: "Waiting for team",
  waiting_approval: "Waiting for founder approval",
  blocked: "Blocked",
  completed: "Completed",
  failed: "Failed",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const DEPARTMENT_STATUS_LABEL: Record<DepartmentStatus, string> = {
  planned: "Planned",
  working: "Working",
  waiting: "Waiting",
  completed: "Completed",
  blocked: "Blocked",
};

export const AGENT_STATUS_LABEL: Record<AgentStatus, string> = {
  idle: "Available",
  working: "Working",
  waiting: "Waiting",
  blocked: "Blocked",
};

export const STARTUP_STAGE_LABEL: Record<StartupStage, string> = {
  idea: "Idea",
  analysis: "Analysis",
  planning: "Planning",
  building: "Building",
  launching: "Launching",
  live: "Live",
  growing: "Growing",
};

export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  pending: "Waiting for you",
  approved: "Approved",
  rejected: "Declined",
  info_requested: "More information requested",
};

export const APPROVAL_CATEGORY_LABEL: Record<ApprovalCategory, string> = {
  spending: "Spending",
  credentials: "Account access",
  publishing: "Public publishing",
  email_campaign: "Email campaign",
  deployment: "Going live",
  external_account: "External account",
  business_decision: "Business decision",
  other: "Other",
};

export const ANALYSIS_KIND_LABEL: Record<AnalysisItemKind, string> = {
  verified: "Verified",
  assumption: "Assumption",
  recommendation: "Recommendation",
};
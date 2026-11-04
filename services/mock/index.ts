import { TASK_STATUS_LABEL } from "@/lib/labels";
import type { ActivityItem, ApprovalRequest, Task, TaskEvent } from "@/types";
import { ServiceError } from "../errors";
import type {
  ActivityService,
  AnalysisService,
  ApprovalService,
  AuthService,
  DeliverableService,
  DepartmentService,
  MemberService,
  MilestoneService,
  NotificationService,
  Services,
  StartupService,
  TaskService,
  UsageService,
} from "../interfaces";
import { simulate } from "./latency";
import { getStore, newId } from "./store";

/** Finds a record or throws a friendly not_found error. */
function findOrThrow<T extends { id: string }>(list: T[], id: string, label: string): T {
  const found = list.find((item) => item.id === id);
  if (!found) throw new ServiceError("not_found", `We could not find that ${label}.`);
  return found;
}

const byNewest = <T extends { createdAt?: string; at?: string }>(a: T, b: T) =>
  new Date(b.createdAt ?? b.at ?? 0).getTime() - new Date(a.createdAt ?? a.at ?? 0).getTime();

/* ------------------------------------------------------------- startups */
const startupService: StartupService = {
  list: () => simulate(() => getStore().startups),
  get: (id) => simulate(() => findOrThrow(getStore().startups, id, "startup")),
  create: ({ name, ideaSummary }) =>
    simulate(() => {
      const store = getStore();
      const startup = {
        id: newId("startup"),
        name: name.trim(),
        ideaSummary: ideaSummary.trim(),
        stage: "idea" as const,
        progress: 0,
        createdAt: new Date().toISOString(),
        ownerId: store.currentUserId ?? "u_ada",
      };
      store.startups.push(startup);
      store.analyses.push({ startupId: startup.id, status: "not_started", sections: [], updatedAt: startup.createdAt });
      return startup;
    }),
  update: (id, patch) =>
    simulate(() => {
      const startup = findOrThrow(getStore().startups, id, "startup");
      Object.assign(startup, patch);
      return startup;
    }),
};

/* ---------------------------------------------------------- departments */
const departmentService: DepartmentService = {
  list: (startupId) => simulate(() => getStore().departments.filter((d) => d.startupId === startupId)),
  get: (id) => simulate(() => findOrThrow(getStore().departments, id, "department")),
  listAgents: (departmentId) => simulate(() => getStore().agents.filter((a) => a.departmentId === departmentId)),
};

/* ---------------------------------------------------------------- tasks */
const taskService: TaskService = {
  list: (startupId, filters) =>
    simulate(() => {
      const search = filters?.search?.trim().toLowerCase();
      return getStore()
        .tasks.filter((t) => t.startupId === startupId)
        .filter((t) => !filters?.status?.length || filters.status.includes(t.status))
        .filter((t) => !filters?.priority?.length || filters.priority.includes(t.priority))
        .filter((t) => !filters?.departmentId || t.departmentId === filters.departmentId)
        .filter((t) => !filters?.assigneeId || t.assigneeId === filters.assigneeId)
        .filter((t) => !search || `${t.title} ${t.description}`.toLowerCase().includes(search))
        .sort(byNewest);
    }),
  get: (id) => simulate(() => findOrThrow(getStore().tasks, id, "task")),
  listEvents: (taskId) =>
    simulate(() =>
      getStore()
        .events.filter((e) => e.taskId === taskId)
        .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()),
    ),
  create: (input) =>
    simulate(() => {
      const store = getStore();
      const now = new Date().toISOString();
      const task: Task = {
        id: newId("task"),
        startupId: input.startupId,
        title: input.title.trim(),
        description: input.description,
        departmentId: input.departmentId,
        assigneeType: input.assigneeType,
        assigneeId: input.assigneeId,
        priority: input.priority,
        status: "pending",
        createdAt: now,
        dueDate: input.dueDate,
        dependencyIds: input.dependencyIds ?? [],
        deliverableIds: [],
        createdBy: { type: "founder", id: store.currentUserId ?? "u_ada" },
        creationReason: input.creationReason,
      };
      store.tasks.push(task);
      const created: TaskEvent = {
        id: newId("ev"),
        taskId: task.id,
        at: now,
        actor: { type: "founder", id: store.currentUserId ?? undefined, name: "You" },
        type: "created",
        summary: "You created this task.",
      };
      store.events.push(created);
      return task;
    }),
  updateStatus: (id, status) =>
    simulate(() => {
      const store = getStore();
      const task = findOrThrow(store.tasks, id, "task");
      task.status = status;
      if (status !== "blocked") task.blockedReason = undefined;
      store.events.push({
        id: newId("ev"),
        taskId: id,
        at: new Date().toISOString(),
        actor: { type: "founder", id: store.currentUserId ?? undefined, name: "You" },
        type: "status_changed",
        summary: `You changed the status to "${TASK_STATUS_LABEL[status]}".`,
      });
      return task;
    }),
};

/* ------------------------------------------------------------- activity */
const activityService: ActivityService = {
  list: (startupId, options) =>
    simulate(() => {
      const items = getStore()
        .activity.filter((a) => a.startupId === startupId)
        .filter((a) => !options?.departmentId || a.departmentId === options.departmentId)
        .sort(byNewest);
      return options?.limit ? items.slice(0, options.limit) : items;
    }),
};

/* ------------------------------------------------------------ approvals */
const approvalService: ApprovalService = {
  list: (startupId, status) =>
    simulate(() =>
      getStore()
        .approvals.filter((a) => a.startupId === startupId)
        .filter((a) => !status || a.status === status)
        .sort(byNewest),
    ),
  get: (id) => simulate(() => findOrThrow(getStore().approvals, id, "approval request")),
  decide: (id, { decision, note }) =>
    simulate(() => {
      const store = getStore();
      const approval: ApprovalRequest = findOrThrow(store.approvals, id, "approval request");
      const decidedAt = new Date().toISOString();
      approval.status = decision;
      approval.decidedAt = decidedAt;
      approval.founderNote = note?.trim() || undefined;

      // Keep the linked task in step with the decision
      const task = approval.taskId ? store.tasks.find((t) => t.id === approval.taskId) : undefined;
      if (task && task.status === "waiting_approval") {
        if (decision === "approved") task.status = "working";
        if (decision === "rejected") {
          task.status = "blocked";
          task.blockedReason = "You declined the approval request for this task.";
        }
      }

      const messages: Record<typeof decision, string> = {
        approved: `You approved "${approval.title}".`,
        rejected: `You declined "${approval.title}".`,
        info_requested: `You asked for more information about "${approval.title}".`,
      };
      const item: ActivityItem = {
        id: newId("act"),
        startupId: approval.startupId,
        at: decidedAt,
        departmentId: approval.departmentId,
        kind: "info",
        message: messages[decision],
        approvalId: approval.id,
      };
      store.activity.push(item);
      return approval;
    }),
};

/* --------------------------------------------------------- deliverables */
const deliverableService: DeliverableService = {
  list: (startupId, filters) =>
    simulate(() =>
      getStore()
        .deliverables.filter((d) => d.startupId === startupId)
        .filter((d) => !filters?.departmentId || d.departmentId === filters.departmentId)
        .filter((d) => !filters?.taskId || d.taskId === filters.taskId)
        .filter((d) => !filters?.type || d.type === filters.type)
        .sort(byNewest),
    ),
  get: (id) => simulate(() => findOrThrow(getStore().deliverables, id, "deliverable")),
};

/* ----------------------------------------------------------- milestones */
const milestoneService: MilestoneService = {
  list: (startupId) => simulate(() => getStore().milestones.filter((m) => m.startupId === startupId)),
};

/* -------------------------------------------------------- notifications */
const notificationService: NotificationService = {
  list: (startupId) =>
    simulate(() => getStore().notifications.filter((n) => n.startupId === startupId).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())),
  markRead: (id) =>
    simulate(() => {
      const notification = findOrThrow(getStore().notifications, id, "notification");
      notification.read = true;
      return notification;
    }),
  markAllRead: (startupId) =>
    simulate(() => {
      getStore()
        .notifications.filter((n) => n.startupId === startupId)
        .forEach((n) => {
          n.read = true;
        });
    }),
};

/* ------------------------------------------------- analysis / usage / members */
const analysisService: AnalysisService = {
  get: (startupId) =>
    simulate(() => {
      const found = getStore().analyses.find((a) => a.startupId === startupId);
      if (!found) throw new ServiceError("not_found", "We could not find the business analysis.");
      return found;
    }),
};

const usageService: UsageService = {
  get: (startupId) =>
    simulate(() => {
      const found = getStore().usage.find((u) => u.startupId === startupId);
      if (!found) throw new ServiceError("not_found", "We could not find usage details.");
      return found;
    }),
};

const memberService: MemberService = {
  list: (startupId) => simulate(() => getStore().members.filter((m) => m.startupId === startupId)),
};

/* ----------------------------------------------------------------- auth */
const authService: AuthService = {
  getCurrentUser: () =>
    simulate(() => {
      const store = getStore();
      return store.users.find((u) => u.id === store.currentUserId) ?? null;
    }),
  signIn: (email) =>
    simulate(() => {
      const store = getStore();
      // Mock mode accepts any password; unknown emails sign in as the demo user
      const user = store.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ?? store.users[0];
      store.currentUserId = user.id;
      return user;
    }),
  signUp: ({ name, email }) =>
    simulate(() => {
      const store = getStore();
      const user = { id: newId("u"), name: name.trim(), email: email.trim(), createdAt: new Date().toISOString() };
      store.users.push(user);
      store.currentUserId = user.id;
      return user;
    }),
  signOut: () =>
    simulate(() => {
      getStore().currentUserId = null;
    }),
};

export const mockServices: Services = {
  startupService,
  departmentService,
  taskService,
  activityService,
  approvalService,
  deliverableService,
  milestoneService,
  notificationService,
  analysisService,
  usageService,
  memberService,
  authService,
};
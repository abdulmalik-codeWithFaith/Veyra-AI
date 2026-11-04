import type {
  ActivityItem,
  Agent,
  ApprovalRequest,
  ApprovalStatus,
  BusinessAnalysis,
  Deliverable,
  DeliverableType,
  Department,
  ID,
  Member,
  Milestone,
  Notification,
  Startup,
  Task,
  TaskEvent,
  TaskPriority,
  TaskStatus,
  UsageSummary,
  User,
} from "@/types";

/**
 * Service contracts. Components talk ONLY to these (via "@/services"),
 * so a real HTTP backend can replace the mocks without touching any UI.
 */

export interface CreateStartupInput {
  name: string;
  ideaSummary: string;
}

export type UpdateStartupPatch = Partial<Omit<Startup, "id" | "createdAt" | "ownerId">>;

export interface StartupService {
  list(): Promise<Startup[]>;
  get(id: ID): Promise<Startup>;
  create(input: CreateStartupInput): Promise<Startup>;
  update(id: ID, patch: UpdateStartupPatch): Promise<Startup>;
}

export interface DepartmentService {
  list(startupId: ID): Promise<Department[]>;
  get(id: ID): Promise<Department>;
  listAgents(departmentId: ID): Promise<Agent[]>;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  departmentId?: ID;
  assigneeId?: ID;
  search?: string;
}

export type CreateTaskInput = Pick<
  Task,
  "startupId" | "title" | "description" | "departmentId" | "assigneeType" | "assigneeId" | "priority"
> &
  Partial<Pick<Task, "dueDate" | "dependencyIds" | "creationReason">>;

export interface TaskService {
  list(startupId: ID, filters?: TaskFilters): Promise<Task[]>;
  get(id: ID): Promise<Task>;
  listEvents(taskId: ID): Promise<TaskEvent[]>;
  create(input: CreateTaskInput): Promise<Task>;
  updateStatus(id: ID, status: TaskStatus): Promise<Task>;
}

export interface ActivityListOptions {
  limit?: number;
  departmentId?: ID;
}

export interface ActivityService {
  list(startupId: ID, options?: ActivityListOptions): Promise<ActivityItem[]>;
}

export interface ApprovalDecision {
  decision: Exclude<ApprovalStatus, "pending">;
  note?: string;
}

export interface ApprovalService {
  list(startupId: ID, status?: ApprovalStatus): Promise<ApprovalRequest[]>;
  get(id: ID): Promise<ApprovalRequest>;
  decide(id: ID, decision: ApprovalDecision): Promise<ApprovalRequest>;
}

export interface DeliverableFilters {
  departmentId?: ID;
  taskId?: ID;
  type?: DeliverableType;
}

export interface DeliverableService {
  list(startupId: ID, filters?: DeliverableFilters): Promise<Deliverable[]>;
  get(id: ID): Promise<Deliverable>;
}

export interface MilestoneService {
  list(startupId: ID): Promise<Milestone[]>;
}

export interface NotificationService {
  list(startupId: ID): Promise<Notification[]>;
  markRead(id: ID): Promise<Notification>;
  markAllRead(startupId: ID): Promise<void>;
}

export interface AnalysisService {
  get(startupId: ID): Promise<BusinessAnalysis>;
}

export interface UsageService {
  get(startupId: ID): Promise<UsageSummary>;
}

export interface MemberService {
  list(startupId: ID): Promise<Member[]>;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthService {
  getCurrentUser(): Promise<User | null>;
  signIn(email: string, password: string): Promise<User>;
  signUp(input: SignUpInput): Promise<User>;
  signOut(): Promise<void>;
}

/** Everything the app can call. */
export interface Services {
  startupService: StartupService;
  departmentService: DepartmentService;
  taskService: TaskService;
  activityService: ActivityService;
  approvalService: ApprovalService;
  deliverableService: DeliverableService;
  milestoneService: MilestoneService;
  notificationService: NotificationService;
  analysisService: AnalysisService;
  usageService: UsageService;
  memberService: MemberService;
  authService: AuthService;
}
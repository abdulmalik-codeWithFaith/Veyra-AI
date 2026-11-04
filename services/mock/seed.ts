import type {
  ActivityItem,
  Agent,
  ApprovalRequest,
  BusinessAnalysis,
  Deliverable,
  Department,
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

/** The in-memory "database" the mock services read and write. */
export interface Store {
  currentUserId: string | null;
  users: User[];
  startups: Startup[];
  departments: Department[];
  agents: Agent[];
  tasks: Task[];
  events: TaskEvent[];
  deliverables: Deliverable[];
  approvals: ApprovalRequest[];
  activity: ActivityItem[];
  milestones: Milestone[];
  notifications: Notification[];
  analyses: BusinessAnalysis[];
  usage: UsageSummary[];
  members: Member[];
}

export const CURRENT_USER_ID = "u_ada";
export const SEED_STARTUP_ID = "localfix";
export const EMPTY_STARTUP_ID = "greenleaf";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/**
 * Built lazily (see store.ts) so dates are relative to "now" when the app runs,
 * which keeps relative times like "2 hours ago" realistic.
 */
export function createSeed(now: number): Store {
  const ago = (hours: number) => new Date(now - hours * HOUR).toISOString();
  const ahead = (days: number) => new Date(now + days * DAY).toISOString();

  /* ---------------------------------------------------------------- users */
  const users: User[] = [
    { id: "u_ada", name: "Ada Okafor", email: "ada@localfix.io", createdAt: ago(24 * 30) },
    { id: "u_tunde", name: "Tunde Bello", email: "tunde@localfix.io", createdAt: ago(24 * 20) },
  ];

  /* ------------------------------------------------------------- startups */
  const startups: Startup[] = [
    {
      id: SEED_STARTUP_ID,
      name: "LocalFix",
      tagline: "Trusted local technicians, booked in minutes",
      ideaSummary:
        "A marketplace for verified local electricians, plumbers and technicians, with booking, payments and reviews.",
      stage: "building",
      progress: 58,
      createdAt: ago(24 * 21),
      ownerId: "u_ada",
    },
    {
      id: EMPTY_STARTUP_ID,
      name: "GreenLeaf",
      ideaSummary: "A subscription service that delivers fresh herbs and vegetables from local urban farms.",
      stage: "idea",
      progress: 0,
      createdAt: ago(2),
      ownerId: "u_ada",
    },
  ];

  /* --------------------------------------------------------------- agents */
  const agent = (
    id: string,
    departmentId: string,
    name: string,
    role: string,
    description: string,
    status: Agent["status"],
    currentTaskId?: string,
  ): Agent => ({ id, departmentId, name, role, description, status, model: "Veyra Agent", currentTaskId });

  const agents: Agent[] = [
    agent("a_pm_1", "d_pm", "Maya", "Product Manager", "Turns your idea into clear features and priorities.", "working", "t3"),
    agent("a_pm_2", "d_pm", "Jordan", "Requirements Analyst", "Writes detailed requirements for every feature.", "working", "t4"),
    agent("a_eng_1", "d_eng", "Kemi", "Backend Engineer", "Builds the booking, payments and provider systems.", "working", "t10"),
    agent("a_eng_2", "d_eng", "Leo", "Frontend Engineer", "Builds the screens customers and providers use.", "working", "t14"),
    agent("a_eng_3", "d_eng", "Sam", "DevOps Engineer", "Sets up hosting so the product can go live.", "waiting", "t13"),
    agent("a_des_1", "d_design", "Zara", "UI Designer", "Designs the screens and user flows.", "idle"),
    agent("a_des_2", "d_design", "Noah", "Brand Designer", "Creates the logo, colors and brand style.", "idle"),
    agent("a_qa_1", "d_qa", "Iris", "QA Engineer", "Tests every feature before customers see it.", "waiting", "t16"),
    agent("a_mkt_1", "d_marketing", "Ella", "Content Strategist", "Writes website copy and launch emails.", "working", "t21"),
    agent("a_mkt_2", "d_marketing", "Ravi", "Campaign Manager", "Plans and runs marketing campaigns.", "waiting", "t20"),
    agent("a_gr_1", "d_growth", "Chidi", "Growth Analyst", "Finds the first customers and providers.", "idle"),
  ];

  /* ---------------------------------------------------------------- tasks */
  const founder = { type: "founder", id: "u_ada" } as const;
  const byAgent = (id: string) => ({ type: "agent", id }) as const;

  interface TaskSeed {
    id: string;
    title: string;
    description: string;
    dept: string;
    assignee: string;
    human?: boolean;
    priority: TaskPriority;
    status: TaskStatus;
    createdHoursAgo: number;
    dueInDays?: number;
    deps?: string[];
    deliverables?: string[];
    by?: Task["createdBy"];
    reason?: string;
    blocked?: string;
  }

  const task = (s: TaskSeed): Task => ({
    id: s.id,
    startupId: SEED_STARTUP_ID,
    title: s.title,
    description: s.description,
    departmentId: s.dept,
    assigneeType: s.human ? "human" : "agent",
    assigneeId: s.assignee,
    priority: s.priority,
    status: s.status,
    createdAt: ago(s.createdHoursAgo),
    dueDate: s.dueInDays === undefined ? undefined : ahead(s.dueInDays),
    dependencyIds: s.deps ?? [],
    deliverableIds: s.deliverables ?? [],
    createdBy: s.by ?? founder,
    creationReason: s.reason,
    blockedReason: s.blocked,
  });

  const tasks: Task[] = [
    // Product
    task({ id: "t1", title: "Define booking flow requirements", description: "Write down every step a customer takes from searching for a technician to confirming a booking.", dept: "d_pm", assignee: "a_pm_1", priority: "high", status: "completed", createdHoursAgo: 24 * 18, deliverables: ["del_1"] }),
    task({ id: "t2", title: "Write provider verification policy", description: "Decide how technicians are checked before they can accept jobs.", dept: "d_pm", assignee: "a_pm_1", priority: "medium", status: "completed", createdHoursAgo: 24 * 16, by: byAgent("a_pm_1"), reason: "Customers trust the marketplace only if providers are verified, so this had to be defined early." }),
    task({ id: "t3", title: "Prioritise the launch feature list", description: "Decide which features are in the first release and which wait.", dept: "d_pm", assignee: "a_pm_1", priority: "high", status: "working", createdHoursAgo: 24 * 5, dueInDays: 2 }),
    task({ id: "t4", title: "Write the reviews and ratings spec", description: "Describe how customers leave reviews and how they appear on provider profiles.", dept: "d_pm", assignee: "a_pm_2", priority: "medium", status: "working", createdHoursAgo: 24 * 4, dueInDays: 4 }),
    task({ id: "t5", title: "Plan the provider sign-up journey", description: "Map out how a technician joins, gets verified and receives their first job.", dept: "d_pm", assignee: "a_pm_2", priority: "medium", status: "pending", createdHoursAgo: 24 * 3, deps: ["t2"], by: byAgent("a_pm_1"), reason: "Providers need a smooth start or the marketplace will have no one to book." }),
    task({ id: "t26", title: "Confirm business registration details", description: "Provide the company registration number so payments and contracts can be set up.", dept: "d_pm", assignee: "u_tunde", human: true, priority: "high", status: "pending", createdHoursAgo: 24 * 2, dueInDays: 5, by: byAgent("a_pm_1"), reason: "The payment provider requires verified company details before going live." }),
    // Design
    task({ id: "t6", title: "Create the LocalFix brand kit", description: "Logo, colors, typography and tone of voice.", dept: "d_design", assignee: "a_des_2", priority: "high", status: "completed", createdHoursAgo: 24 * 15, deliverables: ["del_2"] }),
    task({ id: "t7", title: "Design the booking screens", description: "Search, provider profile, booking and confirmation screens.", dept: "d_design", assignee: "a_des_1", priority: "high", status: "completed", createdHoursAgo: 24 * 12, deps: ["t1"], deliverables: ["del_3"] }),
    task({ id: "t8", title: "Design the provider dashboard", description: "Where technicians manage jobs, availability and earnings.", dept: "d_design", assignee: "a_des_1", priority: "medium", status: "completed", createdHoursAgo: 24 * 9, deliverables: ["del_4"] }),
    // Engineering
    task({ id: "t9", title: "Set up the project and database", description: "Create the foundations everything else is built on.", dept: "d_eng", assignee: "a_eng_1", priority: "urgent", status: "completed", createdHoursAgo: 24 * 13, deliverables: ["del_7"] }),
    task({ id: "t10", title: "Build the booking system", description: "Let customers pick a time and a technician, and confirm a booking.", dept: "d_eng", assignee: "a_eng_1", priority: "high", status: "working", createdHoursAgo: 24 * 8, dueInDays: 3, deps: ["t1", "t9"], by: byAgent("a_pm_1"), reason: "Booking is the core of the product, so everything else depends on it." }),
    task({ id: "t11", title: "Build the customer booking screens", description: "Turn the approved designs into working screens.", dept: "d_eng", assignee: "a_eng_2", priority: "high", status: "working", createdHoursAgo: 24 * 7, dueInDays: 4, deps: ["t7"] }),
    task({ id: "t12", title: "Connect the payment provider", description: "Let customers pay for bookings securely.", dept: "d_eng", assignee: "a_eng_1", priority: "urgent", status: "waiting_approval", createdHoursAgo: 24 * 3, dueInDays: 3, deps: ["t10"], by: byAgent("a_eng_1"), reason: "Customers cannot complete a booking without a way to pay." }),
    task({ id: "t13", title: "Set up hosting and going live", description: "Choose and configure where LocalFix will run.", dept: "d_eng", assignee: "a_eng_3", priority: "high", status: "waiting_approval", createdHoursAgo: 24 * 2, dueInDays: 6, by: byAgent("a_eng_3"), reason: "The product needs a home on the internet before it can launch." }),
    task({ id: "t14", title: "Fix booking confirmation emails", description: "Customers are not receiving an email after they book.", dept: "d_eng", assignee: "a_eng_2", priority: "urgent", status: "working", createdHoursAgo: 5, dueInDays: 1, by: byAgent("a_qa_1"), reason: "QA found that confirmation emails were not being sent during testing." }),
    task({ id: "t15", title: "Speed up provider search", description: "Search results take too long to appear when many providers match.", dept: "d_eng", assignee: "a_eng_1", priority: "medium", status: "pending", createdHoursAgo: 4, by: byAgent("a_qa_1"), reason: "QA measured slow search results that would frustrate customers." }),
    task({ id: "t25", title: "Review how payment data is handled", description: "An automatic safety check on how card details move through the system.", dept: "d_eng", assignee: "a_eng_1", priority: "high", status: "failed", createdHoursAgo: 24, deps: ["t12"], by: byAgent("a_eng_1"), reason: "Payments must meet safety standards before real money is handled." }),
    // QA
    task({ id: "t16", title: "Test the booking flow end to end", description: "Walk through booking as a customer and check every step works.", dept: "d_qa", assignee: "a_qa_1", priority: "high", status: "waiting_team", createdHoursAgo: 24 * 2, deps: ["t10", "t11"] }),
    task({ id: "t17", title: "Test payment checkout", description: "Check successful payments, failed payments and refunds.", dept: "d_qa", assignee: "a_qa_1", priority: "high", status: "planned", createdHoursAgo: 24 * 2, deps: ["t12"] }),
    task({ id: "t18", title: "Check layouts on small phone screens", description: "Make sure every screen is usable on a small phone.", dept: "d_qa", assignee: "a_qa_1", priority: "medium", status: "blocked", createdHoursAgo: 24, deps: ["t11"], blocked: "The customer screens are not finished yet, so there is nothing to check." }),
    // Marketing
    task({ id: "t19", title: "Write the launch page copy", description: "Headlines and text for the LocalFix website.", dept: "d_marketing", assignee: "a_mkt_1", priority: "medium", status: "completed", createdHoursAgo: 24 * 6, deliverables: ["del_5"] }),
    task({ id: "t20", title: "Plan the first public marketing campaign", description: "Pick channels, budget and messages for the launch campaign.", dept: "d_marketing", assignee: "a_mkt_2", priority: "high", status: "waiting_approval", createdHoursAgo: 24 * 2, dueInDays: 7 }),
    task({ id: "t21", title: "Draft the launch email sequence", description: "Three emails to welcome the first customers and providers.", dept: "d_marketing", assignee: "a_mkt_1", priority: "medium", status: "working", createdHoursAgo: 24, dueInDays: 5, by: byAgent("a_mkt_2"), reason: "A welcome sequence keeps early users engaged after they sign up." }),
    // Growth
    task({ id: "t22", title: "Find the first 100 technicians", description: "Build a list of reliable local technicians to invite at launch.", dept: "d_growth", assignee: "a_gr_1", priority: "medium", status: "planned", createdHoursAgo: 24 * 2, dueInDays: 14 }),
    task({ id: "t23", title: "Plan a referral programme", description: "Reward customers who bring friends.", dept: "d_growth", assignee: "a_gr_1", priority: "low", status: "planned", createdHoursAgo: 24 * 2, by: byAgent("a_pm_1"), reason: "Referrals are the cheapest way to grow a local marketplace." }),
    task({ id: "t24", title: "Set up visitor tracking", description: "Measure where customers come from and where they drop off.", dept: "d_growth", assignee: "a_gr_1", priority: "low", status: "pending", createdHoursAgo: 24 * 2, deps: ["t13"] }),
  ];

  /* --------------------------------------------------------------- events */
  const actor = (id: string, name: string): TaskEvent["actor"] => ({ type: "agent", id, name });
  const system: TaskEvent["actor"] = { type: "system", name: "Veyra" };
  let eventCount = 0;
  const ev = (
    taskId: string,
    hoursAgo: number,
    by: TaskEvent["actor"],
    type: TaskEvent["type"],
    summary: string,
  ): TaskEvent => ({ id: `ev_${++eventCount}`, taskId, at: ago(hoursAgo), actor: by, type, summary });

  const maya = actor("a_pm_1", "Maya");
  const kemi = actor("a_eng_1", "Kemi");
  const leo = actor("a_eng_2", "Leo");
  const iris = actor("a_qa_1", "Iris");
  const ravi = actor("a_mkt_2", "Ravi");

  const events: TaskEvent[] = [
    // Booking system: PM -> Engineering -> QA -> back to Engineering
    ev("t10", 24 * 8, maya, "created", "Maya (Product) created this task from the booking requirements."),
    ev("t10", 24 * 8, maya, "assigned", "Maya assigned the task to Kemi in Engineering."),
    ev("t10", 24 * 7.5, kemi, "status_changed", "Kemi started building the booking system."),
    ev("t10", 24 * 3, kemi, "handoff", "Kemi handed the first working version to QA for testing."),
    ev("t10", 24 * 2, iris, "blocker_reported", "Iris (QA) found that confirmation emails are not sent after a booking."),
    ev("t10", 24 * 2 - 1, iris, "handoff", "QA sent the booking system back to Engineering with 2 issues to fix."),
    ev("t10", 24 * 2 - 2, kemi, "status_changed", "Kemi resumed work on the booking system."),
    // Payment connection
    ev("t12", 24 * 3, kemi, "created", "Kemi created this task because customers need a way to pay."),
    ev("t12", 24 * 3 - 1, kemi, "status_changed", "Kemi built the payment screens using test payments."),
    ev("t12", 30, kemi, "approval_requested", "Kemi asked for your approval to connect the real payment provider."),
    ev("t12", 30, system, "status_changed", "Work is paused until you approve."),
    // Confirmation email bug
    ev("t14", 5, iris, "created", "Iris (QA) created this task after confirmation emails failed in testing."),
    ev("t14", 5, iris, "assigned", "Iris assigned the fix to Leo in Engineering."),
    ev("t14", 4, leo, "status_changed", "Leo started investigating why emails are not sent."),
    ev("t14", 2, leo, "comment", "Leo found the cause and is testing a fix."),
    // QA end-to-end test
    ev("t16", 24 * 2, iris, "created", "Iris (QA) prepared the end-to-end booking test."),
    ev("t16", 24 * 2 - 1, iris, "blocker_reported", "Iris found 2 issues and is waiting for Engineering to fix them."),
    ev("t16", 5, system, "status_changed", "Task is waiting for the email fix to be finished."),
    // Marketing campaign
    ev("t20", 24 * 2, ravi, "created", "Ravi (Marketing) started planning the launch campaign."),
    ev("t20", 20, ravi, "deliverable_added", "Ravi prepared a campaign plan with messages and a budget."),
    ev("t20", 20, ravi, "approval_requested", "Ravi asked for your approval before anything is published."),
    // Completed work
    ev("t1", 24 * 17, maya, "deliverable_added", "Maya finished the booking flow requirements."),
    ev("t6", 24 * 14, actor("a_des_2", "Noah"), "deliverable_added", "Noah delivered the LocalFix brand kit."),
    ev("t25", 24, kemi, "status_changed", "The automatic safety check could not finish and needs another run."),
  ];

  /* --------------------------------------------------------- deliverables */
  const del = (
    id: string,
    taskId: string | undefined,
    departmentId: string,
    title: string,
    type: Deliverable["type"],
    summary: string,
    hoursAgo: number,
    createdByAgentId: string,
    evidence?: string,
    url?: string,
  ): Deliverable => ({
    id,
    startupId: SEED_STARTUP_ID,
    taskId,
    departmentId,
    title,
    type,
    summary,
    url,
    evidence,
    createdAt: ago(hoursAgo),
    createdByAgentId,
  });

  const deliverables: Deliverable[] = [
    del("del_1", "t1", "d_pm", "Booking flow requirements", "document", "Every step from searching to confirming a booking, with rules for cancellations and rescheduling.", 24 * 17, "a_pm_1", "Reviewed and approved by the founder."),
    del("del_2", "t6", "d_design", "LocalFix brand kit", "design", "Logo, color palette, typography and tone of voice.", 24 * 14, "a_des_2", "Brand kit applied across all screens.", "https://example.com/localfix/brand-kit"),
    del("del_3", "t7", "d_design", "Booking screens (version 1)", "design", "Search, provider profile, booking and confirmation screens for phone and desktop.", 24 * 11, "a_des_1", "12 screens reviewed against the requirements.", "https://example.com/localfix/booking-screens"),
    del("del_4", "t8", "d_design", "Provider dashboard designs", "design", "Job list, calendar and earnings views for technicians.", 24 * 8, "a_des_1", "6 screens delivered."),
    del("del_5", "t19", "d_marketing", "Launch page copy", "document", "Headlines, benefits and a short FAQ for the LocalFix website.", 24 * 5, "a_mkt_1", "Copy checked for tone and clarity."),
    del("del_6", undefined, "d_pm", "Market research summary", "report", "How customers find technicians today, what they pay and what frustrates them.", 24 * 19, "a_pm_1", "12 sources reviewed.", "https://example.com/localfix/market-research"),
    del("del_7", "t9", "d_eng", "Project and database foundation", "code", "The base of the product, with accounts, providers and bookings ready to build on.", 24 * 12, "a_eng_1", "All setup checks passed."),
    del("del_8", undefined, "d_pm", "Competitor comparison", "dataset", "Seven competing services compared on price, coverage and reviews.", 24 * 18, "a_pm_2", "Figures collected from public pages."),
  ];

  /* ------------------------------------------------------------ approvals */
  const approvals: ApprovalRequest[] = [
    {
      id: "ap_1",
      startupId: SEED_STARTUP_ID,
      departmentId: "d_eng",
      taskId: "t12",
      category: "credentials",
      title: "Connect your payment provider",
      what: "Enter your payment provider keys so LocalFix can accept real payments from customers.",
      why: "Customers cannot pay for bookings until the real provider is connected. Everything else for checkout is already built and tested with practice payments.",
      ifApproved: "Engineering finishes checkout and QA begins testing real payment flows.",
      ifRejected: "Checkout stays in practice mode and the launch date moves back.",
      risks: [
        "Live keys can move real money, so only enter them in the secure form.",
        "You can disconnect the provider at any time from Settings.",
      ],
      status: "pending",
      requiresSecureInput: true,
      createdAt: ago(30),
    },
    {
      id: "ap_2",
      startupId: SEED_STARTUP_ID,
      departmentId: "d_marketing",
      taskId: "t20",
      category: "publishing",
      title: "Launch the first public marketing campaign",
      what: "Publish a two-week campaign across social media and local community groups announcing LocalFix.",
      why: "The first customers and technicians need to hear about LocalFix before launch day.",
      ifApproved: "Marketing schedules the posts and begins reaching local customers and technicians.",
      ifRejected: "Nothing is published, and Marketing will revise the plan based on your note.",
      costEstimate: { amount: 400, currency: "USD" },
      risks: ["Posts are public and cannot be fully removed once shared."],
      status: "pending",
      createdAt: ago(20),
    },
    {
      id: "ap_3",
      startupId: SEED_STARTUP_ID,
      departmentId: "d_eng",
      taskId: "t13",
      category: "spending",
      title: "Approve the hosting budget",
      what: "Pay for hosting and a database so LocalFix can run for real customers.",
      why: "The product needs a reliable home on the internet before it can launch.",
      ifApproved: "Engineering sets up hosting and prepares the product for launch.",
      ifRejected: "The product stays in testing and cannot go live.",
      costEstimate: { amount: 45, currency: "USD", recurring: "monthly" },
      status: "pending",
      createdAt: ago(12),
    },
    {
      id: "ap_4",
      startupId: SEED_STARTUP_ID,
      departmentId: "d_pm",
      category: "business_decision",
      title: "Launch in one city first",
      what: "Start with a single city to build trust and reviews before expanding.",
      why: "A focused launch makes it easier to recruit technicians and deliver great service.",
      ifApproved: "The team plans the launch around one city.",
      ifRejected: "The team plans a wider launch.",
      status: "approved",
      createdAt: ago(24 * 10),
      decidedAt: ago(24 * 10 - 2),
      founderNote: "Yes, start with Ibadan.",
    },
  ];

  /* ------------------------------------------------------------- activity */
  let activityCount = 0;
  const act = (
    hoursAgo: number,
    kind: ActivityItem["kind"],
    message: string,
    departmentId?: string,
    links: { taskId?: string; approvalId?: string } = {},
  ): ActivityItem => ({
    id: `act_${++activityCount}`,
    startupId: SEED_STARTUP_ID,
    at: ago(hoursAgo),
    kind,
    message,
    departmentId,
    ...links,
  });

  const activity: ActivityItem[] = [
    act(0.5, "task_started", "Engineering started fixing the booking confirmation emails.", "d_eng", { taskId: "t14" }),
    act(2, "issue_found", "QA found 2 problems in the booking flow and sent them back to Engineering.", "d_qa", { taskId: "t16" }),
    act(5, "blocker", "Mobile layout checks are on hold until the customer screens are finished.", "d_qa", { taskId: "t18" }),
    act(12, "approval_needed", "Engineering needs your approval for the hosting budget.", "d_eng", { approvalId: "ap_3" }),
    act(20, "approval_needed", "Marketing needs your approval before publishing the first campaign.", "d_marketing", { approvalId: "ap_2" }),
    act(24, "issue_found", "An automatic safety check on payment handling could not finish and will be run again.", "d_eng", { taskId: "t25" }),
    act(30, "approval_needed", "Engineering needs the payment provider keys to finish checkout.", "d_eng", { approvalId: "ap_1" }),
    act(24 * 2, "info", "Product added 3 new tasks for the provider sign-up journey.", "d_pm"),
    act(24 * 3, "task_started", "Engineering started connecting the payment system using practice payments.", "d_eng", { taskId: "t12" }),
    act(24 * 5, "task_completed", "Marketing finished the launch page copy.", "d_marketing", { taskId: "t19" }),
    act(24 * 8, "deliverable_ready", "Design delivered the provider dashboard screens.", "d_design", { taskId: "t8" }),
    act(24 * 9, "milestone", "Plan and design phase completed.", undefined),
    act(24 * 12, "deliverable_ready", "Design delivered 12 booking screens for phone and desktop.", "d_design", { taskId: "t7" }),
    act(24 * 14, "task_completed", "Design finished the LocalFix brand kit.", "d_design", { taskId: "t6" }),
    act(24 * 17, "task_completed", "Product finished the booking flow requirements.", "d_pm", { taskId: "t1" }),
  ];

  /* ----------------------------------------------------------- milestones */
  const milestones: Milestone[] = [
    { id: "m1", startupId: SEED_STARTUP_ID, title: "Plan and design complete", status: "done", dueDate: ago(24 * 9), progress: 100 },
    { id: "m2", startupId: SEED_STARTUP_ID, title: "Booking and payments built", status: "in_progress", dueDate: ahead(7), progress: 55 },
    { id: "m3", startupId: SEED_STARTUP_ID, title: "Testing passed", status: "upcoming", dueDate: ahead(14), progress: 10 },
    { id: "m4", startupId: SEED_STARTUP_ID, title: "Public launch", status: "upcoming", dueDate: ahead(24), progress: 0 },
  ];

  /* -------------------------------------------------------- notifications */
  const note = (
    id: string,
    hoursAgo: number,
    type: Notification["type"],
    title: string,
    body: string,
    read: boolean,
    link?: string,
  ): Notification => ({ id, startupId: SEED_STARTUP_ID, at: ago(hoursAgo), type, title, body, read, link });

  const base = `/s/${SEED_STARTUP_ID}`;
  const notifications: Notification[] = [
    note("n1", 12, "approval_waiting", "Hosting budget needs your approval", "Engineering is waiting to set up hosting for $45 per month.", false, `${base}/approvals`),
    note("n2", 20, "approval_waiting", "Marketing campaign needs your approval", "Nothing will be published until you approve.", false, `${base}/approvals`),
    note("n3", 30, "agent_needs_info", "Engineering needs your payment keys", "Enter them in the secure form to finish checkout.", false, `${base}/approvals`),
    note("n4", 5, "task_blocked", "Mobile checks are on hold", "QA is waiting for the customer screens to be finished.", true, `${base}/tasks`),
    note("n5", 24 * 9, "milestone", "Plan and design complete", "Your first milestone is done. Building is under way.", true, `${base}/activity`),
    note("n6", 24 * 5, "report_ready", "Weekly report is ready", "See what the team finished this week.", true, `${base}/reports`),
  ];

  /* ------------------------------------------------------------- analysis */
  const analyses: BusinessAnalysis[] = [
    {
      startupId: SEED_STARTUP_ID,
      status: "ready",
      updatedAt: ago(24 * 19),
      sections: [
        {
          id: "an_market",
          title: "Market",
          items: [
            { id: "an_1", text: "Most households find technicians through friends or phone calls today.", kind: "verified", sourceUrl: "https://example.com/research/how-people-find-technicians" },
            { id: "an_2", text: "Customers often report trouble finding someone reliable at short notice.", kind: "verified", sourceUrl: "https://example.com/research/reliability-complaints" },
            { id: "an_3", text: "Demand for home repairs is steady throughout the year.", kind: "assumption" },
          ],
        },
        {
          id: "an_customers",
          title: "Customers",
          items: [
            { id: "an_4", text: "Homeowners and landlords are the main customer groups.", kind: "verified", sourceUrl: "https://example.com/research/customer-groups" },
            { id: "an_5", text: "Customers will pay a small booking fee in return for verified providers.", kind: "assumption" },
          ],
        },
        {
          id: "an_competition",
          title: "Competition",
          items: [
            { id: "an_6", text: "Several directories list technicians, but few verify them or handle payments.", kind: "verified", sourceUrl: "https://example.com/research/competitors" },
            { id: "an_7", text: "Emphasise verification and reviews to stand apart from directories.", kind: "recommendation" },
          ],
        },
        {
          id: "an_model",
          title: "Business model",
          items: [
            { id: "an_8", text: "Take a small percentage of each completed booking.", kind: "recommendation" },
            { id: "an_9", text: "Providers will accept a commission if the platform brings steady work.", kind: "assumption" },
            { id: "an_10", text: "Launch in one city first to build trust and reviews before expanding.", kind: "recommendation" },
          ],
        },
      ],
    },
    { startupId: EMPTY_STARTUP_ID, status: "not_started", sections: [], updatedAt: ago(2) },
  ];

  /* ----------------------------------------------------------- usage / people */
  const usage: UsageSummary[] = [
    {
      startupId: SEED_STARTUP_ID,
      periodStart: ago(24 * 30),
      periodEnd: ago(0),
      totalCost: 182.4,
      currency: "USD",
      budgetLimit: 500,
      byDepartment: [
        { departmentId: "d_eng", cost: 82.6 },
        { departmentId: "d_pm", cost: 31.2 },
        { departmentId: "d_design", cost: 28.9 },
        { departmentId: "d_marketing", cost: 22.5 },
        { departmentId: "d_qa", cost: 14.7 },
        { departmentId: "d_growth", cost: 2.5 },
      ],
      tokensUsed: 4_280_000,
    },
    {
      startupId: EMPTY_STARTUP_ID,
      periodStart: ago(24 * 30),
      periodEnd: ago(0),
      totalCost: 0,
      currency: "USD",
      budgetLimit: 100,
      byDepartment: [],
      tokensUsed: 0,
    },
  ];

  const members: Member[] = [
    { id: "mem_1", startupId: SEED_STARTUP_ID, userId: "u_ada", name: "Ada Okafor", email: "ada@localfix.io", role: "owner", departmentIds: [] },
    { id: "mem_2", startupId: SEED_STARTUP_ID, userId: "u_tunde", name: "Tunde Bello", email: "tunde@localfix.io", role: "admin", departmentIds: ["d_pm"] },
    { id: "mem_3", startupId: EMPTY_STARTUP_ID, userId: "u_ada", name: "Ada Okafor", email: "ada@localfix.io", role: "owner", departmentIds: [] },
  ];

  /* ---------------------------------------------------------- departments */
  const countsFor = (departmentId: string): Department["taskCounts"] => {
    const own = tasks.filter((t) => t.departmentId === departmentId);
    return {
      active: own.filter((t) => ["working", "waiting_team", "waiting_approval", "blocked"].includes(t.status)).length,
      completed: own.filter((t) => t.status === "completed").length,
      pending: own.filter((t) => ["planned", "pending"].includes(t.status)).length,
    };
  };

  const dept = (
    id: string,
    name: string,
    description: string,
    responsibilities: string[],
    status: Department["status"],
    memberIds: string[] = [],
  ): Department => ({
    id,
    startupId: SEED_STARTUP_ID,
    name,
    description,
    responsibilities,
    status,
    agentIds: agents.filter((a) => a.departmentId === id).map((a) => a.id),
    memberIds,
    taskCounts: countsFor(id),
    createdAt: ago(24 * 21),
  });

  const departments: Department[] = [
    dept("d_pm", "Product Management", "Decides what gets built and in what order.", ["Write requirements", "Prioritise features", "Coordinate between departments"], "working", ["u_tunde"]),
    dept("d_eng", "Engineering", "Builds and ships the working product.", ["Build features", "Connect payments", "Set up hosting", "Fix issues found in testing"], "working"),
    dept("d_design", "Design", "Creates the brand, screens and user flows.", ["Brand identity", "Screen designs", "Design reviews"], "completed"),
    dept("d_qa", "QA", "Tests everything before customers see it.", ["Test features", "Report issues", "Check on different devices"], "waiting"),
    dept("d_marketing", "Marketing", "Tells people about LocalFix.", ["Website copy", "Campaign planning", "Email sequences"], "working"),
    dept("d_growth", "Growth", "Finds and keeps the first customers and providers.", ["Provider recruitment", "Referral programme", "Analytics"], "planned"),
  ];

  return {
    currentUserId: CURRENT_USER_ID,
    users,
    startups,
    departments,
    agents,
    tasks,
    events,
    deliverables,
    approvals,
    activity,
    milestones,
    notifications,
    analyses,
    usage,
    members,
  };
}
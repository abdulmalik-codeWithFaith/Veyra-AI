"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Code,
  Compass,
  FileSearch,
  FlaskConical,
  KeyRound,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Megaphone,
  Menu,
  Moon,
  Palette,
  Rocket,
  ScrollText,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

/* ==================================================================
   Marketing copy. This is page content, not app data, so it lives here.
   ================================================================== */

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Departments", href: "#departments" },
  { label: "Control", href: "#control" },
  { label: "FAQ", href: "#faq" },
];

const USE_CASES = [
  "Marketplaces",
  "SaaS products",
  "Online stores",
  "Local services",
  "Mobile apps",
  "Creator businesses",
];

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lightbulb,
    title: "Describe your idea",
    body: "A few sentences is enough. Veyra researches your market and separates what is verified from what is assumed.",
  },
  {
    icon: Users,
    title: "Your team is assembled",
    body: "Departments and AI team members are created for your business, each with clear responsibilities and tasks.",
  },
  {
    icon: Rocket,
    title: "Watch it get built",
    body: "Follow progress in plain language. See what was done, what is next, and what needs your decision.",
  },
];

const DEPARTMENTS: { icon: LucideIcon; name: string; does: string }[] = [
  { icon: Compass, name: "Strategy", does: "Researches your market and shapes the plan." },
  { icon: ListChecks, name: "Product", does: "Turns the plan into clear features and priorities." },
  { icon: Palette, name: "Design", does: "Creates the brand, screens and user flows." },
  { icon: Code, name: "Engineering", does: "Builds and ships the working product." },
  { icon: FlaskConical, name: "QA", does: "Tests everything before a customer sees it." },
  { icon: Megaphone, name: "Marketing", does: "Writes your copy and prepares campaigns." },
  { icon: TrendingUp, name: "Growth", does: "Finds your first users and keeps them." },
  { icon: Settings2, name: "Operations", does: "Handles the day-to-day running of the business." },
];

const CONTROLS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Wallet,
    title: "Approval before spending",
    body: "Hosting, tools and ads never cost you a cent until you say yes. Every request shows the exact amount.",
  },
  {
    icon: KeyRound,
    title: "Credentials stay private",
    body: "Passwords and API keys are entered in a secure form. They never appear in activity or reports.",
  },
  {
    icon: ScrollText,
    title: "A clear record of everything",
    body: "Every task, handoff and decision is logged in plain language, so you can always see who did what.",
  },
  {
    icon: CircleDollarSign,
    title: "Budgets you set",
    body: "Set a monthly limit and see spend by department. Veyra pauses and asks before going over.",
  },
];

// Placeholder quotes: replace with real customer stories before launch.
const TESTIMONIALS: { quote: string; role: string; initials: string }[] = [
  {
    quote:
      "I had an idea and no team. A week later I had a plan, a design and a working booking flow to review.",
    role: "First-time founder, home services",
    initials: "AO",
  },
  {
    quote:
      "I like that I never read a log. I open the dashboard, see what changed, and approve what needs me.",
    role: "Solo founder, online marketplace",
    initials: "MK",
  },
  {
    quote:
      "The approval requests are the best part. They tell me why, what it costs and what happens if I decline.",
    role: "Founder, subscription startup",
    initials: "TD",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need technical skills to use Veyra?",
    a: "No. Veyra is designed for founders. Everything is reported in plain language, and you only make the business decisions.",
  },
  {
    q: "What can Veyra do without asking me?",
    a: "Research, planning, design, building and testing happen on their own. Anything sensitive, like spending money, publishing publicly, sending emails or using credentials, waits for your approval.",
  },
  {
    q: "How do I know what the team is doing?",
    a: "Your dashboard shows progress by department, a plain-language activity feed, and every task with its status, owner and deliverables.",
  },
  {
    q: "Can I add my own people to the team?",
    a: "Yes. Invite teammates, give them access to specific departments, and assign tasks to people or AI team members.",
  },
  {
    q: "Is my idea kept private?",
    a: "Your startup, its plans and its files are private to you and the people you invite.",
  },
];

/* ==================================================================
   Shared primitives
   ================================================================== */

const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-150 whitespace-nowrap";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:bg-primary-hover h-10 px-4`;
const btnSecondary = `${btn} border border-border bg-surface text-text hover:bg-surface-muted h-10 px-4`;
const btnGhost = `${btn} text-text-muted hover:text-text hover:bg-surface-muted h-10 px-3`;

const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";

type Tone = "success" | "warning" | "danger" | "info" | "primary" | "muted";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  primary: "bg-primary-soft text-primary",
  muted: "bg-surface-muted text-text-muted",
};

function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Veyra home">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-tight">Veyra</span>
    </Link>
  );
}

/** Applies and persists the theme. Uses the same "veyra-theme" key as the inline script in layout.tsx. */
function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("veyra-theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable: the theme still changes for this visit */
    }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      className="grid size-10 place-items-center rounded-xl text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
    >
      <Sun className="hidden size-[18px] dark:block" aria-hidden />
      <Moon className="size-[18px] dark:hidden" aria-hidden />
    </button>
  );
}

/** Browser-style frame used to present product mockups. */
function Window({
  children,
  url = "app.veyra.ai",
  className = "",
}: {
  children: ReactNode;
  url?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-surface shadow-lift ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-border bg-surface-muted px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto rounded-md bg-surface px-3 py-0.5 text-[11px] text-text-muted">
          {url}
        </div>
        <span className="w-10" aria-hidden />
      </div>
      {children}
    </div>
  );
}

/* ==================================================================
   Navbar
   ================================================================== */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
        scrolled || open
          ? "border-border bg-background/85"
          : "border-transparent bg-background/40"
      }`}
    >
      <div className={`${container} flex h-16 items-center justify-between gap-6`}>
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={btnGhost}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/sign-in" className={`${btnGhost} hidden sm:inline-flex`}>
            Sign in
          </Link>
          <Link href="/sign-up" className={`${btnPrimary} hidden sm:inline-flex`}>
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-xl text-text-muted hover:bg-surface-muted md:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className={`${container} flex flex-col gap-1 py-4`}>
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-text hover:bg-surface-muted"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/sign-in" className={btnSecondary}>
                  Sign in
                </Link>
                <Link href="/sign-up" className={btnPrimary}>
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ==================================================================
   Hero
   ================================================================== */

function IdeaForm() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = idea.trim() ? `?idea=${encodeURIComponent(idea.trim())}` : "";
    router.push(`/new-startup${q}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-soft sm:flex-row"
    >
      <label htmlFor="idea" className="sr-only">
        Describe your business idea
      </label>
      <input
        id="idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="A marketplace for verified local electricians…"
        className="h-11 min-w-0 flex-1 rounded-xl bg-transparent px-3 text-sm placeholder:text-text-muted focus-visible:outline-offset-0"
      />
      <button type="submit" className={`${btnPrimary} h-11 px-5`}>
        Build my startup
      </button>
    </form>
  );
}

const HERO_NAV: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileSearch, label: "Business Analysis" },
  { icon: Building2, label: "Departments" },
  { icon: ListChecks, label: "Tasks" },
  { icon: Activity, label: "Activity" },
  { icon: ShieldCheck, label: "Approvals" },
];

const HERO_DEPTS: { name: string; doing: string; value: number; done?: boolean }[] = [
  { name: "Product", doing: "Writing booking requirements", value: 72 },
  { name: "Engineering", doing: "Building the payments flow", value: 48 },
  { name: "Design", doing: "Brand and screens finished", value: 100, done: true },
  { name: "Marketing", doing: "Drafting the launch campaign", value: 31 },
];

const HERO_FEED = [
  "Design finished 12 app screens",
  "QA found 2 issues in checkout",
  "Product added 6 new tasks",
  "Marketing drafted a campaign",
];

function HeroDashboard() {
  return (
    <Window url="app.veyra.ai/s/localfix">
      <div className="flex min-h-[340px] sm:min-h-[420px]">
        <aside className="hidden w-48 shrink-0 border-r border-border bg-surface-muted/50 p-3 sm:block">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-xs font-medium">
            <span className="grid size-5 place-items-center rounded bg-primary text-[10px] text-primary-foreground">
              L
            </span>
            LocalFix
          </div>
          <ul className="space-y-0.5">
            {HERO_NAV.map(({ icon: Icon, label, active }) => (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                  active ? "bg-primary-soft font-medium text-primary" : "text-text-muted"
                }`}
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
                {label === "Approvals" && (
                  <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                    3
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Good morning, Ada</p>
              <p className="text-xs text-text-muted">LocalFix is in the building stage</p>
            </div>
            <Pill tone="primary">62% complete</Pill>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { n: "24", l: "Tasks done" },
              { n: "9", l: "In progress" },
              { n: "3", l: "Need you" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border p-3">
                <p className="text-lg font-semibold leading-none">{s.n}</p>
                <p className="mt-1.5 text-[11px] text-text-muted">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <ul className="space-y-3.5">
              {HERO_DEPTS.map((d, i) => (
                <li key={d.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      {d.done ? (
                        <CheckCircle2 className="size-3.5 text-success" aria-hidden />
                      ) : (
                        <Bot className="size-3.5 text-primary" aria-hidden />
                      )}
                      {d.name}
                    </span>
                    <span className="truncate text-text-muted">{d.doing}</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value}%` }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 + i * 0.12 }}
                    className={`h-1.5 rounded-full ${d.done ? "bg-success" : "bg-primary"}`}
                  />
                </li>
              ))}
            </ul>

            <div className="hidden rounded-xl bg-surface-muted p-3 md:block">
              <p className="mb-2 text-[11px] font-medium text-text-muted">Latest activity</p>
              <ul className="space-y-2">
                {HERO_FEED.map((f) => (
                  <li key={f} className="flex gap-2 text-[11px] leading-snug">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Faint grid, fading out downward */}
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-24 -z-10 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className={`${container} pb-20 pt-14 text-center sm:pt-20`}>
        <motion.a
          href="#how-it-works"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted shadow-soft hover:text-text"
        >
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          Your AI company, ready in minutes
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
        >
          Your first startup team, powered by AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg"
        >
          Describe your idea. Veyra creates the departments that plan, build, test, launch and
          grow your business, while you approve the decisions that matter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="mt-9"
        >
          <IdeaForm />
          <p className="mt-3 text-sm text-text-muted">Free to start. No technical skills needed.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
          className="relative mx-auto mt-16 max-w-4xl text-left"
          role="img"
          aria-label="Veyra dashboard showing progress across Product, Engineering, Design and Marketing"
        >
          <HeroDashboard />

          {/* Floating cards overlap the frame on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            className="absolute -right-6 -top-6 hidden w-56 rounded-xl border border-border bg-surface p-3.5 shadow-lift lg:block"
          >
            <Pill tone="warning">
              <Clock className="size-3" aria-hidden /> Needs approval
            </Pill>
            <p className="mt-2 text-xs font-medium leading-snug">Launch your first marketing campaign</p>
            <p className="mt-1 text-[11px] text-text-muted">Marketing · First public post</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1.3 }}
            className="absolute -bottom-6 -left-6 hidden w-60 items-center gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-lift lg:flex"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="size-4" aria-hidden />
            </span>
            <p className="text-xs leading-snug">
              <span className="font-medium">Design</span> finished your brand kit
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section aria-label="What you can build" className="border-y border-border bg-surface">
      <div className={`${container} flex flex-col items-center gap-4 py-8 md:flex-row md:justify-between`}>
        <p className="text-sm text-text-muted">Built for founders starting</p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
          {USE_CASES.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ==================================================================
   Feature rows, each with a product mockup
   ================================================================== */

function FeatureRow({
  id,
  icon: Icon,
  title,
  body,
  points,
  reverse,
  children,
}: {
  id?: string;
  icon: LucideIcon;
  title: string;
  body: string;
  points: string[];
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <div id={id} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? "lg:order-2" : ""}>
        <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <h3 className="mt-5 max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">{body}</p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "lg:order-1" : ""} aria-hidden>
        {children}
      </div>
    </div>
  );
}

function AnalysisMock() {
  const items: { tone: Tone; label: string; text: string }[] = [
    { tone: "success", label: "Verified", text: "Customers struggle to find trusted electricians and plumbers." },
    { tone: "success", label: "Verified", text: "Most bookings today start with a phone call or a referral." },
    { tone: "warning", label: "Assumption", text: "Customers will pay a small booking fee for verified providers." },
    { tone: "primary", label: "Recommendation", text: "Launch in one city first, then expand once reviews build trust." },
  ];
  return (
    <Window url="app.veyra.ai/s/localfix/analysis">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Business analysis</p>
          <Pill tone="success">Ready</Pill>
        </div>
        <ul className="mt-4 space-y-2.5">
          {items.map((i) => (
            <li key={i.text} className="rounded-xl border border-border p-3.5">
              <Pill tone={i.tone}>{i.label}</Pill>
              <p className="mt-2 text-[13px] leading-snug">{i.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

function TasksMock() {
  const tasks: { title: string; dept: string; tone: Tone; status: string; high?: boolean }[] = [
    { title: "Design the booking flow", dept: "Product", tone: "info", status: "Working", high: true },
    { title: "Build payment checkout", dept: "Engineering", tone: "warning", status: "Waiting for your approval", high: true },
    { title: "Test confirmation emails", dept: "QA", tone: "muted", status: "Waiting for team" },
    { title: "Write launch email copy", dept: "Marketing", tone: "muted", status: "Planned" },
  ];
  const handoff = ["Product", "Engineering", "QA", "Engineering"];
  return (
    <Window url="app.veyra.ai/s/localfix/tasks">
      <div className="p-5">
        <p className="text-sm font-semibold">Tasks</p>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {tasks.map((t) => (
            <li key={t.title} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{t.title}</p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {t.dept}
                  {t.high ? " · High priority" : ""}
                </p>
              </div>
              <Pill tone={t.tone}>{t.status}</Pill>
            </li>
          ))}
        </ul>
        <p className="mb-2 mt-5 text-[11px] font-medium text-text-muted">How work moved</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {handoff.map((h, i) => (
            <span key={`${h}-${i}`} className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium">
                <Bot className="size-3 text-primary" aria-hidden />
                {h}
              </span>
              {i < handoff.length - 1 && <ArrowRight className="size-3 text-text-muted" aria-hidden />}
            </span>
          ))}
        </div>
      </div>
    </Window>
  );
}

function ApprovalMock() {
  const rows = [
    { l: "What", v: "Connect your payment provider so customers can pay for bookings." },
    { l: "Why", v: "Checkout cannot go live without a way to take payments." },
    { l: "If you approve", v: "Engineering finishes checkout and QA begins testing." },
    { l: "If you decline", v: "Checkout stays unfinished and launch moves back." },
  ];
  return (
    <Window url="app.veyra.ai/s/localfix/approvals">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Connect payment provider</p>
          <Pill tone="warning">
            <KeyRound className="size-3" aria-hidden /> Secure input
          </Pill>
        </div>
        <dl className="mt-4 space-y-3">
          {rows.map((r) => (
            <div key={r.l} className="rounded-xl bg-surface-muted px-3.5 py-3">
              <dt className="text-[11px] font-medium text-text-muted">{r.l}</dt>
              <dd className="mt-0.5 text-[13px] leading-snug">{r.v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground">
            Approve
          </span>
          <span className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium">
            Ask a question
          </span>
          <span className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-danger">
            Decline
          </span>
        </div>
      </div>
    </Window>
  );
}

function ActivityMock() {
  const feed: { icon: LucideIcon; tone: Tone; text: string; time: string }[] = [
    { icon: CheckCircle2, tone: "success", text: "Design finished the brand kit and 12 app screens.", time: "2h ago" },
    { icon: Search, tone: "info", text: "QA found 2 issues in checkout. Engineering is fixing them.", time: "3h ago" },
    { icon: Clock, tone: "warning", text: "Marketing drafted your launch campaign and needs your approval.", time: "5h ago" },
    { icon: ListChecks, tone: "primary", text: "Product added 6 new tasks for the booking flow.", time: "Yesterday" },
  ];
  return (
    <Window url="app.veyra.ai/s/localfix/activity">
      <div className="p-5">
        <p className="text-sm font-semibold">Activity</p>
        <ul className="mt-4 space-y-4">
          {feed.map(({ icon: Icon, tone, text, time }) => (
            <li key={text} className="flex gap-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full ${toneClass[tone]}`}>
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-[13px] leading-snug">{text}</p>
                <p className="mt-0.5 text-[11px] text-text-muted">{time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

function Features() {
  return (
    <section id="product" className={`${container} scroll-mt-20 py-24`}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything a company does, in one calm dashboard
        </h2>
        <p className="mt-4 text-base text-text-muted sm:text-lg">
          Research, planning, building and launching are handled by your team. You see the
          progress and make the calls.
        </p>
      </div>

      <div className="mt-20 space-y-28">
        <FeatureRow
          icon={FileSearch}
          title="Start with research you can trust"
          body="Before anything is built, Veyra studies your market and shows its work, clearly separating facts from guesses."
          points={[
            "Verified facts link to their source",
            "Assumptions are flagged so you can challenge them",
            "Recommendations tell you what to do next",
          ]}
        >
          <AnalysisMock />
        </FeatureRow>

        <FeatureRow
          icon={ListChecks}
          title="A team that hands work to each other"
          body="Tasks move between departments like they do in a real company. See who owns what, what is blocked and why."
          points={[
            "Every task has an owner, priority and status",
            "Dependencies and handoffs are visible",
            "Statuses are written in plain language",
          ]}
          reverse
        >
          <TasksMock />
        </FeatureRow>

        <FeatureRow
          icon={ShieldCheck}
          title="You decide what matters"
          body="Sensitive actions wait for you. Each request explains itself, so approving takes seconds, not research."
          points={[
            "See the cost and the risks up front",
            "Know what happens if you approve or decline",
            "Enter credentials through a secure form",
          ]}
        >
          <ApprovalMock />
        </FeatureRow>

        <FeatureRow
          icon={Activity}
          title="Follow progress without reading logs"
          body="A running story of your business, written for founders. Catch up in under a minute."
          points={[
            "Milestones show how close launch is",
            "Notifications only for things that need you",
            "Reports summarise each week",
          ]}
          reverse
        >
          <ActivityMock />
        </FeatureRow>
      </div>
    </section>
  );
}

/* ==================================================================
   How it works, Departments, Control
   ================================================================== */

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-surface">
      <div className={`${container} py-24`}>
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From idea to a running business in three steps
          </h2>
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm text-text-muted">Step {i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Departments() {
  return (
    <section id="departments" className={`${container} scroll-mt-20 py-24`}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          A full company, not a chatbot
        </h2>
        <p className="mt-4 text-base text-text-muted sm:text-lg">
          Each department has its own AI team members, tasks and deliverables, and they work
          together toward launch.
        </p>
      </div>
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEPARTMENTS.map(({ icon: Icon, name, does }) => (
          <motion.li
            key={name}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.15 }}
            className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-surface-muted text-primary">
              <Icon className="size-[18px]" aria-hidden />
            </span>
            <h3 className="mt-4 text-sm font-semibold">{name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{does}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Control() {
  return (
    <section id="control" className="scroll-mt-20 border-y border-border bg-surface">
      <div className={`${container} py-24`}>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              You stay in control, always
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
              Autonomous does not mean unsupervised. Veyra works on its own for everyday tasks and
              stops to ask before anything sensitive.
            </p>
            <Link href="/sign-up" className={`${btnPrimary} mt-8 h-11 px-5`}>
              Try it with your idea
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {CONTROLS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-2xl border border-border bg-background p-5">
                <span className="grid size-9 place-items-center rounded-lg bg-success-soft text-success">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   Testimonials, FAQ, CTA, Footer
   ================================================================== */

function Testimonials() {
  return (
    <section className={`${container} py-24`}>
      <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Founders focus on the business, not the busywork
      </h2>
      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <li key={t.initials} className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <blockquote className="text-[15px] leading-relaxed">“{t.quote}”</blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {t.initials}
              </span>
              <p className="text-sm text-text-muted">{t.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Questions, answered
        </h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left text-base font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown
                  className="size-5 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={`${container} py-24`}>
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
        <div
          aria-hidden
          className="bg-grid absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          Ready to meet your startup team?
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-base opacity-90">
          Describe your idea today and see your first plan, departments and tasks in minutes.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className={`${btn} h-11 bg-surface px-6 text-text hover:bg-surface-muted`}
          >
            Start your startup
          </Link>
          <Link
            href="/sign-in"
            className={`${btn} h-11 px-6 text-primary-foreground hover:bg-white/10`}
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#product" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Departments", href: "#departments" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Sign in", href: "/sign-in" },
        { label: "Sign up", href: "/sign-up" },
        { label: "Start a startup", href: "/new-startup" },
      ],
    },
  ];
  return (
    <footer className="border-t border-border">
      <div className={`${container} grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]`}>
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
            Your first startup team, powered by AI.
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-sm font-semibold">{c.title}</p>
            <ul className="mt-4 space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("#") ? (
                    <a href={l.href} className="text-sm text-text-muted hover:text-text">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-text-muted hover:text-text">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        {/* <p className={`${container} py-6 text-sm text-text-muted`}>
          © {new Date().getFullYear()} Veyra. All rights reserved.
        </p> */}
      </div>
    </footer>
  );
}

/* ==================================================================
   Page
   ================================================================== */

export default function LandingPage() {
  return (
    // reducedMotion="user": framer-motion skips movement if the OS asks for less motion
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <UseCases />
        <Features />
        <HowItWorks />
        <Departments />
        <Control />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </MotionConfig>
  );
}
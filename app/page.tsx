"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Clock,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------
   Marketing copy lives here (not app data, so no service layer needed).
   The real landing page will be refined in a later prompt.
------------------------------------------------------------------- */

const DEPARTMENTS: { name: string; does: string }[] = [
  { name: "Strategy", does: "Researches your market and shapes the plan." },
  { name: "Product", does: "Turns the plan into clear features and priorities." },
  { name: "Design", does: "Creates the look, flows and brand." },
  { name: "Engineering", does: "Builds and ships the working product." },
  { name: "QA", does: "Tests everything before a customer sees it." },
  { name: "Marketing", does: "Writes the copy and runs your campaigns." },
  { name: "Growth", does: "Finds your first users and keeps them." },
  { name: "Operations", does: "Handles the day-to-day running of the business." },
];

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lightbulb,
    title: "Describe your idea",
    body: "A few sentences is enough. Veyra researches the market and sets out what is known, what is assumed and what it recommends.",
  },
  {
    icon: Users,
    title: "Your team is assembled",
    body: "Departments and AI team members are created for your business, each with clear responsibilities and tasks.",
  },
  {
    icon: Rocket,
    title: "Watch it get built",
    body: "Follow progress in plain language. No logs, no jargon. Just what was done, what is next and what needs you.",
  },
];

const PREVIEW_ROWS: {
  department: string;
  doing: string;
  progress: number;
  done?: boolean;
}[] = [
  { department: "Product", doing: "Writing booking requirements", progress: 72 },
  { department: "Engineering", doing: "Building the payments flow", progress: 48 },
  { department: "Design", doing: "Brand and screens finished", progress: 100, done: true },
  { department: "Marketing", doing: "Drafting the launch campaign", progress: 31 },
];

/* ------------------------------------------------------------------
   Shared bits
------------------------------------------------------------------- */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-150 disabled:opacity-60";
const buttonPrimary = `${buttonBase} bg-primary text-primary-foreground hover:bg-primary-hover h-10 px-4`;
const buttonGhost = `${buttonBase} text-text-muted hover:text-text hover:bg-surface-muted h-10 px-3`;

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

/* ------------------------------------------------------------------
   Sections
------------------------------------------------------------------- */

function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Logo />
      <nav aria-label="Main" className="flex items-center gap-1">
        <Link href="/sign-in" className={buttonGhost}>
          Sign in
        </Link>
        <Link href="/sign-up" className={buttonPrimary}>
          Get started
        </Link>
      </nav>
    </header>
  );
}

function IdeaForm() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = idea.trim() ? `?idea=${encodeURIComponent(idea.trim())}` : "";
    router.push(`/new-startup${query}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-soft sm:flex-row"
    >
      <label htmlFor="idea" className="sr-only">
        Describe your business idea
      </label>
      <input
        id="idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="A marketplace for verified local electricians…"
        className="h-11 min-w-0 flex-1 rounded-xl bg-transparent px-3 text-sm text-text placeholder:text-text-muted focus-visible:outline-offset-0"
      />
      <button type="submit" className={`${buttonPrimary} h-11 px-5`}>
        Build my startup
      </button>
    </form>
  );
}

/** The one memorable moment: a live-feeling view of departments at work. */
function TeamPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
      className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-lift"
      role="img"
      aria-label="Preview of a startup dashboard showing four departments and their progress"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">LocalFix</p>
          <p className="text-xs text-text-muted">Building · Week 3</p>
        </div>
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
          62% complete
        </span>
      </div>

      <ul className="mt-5 space-y-4">
        {PREVIEW_ROWS.map((row, i) => (
          <li key={row.department}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                {row.done ? (
                  <CheckCircle2 className="size-4 text-success" aria-hidden />
                ) : (
                  <Bot className="size-4 text-primary" aria-hidden />
                )}
                {row.department}
              </span>
              <span className="truncate text-xs text-text-muted">{row.doing}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <motion.div
                className={`h-full rounded-full ${row.done ? "bg-success" : "bg-primary"}`}
                initial={{ width: 0 }}
                animate={{ width: `${row.progress}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 + i * 0.12 }}
              />
            </div>
          </li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 1.2 }}
        className="mt-5 flex items-center gap-3 rounded-xl bg-warning-soft px-3.5 py-3"
      >
        <Clock className="size-4 shrink-0 text-warning" aria-hidden />
        <p className="text-xs leading-snug text-text">
          <span className="font-medium">Needs your approval:</span> first public marketing campaign
        </p>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-20">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
        >
          Your first startup team, powered by AI.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
          className="mt-5 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg"
        >
          Tell Veyra your business idea. It creates the departments that plan,
          build, test, launch and grow it, while you approve the decisions that matter.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
          className="mt-8"
        >
          <IdeaForm />
          <p className="mt-3 text-sm text-text-muted">
            Free to start. No technical knowledge needed.
          </p>
        </motion.div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <TeamPreview />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
          From idea to a running business in three steps
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm text-text-muted">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Departments() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="max-w-sm text-2xl font-semibold tracking-tight sm:text-3xl">
            A full company, not a chatbot
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-text-muted">
            Each department has its own AI team members, tasks and deliverables.
            They hand work to each other the way a real team does.
          </p>
        </div>
        <dl className="grid gap-x-8 sm:grid-cols-2">
          {DEPARTMENTS.map((d) => (
            <div key={d.name} className="border-t border-border py-4">
              <dt className="text-sm font-semibold">{d.name}</dt>
              <dd className="mt-1 text-sm text-text-muted">{d.does}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FounderControl() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8 shadow-soft sm:flex-row sm:items-center sm:gap-10 sm:p-10">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
          <ShieldCheck className="size-6" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            You stay in control
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-text-muted">
            Spending money, publishing publicly, sending emails and entering
            credentials always wait for your approval. Each request explains
            what will happen, why, and what changes if you say no.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to meet your team?
        </h2>
        <Link href="/sign-up" className={`${buttonPrimary} h-11 px-6`}>
          Start your startup
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <p>© {new Date().getFullYear()} Veyra. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    // reducedMotion="user": framer-motion skips transforms if the OS asks for less motion
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Departments />
        <FounderControl />
        <FinalCta />
      </main>
      <Footer />
    </MotionConfig>
  );
}
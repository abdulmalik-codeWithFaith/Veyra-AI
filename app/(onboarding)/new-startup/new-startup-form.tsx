"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";

const MIN_IDEA_LENGTH = 20;
const MAX_IDEA_LENGTH = 600;

const EXAMPLES: { name: string; idea: string }[] = [
  {
    name: "LocalFix",
    idea: "A marketplace for verified local electricians, plumbers and technicians, with booking, payments and reviews.",
  },
  {
    name: "PetPal",
    idea: "A monthly subscription box for pet owners, with toys and treats chosen for each pet's age and size.",
  },
  {
    name: "StudyLoop",
    idea: "A mobile app that matches university students into study groups based on their courses and schedules.",
  },
  {
    name: "FreshCrate",
    idea: "A weekly delivery of fresh produce straight from local farmers to city households.",
  },
];

const BUILD_STEPS = [
  "Understanding your idea",
  "Researching your market",
  "Choosing your departments",
  "Preparing your dashboard",
];
const STEP_DURATION_MS = 1000;

type Errors = { name?: string; idea?: string };

function validate(name: string, idea: string): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = "Give your startup a name.";
  if (idea.trim().length < MIN_IDEA_LENGTH) {
    errors.idea = `Describe your idea in at least ${MIN_IDEA_LENGTH} characters so the team has enough to work with.`;
  }
  return errors;
}

const fieldClass = (invalid: boolean) =>
  `w-full rounded-xl border bg-surface px-3.5 text-sm placeholder:text-text-muted transition-colors focus-visible:outline-offset-0 ${
    invalid ? "border-danger" : "border-border hover:border-text-muted/50"
  }`;

/** Shown after submit: steps tick off while the team is "assembled", then we navigate. */
function BuildingScreen({ name, onDone }: { name: string; onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => s + 1), STEP_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step >= BUILD_STEPS.length) onDone();
  }, [step, onDone]);

  const percent = Math.min(100, (step / BUILD_STEPS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-border bg-surface p-8 shadow-soft"
      role="status"
      aria-live="polite"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
        <Sparkles className="size-5" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">
        Assembling the team for {name}
      </h1>
      <p className="mt-2 text-sm text-text-muted">This only takes a moment.</p>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <ul className="mt-6 space-y-3.5">
        {BUILD_STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={label}
              className={`flex items-center gap-3 text-sm ${done || active ? "text-text" : "text-text-muted"}`}
            >
              {done ? (
                <CheckCircle2 className="size-[18px] text-success" aria-hidden />
              ) : active ? (
                <Loader2 className="size-[18px] animate-spin text-primary" aria-hidden />
              ) : (
                <Circle className="size-[18px]" aria-hidden />
              )}
              {label}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export function NewStartupForm() {
  const router = useRouter();
  // The landing page passes the idea along as ?idea=...
  const initialIdea = useSearchParams().get("idea") ?? "";
  const [name, setName] = useState("");
  const [idea, setIdea] = useState(initialIdea.slice(0, MAX_IDEA_LENGTH));
  const [errors, setErrors] = useState<Errors>({});
  const [building, setBuilding] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(name, idea);
    setErrors(found);
    if (Object.keys(found).length === 0) setBuilding(true);
  }

  function applyExample(example: { name: string; idea: string }) {
    setName(example.name);
    setIdea(example.idea);
    setErrors({});
  }

  // useCallback keeps the identity stable so BuildingScreen's effect fires navigation only once
  const handleDone = useCallback(() => {
    // TODO: call startupService.create({ name, ideaSummary: idea }) and route to `/s/${startup.id}`.
    // Until the app shell exists, this goes to the seeded demo startup.
    router.push("/s/localfix");
  }, [router]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {building ? (
          <BuildingScreen key="building" name={name.trim()} onDone={handleDone} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What are you building?
            </h1>
            <p className="mt-3 text-base leading-relaxed text-text-muted">
              Describe your idea in plain words. Veyra will research it and set up a team to build it.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
            >
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Startup name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="e.g. LocalFix"
                  maxLength={60}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`${fieldClass(Boolean(errors.name))} h-11`}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1.5 text-xs text-danger">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="idea" className="text-sm font-medium">
                    Your idea
                  </label>
                  <span className="text-xs text-text-muted" aria-live="off">
                    {idea.length}/{MAX_IDEA_LENGTH}
                  </span>
                </div>
                <textarea
                  id="idea"
                  value={idea}
                  onChange={(e) => {
                    setIdea(e.target.value);
                    setErrors((p) => ({ ...p, idea: undefined }));
                  }}
                  rows={5}
                  maxLength={MAX_IDEA_LENGTH}
                  placeholder="Who is it for, what problem does it solve, and how will it work?"
                  aria-invalid={Boolean(errors.idea)}
                  aria-describedby={errors.idea ? "idea-error" : undefined}
                  className={`${fieldClass(Boolean(errors.idea))} resize-none py-3 leading-relaxed`}
                />
                {errors.idea && (
                  <p id="idea-error" role="alert" className="mt-1.5 text-xs text-danger">
                    {errors.idea}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2.5 text-xs font-medium text-text-muted">Need inspiration? Try an example</p>
                <ul className="flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <li key={ex.name}>
                      <button
                        type="button"
                        onClick={() => applyExample(ex)}
                        className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                      >
                        {ex.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Sparkles className="size-4" aria-hidden />
                Build my startup
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
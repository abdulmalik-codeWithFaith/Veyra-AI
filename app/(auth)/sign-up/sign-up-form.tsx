"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type FieldName = "name" | "email" | "password";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName | "form", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_PATTERN.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (v.password.length < 8) errors.password = "Use at least 8 characters.";
  return errors;
}

/** Rough strength score from 0 (empty) to 4. Visual guidance only, not a security check. */
function passwordStrength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(score, 1);
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["", "bg-danger", "bg-warning", "bg-info", "bg-success"];

const inputClass = (invalid: boolean) =>
  `h-11 w-full rounded-xl border bg-surface px-3.5 text-sm placeholder:text-text-muted transition-colors focus-visible:outline-offset-0 ${
    invalid ? "border-danger" : "border-border hover:border-text-muted/50"
  }`;

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(values.password);

  function handleChange(field: FieldName) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear this field's error as soon as the person starts fixing it
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      // TODO: replace with authService.signUp(...) from "@/services" once the service layer exists.
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push("/new-startup");
    } catch {
      setErrors({ form: "We could not create your account. Please try again." });
      setLoading(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Create your account</h1>
        <p className="mt-2 text-sm text-text-muted">
          Start building your startup with an AI team in minutes.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {errors.form && (
            <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-3 text-sm text-danger">
              {errors.form}
            </p>
          )}

          <Field id="name" label="Full name" error={errors.name}>
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange("name")}
              placeholder="Ada Okafor"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass(Boolean(errors.name))}
            />
          </Field>

          <Field id="email" label="Work email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange("email")}
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(Boolean(errors.email))}
            />
          </Field>

          <Field
            id="password"
            label="Password"
            error={errors.password}
            hint={values.password ? undefined : "At least 8 characters."}
          >
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange("password")}
                placeholder="Create a password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : "password-strength"}
                className={`${inputClass(Boolean(errors.password))} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-text-muted hover:bg-surface-muted hover:text-text"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>

            {values.password && (
              <div id="password-strength" className="mt-2.5" aria-live="polite">
                <div className="flex gap-1.5" aria-hidden>
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-surface-muted">
                      <motion.span
                        className={`block h-full ${STRENGTH_COLOR[strength]}`}
                        initial={false}
                        animate={{ width: i <= strength ? "100%" : "0%" }}
                        transition={{ duration: 0.2 }}
                      />
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  Password strength: {STRENGTH_LABEL[strength]}
                </p>
              </div>
            )}
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {loading ? "Creating your account…" : "Create account"}
          </button>

          <p className="text-center text-xs leading-relaxed text-text-muted">
            By creating an account you agree to our{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-text">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-text">
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </motion.div>
    </MotionConfig>
  );
}
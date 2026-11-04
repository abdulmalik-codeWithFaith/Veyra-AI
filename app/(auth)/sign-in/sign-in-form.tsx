"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type FieldName = "email" | "password";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName | "form", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!EMAIL_PATTERN.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!v.password) errors.password = "Enter your password.";
  return errors;
}

const inputClass = (invalid: boolean) =>
  `h-11 w-full rounded-xl border bg-surface px-3.5 text-sm placeholder:text-text-muted transition-colors focus-visible:outline-offset-0 ${
    invalid ? "border-danger" : "border-border hover:border-text-muted/50"
  }`;

function Field({
  id,
  label,
  error,
  action,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {action}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      // TODO: replace with authService.signIn(email, password) from "@/services" once the service layer exists.
      await new Promise((resolve) => setTimeout(resolve, 700));
      // TODO: route to the person's most recent startup (/s/[startupId]) once startups load from the service.
      router.push("/new-startup");
    } catch {
      setErrors({ form: "Those details did not match. Please check them and try again." });
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
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-text-muted">
          Sign in to see what your team has been working on.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {errors.form && (
            <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-3 text-sm text-danger">
              {errors.form}
            </p>
          )}

          <Field id="email" label="Email" error={errors.email}>
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
            action={
              <Link
                href="#"
                className="text-xs font-medium text-primary hover:text-primary-hover"
              >
                Forgot password?
              </Link>
            }
          >
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
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
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {loading ? "Signing you in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          New to Veyra?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:text-primary-hover">
            Create an account
          </Link>
        </p>
      </motion.div>
    </MotionConfig>
  );
}
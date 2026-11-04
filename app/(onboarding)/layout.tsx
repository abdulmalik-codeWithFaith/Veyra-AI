import Link from "next/link";
import { Sparkles } from "lucide-react";

/** Minimal shell for onboarding: just the logo, so nothing distracts from the idea. */
export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-10 -z-10 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/30"
      />

      <header className="mx-auto flex h-16 w-full max-w-5xl items-center px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Veyra home">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">Veyra</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-8 sm:px-8 sm:pt-14">{children}</main>
    </div>
  );
}
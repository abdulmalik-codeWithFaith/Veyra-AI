import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  "Describe your idea and get a plan in minutes",
  "AI departments build, test and launch for you",
  "You approve every sensitive decision",
];

/** Shared shell for sign-in and sign-up: form on the left, brand panel on the right. */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Link href="/" className="flex w-fit items-center gap-2" aria-label="Veyra home">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">Veyra</span>
        </Link>

        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {children}
        </main>
      </div>

      <aside className="relative hidden overflow-hidden lg:block" aria-label="About Veyra">
        <Image
          src="/images/team.svg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
        />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Your first startup team, powered by AI.
          </h2>
          <ul className="mt-6 space-y-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-300" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
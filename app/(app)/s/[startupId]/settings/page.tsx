"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { AsyncView } from "@/components/ui/async-view";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { getThemePreference, setThemePreference, subscribeToTheme, type ThemePreference } from "@/lib/theme";
import { useAsync } from "@/lib/use-async";
import { authService, startupService, usageService } from "@/services";

const THEMES: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-border py-8 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-10">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function GeneralForm() {
  const { startup, refreshStartup } = useStartup();
  const { toast } = useToast();
  const [name, setName] = useState(startup.name);
  const [tagline, setTagline] = useState(startup.tagline ?? "");
  const [idea, setIdea] = useState(startup.ideaSummary);
  const [errors, setErrors] = useState<{ name?: string; idea?: string }>({});
  const [saving, setSaving] = useState(false);

  const dirty = name !== startup.name || tagline !== (startup.tagline ?? "") || idea !== startup.ideaSummary;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: typeof errors = {};
    if (name.trim().length < 2) found.name = "Give your startup a name.";
    if (idea.trim().length < 20) found.idea = "Describe your idea in at least 20 characters.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await startupService.update(startup.id, {
        name: name.trim(),
        tagline: tagline.trim() || undefined,
        ideaSummary: idea.trim(),
      });
      refreshStartup();
      toast({ title: "Settings saved", variant: "success" });
    } catch {
      toast({ title: "Could not save your changes", description: "Please try again.", variant: "danger" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Input label="Startup name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} maxLength={60} />
      <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} hint="A short line shown under your name." maxLength={100} />
      <Textarea label="Your idea" value={idea} onChange={(e) => setIdea(e.target.value)} error={errors.idea} rows={4} maxLength={600} />
      <Button type="submit" loading={saving} disabled={!dirty}>
        Save changes
      </Button>
    </form>
  );
}

function ThemePicker() {
  const preference = useSyncExternalStore(subscribeToTheme, getThemePreference, () => "system" as ThemePreference);
  return (
    <div role="radiogroup" aria-label="Theme" className="grid max-w-md grid-cols-3 gap-3">
      {THEMES.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setThemePreference(value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-colors",
              active ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-muted",
            )}
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsPage() {
  const { startup } = useStartup();
  const usage = useAsync(() => usageService.get(startup.id), [startup.id]);
  const user = useAsync(() => authService.getCurrentUser(), []);

  return (
    <>
      <PageHeader title="Settings" description="Your startup details, budget and preferences." />

      <Card className="p-6 sm:p-8">
        <Section title="Startup details" description="How your startup appears across Veyra.">
          {/* Keyed so the form resets if the startup changes */}
          <GeneralForm key={startup.id} />
        </Section>

        <Section title="Budget" description="Veyra asks before spending beyond your limit.">
          <AsyncView state={usage} loading={<Skeleton className="h-20 w-full max-w-md rounded-xl" />}>
            {(u) => (
              <div className="max-w-md">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-semibold">{formatCurrency(u.totalCost, u.currency)}</p>
                  <p className="text-sm text-text-muted">
                    {u.budgetLimit ? `of ${formatCurrency(u.budgetLimit, u.currency)}` : "No limit set"}
                  </p>
                </div>
                {u.budgetLimit && (
                  <ProgressBar label="Budget used" value={(u.totalCost / u.budgetLimit) * 100} className="mt-3" />
                )}
                <p className="mt-3 text-xs text-text-muted">Changing the budget limit will be available once the backend is connected.</p>
              </div>
            )}
          </AsyncView>
        </Section>

        <Section title="Appearance" description="Choose how Veyra looks on this device.">
          <ThemePicker />
        </Section>

        <Section title="Your account" description="The account you are signed in with.">
          <AsyncView state={user} loading={<Skeleton className="h-12 w-64 rounded-xl" />}>
            {(u) =>
              u && (
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold">{u.name}</p>
                    <p className="text-xs text-text-muted">{u.email}</p>
                  </div>
                </div>
              )
            }
          </AsyncView>
        </Section>
      </Card>
    </>
  );
}
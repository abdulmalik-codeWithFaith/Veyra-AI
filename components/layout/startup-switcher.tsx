"use client";

import { Check, ChevronsUpDown, Plus, Rocket } from "lucide-react";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { STARTUP_STAGE_LABEL } from "@/lib/labels";
import { useAsync } from "@/lib/use-async";
import { startupService } from "@/services";
import type { Startup } from "@/types";

/** Shows the current startup and lets the founder switch or create another. */
export function StartupSwitcher({ current }: { current?: Startup }) {
  const { data: startups } = useAsync(() => startupService.list(), []);

  if (!current) return <Skeleton className="h-12 w-full rounded-xl" />;

  const items: DropdownItem[] = [
    { type: "label", label: "Your startups" },
    ...(startups ?? [{ ...current }]).map((s) => ({
      label: s.name,
      icon: s.id === current.id ? Check : Rocket,
      href: `/s/${s.id}`,
    })),
    { type: "separator" },
    { label: "Create new startup", icon: Plus, href: "/new-startup" },
  ];

  return (
    <Dropdown
      label="Switch startup"
      align="start"
      className="w-full"
      menuClassName="w-full min-w-60"
      triggerClassName="w-full gap-3 border border-border bg-background px-3 py-2 text-left hover:bg-surface-muted"
      trigger={
        <>
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            {current.name[0]?.toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{current.name}</span>
            <span className="block truncate text-xs text-text-muted">{STARTUP_STAGE_LABEL[current.stage]} stage</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-text-muted" aria-hidden />
        </>
      }
      items={items}
    />
  );
}
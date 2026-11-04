"use client";

import { useSyncExternalStore } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { getThemePreference, setThemePreference, subscribeToTheme, type ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/** Light / Dark / System picker. Defaults to System. */
export function ThemeToggle() {
  const preference = useSyncExternalStore(subscribeToTheme, getThemePreference, () => "system" as ThemePreference);
  const Current = OPTIONS.find((o) => o.value === preference)?.icon ?? Monitor;

  const items: DropdownItem[] = OPTIONS.map((o) => ({
    label: preference === o.value ? `${o.label} (current)` : o.label,
    icon: preference === o.value ? Check : o.icon,
    onSelect: () => setThemePreference(o.value),
  }));

  return (
    <Dropdown
      label="Change theme"
      trigger={<Current className="size-[18px]" aria-hidden />}
      triggerClassName="size-10 justify-center text-text-muted hover:bg-surface-muted hover:text-text"
      items={items}
    />
  );
}
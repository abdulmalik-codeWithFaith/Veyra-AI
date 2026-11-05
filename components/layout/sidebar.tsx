"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Startup } from "@/types";
import { isNavActive, NAV_ITEMS, navHref } from "./nav";
import { StartupSwitcher } from "./startup-switcher";

interface SidebarProps {
  startupId: string;
  startup?: Startup;
  pendingApprovals?: number;
  /** Must be unique per rendered sidebar so the animated indicator does not jump between desktop and mobile copies. */
  layoutPrefix: string;
}

export function Sidebar({ startupId, startup, pendingApprovals = 0, layoutPrefix }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href={`/s/${startupId}`} className="flex items-center gap-2" aria-label="Veyra dashboard">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">Veyra</span>
        </Link>
      </div>

      <div className="px-3">
        <StartupSwitcher current={startup} />
      </div>

      <nav aria-label="Startup" className="mt-5 flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, startupId, item);
            const Icon = item.icon;
            const showBadge = item.key === "approvals" && pendingApprovals > 0;
            return (
              <li key={item.key}>
                <Link
                  href={navHref(startupId, item)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-text-muted hover:bg-surface-muted hover:text-text",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`${layoutPrefix}-active`}
                      className="absolute inset-0 rounded-xl bg-primary-soft"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  )}
                  <Icon className="relative size-[18px] shrink-0" aria-hidden />
                  <span className="relative flex-1">{item.label}</span>
                  {showBadge && (
                    <span
                      className="relative grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground"
                      aria-label={`${pendingApprovals} waiting for you`}
                    >
                      {pendingApprovals}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
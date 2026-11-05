"use client";

import { createContext, useContext } from "react";
import type { Startup } from "@/types";

export interface StartupContextValue {
  /** The startup in the current route. Pages only render once it has loaded. */
  startup: Startup;
  /** Number of approvals waiting for the founder. */
  pendingApprovals: number;
  /** Call after editing the startup so the sidebar and pages show the new details. */
  refreshStartup: () => void;
  /** Call after approving or declining so the sidebar badge updates. */
  refreshApprovals: () => void;
  /** Call after reading notifications so the bell dot updates. */
  refreshNotifications: () => void;
}

export const StartupContext = createContext<StartupContextValue | null>(null);

/** const { startup } = useStartup(); */
export function useStartup(): StartupContextValue {
  const ctx = useContext(StartupContext);
  if (!ctx) throw new Error("useStartup must be used inside the app shell.");
  return ctx;
}
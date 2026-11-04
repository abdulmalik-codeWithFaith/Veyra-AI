"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False on the server and during hydration, true afterwards. Needed before using portals. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
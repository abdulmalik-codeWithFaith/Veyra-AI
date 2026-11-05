"use client";

import { useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | undefined;
  error: Error | undefined;
  /** True until the first result for the CURRENT deps arrives (or while retrying after an error). */
  loading: boolean;
  /** True while a reload() is running and the previous data is still on screen. */
  refreshing: boolean;
  reload: () => void;
}

type Settled<T> = { depsKey: string; tick: number } & (
  | { data: T; error?: undefined }
  | { data?: undefined; error: Error }
);

/**
 * Data-fetching hook used with the service layer:
 *   const { data, loading, error, reload } = useAsync(() => taskService.list(id), [id]);
 * Components render Skeleton while `loading`, an error state when `error`, EmptyState when empty.
 * Changing deps shows the loading state again; reload() keeps the old data visible while refreshing.
 * Deps must be serialisable (ids, strings, plain filter objects).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: readonly unknown[] = []): AsyncState<T> {
  const [tick, setTick] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const depsKey = JSON.stringify(deps);

  // Always call the latest fn without making it an effect dependency
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    let cancelled = false;
    fnRef.current()
      .then((data) => {
        if (!cancelled) setSettled({ depsKey, tick, data });
      })
      .catch((err: unknown) => {
        if (!cancelled) setSettled({ depsKey, tick, error: err instanceof Error ? err : new Error(String(err)) });
      });
    return () => {
      cancelled = true;
    };
  }, [depsKey, tick]);

  // Derived, not stored: results for older deps count as "loading"
  const current = settled && settled.depsKey === depsKey ? settled : null;
  const refreshing = current !== null && current.tick !== tick;
  const loading = current === null || (current.error !== undefined && refreshing);

  return {
    data: loading ? undefined : current?.data,
    error: loading ? undefined : current?.error,
    loading,
    refreshing,
    reload: () => setTick((t) => t + 1),
  };
}
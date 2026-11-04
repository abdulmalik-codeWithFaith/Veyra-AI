"use client";

import { useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | undefined;
  error: Error | undefined;
  /** True until the request for the CURRENT deps has settled (so stale data never shows). */
  loading: boolean;
  reload: () => void;
}

type Settled<T> =
  | { key: string; data: T; error?: undefined }
  | { key: string; data?: undefined; error: Error };

/**
 * Data-fetching hook used with the service layer:
 *   const { data, loading, error, reload } = useAsync(() => taskService.list(id), [id]);
 * Components render Skeleton while `loading`, an error state when `error`, EmptyState when empty.
 * Deps must be serialisable (ids, strings, plain filter objects).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: readonly unknown[] = []): AsyncState<T> {
  const [tick, setTick] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const key = JSON.stringify([...deps, tick]);

  // Always call the latest fn without making it an effect dependency
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    let cancelled = false;
    fnRef.current()
      .then((data) => {
        if (!cancelled) setSettled({ key, data });
      })
      .catch((err: unknown) => {
        if (!cancelled) setSettled({ key, error: err instanceof Error ? err : new Error(String(err)) });
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  // Derived, not stored: results from an older key count as "loading"
  const current = settled && settled.key === key ? settled : null;

  return {
    data: current?.data,
    error: current?.error,
    loading: current === null,
    reload: () => setTick((t) => t + 1),
  };
}
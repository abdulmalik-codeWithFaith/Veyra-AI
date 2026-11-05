import type { ReactNode } from "react";
import type { AsyncState } from "@/lib/use-async";
import { ErrorState } from "./empty-state";

interface AsyncViewProps<T> {
  /** The object returned by useAsync(). */
  state: AsyncState<T>;
  /** Skeleton shown while loading. */
  loading: ReactNode;
  /** Shown when isEmpty(data) is true. */
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}

/** Renders the loading, error, empty and loaded states for one useAsync() result. */
export function AsyncView<T>({ state, loading, empty, isEmpty, children }: AsyncViewProps<T>) {
  if (state.loading) {
    return (
      <div aria-busy="true" aria-label="Loading">
        {loading}
      </div>
    );
  }
  if (state.error) {
    // ServiceError messages are written for people; anything else gets the generic text
    const friendly = state.error.name === "ServiceError" ? state.error.message : undefined;
    return <ErrorState description={friendly} onRetry={state.reload} className="py-8" />;
  }
  if (state.data === undefined) return null;
  if (isEmpty?.(state.data)) return <>{empty}</>;
  return <>{children(state.data)}</>;
}
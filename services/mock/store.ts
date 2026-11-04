import { createSeed, type Store } from "./seed";

let store: Store | null = null;

/**
 * Lazily creates the seed on first use so dates are relative to when the app runs.
 * Only ever called from inside async service methods, never during render.
 */
export function getStore(): Store {
  if (!store) store = createSeed(Date.now());
  return store;
}

/** Test helper: throw away all changes and start from fresh seed data. */
export function resetMockStore(): void {
  store = null;
}

let counter = 0;
/** Unique-enough ids for records created in mock mode. */
export function newId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}
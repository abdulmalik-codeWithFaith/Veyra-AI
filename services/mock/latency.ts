import { ServiceError } from "../errors";

/**
 * Mock-mode behaviour. Tweak at runtime from the console or a test page, e.g.
 *   mockConfig.failureRate = 0.3   // 30% of calls throw, to test error states
 * or set NEXT_PUBLIC_MOCK_ERROR_RATE=0.3 in .env.local.
 */
export const mockConfig = {
  minLatencyMs: 300,
  maxLatencyMs: 600,
  failureRate: Number(process.env.NEXT_PUBLIC_MOCK_ERROR_RATE ?? 0) || 0,
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Wrap a synchronous store read/write: waits 300-600ms, may fail, then returns a deep copy. */
export async function simulate<T>(work: () => T): Promise<T> {
  const { minLatencyMs, maxLatencyMs, failureRate } = mockConfig;
  await sleep(minLatencyMs + Math.random() * (maxLatencyMs - minLatencyMs));
  if (Math.random() < failureRate) {
    throw new ServiceError("network", "Something went wrong while loading this. Please try again.");
  }
  // Copy so UI code can never mutate the in-memory "database" by accident
  return structuredClone(work());
}
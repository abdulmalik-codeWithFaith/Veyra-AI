/** Thrown by any service. UI shows a friendly message; `code` lets callers branch. */
export type ServiceErrorCode = "not_found" | "unauthorized" | "invalid" | "network";

export class ServiceError extends Error {
  readonly code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message: string) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
  }
}
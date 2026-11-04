import type { Services } from "./interfaces";
import { mockServices } from "./mock";

/**
 * The single entry point for data. Components import from "@/services" only:
 *   import { taskService } from "@/services";
 *
 * NEXT_PUBLIC_USE_MOCKS=true  -> in-memory mock services with seed data (default)
 * NEXT_PUBLIC_USE_MOCKS=false -> real HTTP services (not built yet)
 */
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

/* ==========================================================================
   REAL BACKEND GOES HERE
   --------------------------------------------------------------------------
   When the backend exists, implement every interface in ./interfaces.ts over
   HTTP (for example in ./http/*.ts) and return them from this function.
   Nothing else in the app needs to change.
   ========================================================================== */
function createHttpServices(): Services {
  throw new Error(
    "Real HTTP services are not implemented yet. Set NEXT_PUBLIC_USE_MOCKS=true in .env.local.",
  );
}

export const services: Services = USE_MOCKS ? mockServices : createHttpServices();

export const {
  startupService,
  departmentService,
  taskService,
  activityService,
  approvalService,
  deliverableService,
  milestoneService,
  notificationService,
  analysisService,
  usageService,
  memberService,
  authService,
} = services;

export { ServiceError } from "./errors";
export type * from "./interfaces";
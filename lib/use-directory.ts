"use client";

import { departmentService, memberService } from "@/services";
import type { Agent, Department, Member, Task } from "@/types";
import { useAsync, type AsyncState } from "./use-async";

/** Everything needed to turn ids into names: departments, AI team members and people. */
export interface DirectoryData {
  departments: Department[];
  agents: Agent[];
  members: Member[];
}

/** Loads departments, their agents and members for a startup in one go. */
export function useDirectory(startupId: string): AsyncState<DirectoryData> {
  return useAsync<DirectoryData>(async () => {
    const [departments, members] = await Promise.all([
      departmentService.list(startupId),
      memberService.list(startupId),
    ]);
    const agentLists = await Promise.all(departments.map((d) => departmentService.listAgents(d.id)));
    return { departments, agents: agentLists.flat(), members };
  }, [startupId]);
}

export function departmentName(directory: DirectoryData | undefined, id: string): string {
  return directory?.departments.find((d) => d.id === id)?.name ?? "Department";
}

export interface PersonRef {
  name: string;
  variant: "agent" | "human";
}

export function assigneeOf(directory: DirectoryData | undefined, task: Task): PersonRef {
  if (task.assigneeType === "agent") {
    const agent = directory?.agents.find((a) => a.id === task.assigneeId);
    return { name: agent?.name ?? "AI team member", variant: "agent" };
  }
  const member = directory?.members.find((m) => m.userId === task.assigneeId);
  return { name: member?.name ?? "Team member", variant: "human" };
}

/** Who created a task, in founder-friendly words. */
export function creatorOf(directory: DirectoryData | undefined, task: Task): string {
  const { type, id } = task.createdBy;
  if (type === "founder") return "You";
  if (type === "agent") return directory?.agents.find((a) => a.id === id)?.name ?? "An AI team member";
  return directory?.members.find((m) => m.userId === id)?.name ?? "A team member";
}
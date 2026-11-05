"use client";

import Link from "next/link";
import { Bot, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { AsyncView } from "@/components/ui/async-view";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { departmentName, useDirectory } from "@/lib/use-directory";
import type { Member } from "@/types";

const ROLE_LABEL: Record<Member["role"], string> = { owner: "Owner", admin: "Admin", member: "Member" };
const ROLE_VARIANT: Record<Member["role"], BadgeVariant> = { owner: "primary", admin: "info", member: "neutral" };

export default function TeamPage() {
  const { startup } = useStartup();
  const directory = useDirectory(startup.id);

  return (
    <>
      <PageHeader title="Team" description="The people and AI team members working on your startup." />

      <AsyncView
        state={directory}
        loading={
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        }
      >
        {(d) => (
          <div className="space-y-10">
            <section aria-labelledby="people-heading">
              <h2 id="people-heading" className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Users className="size-4 text-text-muted" aria-hidden />
                People
              </h2>
              {d.members.length === 0 ? (
                <EmptyState icon={Users} title="No people yet" description="Teammates you invite will appear here." className="py-8" />
              ) : (
                <Card>
                  <ul className="divide-y divide-border">
                    {d.members.map((m) => (
                      <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar name={m.name} size="md" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{m.name}</p>
                            <p className="truncate text-xs text-text-muted">{m.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {m.departmentIds.length === 0 ? (
                            <span className="text-xs text-text-muted">All departments</span>
                          ) : (
                            m.departmentIds.map((id) => (
                              <Badge key={id} size="sm">
                                {departmentName(d, id)}
                              </Badge>
                            ))
                          )}
                          <Badge variant={ROLE_VARIANT[m.role]} size="sm">
                            {ROLE_LABEL[m.role]}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </section>

            <section aria-labelledby="ai-heading">
              <h2 id="ai-heading" className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Bot className="size-4 text-text-muted" aria-hidden />
                AI team
              </h2>
              {d.departments.length === 0 ? (
                <EmptyState
                  icon={Bot}
                  title="No AI team members yet"
                  description="Veyra creates your team after the business analysis is ready."
                  className="py-8"
                />
              ) : (
                <div className="space-y-6">
                  {d.departments.map((dept) => {
                    const agents = d.agents.filter((a) => a.departmentId === dept.id);
                    return (
                      <div key={dept.id}>
                        <Link
                          href={`/s/${startup.id}/departments/${dept.id}`}
                          className="mb-3 inline-block text-xs font-semibold text-text-muted hover:text-text"
                        >
                          {dept.name}
                        </Link>
                        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {agents.map((a) => (
                            <li key={a.id}>
                              <Card className="h-full p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar name={a.name} variant="agent" size="md" />
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">{a.name}</p>
                                    <p className="truncate text-xs text-text-muted">{a.role}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <StatusBadge type="agent" status={a.status} size="sm" />
                                </div>
                              </Card>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </AsyncView>
    </>
  );
}
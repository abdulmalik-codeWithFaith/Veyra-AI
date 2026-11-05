"use client";

import { Building2 } from "lucide-react";
import { DepartmentCard } from "@/components/departments/department-card";
import { PageHeader } from "@/components/layout/page-header";
import { useStartup } from "@/components/layout/startup-context";
import { AsyncView } from "@/components/ui/async-view";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useAsync } from "@/lib/use-async";
import { departmentService } from "@/services";

export default function DepartmentsPage() {
  const { startup } = useStartup();
  const departments = useAsync(() => departmentService.list(startup.id), [startup.id]);

  return (
    <>
      <PageHeader title="Departments" description="Your AI departments and what each one is working on." />
      <AsyncView
        state={departments}
        loading={
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={Building2}
            title="No departments yet"
            description="Veyra creates your departments once the business analysis is ready."
          />
        }
      >
        {(list) => (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((d) => (
              <li key={d.id}>
                <DepartmentCard department={d} startupId={startup.id} />
              </li>
            ))}
          </ul>
        )}
      </AsyncView>
    </>
  );
}
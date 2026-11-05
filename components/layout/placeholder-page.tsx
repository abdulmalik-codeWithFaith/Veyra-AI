import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "./page-header";

/** Temporary body for routes that are built in later steps. */
export function PlaceholderPage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon}
        title="This page is coming soon"
        description="The layout and navigation are in place. The content for this page is built in a later step."
      />
    </>
  );
}
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { useAsync } from "@/lib/use-async";
import { approvalService, authService, notificationService, ServiceError, startupService } from "@/services";
import { titleForPath } from "./nav";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { StartupContext, type StartupContextValue } from "./startup-context";
import { Topbar } from "./topbar";

function ContentSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

/** Sidebar + topbar around every page under /s/[startupId]. Loads the startup from the service layer. */
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { startupId = "" } = useParams<{ startupId: string }>();

  const startupState = useAsync(() => startupService.get(startupId), [startupId]);
  const approvals = useAsync(() => approvalService.list(startupId, "pending"), [startupId]);
  const notifications = useAsync(() => notificationService.list(startupId), [startupId]);
  const user = useAsync(() => authService.getCurrentUser(), []);

  // Remember the path the drawer was opened on: navigating changes the path, which closes it
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const menuOpen = menuOpenedAt === pathname;

  // Signed-out visitors go to the sign-in page
  useEffect(() => {
    if (!user.loading && user.data === null) router.replace("/sign-in");
  }, [user.loading, user.data, router]);

  const pendingApprovals = approvals.data?.length ?? 0;
  const startup = startupState.data;

  const contextValue = useMemo<StartupContextValue | null>(
    () =>
      startup
        ? {
            startup,
            pendingApprovals,
            refreshStartup: startupState.reload,
            refreshApprovals: approvals.reload,
            refreshNotifications: notifications.reload,
          }
        : null,
    [startup, pendingApprovals, startupState.reload, approvals.reload, notifications.reload],
  );

  let content: ReactNode;
  if (startupState.loading) {
    content = <ContentSkeleton />;
  } else if (startupState.error) {
    content =
      startupState.error instanceof ServiceError && startupState.error.code === "not_found" ? (
        <EmptyState
          icon={Rocket}
          title="We could not find that startup"
          description="It may have been removed, or the link may be wrong."
          action={
            <Link href="/new-startup" className={buttonVariants()}>
              Create a startup
            </Link>
          }
        />
      ) : (
        <ErrorState onRetry={startupState.reload} />
      );
  } else if (contextValue) {
    content = <StartupContext.Provider value={contextValue}>{children}</StartupContext.Provider>;
  }

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border lg:block">
        <Sidebar startupId={startupId} startup={startup} pendingApprovals={pendingApprovals} layoutPrefix="desktop" />
      </aside>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpenedAt(null)}
        startupId={startupId}
        startup={startup}
        pendingApprovals={pendingApprovals}
      />

      <div className="lg:pl-64">
        <Topbar
          title={titleForPath(pathname, startupId)}
          startupId={startupId}
          user={user.loading ? undefined : user.data}
          notifications={notifications.data}
          onOpenMenu={() => setMenuOpenedAt(pathname)}
          onNotificationsChanged={notifications.reload}
        />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{content}</main>
      </div>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { Bell, CheckCheck, LogOut, Menu, Search, Settings, User as UserIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { authService, notificationService } from "@/services";
import type { Notification, User } from "@/types";
import { ThemeToggle } from "./theme-toggle";

interface TopbarProps {
  title: string;
  startupId: string;
  user?: User | null;
  notifications?: Notification[];
  onOpenMenu: () => void;
  onNotificationsChanged: () => void;
}

export function Topbar({ title, startupId, user, notifications, onOpenMenu, onNotificationsChanged }: TopbarProps) {
  const router = useRouter();
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  const notificationItems: DropdownItem[] = [
    { type: "label", label: unread > 0 ? `${unread} unread` : "Notifications" },
    ...(notifications && notifications.length > 0
      ? notifications.slice(0, 5).map((n): DropdownItem => ({ label: n.title, href: n.link }))
      : [{ label: "You are all caught up", disabled: true } satisfies DropdownItem]),
    { type: "separator" },
    {
      label: "Mark all as read",
      icon: CheckCheck,
      disabled: unread === 0,
      onSelect: () => {
        void notificationService.markAllRead(startupId).then(onNotificationsChanged);
      },
    },
  ];

  async function signOut() {
    await authService.signOut();
    router.push("/sign-in");
  }

  const userItems: DropdownItem[] = [
    { type: "label", label: user?.email ?? "Account" },
    { label: "Profile", icon: UserIcon, href: `/s/${startupId}/settings` },
    { label: "Settings", icon: Settings, href: `/s/${startupId}/settings` },
    { type: "separator" },
    { label: "Sign out", icon: LogOut, danger: true, onSelect: () => void signOut() },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <Button variant="ghost" iconOnly leftIcon={Menu} aria-label="Open navigation" onClick={onOpenMenu} className="lg:hidden" />

      <p className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight">{title}</p>

      {/* Visual only for now: search is built in a later step */}
      <Input
        type="search"
        aria-label="Search"
        placeholder="Search"
        leftIcon={Search}
        className="hidden w-64 md:block"
      />

      <Dropdown
        label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        menuClassName="w-80"
        triggerClassName="relative size-10 justify-center text-text-muted hover:bg-surface-muted hover:text-text"
        trigger={
          <>
            <Bell className="size-[18px]" aria-hidden />
            {unread > 0 && (
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-background" aria-hidden />
            )}
          </>
        }
        items={notificationItems}
      />

      <ThemeToggle />

      {user === undefined ? (
        <Skeleton className="size-9 rounded-full" />
      ) : (
        <Dropdown
          label="Account menu"
          triggerClassName="rounded-full"
          trigger={<Avatar name={user?.name ?? "Guest"} size="md" />}
          items={userItems}
        />
      )}
    </header>
  );
}
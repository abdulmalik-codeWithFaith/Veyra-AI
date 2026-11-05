import {
  Activity,
  Building2,
  FileSearch,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  /** Path after /s/[startupId]. Empty string is the dashboard. */
  segment: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", segment: "", icon: LayoutDashboard },
  { key: "analysis", label: "Business Analysis", segment: "analysis", icon: FileSearch },
  { key: "departments", label: "Departments", segment: "departments", icon: Building2 },
  { key: "tasks", label: "Tasks", segment: "tasks", icon: ListChecks },
  { key: "activity", label: "Activity", segment: "activity", icon: Activity },
  { key: "approvals", label: "Approvals", segment: "approvals", icon: ShieldCheck },
  { key: "reports", label: "Reports", segment: "reports", icon: TrendingUp },
  { key: "team", label: "Team", segment: "team", icon: Users },
  { key: "settings", label: "Settings", segment: "settings", icon: Settings },
];

export function navHref(startupId: string, item: NavItem): string {
  return item.segment ? `/s/${startupId}/${item.segment}` : `/s/${startupId}`;
}

/** The dashboard only matches its exact path; everything else matches its sub-routes too. */
export function isNavActive(pathname: string, startupId: string, item: NavItem): boolean {
  const href = navHref(startupId, item);
  return item.segment === "" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function titleForPath(pathname: string, startupId: string): string {
  const match = NAV_ITEMS.find((item) => isNavActive(pathname, startupId, item));
  return match?.label ?? "Dashboard";
}
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The shell reads the route params on the client, which Next.js 16 wants inside Suspense
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" aria-busy="true" />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
"use client";

import { Overlay } from "@/components/ui/overlay";
import type { Startup } from "@/types";
import { Sidebar } from "./sidebar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  startupId: string;
  startup?: Startup;
  pendingApprovals?: number;
}

/** The sidebar as a slide-in drawer for small screens. */
export function MobileNav({ open, onClose, startupId, startup, pendingApprovals }: MobileNavProps) {
  return (
    <Overlay open={open} onClose={onClose} variant="left" labelledBy="mobile-nav-title" className="max-w-72">
      <h2 id="mobile-nav-title" className="sr-only">
        Navigation
      </h2>
      <Sidebar startupId={startupId} startup={startup} pendingApprovals={pendingApprovals} layoutPrefix="mobile" />
    </Overlay>
  );
}
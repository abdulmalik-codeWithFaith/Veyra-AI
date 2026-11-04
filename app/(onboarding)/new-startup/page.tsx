import { Suspense } from "react";
import type { Metadata } from "next";
import { NewStartupForm } from "./new-startup-form";

export const metadata: Metadata = {
  title: "Start a new startup",
};

export default function NewStartupPage() {
  // The form reads ?idea=... on the client, which must sit inside Suspense in Next.js 16
  return (
    <Suspense fallback={null}>
      <NewStartupForm />
    </Suspense>
  );
}
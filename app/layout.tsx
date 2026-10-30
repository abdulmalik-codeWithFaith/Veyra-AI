import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Veyra: Your first startup team, powered by AI",
    template: "%s | Veyra",
  },
  description:
    "Describe your business idea and Veyra creates AI departments that plan, build, test, launch and grow it. You stay in control.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e13" },
  ],
};

/**
 * Runs before first paint so the correct theme is applied with no flash.
 * Storage key "veyra-theme" holds "light" | "dark" | "system" (default: system).
 * The ThemeToggle component built later will read/write the same key.
 */
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("veyra-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored === "dark" || ((!stored || stored === "system") && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the theme script changes <html class> before React hydrates
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
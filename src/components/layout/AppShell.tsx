import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/AppHeader";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 sm:px-6">
          Travel OS · 讓每一段旅程更清楚、更可行
        </div>
      </footer>
    </div>
  );
}

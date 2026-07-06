import Link from "next/link";

import { buttonStyles } from "@/components/ui/Button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-950"
        >
          Travel <span className="text-teal-700">OS</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3" aria-label="主要導覽">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            我的旅程
          </Link>
          <Link
            href="/login"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            登入
          </Link>
        </nav>
      </div>
    </header>
  );
}

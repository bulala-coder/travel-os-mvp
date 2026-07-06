import Link from "next/link";

import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          我的旅程
        </h1>
        <Link href="/journeys/new" className={buttonStyles({ size: "sm" })}>
          建立新旅程
        </Link>
      </div>
      <EmptyState
        title="你還沒有建立任何旅程。"
        description="從一個模糊的旅行想法開始，Travel OS 會陪你把它整理成可執行的計畫。"
        action={
          <Link href="/journeys/new" className={buttonStyles()}>
            開始建立
          </Link>
        }
      />
    </div>
  );
}

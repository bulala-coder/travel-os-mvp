import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { JourneyStatus } from "@/types/journey";

type JourneyCardProps = {
  id: string;
  title: string;
  destination: string | null;
  duration_days: number | null;
  status: JourneyStatus;
  feasibility_score?: number | null;
  updated_at: string;
};

const statusLabels: Record<JourneyStatus, string> = {
  draft: "草稿",
  saved: "已儲存",
  needs_review: "待檢查",
  archived: "已封存",
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function JourneyCard({
  id,
  title,
  destination,
  duration_days,
  status,
  feasibility_score,
  updated_at,
}: JourneyCardProps) {
  return (
    <Link href={`/journeys/${id}`} className="block">
      <Card className="transition-colors hover:border-teal-200 hover:bg-teal-50/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {destination ?? "未設定目的地"} ·{" "}
              {duration_days ? `${duration_days} 天` : "天數未設定"}
            </p>
          </div>
          <Badge>{statusLabels[status]}</Badge>
        </div>
        <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:grid-cols-2">
          <p>
            可行性：
            {typeof feasibility_score === "number"
              ? `${feasibility_score}/100`
              : "尚未檢查"}
          </p>
          <p className="sm:text-right">更新：{formatUpdatedAt(updated_at)}</p>
        </div>
      </Card>
    </Link>
  );
}

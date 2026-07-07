import Link from "next/link";
import { redirect } from "next/navigation";

import { JourneyCard } from "@/components/journey/JourneyCard";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import type { Journey } from "@/types/journey";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: journeys } = await supabase
    .from("journeys")
    .select(
      "id, user_id, title, destination, duration_days, status, summary, created_at, updated_at",
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const journeyList = (journeys ?? []) as Journey[];

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
      {journeyList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {journeyList.map((journey) => (
            <JourneyCard
              key={journey.id}
              id={journey.id}
              title={journey.title}
              destination={journey.destination}
              duration_days={journey.duration_days}
              status={journey.status}
              updated_at={journey.updated_at}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="你還沒有建立任何旅程。"
          description="從一個模糊的旅行想法開始，Travel OS 會陪你把它整理成可執行的計畫。"
          action={
            <Link href="/journeys/new" className={buttonStyles()}>
              開始建立
            </Link>
          }
        />
      )}
    </div>
  );
}

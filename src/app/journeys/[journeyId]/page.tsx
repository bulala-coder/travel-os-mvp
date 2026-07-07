import { notFound, redirect } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import type { Journey, TravelIntent, UserPreferences } from "@/types/journey";

const sections = [
  {
    title: "Itinerary",
    description: "每天的活動與時間安排會顯示在這裡。",
  },
  {
    title: "Feasibility",
    description: "交通、時間與行程密度的可執行性檢查會顯示在這裡。",
  },
  {
    title: "Replan",
    description: "你可以在這裡提出想調整的內容。",
  },
  {
    title: "Next Actions",
    description: "出發前建議完成的下一步會顯示在這裡。",
  },
];

type JourneyPageProps = {
  params: Promise<{ journeyId: string }>;
};

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { journeyId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: journey } = await supabase
    .from("journeys")
    .select(
      "id, user_id, title, destination, duration_days, status, summary, created_at, updated_at",
    )
    .eq("id", journeyId)
    .eq("user_id", user.id)
    .single();

  if (!journey) {
    notFound();
  }

  const { data: intent } = await supabase
    .from("travel_intents")
    .select(
      "id, journey_id, intent_status, destination, duration_days, raw_input, clarified_summary, created_at, updated_at",
    )
    .eq("journey_id", journeyId)
    .maybeSingle();

  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("id, journey_id, pace, budget_level, interests, created_at, updated_at")
    .eq("journey_id", journeyId)
    .maybeSingle();

  const currentJourney = journey as Journey;
  const travelIntent = intent as TravelIntent | null;
  const userPreferences = preferences as UserPreferences | null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <Badge>{currentJourney.status}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          {currentJourney.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {currentJourney.destination ?? "未設定目的地"} ·{" "}
          {currentJourney.duration_days
            ? `${currentJourney.duration_days} 天`
            : "天數未設定"}
        </p>
      </div>
      <div className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">目的地</dt>
              <dd className="mt-1 text-slate-900">
                {currentJourney.destination ?? "尚未設定"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">旅行天數</dt>
              <dd className="mt-1 text-slate-900">
                {currentJourney.duration_days
                  ? `${currentJourney.duration_days} 天`
                  : "尚未設定"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">狀態</dt>
              <dd className="mt-1 text-slate-900">{currentJourney.status}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">最後更新</dt>
              <dd className="mt-1 text-slate-900">
                {new Intl.DateTimeFormat("zh-TW", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(currentJourney.updated_at))}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            Travel Intent
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {travelIntent?.clarified_summary ||
              travelIntent?.raw_input ||
              "旅行意圖尚待釐清。"}
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
            Status: {travelIntent?.intent_status ?? "pending"}
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-slate-500">步調</p>
              <p className="mt-1 text-slate-900">
                {userPreferences?.pace ?? "balanced"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-500">預算</p>
              <p className="mt-1 text-slate-900">
                {userPreferences?.budget_level ?? "unknown"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">興趣</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {userPreferences?.interests?.length ? (
                userPreferences.interests.map((interest) => (
                  <Badge key={interest}>{interest}</Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500">尚未選擇興趣。</p>
              )}
            </div>
          </div>
        </Card>

        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-lg font-semibold text-slate-900">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {section.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

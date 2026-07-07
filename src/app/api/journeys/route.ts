import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { BudgetLevel, Pace } from "@/types/journey";

const paceValues = ["relaxed", "balanced", "full", "intense"] as const;
const budgetValues = ["low", "medium", "high", "luxury", "unknown"] as const;

type CreateJourneyPayload = {
  destination?: unknown;
  duration_days?: unknown;
  pace?: unknown;
  interests?: unknown;
  budget_level?: unknown;
  raw_input?: unknown;
};

function isPace(value: unknown): value is Pace {
  return typeof value === "string" && paceValues.includes(value as Pace);
}

function isBudgetLevel(value: unknown): value is BudgetLevel {
  return (
    typeof value === "string" && budgetValues.includes(value as BudgetLevel)
  );
}

function getEmailPrefix(email?: string) {
  return email?.split("@")[0] || null;
}

function validatePayload(payload: CreateJourneyPayload) {
  const destination =
    typeof payload.destination === "string" ? payload.destination.trim() : "";
  const durationDays = Number(payload.duration_days);
  const pace = isPace(payload.pace) ? payload.pace : "balanced";
  const budgetLevel = isBudgetLevel(payload.budget_level)
    ? payload.budget_level
    : "unknown";
  const interests = Array.isArray(payload.interests)
    ? payload.interests.filter(
        (interest): interest is string =>
          typeof interest === "string" && interest.trim().length > 0,
      )
    : [];
  const rawInput =
    typeof payload.raw_input === "string" ? payload.raw_input.trim() : "";

  if (!destination) {
    return { error: "請輸入目的地。" };
  }

  if (!Number.isInteger(durationDays) || durationDays < 1) {
    return { error: "請輸入有效的旅行天數。" };
  }

  return {
    data: {
      destination,
      durationDays,
      pace,
      budgetLevel,
      interests,
      rawInput,
    },
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "請先登入。" }, { status: 401 });
  }

  const payload = (await request.json()) as CreateJourneyPayload;
  const validated = validatePayload(payload);

  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { destination, durationDays, pace, budgetLevel, interests, rawInput } =
    validated.data;

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: getEmailPrefix(user.email),
      default_language: "zh-TW",
    },
    {
      onConflict: "id",
      ignoreDuplicates: true,
    },
  );

  if (profileError) {
    return NextResponse.json(
      { error: "無法確認使用者資料，請確認資料庫 migration 已套用。" },
      { status: 500 },
    );
  }

  const { data: journey, error: journeyError } = await supabase
    .from("journeys")
    .insert({
      user_id: user.id,
      title: `${destination} ${durationDays} 天旅程`,
      destination,
      duration_days: durationDays,
      status: "draft",
    })
    .select("id")
    .single();

  if (journeyError || !journey) {
    return NextResponse.json(
      { error: "建立旅程失敗，請稍後再試。" },
      { status: 500 },
    );
  }

  const journeyId = journey.id as string;

  const { error: intentError } = await supabase.from("travel_intents").insert({
    journey_id: journeyId,
    destination,
    duration_days: durationDays,
    raw_input: rawInput || null,
    intent_status: "pending",
  });

  if (intentError) {
    return NextResponse.json(
      { error: "旅程已建立，但旅行意圖儲存失敗。" },
      { status: 500 },
    );
  }

  const { error: preferencesError } = await supabase
    .from("user_preferences")
    .insert({
      journey_id: journeyId,
      pace,
      interests,
      budget_level: budgetLevel,
    });

  if (preferencesError) {
    return NextResponse.json(
      { error: "旅程已建立，但偏好設定儲存失敗。" },
      { status: 500 },
    );
  }

  return NextResponse.json({ journey_id: journeyId }, { status: 201 });
}

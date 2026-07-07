export type JourneyStatus = "draft" | "saved" | "needs_review" | "archived";

export type Pace = "relaxed" | "balanced" | "full" | "intense";

export type BudgetLevel = "low" | "medium" | "high" | "luxury" | "unknown";

export type IntentStatus = "pending" | "clarified" | "confirmed";

export type Journey = {
  id: string;
  user_id: string;
  title: string;
  destination: string | null;
  duration_days: number | null;
  status: JourneyStatus;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

export type TravelIntent = {
  id: string;
  journey_id: string;
  intent_status: IntentStatus;
  destination: string | null;
  duration_days: number | null;
  raw_input: string | null;
  clarified_summary: string | null;
  created_at: string;
  updated_at: string;
};

export type UserPreferences = {
  id: string;
  journey_id: string;
  pace: Pace;
  budget_level: BudgetLevel;
  interests: string[];
  created_at: string;
  updated_at: string;
};

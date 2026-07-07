"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { BudgetLevel, Pace } from "@/types/journey";

const paceOptions: { value: Pace; label: string }[] = [
  { value: "relaxed", label: "悠閒" },
  { value: "balanced", label: "平衡" },
  { value: "full", label: "充實" },
  { value: "intense", label: "緊湊" },
];

const budgetOptions: { value: BudgetLevel; label: string }[] = [
  { value: "unknown", label: "還不確定" },
  { value: "low", label: "節省" },
  { value: "medium", label: "中等" },
  { value: "high", label: "較高" },
  { value: "luxury", label: "奢華" },
];

const interestOptions = [
  "美食",
  "咖啡",
  "自然",
  "建築",
  "博物館",
  "購物",
  "親子",
  "慢旅行",
];

export function NewJourneyForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [pace, setPace] = useState<Pace>("balanced");
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("unknown");
  const [interests, setInterests] = useState<string[]>([]);
  const [rawInput, setRawInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/journeys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          duration_days: Number(durationDays),
          pace,
          interests,
          budget_level: budgetLevel,
          raw_input: rawInput,
        }),
      });

      const data = (await response.json()) as {
        journey_id?: string;
        error?: string;
      };

      if (!response.ok || !data.journey_id) {
        setError(data.error ?? "建立旅程失敗，請稍後再試。");
        return;
      }

      router.push(`/journeys/${data.journey_id}`);
    } catch {
      setError("建立旅程失敗，請確認網路連線後再試一次。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          目的地
        </span>
        <Input
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="例如：京都、日本"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          旅行天數
        </span>
        <Input
          type="number"
          min={1}
          value={durationDays}
          onChange={(event) => setDurationDays(event.target.value)}
          placeholder="例如：5"
          required
        />
      </label>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-700">
          旅行步調
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {paceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPace(option.value)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                pace === option.value
                  ? "border-teal-700 bg-teal-50 text-teal-800"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-700">
          興趣
        </legend>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => {
            const isSelected = interests.includes(interest);

            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-teal-700 bg-teal-50 text-teal-800"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          預算
        </span>
        <select
          value={budgetLevel}
          onChange={(event) => setBudgetLevel(event.target.value as BudgetLevel)}
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-1"
        >
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          其他旅行想法
        </span>
        <Textarea
          value={rawInput}
          onChange={(event) => setRawInput(event.target.value)}
          placeholder="把腦中零散的想法都寫在這裡，例如想去的地方、不想做的事，或任何期待。"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      ) : null}

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "建立中..." : "建立旅程"}
      </Button>
    </form>
  );
}

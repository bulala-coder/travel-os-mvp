import { NewJourneyForm } from "@/components/intent/NewJourneyForm";
import { Card } from "@/components/ui/Card";

export default function NewJourneyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold text-teal-700">New Journey</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          建立新旅程
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          先告訴我們你目前想到的內容，不需要整理得很完整。
        </p>
      </div>
      <Card className="p-5 sm:p-7">
        <NewJourneyForm />
      </Card>
    </div>
  );
}

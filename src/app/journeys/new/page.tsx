import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const fields = [
  { label: "目的地", placeholder: "例如：京都、日本" },
  { label: "旅行天數", placeholder: "例如：5 天" },
  { label: "旅行步調", placeholder: "例如：悠閒、不趕行程" },
  { label: "興趣", placeholder: "例如：咖啡、建築、在地料理" },
];

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
        <form className="space-y-5">
          {fields.map((field) => (
            <label key={field.label} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                {field.label}
              </span>
              <Input placeholder={field.placeholder} disabled />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              其他旅行想法
            </span>
            <Textarea
              placeholder="把腦中零散的想法都寫在這裡，例如想去的地方、不想做的事，或任何期待。"
              disabled
            />
          </label>
          <Button className="w-full" disabled>
            開始整理旅行意圖（即將推出）
          </Button>
        </form>
      </Card>
    </div>
  );
}

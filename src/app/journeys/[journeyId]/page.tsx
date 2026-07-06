import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const sections = [
  {
    title: "Overview",
    description: "旅程目的、日期、步調與偏好會顯示在這裡。",
  },
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <Badge>草稿</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          旅程工作區
        </h1>
        <p className="mt-2 text-sm text-slate-500">Journey ID: {journeyId}</p>
      </div>
      <div className="space-y-4">
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

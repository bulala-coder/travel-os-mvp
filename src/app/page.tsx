import Link from "next/link";

import { buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const steps = [
  "釐清旅行意圖",
  "生成行程",
  "檢查可執行性",
  "修改並儲存",
];

export default function Home() {
  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50 to-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-700">
            你的 AI 旅行作業系統
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            把混亂的旅行想法，變成可以真的出發的旅程。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Travel OS
            會幫你釐清旅行意圖、生成個人化行程、檢查可執行性，並儲存成可持續修改的旅程計畫。
          </p>
          <Link
            href="/journeys/new"
            className={`${buttonStyles()} mt-8 w-full sm:w-auto`}
          >
            建立我的旅程
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            從想法到可執行的旅程
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step}>
              <span className="flex size-9 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">
                {index + 1}
              </span>
              <h3 className="mt-5 font-semibold text-slate-900">{step}</h3>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

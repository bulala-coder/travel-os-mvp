import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">
        個人資料
      </h1>
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">
            T
          </div>
          <div>
            <p className="font-semibold text-slate-900">Travel OS 使用者</p>
            <Badge className="mt-1">尚未登入</Badge>
          </div>
        </div>
        <p className="mt-6 border-t border-slate-100 pt-6 text-sm leading-6 text-slate-500">
          登入後，你可以在這裡查看並管理個人資料與旅行偏好。
        </p>
      </Card>
    </div>
  );
}

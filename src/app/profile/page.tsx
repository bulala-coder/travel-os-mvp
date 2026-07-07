import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const displayName = user?.email?.split("@")[0] || "Travel OS 使用者";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">
        個人資料
      </h1>
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{displayName}</p>
            <Badge className="mt-1">已登入</Badge>
          </div>
        </div>
        <p className="mt-6 border-t border-slate-100 pt-6 text-sm leading-6 text-slate-500">
          {user?.email
            ? `目前登入信箱：${user.email}`
            : "你可以在這裡查看並管理個人資料與旅行偏好。"}
        </p>
      </Card>
    </div>
  );
}

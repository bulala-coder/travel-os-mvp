import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-16 sm:py-24">
      <Card className="w-full p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          登入 Travel OS
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          登入後可以儲存與管理你的旅程。
        </p>
        <form className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </span>
            <Input type="email" placeholder="you@example.com" disabled />
          </label>
          <Button className="w-full" disabled>
            登入（即將推出）
          </Button>
        </form>
      </Card>
    </div>
  );
}

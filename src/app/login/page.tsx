import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-16 sm:py-24">
      <Card className="w-full p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          登入 Travel OS
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          登入後可以儲存與管理你的旅程。
        </p>
        <LoginForm
          errorMessage={params.error}
          successMessage={params.message}
          nextPath={params.next}
        />
      </Card>
    </div>
  );
}

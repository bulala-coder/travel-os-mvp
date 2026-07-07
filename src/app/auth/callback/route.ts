import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function getEmailPrefix(email?: string) {
  return email?.split("@")[0] || null;
}

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=登入連結無效，請重新寄送。", requestUrl.origin),
    );
  }

  const supabase = await createClient();
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("登入失敗，請重新寄送登入連結。")}`,
        requestUrl.origin,
      ),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=找不到登入使用者，請再試一次。", requestUrl.origin),
    );
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: getEmailPrefix(user.email),
      default_language: "zh-TW",
    },
    {
      onConflict: "id",
      ignoreDuplicates: true,
    },
  );

  if (profileError) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("登入成功，但建立個人資料失敗。請確認 Supabase migration 已套用。")}`,
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

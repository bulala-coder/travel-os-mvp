"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  errorMessage?: string;
  successMessage?: string;
  nextPath?: string;
};

export function LoginForm({
  errorMessage,
  successMessage,
  nextPath = "/dashboard",
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(errorMessage ?? "");
  const [message, setMessage] = useState(successMessage ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();
      const redirectTo = new URL(
        `${window.location.origin}/auth/callback`,
      );
      redirectTo.searchParams.set(
        "next",
        nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/dashboard",
      );

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo.toString(),
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setMessage("登入連結已寄出，請到信箱點擊連結完成登入。");
      setEmail("");
    } catch {
      setError("無法送出登入信，請確認 Supabase 環境變數已設定。");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </span>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      {message ? (
        <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-800">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      ) : null}

      <Button className="w-full" type="submit" disabled={isSending}>
        {isSending ? "寄送中..." : "寄送登入連結"}
      </Button>
    </form>
  );
}

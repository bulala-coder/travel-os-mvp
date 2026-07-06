type ErrorStateProps = {
  message?: string;
};

export function ErrorState({
  message = "發生了一點問題，請稍後再試。",
}: ErrorStateProps) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
      role="alert"
    >
      {message}
    </div>
  );
}

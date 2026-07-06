type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "載入中…" }: LoadingStateProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600"
      role="status"
    >
      <span className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-teal-700" />
      {message}
    </div>
  );
}

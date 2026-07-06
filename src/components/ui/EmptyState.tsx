import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
      <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-teal-50 text-xl">
        ✦
      </span>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  hint?: string;
}

export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <p className="text-sm text-nf-muted-grey">{message}</p>
      {hint && <p className="mt-2 text-xs text-nf-muted-grey/70">{hint}</p>}
    </div>
  );
}

export function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-lg border border-dashed border-black/15 bg-zinc-100 text-center text-sm text-zinc-500 ${className}`}
    >
      [Photo: {label}]
    </div>
  );
}

type DomainPillProps = {
  label: string;
  variant?: "default" | "outline";
};

export function DomainPill({ label, variant = "default" }: DomainPillProps) {
  const styles =
    variant === "outline"
      ? "border border-white/30 text-white/90"
      : "bg-white/10 text-white";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide ${styles}`}>
      {label}
    </span>
  );
}

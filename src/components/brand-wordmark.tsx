import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  className?: string;
}

export function BrandWordmark({
  className,
}: BrandWordmarkProps) {
  return (
    <span
      aria-label="ADL"
      className={cn(
        "inline-flex items-center whitespace-nowrap font-[family-name:var(--font-cormorant-garamond)] font-semibold italic leading-none tracking-[-0.055em]",
        "text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative mr-[0.36em] inline-block h-[0.84em] w-[0.98em] shrink-0 translate-y-[0.015em] rounded-t-[999px] border-[0.052em] border-b-0 border-primary/70"
      >
        <span className="absolute bottom-0 left-1/2 h-[58%] border-l-[0.042em] border-primary/70" />
      </span>
      <span aria-hidden>ADL</span>
    </span>
  );
}

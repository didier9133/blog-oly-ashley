import { cn } from "@/lib/utils";
import styles from "./brand-wordmark.module.css";

interface BrandWordmarkProps {
  className?: string;
  variant?: "header" | "footer" | "sidebar";
}

export function BrandWordmark({
  className,
  variant = "header",
}: BrandWordmarkProps) {
  return (
    <span
      aria-label="ADL"
      className={cn(styles.wordmark, styles[variant], className)}
    >
      <span aria-hidden className={styles.mark}>
        <span className={styles.markStem} />
      </span>
      <span aria-hidden>ADL</span>
    </span>
  );
}

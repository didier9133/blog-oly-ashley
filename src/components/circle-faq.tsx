import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type QAItem = { q: string; a: string };

interface CircleFaqProps {
  items: QAItem[];
  className?: string;
}

export function CircleFaq({ items, className }: CircleFaqProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <Card
          key={i}
          className="border-border/50 shadow-sm rounded-sm bg-card overflow-hidden"
        >
          <CardContent className="p-0">
            <details className="group">
              <summary
                className={cn(
                  "flex items-center justify-between gap-4 p-6 cursor-pointer list-none",
                  "transition-colors hover:bg-foreground/[0.02]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8a08b]/40 focus-visible:ring-inset",
                )}
              >
                <h3 className="text-lg font-light text-foreground italic pr-4">
                  {item.q}
                </h3>
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 flex h-8 w-8 items-center justify-center rounded-full",
                    "border border-[#d8a08b]/40 text-[#d8a08b]",
                    "transition-transform duration-300 ease-out",
                    "group-open:rotate-45",
                  )}
                >
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </summary>
              <div
                className={cn(
                  "px-6 pb-6 pt-0 font-[family-name:var(--font-lora)]",
                  "text-foreground/80 leading-relaxed",
                )}
              >
                {item.a}
              </div>
            </details>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface FilmGrainProps {
  className?: string;
  opacity?: number;
}

export function FilmGrain({ className, opacity = 0.14 }: FilmGrainProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 mix-blend-overlay motion-reduce:hidden",
        className,
      )}
      style={{ opacity }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#hero-grain)"
          className="animate-grain"
        />
      </svg>
    </div>
  );
}

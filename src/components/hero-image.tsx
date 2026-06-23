import Image from "next/image";
import { FilmGrain } from "@/components/film-grain";

interface HeroImageProps {
  src: string;
  alt: string;
  sizes?: string;
  variant?: "default" | "clean";
  objectPosition?: string;
  priority?: boolean;
}

export function HeroImage({
  src,
  alt,
  sizes,
  variant = "default",
  objectPosition = "object-center",
  priority = true,
}: HeroImageProps) {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-y-[6%] inset-x-0">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={82}
            sizes={sizes}
            className={`object-cover ${objectPosition}`}
          />
          <FilmGrain opacity={variant === "clean" ? 0.08 : 0.14} />
        </div>
      </div>

      {variant === "default" ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "radial-gradient(ellipse 108% 95% at 60% 50%, transparent 52%, rgba(20, 14, 10, 0.22) 100%)",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-20 z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--background) 50%, transparent), transparent)",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 z-[1]"
            style={{
              background:
                "linear-gradient(to top, rgba(20, 14, 10, 0.34), rgba(20, 14, 10, 0.12) 45%, transparent 80%)",
            }}
          />
        </>
      ) : null}
    </>
  );
}

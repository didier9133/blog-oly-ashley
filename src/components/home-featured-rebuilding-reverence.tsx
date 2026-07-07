import type { CSSProperties } from "react";
import {
  PromotedBook,
  type PromotedBookData,
} from "@/components/promoted-book";

interface HomeFeaturedRebuildingReverenceProps {
  book: PromotedBookData | null;
  eyebrow: string;
  tagline: string;
  blurbStart: string;
  blurbHighlight: string;
  blurbEnd: string;
  cta: string;
  emptyState: string;
}

export function HomeFeaturedRebuildingReverence({
  book,
  eyebrow,
  tagline,
  blurbStart,
  blurbHighlight,
  blurbEnd,
  cta,
  emptyState,
}: HomeFeaturedRebuildingReverenceProps) {
  return (
    <section
      id="workbooks"
      className="relative -mt-px"
      style={{ "--bridge-color": "var(--paper)" } as CSSProperties}
    >
      <div className="section-bleed-bridge" />
      <div className="relative mx-auto max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-12">
        <PromotedBook
          book={book}
          eyebrow={eyebrow}
          tagline={tagline}
          blurbStart={blurbStart}
          blurbHighlight={blurbHighlight}
          blurbEnd={blurbEnd}
          cta={cta}
          emptyState={emptyState}
          fallbackHref="/workbooks"
          className="bg-transparent"
        />
      </div>
    </section>
  );
}

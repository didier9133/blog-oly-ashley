import Image from "next/image";
import Link from "next/link";

export function FooterChurchHurtGuideCta({
  href,
  eyebrow,
  title,
  description,
  cta,
  coverAlt,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  coverAlt: string;
}) {
  return (
    <section
      id="newsletter"
      data-footer-guide-cta
      aria-labelledby="footer-church-hurt-guide-title"
      className="relative w-full overflow-hidden bg-[#62684f] py-16 text-white md:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:26px_26px]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 bottom-[-12rem] size-[28rem] rounded-full border border-[#f1c8b7]/20"
      />
      <div
        aria-hidden="true"
        className="absolute -right-44 top-[-14rem] size-[34rem] rounded-full bg-[#bd775c]/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-11 px-5 md:grid-cols-[0.62fr_1.38fr] md:gap-16 md:px-10 lg:gap-24">
        <div className="relative mx-auto w-[11rem] sm:w-[13rem] md:w-full md:max-w-[15rem]">
          <div
            aria-hidden="true"
            className="absolute -inset-3 translate-x-5 translate-y-5 rotate-3 border border-[#e8ddcc]/20 bg-[#4e5340]"
          />
          <Image
            src="/which-binary-guide-cover.jpg"
            alt={coverAlt}
            width={612}
            height={792}
            sizes="(max-width: 767px) 208px, 240px"
            className="relative h-auto w-full -rotate-2 shadow-[0_28px_70px_rgba(24,25,19,0.42)] transition-transform duration-700 motion-safe:hover:rotate-0 motion-safe:hover:scale-[1.015]"
            loading="lazy"
          />
        </div>

        <div className="text-center md:text-left">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#efc8b8]">
            {eyebrow}
          </p>
          <h2
            id="footer-church-hurt-guide-title"
            className="mx-auto mt-5 max-w-[19ch] font-[family-name:var(--font-cormorant-garamond)] text-[clamp(2.65rem,5vw,4.6rem)] font-medium leading-[0.94] tracking-[-0.025em] text-white text-balance md:mx-0"
          >
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lora)] text-sm leading-7 text-[#f7f2e8]/82 md:mx-0 md:text-base">
            {description}
          </p>
          <Link
            href={href}
            className="group mt-8 inline-flex min-h-14 items-center justify-center gap-5 bg-[#bd775c] px-7 py-4 font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_18px_40px_-24px_rgba(22,21,16,0.9)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#a96047] hover:shadow-[0_24px_48px_-24px_rgba(22,21,16,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span>{cta}</span>
            <span
              aria-hidden="true"
              className="text-base transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

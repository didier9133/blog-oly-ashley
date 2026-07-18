"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/[locale]/actions/newsletter";
import { useLocale, useTranslations } from "next-intl";

export function SubstackHeroSubscribe() {
  const t = useTranslations("subscribeHero");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current && !inputRef.current.checkValidity()) {
      inputRef.current.reportValidity();
      return;
    }

    const toastId = toast.loading(t("toast-loading"));

    try {
      await subscribeToNewsletter(email, {
        locale: locale === "es" ? "es" : "en",
        source: "hero",
        sourceUrl: window.location.href,
      });
      toast.success(t("toast-success"), { id: toastId });
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(t("toast-error"), { id: toastId });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="group flex items-end gap-3 max-w-md"
    >
      <label htmlFor="hero-email" className="sr-only">
        {t("placeholder")}
      </label>
      <input
        id="hero-email"
        ref={inputRef}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder={t("placeholder")}
        autoComplete="email"
        inputMode="email"
        required
        className="flex-1 min-w-0 bg-transparent border-0 border-b border-foreground/25 pb-2 outline-none font-[family-name:var(--font-lora)] text-base sm:text-lg text-foreground placeholder:text-foreground/35 placeholder:font-light py-1 transition-colors duration-500 focus:border-primary"
      />
      <button
        type="submit"
        aria-label={t("cta")}
        className="shrink-0 inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white bg-[#d8a08b] hover:bg-[#c28c77] px-5 py-3 rounded-sm transition-colors duration-500 ease-out shadow-sm"
      >
        <span>{t("cta")}</span>
        <span
          aria-hidden
          className="inline-block transition-transform duration-500 ease-[var(--ease-breath)] group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </form>
  );
}

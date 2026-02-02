"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/[locale]/actions/newsletter";
import { useTranslations } from "next-intl";

export function SubstackHeroSubscribe() {
  const t = useTranslations("subscribeHero");
  const [email, setEmail] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use native validation messages when possible.
    if (inputRef.current && !inputRef.current.checkValidity()) {
      inputRef.current.reportValidity();
      return;
    }

    const toastId = toast.loading(t("toast-loading"));

    try {
      await subscribeToNewsletter(email, { source: "hero" });
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
      className="flex w-full items-stretch border border-[#de9e86]/20 rounded-sm overflow-hidden bg-white/40 shadow-sm focus-within:border-[#de9e86] transition-colors"
    >
      <input
        ref={inputRef}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder={t("placeholder")}
        className="flex-1 min-w-0 bg-transparent px-4 py-4 text-xs font-sans text-foreground placeholder:text-muted-foreground/60 outline-none"
        required
        autoComplete="email"
        inputMode="email"
      />
      <button
        type="submit"
        className="bg-[#de9e86] text-white px-6 uppercase tracking-[0.15em] text-[10px] font-bold hover:bg-[#c98a72] transition-colors whitespace-nowrap"
        aria-label={t("cta")}
      >
        {t("cta")}
      </button>
    </form>
  );
}

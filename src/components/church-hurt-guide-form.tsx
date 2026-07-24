"use client";

import { useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/[locale]/actions/newsletter";
import { trackAnalyticsEvent } from "@/lib/analytics";

type GuideLocale = "en" | "es";

const FORM_COPY = {
  en: {
    loading: "Sending your guide…",
    toastSuccess: "Your guide is on its way.",
    toastError: "We couldn’t send the guide. Please try again.",
    success: "Check your inbox. Your guide is on its way.",
    label: "Email address",
    placeholder: "you@example.com",
    sending: "Sending…",
    cta: "Help Me Name What I Am Carrying",
    trust:
      "Free. Five minutes. Your guide arrives by email, followed by one gentle next step from Ashley.",
  },
  es: {
    loading: "Enviando tu guía…",
    toastSuccess: "La guía va en camino.",
    toastError: "No pudimos enviar la guía. Inténtalo de nuevo.",
    success: "Revisa tu correo. La guía va en camino.",
    label: "Correo electrónico",
    placeholder: "tu@correo.com",
    sending: "Enviando…",
    cta: "Ayúdame a darle nombre a lo que estoy viviendo",
    trust:
      "Gratis. Cinco minutos. La guía está en inglés y llegará a tu correo; después recibirás un mensaje breve de Ashley para acompañar el siguiente paso.",
  },
} as const;

export function ChurchHurtGuideForm({ locale }: { locale: GuideLocale }) {
  const copy = FORM_COPY[locale];
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputRef.current && !inputRef.current.checkValidity()) {
      inputRef.current.reportValidity();
      return;
    }

    const toastId = toast.loading(copy.loading);
    setIsSubmitting(true);

    try {
      await subscribeToNewsletter(email, {
        locale,
        source: "church_hurt_landing",
        sourceUrl: window.location.href,
      });
      trackAnalyticsEvent("newsletter_signup", {
        source_location: "church_hurt_landing",
        locale,
      });
      toast.success(copy.toastSuccess, { id: toastId });
      setEmail("");
      setIsDelivered(true);
    } catch (error) {
      console.error(error);
      toast.error(copy.toastError, {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDelivered) {
    return (
      <div
        role="status"
        className="flex min-h-16 items-center gap-4 border border-[#65705c]/20 bg-[#eef0e9] px-5 py-4 text-[#34372f]"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#62684f] text-white">
          <Check className="size-4" aria-hidden="true" />
        </span>
        <p className="font-[family-name:var(--font-lora)] text-sm leading-relaxed">
          {copy.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate={false}>
      <label
        htmlFor="church-hurt-guide-email"
        className="mb-2.5 block font-sans text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#5f5a54]"
      >
        {copy.label}
      </label>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input
          ref={inputRef}
          id="church-hurt-guide-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          autoComplete="email"
          inputMode="email"
          required
          disabled={isSubmitting}
          className="min-h-14 min-w-0 border border-[#7b7167]/25 bg-white/75 px-5 font-[family-name:var(--font-lora)] text-base text-[#27231f] outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-[#7b7167]/55 focus:border-[#9b5941] focus:bg-white focus:shadow-[0_0_0_3px_rgba(155,89,65,0.12)]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex min-h-14 max-w-full items-center justify-center gap-3 bg-[#8f513b] px-6 py-3.5 font-sans text-[0.7rem] font-bold uppercase leading-[1.35] tracking-[0.12em] text-[#fffaf5] shadow-[0_16px_34px_-22px_rgba(92,45,31,0.95)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#784330] hover:shadow-[0_20px_38px_-20px_rgba(92,45,31,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f513b] disabled:pointer-events-none disabled:opacity-65 sm:max-w-[17rem]"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                className="size-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
              <span>{copy.sending}</span>
            </>
          ) : (
            <>
              <span className="text-balance">{copy.cta}</span>
              <span
                aria-hidden="true"
                className="text-base transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </>
          )}
        </button>
      </div>
      <p className="mt-3 font-[family-name:var(--font-lora)] text-[0.7rem] leading-relaxed text-[#655f58]/75">
        {copy.trust}
      </p>
    </form>
  );
}

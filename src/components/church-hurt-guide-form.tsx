"use client";

import { useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/[locale]/actions/newsletter";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./church-hurt-guide-form.module.css";

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
      <div role="status" className={styles.success}>
        <span className={styles.successIcon}>
          <Check className={styles.successCheck} aria-hidden="true" />
        </span>
        <p className={styles.successText}>{copy.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate={false}>
      <label htmlFor="church-hurt-guide-email" className={styles.label}>
        {copy.label}
      </label>
      <div className={styles.controls}>
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
          className={styles.input}
        />
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? (
            <>
              <LoaderCircle className={styles.spinner} aria-hidden="true" />
              <span>{copy.sending}</span>
            </>
          ) : (
            <>
              <span className={styles.buttonLabel}>{copy.cta}</span>
              <span aria-hidden="true" className={styles.arrow}>
                →
              </span>
            </>
          )}
        </button>
      </div>
      <p className={styles.trust}>{copy.trust}</p>
    </form>
  );
}

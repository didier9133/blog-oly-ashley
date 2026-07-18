"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { scrollToNewsletter as scrollToNewsletterUtil } from "@/lib/newsletter-scroll";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/app/[locale]/actions/newsletter";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Check, LoaderCircle } from "lucide-react";

interface FormSubscribeNewsletterProps {
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "transparent";
}

export function FormSubscribeNewsletter({
  className,
  showLabel = true,
  variant = "default",
}: FormSubscribeNewsletterProps) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleNewsletterHash = () => {
      if (window.location.hash !== "#newsletter") return;

      scrollToNewsletterUtil({ behavior: "smooth" });
    };

    handleNewsletterHash();
    window.addEventListener("hashchange", handleNewsletterHash);
    return () => window.removeEventListener("hashchange", handleNewsletterHash);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current && !inputRef.current.checkValidity()) {
      inputRef.current.reportValidity();
      return;
    }

    const toastId = toast.loading(t("toast-loading"));
    setIsSubmitting(true);

    try {
      await subscribeToNewsletter(email, {
        locale: locale === "es" ? "es" : "en",
        source: "footer",
        sourceUrl: window.location.href,
      });
      trackAnalyticsEvent("newsletter_signup", {
        source_location: "footer",
        locale,
      });
      toast.success(t("toast-success"), { id: toastId });
      setEmail("");
      setIsDelivered(true);
    } catch (err) {
      console.error(err);
      toast.error(t("toast-error"), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="newsletter-form" className={cn("w-full", className)}>
      <label
        htmlFor="newsletter-email"
        className={
          showLabel
            ? "block uppercase tracking-widest text-xs font-bold text-muted-foreground mb-4 text-center"
            : "sr-only"
        }
      >
        {showLabel ? t("newsletter-label") : t("placeholder")}
      </label>

      <div className="w-full max-w-xl mx-auto">
        {isDelivered ? (
          <div
            className="flex min-h-14 items-center justify-center gap-3 rounded-sm border border-[#f7f2e8]/35 bg-[#f7f2e8]/10 px-5 py-3 text-left text-sm text-[#fffaf2]"
            role="status"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f7f2e8] text-[#62684f]">
              <Check className="size-4" aria-hidden="true" />
            </span>
            <span>{t("delivery-confirmation")}</span>
          </div>
        ) : (
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row w-full gap-3 items-center sm:items-stretch"
        >
          <Input
            ref={inputRef}
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            required
            disabled={isSubmitting}
            autoComplete="email"
            inputMode="email"
            className={cn(
              "w-full sm:flex-1 transition-all h-14 text-base shadow-sm px-6 rounded-sm border",
              variant === "default"
                ? "bg-white border-orange-900/10 focus:border-[#bd775c] focus:ring-[#bd775c]/20 placeholder:text-muted-foreground/60"
                : "bg-[#fbf7f1] border-[#fbf7f1] text-[#1a1714] placeholder:text-[#6a6259] focus-visible:border-[#bd775c] focus-visible:ring-[#bd775c]/30",
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "h-14 w-full sm:w-auto px-8 uppercase tracking-widest text-xs font-bold transition-all shadow-sm rounded-sm",
              variant === "default"
                ? "bg-[#bd775c] hover:bg-[#a1624b] text-white"
                : "bg-[#e8e3dd] hover:bg-white text-[#4a4f3d]",
            )}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                <span>{t("sending-label")}</span>
              </>
            ) : (
              t("subscribe-label")
            )}
          </Button>
        </form>
        )}
        <p className="mt-3 text-center text-[11px] leading-relaxed text-[#f7f2e8]/70">
          {t("lead-magnet-consent")}
        </p>
      </div>
    </div>
  );
}

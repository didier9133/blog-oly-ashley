"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { scrollToNewsletter as scrollToNewsletterUtil } from "@/lib/newsletter-scroll";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/app/[locale]/actions/newsletter";

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
  const [email, setEmail] = useState("");
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

    try {
      await subscribeToNewsletter(email, { source: "footer" });
      toast.success(t("toast-success"), { id: toastId });
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(t("toast-error"), { id: toastId });
    }
  };

  return (
    <div id="newsletter-form" className={cn("w-full", className)}>
      {showLabel && (
        <label
          htmlFor="newsletter-email"
          className="block uppercase tracking-widest text-xs font-bold text-muted-foreground mb-4 text-center"
        >
          {t("newsletter-label")}
        </label>
      )}

      <div className="w-full max-w-md mx-auto">
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
            autoComplete="email"
            inputMode="email"
            className={cn(
              "w-full sm:flex-1 transition-all h-14 text-base shadow-sm px-6 rounded-sm border",
              variant === "default"
                ? "bg-white border-orange-900/10 focus:border-[#bd775c] focus:ring-[#bd775c]/20 placeholder:text-muted-foreground/60"
                : "bg-transparent border-white/40 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20",
            )}
          />
          <Button
            type="submit"
            className={cn(
              "h-14 w-full sm:w-auto px-8 uppercase tracking-widest text-xs font-bold transition-all shadow-sm rounded-sm",
              variant === "default"
                ? "bg-[#bd775c] hover:bg-[#a1624b] text-white"
                : "bg-[#e8e3dd] hover:bg-white text-[#4a4f3d]",
            )}
          >
            {t("subscribe-label")}
          </Button>
        </form>
      </div>
    </div>
  );
}

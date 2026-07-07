"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

interface ButtonPayProps {
  isSubmitting: boolean;
  isDisabled?: boolean;
}

export function ButtonPay({ isSubmitting, isDisabled }: ButtonPayProps) {
  const t = useTranslations("Checkout");
  const disabled = isSubmitting || Boolean(isDisabled);
  const showPreparingState = !isSubmitting && Boolean(isDisabled);

  return (
    <div className="flex gap-3">
      <Button className="flex-1" size="lg" type="submit" disabled={disabled}>
        {isSubmitting ? (
          <>
            <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
            {t("pay-processing")}
          </>
        ) : showPreparingState ? (
          <>
            <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
            {t("pay-preparing")}
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            {t("pay-button")}
          </>
        )}
      </Button>
    </div>
  );
}

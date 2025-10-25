"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, ShoppingCart } from "lucide-react";

interface ButtonPayProps {
  isSubmitting: boolean;
  isDisabled?: boolean;
}

export function ButtonPay({ isSubmitting, isDisabled }: ButtonPayProps) {
  const disabled = isSubmitting || Boolean(isDisabled);
  const showPreparingState = !isSubmitting && Boolean(isDisabled);

  return (
    <div className="flex gap-3">
      <Button className="flex-1" size="lg" type="submit" disabled={disabled}>
        {isSubmitting ? (
          <>
            <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
            {"Processing..."}
          </>
        ) : showPreparingState ? (
          <>
            <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
            {"Preparing checkout"}
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            {"Buy Now"}
          </>
        )}
      </Button>
    </div>
  );
}

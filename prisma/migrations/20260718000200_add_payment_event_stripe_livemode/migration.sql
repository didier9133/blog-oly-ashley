ALTER TABLE "PaymentEvent"
ADD COLUMN "stripeLivemode" BOOLEAN;

CREATE INDEX "PaymentEvent_stripeLivemode_createdAt_idx"
ON "PaymentEvent"("stripeLivemode", "createdAt");

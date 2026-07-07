CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT,
    "eventType" TEXT NOT NULL,
    "stripePaymentIntent" TEXT,
    "stripeChargeId" TEXT,
    "stripeSessionId" TEXT,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "amount" INTEGER,
    "currency" TEXT,
    "productName" TEXT,
    "productType" TEXT,
    "status" TEXT,
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaymentEvent_stripeEventId_key" ON "PaymentEvent"("stripeEventId");
CREATE INDEX "PaymentEvent_eventType_idx" ON "PaymentEvent"("eventType");
CREATE INDEX "PaymentEvent_stripePaymentIntent_idx" ON "PaymentEvent"("stripePaymentIntent");
CREATE INDEX "PaymentEvent_customerEmail_idx" ON "PaymentEvent"("customerEmail");
CREATE INDEX "PaymentEvent_createdAt_idx" ON "PaymentEvent"("createdAt");

-- CreateTable
CREATE TABLE "NewsletterSignup" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT,
    "source" TEXT,
    "handledAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSignup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSignup_email_key" ON "NewsletterSignup"("email");

-- CreateIndex
CREATE INDEX "NewsletterSignup_createdAt_idx" ON "NewsletterSignup"("createdAt");

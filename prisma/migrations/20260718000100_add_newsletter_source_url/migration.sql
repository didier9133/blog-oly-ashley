-- Preserve the complete signup URL, including query parameters used for attribution.
ALTER TABLE "NewsletterSignup" ADD COLUMN "sourceUrl" TEXT;

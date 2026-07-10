import "server-only";

export const CONTACT_NOTIFICATION_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL || "support@ashleydianaleon.com";

export const NEWSLETTER_NOTIFICATION_EMAIL =
  process.env.NEWSLETTER_NOTIFICATION_EMAIL || CONTACT_NOTIFICATION_EMAIL;

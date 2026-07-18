import "server-only";

export const SUPPORT_EMAIL = "support@ashleydianaleon.com";

export const CONTACT_NOTIFICATION_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL || SUPPORT_EMAIL;

export const NEWSLETTER_NOTIFICATION_EMAIL =
  process.env.NEWSLETTER_NOTIFICATION_EMAIL || CONTACT_NOTIFICATION_EMAIL;

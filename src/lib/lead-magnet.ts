export const LEAD_MAGNET = {
  s3Key: "lead-magnets/which-binary-are-you-standing-in.pdf",
  downloadFileName: "Which Binary Are You Standing In - Ashley Leon.pdf",
  sha256Hex:
    "349d2fab584e9730b393861d8353f03b1b7d5db1f8788f20c548d06f5870202f",
  sha256Base64: "NJ0vq1hOlzCzk4Ydg1PwOxt9XbH4eI8gxUjQb1hwIC8=",
  expiresInSeconds: 60 * 60 * 48,
  title: "Which Binary Are You Standing In?",
} as const;

export type LeadMagnetLocale = "en" | "es";

export const LEAD_MAGNET_EMAIL_SUBJECT =
  "Your free guide is here: Which Binary Are You Standing In?";

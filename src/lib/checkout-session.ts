const SESSION_MAX_AGE_MS = 23 * 60 * 60 * 1000;
const sessions = new Map<string, { id: string; createdAt: number }>();

/** One purchase attempt per product and browser tab, including reloads. */
export function getCheckoutSessionId(productKey: string, renew = false) {
  const key = `adl_checkout:v1:${productKey}`;
  let session = sessions.get(key);
  try {
    const stored = window.sessionStorage.getItem(key);
    if (stored) session = JSON.parse(stored);
  } catch {
    // Keep the same ID in memory when browser storage is unavailable.
  }

  if (
    renew ||
    !session ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      session.id,
    ) ||
    !Number.isFinite(session.createdAt) ||
    Date.now() - session.createdAt >= SESSION_MAX_AGE_MS
  ) {
    session = { id: crypto.randomUUID(), createdAt: Date.now() };
  }

  sessions.set(key, session);
  try {
    window.sessionStorage.setItem(key, JSON.stringify(session));
  } catch {
    // Storage must never prevent checkout.
  }
  return session.id;
}

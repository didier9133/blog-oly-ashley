export function getStripeLivemodeFromSecretKey(
  secretKey = process.env.STRIPE_SECRET_KEY,
): boolean | null {
  if (!secretKey) return null;
  if (/^(?:sk|rk)_live_/.test(secretKey)) return true;
  if (/^(?:sk|rk)_test_/.test(secretKey)) return false;
  return null;
}

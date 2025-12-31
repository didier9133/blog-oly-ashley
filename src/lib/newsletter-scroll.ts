export function scrollToNewsletter(options?: { behavior?: "auto" | "smooth" }) {
  if (typeof window === "undefined") return;

  const behavior = options?.behavior ?? "smooth";

  const anchor = document.getElementById("newsletter");
  if (!anchor) return;

  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const rect = anchor.getBoundingClientRect();
  const targetTop = rect.top + window.scrollY;
  const maxTop = document.documentElement.scrollHeight - window.innerHeight;
  const clampedTop = Math.max(0, Math.min(targetTop, maxTop));

  if (behavior === "auto" || prefersReduced) {
    window.scrollTo(0, clampedTop);
    return;
  }

  // Manual smooth scroll for consistent behavior (Safari included).
  const startTop = window.scrollY;
  const delta = clampedTop - startTop;
  if (Math.abs(delta) < 1) return;

  const durationMs = 500;
  const start = window.performance?.now?.() ?? Date.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    const elapsed = now - start;
    const t = Math.min(1, Math.max(0, elapsed / durationMs));
    const eased = easeInOutCubic(t);
    window.scrollTo(0, startTop + delta * eased);
    if (t < 1) window.requestAnimationFrame(step);
  };

  // Wait for layout to settle (especially after route transitions).
  window.requestAnimationFrame(() => window.requestAnimationFrame(step));
}

export function configuredNumber(
  value: string | undefined,
  fallback: number,
): number {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const CIRCLE_EARLY_PRICE = Math.max(
  0,
  configuredNumber(process.env.NEXT_PUBLIC_CIRCLE_EARLY_PRICE, 197),
);

export const CIRCLE_REGULAR_PRICE = Math.max(
  CIRCLE_EARLY_PRICE,
  configuredNumber(process.env.NEXT_PUBLIC_CIRCLE_REGULAR_PRICE, 297),
);

export const CIRCLE_SPOTS_REMAINING = Math.max(
  0,
  Math.floor(
    configuredNumber(process.env.NEXT_PUBLIC_CIRCLE_SPOTS_REMAINING, 10),
  ),
);

export const CIRCLE_CAPACITY = Math.max(
  CIRCLE_SPOTS_REMAINING,
  Math.floor(configuredNumber(process.env.NEXT_PUBLIC_CIRCLE_CAPACITY, 15)),
);

export const CIRCLE_IS_AVAILABLE = CIRCLE_SPOTS_REMAINING > 0;

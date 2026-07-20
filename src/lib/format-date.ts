export function formatDate(
  value: Date | string,
  locale: string,
): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
  }).format(date);
}

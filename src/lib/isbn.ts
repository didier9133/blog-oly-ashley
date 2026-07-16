export function normalizeValidIsbn13(isbn: string | null | undefined) {
  const digits = isbn?.replace(/[^0-9]/g, "") ?? "";
  if (!/^\d{13}$/.test(digits)) return null;

  const weightedSum = digits
    .slice(0, 12)
    .split("")
    .reduce(
      (sum, digit, index) => sum + Number(digit) * (index % 2 === 0 ? 1 : 3),
      0,
    );
  const expectedCheckDigit = (10 - (weightedSum % 10)) % 10;

  return expectedCheckDigit === Number(digits[12]) ? digits : null;
}

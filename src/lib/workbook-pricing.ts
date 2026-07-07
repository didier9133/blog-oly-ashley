export const WORKBOOK_PRICE_CENTS = 3300;

export function workbookPriceCents(price?: number | null) {
  return price && price > WORKBOOK_PRICE_CENTS
    ? price
    : WORKBOOK_PRICE_CENTS;
}

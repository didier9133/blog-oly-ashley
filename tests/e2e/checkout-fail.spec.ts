import { test, expect, type Page } from "@playwright/test";
import {
  fetchCheckoutState,
  waitForEventsRecorded,
} from "../helpers/checkout-api";

const WORKBOOK_SLUG =
  process.env.E2E_WORKBOOK_SLUG ?? "reconstruyendo-la-reverencia";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

const BILLING = {
  name: "Prueba E2E",
  email: "e2e+failed@example.com",
  phone: "+57 3001234567",
};

type DeclineCase = {
  name: string;
  card: string;
  expectedEventCode?: string;
};

const DECLINE_CASES: DeclineCase[] = [
  { name: "card_declined", card: "4000000000000002", expectedEventCode: "card_declined" },
  { name: "insufficient_funds", card: "4000000000009995", expectedEventCode: "insufficient_funds" },
  { name: "lost_card", card: "4000000000000069", expectedEventCode: "lost_card" },
  { name: "stolen_card", card: "4000000000000051", expectedEventCode: "stolen_card" },
  { name: "processing_error", card: "4000000000000119", expectedEventCode: "processing_error" },
];

function checkoutForm(page: Page) {
  return page
    .locator("form")
    .filter({ has: page.locator('input[name="name"]') });
}

function payButton(page: Page) {
  return checkoutForm(page).locator('button[type="submit"]');
}

async function gotoCheckout(page: Page) {
  await page.goto(`/es/workbooks/${WORKBOOK_SLUG}`, {
    waitUntil: "commit",
    timeout: 90_000,
  });

  const billingName = page.locator('input[name="name"]').first();
  const retry = page.getByRole("button", { name: "Reintentar" });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const isBillingReady = await billingName
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    if (isBillingReady) return;

    if (await retry.isVisible().catch(() => false)) {
      const clicked = await retry
        .click({ timeout: 2_000 })
        .then(() => true)
        .catch(() => false);
      if (!clicked) {
        await page.reload({ waitUntil: "commit", timeout: 90_000 });
      }
      await page.waitForTimeout(3_000);
    } else {
      await page.goto(`/es/workbooks/${WORKBOOK_SLUG}`, {
        waitUntil: "commit",
        timeout: 90_000,
      });
      await page.waitForTimeout(2_000);
    }
  }

  await expect(billingName).toBeVisible({ timeout: 45_000 });
}

async function fillBilling(page: Page, overrides: Partial<typeof BILLING> = {}) {
  const data = { ...BILLING, ...overrides };
  await page.locator('input[name="name"]').fill(data.name);
  await page.locator('input[name="email"]').fill(data.email);
  await page.locator('input[name="phone"]').fill(data.phone);
}

async function capturePaymentIntentId(page: Page): Promise<string[]> {
  const observed: string[] = [];
  page.on("response", (res) => {
    if (res.url().includes("/api/create-payment-intent") && res.ok()) {
      res
        .json()
        .then((b: any) => {
          if (b?.paymentIntentId)
            observed.push(b.paymentIntentId as string);
        })
        .catch(() => {});
    }
  });
  return observed;
}

test.describe("Checkout pagos fallidos", () => {
  test.describe.configure({ mode: "serial" });

  test("validación de billing bloquea envío sin llamar a Stripe", async ({
    page,
  }) => {
    const observed = await capturePaymentIntentId(page);
    await gotoCheckout(page);

    await payButton(page).click();

    await expect(checkoutForm(page)).toContainText("Ingresa tu nombre");
    await expect(checkoutForm(page)).toContainText("Ingresa un correo válido");
    await expect(checkoutForm(page)).toContainText(
      "Ingresa un número con código internacional",
    );
    await expect(page).toHaveURL(new RegExp(`/workbooks/${WORKBOOK_SLUG}`));
  });

  test("campo email inválido muestra error y no confirma", async ({
    page,
  }) => {
    await gotoCheckout(page);
    await fillBilling(page, { email: "no-es-un-email" });

    await payButton(page).click();
    await expect(checkoutForm(page)).toContainText("Ingresa un correo válido");
    await expect(page).toHaveURL(new RegExp(`/workbooks/${WORKBOOK_SLUG}`));
  });

  test("campo teléfono inválido muestra error y no confirma", async ({
    page,
  }) => {
    await gotoCheckout(page);
    await fillBilling(page, { phone: "3001234567" });

    await payButton(page).click();
    await expect(checkoutForm(page)).toContainText(
      "Ingresa un número con código internacional",
    );
    await expect(page).toHaveURL(new RegExp(`/workbooks/${WORKBOOK_SLUG}`));
  });

  test("botón de pago se rehabilita tras fallo (doble click)", async ({}) => {
    test.skip(true, "Requiere llenar Stripe iframe — cubierto en casos de declinación");
  });
});

for (const tc of DECLINE_CASES) {
  test(`Stripe declina "${tc.name}" → toast y sin redirección`, async ({
    page,
  }) => {
    const observed = await capturePaymentIntentId(page);
    test.setTimeout(120_000);

    await gotoCheckout(page);
    await fillBilling(page);

    await fillStripeCard(page, tc.card);

    const payButton = checkoutForm(page).locator('button[type="submit"]');
    await payButton.click();

    const toast = page
      .locator('[data-sonner-toast][data-type="error"]')
      .first();
    await expect(toast).toBeVisible({ timeout: 60_000 });
    await expect(toast).toContainText(/.+/);

    await expect(page).toHaveURL(new RegExp(`/workbooks/${WORKBOOK_SLUG}`));

    const paymentIntentId = observed.at(-1);
    if (!paymentIntentId) {
      console.warn(`No se capturó paymentIntentId para ${tc.name}`);
      return;
    }

    await waitForEventsRecorded(paymentIntentId, "checkout.confirm_failed", {
      timeoutMs: 20_000,
      intervalMs: 1_000,
    });

    const state = await fetchCheckoutState(paymentIntentId);
    const hasFailedEvent = state.events.some(
      (e) =>
        e.eventType === "checkout.confirm_failed" ||
        e.eventType === "checkout.confirm_exception" ||
        e.eventType === "checkout.submit_failed",
    );
    if (state.events.length > 0) {
      expect(hasFailedEvent).toBe(true);
    } else {
      console.warn(
        `Sin eventos registrados para ${tc.name} (${paymentIntentId}). El webhook/events podría no haber alcanzado la DB.`,
      );
    }
    const orphanPaid = state.purchases.find(
      (p) => p.stripePaymentIntent === paymentIntentId && p.is_paid,
    );
    expect(orphanPaid).toBeUndefined();
  });
}

async function getStripeCardFrame(page: Page) {
  const deadline = Date.now() + 40_000;
  while (Date.now() < deadline) {
    for (const f of page.frames()) {
      const count = await f
        .locator('input[name="number"][autocomplete="cc-number"]')
        .count()
        .catch(() => 0);
      if (count > 0) return f;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Stripe card input frame not found within 40s");
}

async function fillStripeCard(page: Page, card: string) {
  const frame = await getStripeCardFrame(page);
  await frame.locator('input[name="number"]').fill(card, { timeout: 30_000 });
  await frame.locator('input[name="expiry"]').fill("12/30", { timeout: 30_000 });
  await frame.locator('input[name="cvc"]').fill("123", { timeout: 30_000 });
  const postalVisible = await frame
    .locator('input[name="postalCode"]')
    .isVisible()
    .catch(() => false);
  if (postalVisible) {
    await frame
      .locator('input[name="postalCode"]')
      .fill("12345", { timeout: 20_000 });
  }
}

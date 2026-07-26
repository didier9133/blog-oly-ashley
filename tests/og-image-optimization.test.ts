import { describe, expect, test } from "bun:test";
import sharp from "sharp";

import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_MAX_INPUT_SIZE_MB,
  OG_IMAGE_MAX_OUTPUT_SIZE,
  OG_IMAGE_WIDTH,
  canTransformToOgImage,
  exceedsOgImagePixelLimit,
  hasWorkableOgImageAspectRatio,
  isAllowedOgImageFile,
} from "../src/lib/og-image-validation";
import {
  OgImageValidationError,
  optimizeOgImage,
} from "../src/lib/server/optimize-og-image";

async function getRejection(promise: Promise<unknown>) {
  try {
    await promise;
    return null;
  } catch (error) {
    return error;
  }
}

describe("OG image validation", () => {
  test("accepts the three input formats shown in the form", () => {
    expect(isAllowedOgImageFile(new File(["jpg"], "cover.jpg"))).toBe(true);
    expect(isAllowedOgImageFile(new File(["png"], "cover.png"))).toBe(true);
    expect(isAllowedOgImageFile(new File(["webp"], "cover.webp"))).toBe(true);
    expect(isAllowedOgImageFile(new File(["gif"], "cover.gif"))).toBe(false);
    expect(OG_IMAGE_MAX_INPUT_SIZE_MB).toBe(10);
  });

  test("accepts workable dimensions and enforces the pixel ceiling", () => {
    expect(
      canTransformToOgImage({ width: 1000, height: 1000 }),
    ).toBe(true);
    expect(
      canTransformToOgImage({ width: 1080, height: 1920 }),
    ).toBe(true);
    expect(
      hasWorkableOgImageAspectRatio({ width: 1080, height: 1920 }),
    ).toBe(false);
    expect(
      hasWorkableOgImageAspectRatio({ width: 1000, height: 1000 }),
    ).toBe(true);
    expect(
      canTransformToOgImage({ width: 900, height: OG_IMAGE_HEIGHT }),
    ).toBe(false);
    expect(exceedsOgImagePixelLimit({ width: 8000, height: 5001 })).toBe(true);
  });
});

describe("OG image optimization", () => {
  test("crops and converts an accepted image to a bounded 1200x630 JPEG", async () => {
    const input = await sharp({
      create: {
        width: 1000,
        height: 1000,
        channels: 4,
        background: { r: 137, g: 92, b: 72, alpha: 0.7 },
      },
    })
      .png()
      .toBuffer();

    const output = await optimizeOgImage(input);
    const metadata = await sharp(output).metadata();

    expect(metadata.format).toBe("jpeg");
    expect(metadata.width).toBe(OG_IMAGE_WIDTH);
    expect(metadata.height).toBe(OG_IMAGE_HEIGHT);
    expect(output.byteLength <= OG_IMAGE_MAX_OUTPUT_SIZE).toBe(true);
  });

  test("rejects images that would need excessive enlargement", async () => {
    const input = await sharp({
      create: {
        width: 900,
        height: OG_IMAGE_HEIGHT,
        channels: 3,
        background: "#ffffff",
      },
    })
      .jpeg()
      .toBuffer();

    const error = await getRejection(optimizeOgImage(input));
    expect(error instanceof OgImageValidationError).toBe(true);
  });

  test("rejects portrait images even when they have enough resolution", async () => {
    const input = await sharp({
      create: {
        width: 1600,
        height: 2400,
        channels: 3,
        background: "#ffffff",
      },
    })
      .jpeg()
      .toBuffer();

    const error = await getRejection(optimizeOgImage(input));
    expect(error instanceof OgImageValidationError).toBe(true);
  });

  test("checks the real file contents instead of trusting the extension", async () => {
    const svg = Buffer.from(
      `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"></svg>`,
    );

    const error = await getRejection(optimizeOgImage(svg));
    expect(error instanceof OgImageValidationError).toBe(true);
  });
});

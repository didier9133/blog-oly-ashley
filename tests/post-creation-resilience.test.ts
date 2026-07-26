import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const createPage = readFileSync(
  join(
    root,
    "src/app/[locale]/(auth)/dashboard/create/page.tsx",
  ),
  "utf8",
);
const postActions = readFileSync(
  join(root, "src/app/[locale]/actions/posts/index.ts"),
  "utf8",
);
const imageClient = readFileSync(
  join(root, "src/lib/client/upload-og-image.ts"),
  "utf8",
);
const middleware = readFileSync(join(root, "src/middleware.ts"), "utf8");

describe("post creation resilience", () => {
  test("keeps the form intact after a failed publish attempt", () => {
    expect(
      /catch \{\s*toast\.dismiss\(\);\s*toast\.error\(t\("toast\.create\.error"\)\);\s*\} finally \{\s*setIsSubmitting\(false\);\s*\}/.test(
        createPage,
      ),
    ).toBe(true);
    expect(createPage).toContain("window.localStorage.setItem");
    expect(createPage).toContain("window.localStorage.removeItem");
  });

  test("syncs the authenticated Clerk account before creating a post", () => {
    expect(postActions).toContain("ensureCurrentUserIsSynced()");
  });

  test("uploads large source images directly instead of sending them in a server action", () => {
    expect(imageClient).toContain('fetch("/api/upload/image"');
    expect(imageClient).toContain('method: "PUT"');
    expect(createPage).toContain("finalizeOgImageUpload(temporaryImageKey)");
    expect(middleware).toContain(
      "const apiMiddleware = clerkMiddleware(() => NextResponse.next())",
    );
    expect(middleware).toContain("return apiMiddleware(req, event)");
  });
});

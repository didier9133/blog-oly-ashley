import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/(es|en)/dashboard(.*)",
]);

const protectedMiddleware = clerkMiddleware(async (auth, req) => {
  const intlResponse = intlMiddleware(req);
  if (intlResponse && intlResponse.status !== 200) return intlResponse;

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!user.publicMetadata?.isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return intlResponse || NextResponse.next();
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    return protectedMiddleware(req, event);
  }

  // Public pages do not need Clerk. Keeping them outside Clerk's middleware
  // preserves Next.js cacheability and avoids auth headers on crawlable HTML.
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};

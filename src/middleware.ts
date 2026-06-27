import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/(es|en)/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    if (isProtectedRoute(req)) {
      const { userId, redirectToSignIn } = await auth();
      if (!userId) return redirectToSignIn();
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      if (!user.publicMetadata?.isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(req);
  if (intlResponse && intlResponse.status !== 200) return intlResponse;

  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user.publicMetadata?.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return intlResponse || NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|mp4|webm|mov|m4v|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};

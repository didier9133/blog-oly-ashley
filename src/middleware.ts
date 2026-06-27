import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/(es|en)/dashboard(.*)",
]);

// Build the Clerk-only middleware once. It runs the auth + admin check
// and is only invoked for protected routes (see dispatcher below).
// Public pages now resolve auth state via client-side useUser(), so they
// no longer need clerkMiddleware to have set up the request context —
// which lets Vercel cache ISR responses (was TTFB 6.79s).
const clerkHandler = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!user.publicMetadata?.isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export default async function middleware(
  req: NextRequest,
  ev: Parameters<typeof clerkHandler>[1],
) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    return clerkHandler(req, ev);
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

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

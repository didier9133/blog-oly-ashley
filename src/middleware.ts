import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  console.log("🔍 Middleware ejecutándose para:", req.nextUrl.pathname);
  // Ejecutar middleware de internacionalización para todas las rutas
  const intlResponse = intlMiddleware(req);

  // Si intlMiddleware retorna una respuesta (redirect), procesarla
  if (intlResponse && intlResponse.status !== 200) {
    return intlResponse;
  }
  console.log("🌐 Middleware de internacionalización completado");
  console.log({
    isProtectedRoute: isProtectedRoute(req),
    req,
  });
  // Continuar con la lógica de autenticación solo para rutas protegidas
  if (isProtectedRoute(req)) {
    console.log("🔒 Ruta protegida detectada");
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
      console.log("❌ Sin usuario, redirigiendo al login");
      return redirectToSignIn();
    }

    // Verificar si el usuario es admin
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!user.publicMetadata?.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Retornar la respuesta del middleware de i18n o continuar
  return intlResponse || NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};

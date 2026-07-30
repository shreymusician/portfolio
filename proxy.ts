import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (same
 * runtime, same matcher semantics -- just a new file name and export).
 * Wrapping with `auth()` (rather than a bare `await auth()` call) is the
 * documented Auth.js v5 pattern for this file: it reads the session from
 * the request object it's handed, since there's no per-request async
 * context here the way there is in Server Components/Actions.
 *
 * This is the outer gate only. Every Server Action and API route in
 * app/admin/** independently re-checks the session via `auth()` -- this
 * proxy is defense-in-depth, not the sole protection.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  // Protect every /admin/* route except /admin/login itself, so
  // unauthenticated users can reach the login page without a redirect loop.
  matcher: ["/admin((?!/login$).*)"],
};

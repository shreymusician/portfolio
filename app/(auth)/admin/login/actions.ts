"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

/**
 * Server Action backing the credentials login form. `signIn` redirects on
 * success by throwing a Next.js control-flow "NEXT_REDIRECT" error -- that
 * must be rethrown, not swallowed, or the redirect silently never happens.
 * Only genuine `AuthError`s (bad credentials, misconfiguration) are turned
 * into a user-facing message.
 */
export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid username or password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    throw error;
  }
}

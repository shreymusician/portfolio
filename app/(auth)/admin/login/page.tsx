import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4"
    >
      <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-[var(--color-text-primary)]">
          Admin Sign In
        </h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Sign in to manage portfolio content.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}

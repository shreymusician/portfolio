import Link from "next/link";
import { signOut } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/admin"
            className="text-sm font-semibold text-[var(--color-text-primary)]"
          >
            Portfolio Admin
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/projects"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Projects
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto max-w-5xl px-4 py-8 sm:px-6"
      >
        {children}
      </main>
    </div>
  );
}

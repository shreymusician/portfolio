import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-background)] px-4 text-center">
      <p className="font-mono text-sm text-[var(--color-text-secondary)]">
        404
      </p>
      <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[var(--color-text-primary)]">
        Page not found
      </h1>
      <p className="max-w-md text-[var(--color-text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-accent)] px-5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        Back to home
      </Link>
    </div>
  );
}

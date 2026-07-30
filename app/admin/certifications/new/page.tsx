import Link from "next/link";
import { CertificationForm } from "@/components/admin/certification-form";

export default function NewCertificationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/admin/certifications"
        className="text-sm font-medium text-[var(--color-accent)] hover:underline"
      >
        ← Back to certifications
      </Link>

      <h1 className="mt-6 text-2xl font-semibold text-[var(--color-text-primary)]">
        Add Certification
      </h1>

      <div className="mt-8">
        <CertificationForm />
      </div>
    </div>
  );
}

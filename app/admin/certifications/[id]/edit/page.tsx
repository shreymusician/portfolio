import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificationById } from "@/lib/certifications";
import { CertificationForm } from "@/components/admin/certification-form";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certification = await getCertificationById(id);

  if (!certification) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/admin/certifications"
        className="text-sm font-medium text-[var(--color-accent)] hover:underline"
      >
        ← Back to certifications
      </Link>

      <h1 className="mt-6 text-2xl font-semibold text-[var(--color-text-primary)]">
        Edit Certification
      </h1>

      <div className="mt-8">
        <CertificationForm certification={certification} />
      </div>
    </div>
  );
}

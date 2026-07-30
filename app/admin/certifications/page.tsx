import Link from "next/link";
import { getAllCertifications } from "@/lib/certifications";
import { CertificationDeleteButton } from "@/components/admin/certification-delete-button";

export default async function AdminCertificationsPage() {
  const certifications = await getAllCertifications();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Certifications & Achievements
        </h1>
        <Link
          href="/admin/certifications/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
        >
          Add Certification
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full border-collapse">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              <th className="border-b border-[var(--color-border)] px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Title
              </th>
              <th className="border-b border-[var(--color-border)] px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Issuer
              </th>
              <th className="border-b border-[var(--color-border)] px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Category
              </th>
              <th className="border-b border-[var(--color-border)] px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Date
              </th>
              <th className="border-b border-[var(--color-border)] px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certifications.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  No certifications yet. Add one to get started.
                </td>
              </tr>
            ) : (
              certifications.map((cert) => (
                <tr
                  key={cert.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[var(--color-text-primary)]">
                    {cert.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                    {cert.issuer}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-1 text-xs font-medium text-[var(--color-accent)]">
                      {cert.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                    {cert.issueDate}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/certifications/${cert.id}/edit`}
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        Edit
                      </Link>
                      <CertificationDeleteButton certificationId={cert.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

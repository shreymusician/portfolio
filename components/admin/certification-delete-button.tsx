"use client";

import { deleteCertificationAction } from "@/app/admin/certifications/actions";

interface CertificationDeleteButtonProps {
  certificationId: string;
}

export function CertificationDeleteButton({
  certificationId,
}: CertificationDeleteButtonProps) {
  return (
    <button
      onClick={() => {
        if (confirm("Delete this certification?")) {
          deleteCertificationAction(certificationId);
        }
      }}
      className="text-red-500 hover:underline"
    >
      Delete
    </button>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  createCertification,
  deleteCertification,
  updateCertification,
} from "@/lib/certifications";
import { CertificationInputSchema, certificationFormDataToInput } from "@/lib/validations";

export type CertificationFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.id !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function createCertificationAction(
  _prevState: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  await requireAdminSession();

  const parsed = CertificationInputSchema.safeParse(
    certificationFormDataToInput(formData)
  );
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await createCertification(parsed.data);

  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function updateCertificationAction(
  id: string,
  _prevState: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  await requireAdminSession();

  const parsed = CertificationInputSchema.safeParse(
    certificationFormDataToInput(formData)
  );
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const updated = await updateCertification(id, parsed.data);
  if (!updated) {
    return { success: false, message: "Certification not found." };
  }

  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function deleteCertificationAction(id: string): Promise<void> {
  await requireAdminSession();
  await deleteCertification(id);
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

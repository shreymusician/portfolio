"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  slugExists,
  updateProject,
} from "@/lib/projects";
import { ProjectInputSchema, projectFormDataToInput } from "@/lib/validations";

export type ProjectFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Every mutation re-checks the session itself -- proxy.ts already blocks
 * unauthenticated requests to /admin/*, but that is an outer gate, not the
 * only one. A Server Action is reachable by anyone who can send the same
 * POST, so it must not trust that the request only arrived via the UI.
 */
async function requireAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.id !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function createProjectAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdminSession();

  const parsed = ProjectInputSchema.safeParse(projectFormDataToInput(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  if (await slugExists(parsed.data.slug)) {
    return {
      success: false,
      errors: { slug: ["This slug is already in use by another project."] },
    };
  }

  await createProject(parsed.data);

  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProjectAction(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdminSession();

  const parsed = ProjectInputSchema.safeParse(projectFormDataToInput(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  if (await slugExists(parsed.data.slug, id)) {
    return {
      success: false,
      errors: { slug: ["This slug is already in use by another project."] },
    };
  }

  const updated = await updateProject(id, parsed.data);
  if (!updated) {
    return { success: false, message: "Project not found." };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await requireAdminSession();
  await deleteProject(id);
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

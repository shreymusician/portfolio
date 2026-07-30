import { z } from "zod";

/**
 * Slugs must be lowercase, URL-safe, and hyphen-separated (e.g. "ai-chatbot-rag").
 * They back the future /projects/[slug] detail route, so no reserved characters.
 */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Accepts an absolute http(s) URL, or an empty string for optional link fields. */
const optionalUrl = z
  .union([z.url({ protocol: /^https?$/ }), z.literal("")])
  .optional()
  .transform((val) => (val === "" ? undefined : val));

export const ProjectInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(60, "Slug must be 60 characters or fewer")
    .regex(SLUG_REGEX, "Use lowercase letters, numbers, and hyphens only (e.g. my-project)"),
  title: z.string().trim().min(1, "Title is required").max(120, "Title must be 120 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
  techStack: z
    .array(z.string().trim().min(1).max(40))
    .min(1, "Add at least one technology")
    .max(20, "Limit to 20 tech stack tags"),
  coverImageUrl: z.url("Cover image must be a valid URL"),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  /**
   * Short, quantifiable highlight rendered as a badge on the project card,
   * e.g. "40% faster inference", "10K+ monthly users". Optional and terse
   * by design -- this is a badge, not a second description field.
   */
  impactMetric: z
    .string()
    .trim()
    .max(60, "Impact metric must be 60 characters or fewer")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).max(10000).default(0),
});

export type ProjectInput = z.infer<typeof ProjectInputSchema>;

export const ProjectSchema = ProjectInputSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

/** Shape returned to the client after MongoDB serialization (_id as string). */
export type ProjectDocument = Project & { _id: string };

/**
 * Converts raw admin-form FormData into a plain object matching
 * ProjectInputSchema's expected shape, ready for `.safeParse()`.
 * Checkboxes are absent from FormData when unchecked, so booleans are
 * derived from presence rather than value. Tech stack is submitted as a
 * single comma-separated string and split here.
 */
export function projectFormDataToInput(formData: FormData) {
  const techStackRaw = String(formData.get("techStack") ?? "");
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    techStack: techStackRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    githubUrl: String(formData.get("githubUrl") ?? ""),
    liveUrl: String(formData.get("liveUrl") ?? ""),
    impactMetric: String(formData.get("impactMetric") ?? ""),
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    order: String(formData.get("order") ?? "0"),
  };
}

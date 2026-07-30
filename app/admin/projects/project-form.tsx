"use client";

import { useActionState } from "react";
import type { ProjectFormState } from "./actions";
import type { ProjectDTO } from "@/lib/projects";

type ProjectFormAction = (
  prevState: ProjectFormState,
  formData: FormData
) => Promise<ProjectFormState>;

const initialState: ProjectFormState = { success: false };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">
      {messages[0]}
    </p>
  );
}

const inputClasses =
  "h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2";
const textareaClasses =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2";
const labelClasses = "text-sm font-medium text-[var(--color-text-primary)]";

export function ProjectForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: ProjectFormAction;
  defaultValues?: Partial<ProjectDTO>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.message && (
        <p className="text-sm text-[var(--color-error)]" role="alert">
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className={labelClasses}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={defaultValues?.title}
            className={inputClasses}
          />
          <FieldError messages={errors.title} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className={labelClasses}>
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            placeholder="my-project"
            defaultValue={defaultValues?.slug}
            className={inputClasses}
          />
          <FieldError messages={errors.slug} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          className={textareaClasses}
        />
        <FieldError messages={errors.description} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="techStack" className={labelClasses}>
          Tech stack{" "}
          <span className="font-normal text-[var(--color-text-secondary)]">
            (comma-separated)
          </span>
        </label>
        <input
          id="techStack"
          name="techStack"
          type="text"
          required
          placeholder="React, Node.js, MongoDB"
          defaultValue={defaultValues?.techStack?.join(", ")}
          className={inputClasses}
        />
        <FieldError messages={errors.techStack} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="impactMetric" className={labelClasses}>
          Impact metric{" "}
          <span className="font-normal text-[var(--color-text-secondary)]">
            (optional badge, e.g. &quot;40% faster inference&quot;)
          </span>
        </label>
        <input
          id="impactMetric"
          name="impactMetric"
          type="text"
          maxLength={60}
          defaultValue={defaultValues?.impactMetric}
          className={inputClasses}
        />
        <FieldError messages={errors.impactMetric} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="coverImageUrl" className={labelClasses}>
            Cover image URL
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            type="text"
            required
            placeholder="https://images.unsplash.com/..."
            defaultValue={defaultValues?.coverImageUrl}
            className={inputClasses}
          />
          <FieldError messages={errors.coverImageUrl} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="order" className={labelClasses}>
            Sort order
          </label>
          <input
            id="order"
            name="order"
            type="number"
            min={0}
            defaultValue={defaultValues?.order ?? 0}
            className={inputClasses}
          />
          <FieldError messages={errors.order} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="githubUrl" className={labelClasses}>
            GitHub URL{" "}
            <span className="font-normal text-[var(--color-text-secondary)]">
              (optional)
            </span>
          </label>
          <input
            id="githubUrl"
            name="githubUrl"
            type="text"
            placeholder="https://github.com/user/project"
            defaultValue={defaultValues?.githubUrl}
            className={inputClasses}
          />
          <FieldError messages={errors.githubUrl} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="liveUrl" className={labelClasses}>
            Live URL{" "}
            <span className="font-normal text-[var(--color-text-secondary)]">
              (optional)
            </span>
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            type="text"
            placeholder="https://project.vercel.app"
            defaultValue={defaultValues?.liveUrl}
            className={inputClasses}
          />
          <FieldError messages={errors.liveUrl} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
          <input
            type="checkbox"
            name="published"
            defaultChecked={defaultValues?.published}
            className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaultValues?.featured}
            className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          />
          Featured
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-10 w-fit items-center justify-center rounded-md bg-[var(--color-accent)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import type { CertificationDTO } from "@/lib/certifications";
import {
  createCertificationAction,
  updateCertificationAction,
  type CertificationFormState,
} from "@/app/admin/certifications/actions";

interface CertificationFormProps {
  certification?: CertificationDTO;
}

export function CertificationForm({ certification }: CertificationFormProps) {
  const isEdit = !!certification;
  const action = isEdit
    ? (formData: FormData) => updateCertificationAction(certification.id, {
        success: false,
      }, formData)
    : createCertificationAction;

  const [state, formAction, isPending] = useActionState<CertificationFormState, FormData>(
    action,
    { success: false }
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-primary)]">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={certification?.title ?? ""}
          required
          className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="e.g., AI Literacy Certification"
        />
        {state.errors?.title && (
          <p className="mt-1 text-sm text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="issuer" className="block text-sm font-medium text-[var(--color-text-primary)]">
          Issuer *
        </label>
        <input
          type="text"
          id="issuer"
          name="issuer"
          defaultValue={certification?.issuer ?? ""}
          required
          className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="e.g., IBM"
        />
        {state.errors?.issuer && (
          <p className="mt-1 text-sm text-red-500">{state.errors.issuer[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="issueDate" className="block text-sm font-medium text-[var(--color-text-primary)]">
          Issue Date *
        </label>
        <input
          type="text"
          id="issueDate"
          name="issueDate"
          defaultValue={certification?.issueDate ?? ""}
          required
          className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="e.g., December 2025"
        />
        {state.errors?.issueDate && (
          <p className="mt-1 text-sm text-red-500">{state.errors.issueDate[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text-primary)]">
          Category *
        </label>
        <select
          id="category"
          name="category"
          defaultValue={certification?.category ?? "certification"}
          className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="certification">Certification</option>
          <option value="workshop">Workshop</option>
          <option value="hackathon">Hackathon</option>
          <option value="achievement">Achievement</option>
        </select>
        {state.errors?.category && (
          <p className="mt-1 text-sm text-red-500">{state.errors.category[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-[var(--color-text-primary)]">
          Image URL *
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          defaultValue={certification?.imageUrl ?? ""}
          required
          className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="https://example.com/image.png"
        />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-sm text-red-500">{state.errors.imageUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="verifyUrl" className="block text-sm font-medium text-[var(--color-text-primary)]">
          Verification URL (optional)
        </label>
        <input
          type="url"
          id="verifyUrl"
          name="verifyUrl"
          defaultValue={certification?.verifyUrl ?? ""}
          className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="https://example.com/verify"
        />
        {state.errors?.verifyUrl && (
          <p className="mt-1 text-sm text-red-500">{state.errors.verifyUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-[var(--color-text-primary)]">
          Display Order
        </label>
        <input
          type="number"
          id="order"
          name="order"
          defaultValue={certification?.order ?? 0}
          className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      {state.message && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
      >
        {isPending ? "Saving..." : isEdit ? "Update Certification" : "Add Certification"}
      </button>
    </form>
  );
}

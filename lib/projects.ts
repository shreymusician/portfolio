import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { ProjectInput } from "@/lib/validations";

/** Shape handed to Client Components -- _id and dates are plain strings (RSC-safe, JSON-safe). */
export type ProjectDTO = ProjectInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectMongoDoc = ProjectInput & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

function toDTO(doc: ProjectMongoDoc): ProjectDTO {
  const { _id, createdAt, updatedAt, ...rest } = doc;
  return {
    ...rest,
    id: _id.toHexString(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

async function getProjectsCollection() {
  const db = await getDb();
  return db.collection<ProjectMongoDoc>("projects");
}

/** Admin view: every project regardless of published state, newest first. */
export async function getAllProjectsForAdmin(): Promise<ProjectDTO[]> {
  const collection = await getProjectsCollection();
  const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(toDTO);
}

/** Public view: published only, featured first, then by manual order. */
export async function getPublishedProjects(): Promise<ProjectDTO[]> {
  const collection = await getProjectsCollection();
  const docs = await collection
    .find({ published: true })
    .sort({ featured: -1, order: 1 })
    .toArray();
  return docs.map(toDTO);
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getProjectsCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? toDTO(doc) : null;
}

/** Public detail-page lookup: only returns published projects. */
export async function getPublishedProjectBySlug(
  slug: string
): Promise<ProjectDTO | null> {
  const collection = await getProjectsCollection();
  const doc = await collection.findOne({ slug, published: true });
  return doc ? toDTO(doc) : null;
}

/** Used by the create/edit forms to surface a friendly "slug already taken" error before hitting the unique index. */
export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const collection = await getProjectsCollection();
  const filter: Record<string, unknown> = { slug };
  if (excludeId && ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new ObjectId(excludeId) };
  }
  const existing = await collection.findOne(filter, { projection: { _id: 1 } });
  return existing !== null;
}

export async function createProject(input: ProjectInput): Promise<string> {
  const collection = await getProjectsCollection();
  const now = new Date();
  const result = await collection.insertOne({
    ...input,
    createdAt: now,
    updatedAt: now,
  } as ProjectMongoDoc);
  return result.insertedId.toHexString();
}

export async function updateProject(id: string, input: ProjectInput): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getProjectsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getProjectsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * One-time setup: compound index matching the public query's filter+sort,
 * and a unique index on slug. Safe to call repeatedly (createIndex is
 * idempotent) but intended to be run once via scripts/init-db.mjs, not on
 * every request.
 */
export async function ensureProjectIndexes(): Promise<void> {
  const collection = await getProjectsCollection();
  await collection.createIndex({ published: 1, featured: -1, order: 1 });
  await collection.createIndex({ slug: 1 }, { unique: true });
}

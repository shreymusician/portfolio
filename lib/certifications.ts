import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { CertificationInput } from "@/lib/validations";

export type CertificationDTO = CertificationInput & {
  id: string;
  createdAt: string;
};

type CertificationMongoDoc = CertificationInput & {
  _id: ObjectId;
  createdAt: Date;
};

function toDTO(doc: CertificationMongoDoc): CertificationDTO {
  const { _id, createdAt, ...rest } = doc;
  return {
    ...rest,
    id: _id.toHexString(),
    createdAt: createdAt.toISOString(),
  };
}

async function getCertificationsCollection() {
  const db = await getDb();
  return db.collection<CertificationMongoDoc>("certifications");
}

export async function getAllCertifications(): Promise<CertificationDTO[]> {
  const collection = await getCertificationsCollection();
  const docs = await collection
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .toArray();
  return docs.map(toDTO);
}

export async function getCertificationById(id: string): Promise<CertificationDTO | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCertificationsCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? toDTO(doc) : null;
}

export async function createCertification(input: CertificationInput): Promise<string> {
  const collection = await getCertificationsCollection();
  const result = await collection.insertOne({
    ...input,
    createdAt: new Date(),
  } as CertificationMongoDoc);
  return result.insertedId.toHexString();
}

export async function updateCertification(
  id: string,
  input: CertificationInput
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCertificationsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: input }
  );
  return result.matchedCount > 0;
}

export async function deleteCertification(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCertificationsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function ensureCertificationIndexes(): Promise<void> {
  const collection = await getCertificationsCollection();
  await collection.createIndex({ order: 1 });
}

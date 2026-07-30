// Seed script: populate certifications from media files
import pkg from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "portfolio";

if (!uri) {
  console.error("Missing MONGODB_URI. Set it in .env.local before running this script.");
  process.exit(1);
}

const certifications = [
  {
    title: "AI Literacy",
    issuer: "IBM",
    issueDate: "December 2025",
    imageUrl: "/media/certificates/ai literacy badge.jpg",
    category: "certification",
    order: 0,
  },
  {
    title: "Generative AI Tools & Workflow Automation",
    issuer: "Professional Workshop",
    issueDate: "December 2025",
    imageUrl: "/media/certificates/ai tools workshop.jpg",
    category: "workshop",
    order: 0,
  },
  {
    title: "Event Coordinator",
    issuer: "Aignite 2024",
    issueDate: "April 2024",
    imageUrl: "/media/certificates/aignite coordinator.jpeg",
    category: "achievement",
    order: 1,
  },
  {
    title: "Arogya Manthan 2K26 — State Level Hackathon",
    issuer: "ME-RIISE Foundation, MCE",
    issueDate: "July 2026",
    imageUrl: "/media/certificates/arogyamanthan hackathon.png",
    category: "hackathon",
    order: 0,
  },
  {
    title: "Buildathon",
    issuer: "Google",
    issueDate: "April 2024",
    imageUrl: "/media/certificates/buildathon google.jpeg",
    category: "hackathon",
    order: 1,
  },
  {
    title: "Buildathon Winner — 1st Place",
    issuer: "Buildathon 2026",
    issueDate: "July 2026",
    imageUrl: "/media/certificates/buildathon winner.jpg",
    category: "achievement",
    order: 0,
  },
  {
    title: "Buildathon Participation",
    issuer: "Buildathon",
    issueDate: "April 2024",
    imageUrl: "/media/certificates/buildathon.jpeg",
    category: "hackathon",
    order: 2,
  },
  {
    title: "Cursor Certification",
    issuer: "Cursor",
    issueDate: "December 2025",
    imageUrl: "/media/certificates/cursor certification.jpg",
    category: "certification",
    order: 1,
  },
  {
    title: "Cybersecurity Workshop",
    issuer: "Professional Workshop",
    issueDate: "December 2025",
    imageUrl: "/media/certificates/cybersec workshop.jpg",
    category: "workshop",
    order: 1,
  },
  {
    title: "Database Management Systems",
    issuer: "NPTEL",
    issueDate: "2024",
    imageUrl: "/media/certificates/dbms nptel course.jpg",
    category: "certification",
    order: 2,
  },
  {
    title: "Ethical Hacking Fundamentals",
    issuer: "Professional Training",
    issueDate: "December 2025",
    imageUrl: "/media/certificates/ethical hacking fundamentals.jpg",
    category: "certification",
    order: 3,
  },
  {
    title: "Krishimanthan 2026",
    issuer: "36 Hour Hackathon",
    issueDate: "April 2024",
    imageUrl: "/media/certificates/krishimanthan hackathon.jpeg",
    category: "hackathon",
    order: 3,
  },
  {
    title: "N8N Hackathon",
    issuer: "N8N",
    issueDate: "December 2025",
    imageUrl: "/media/certificates/n8n hackathon.png",
    category: "hackathon",
    order: 4,
  },
  {
    title: "Python for Data Science, AI & Development",
    issuer: "IBM / Coursera",
    issueDate: "2024",
    imageUrl: "/media/certificates/python datascience.jpg",
    category: "certification",
    order: 4,
  },
  {
    title: "Python Basics",
    issuer: "Online Course",
    issueDate: "July 2026",
    imageUrl: "/media/certificates/python basics course.jpg",
    category: "certification",
    order: 5,
  },
  {
    title: "IoT Robotics ROS Workshop",
    issuer: "Indian Institute of Science (IISc)",
    issueDate: "2024",
    imageUrl: "/media/certificates/robotics workshop.jpg",
    category: "workshop",
    order: 2,
  },
];

const client = new MongoClient(uri);

async function seedCertifications() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("certifications");

    // Clear existing certifications
    await collection.deleteMany({});
    console.log("Cleared existing certifications");

    // Insert new certifications
    const result = await collection.insertMany(
      certifications.map((cert) => ({
        ...cert,
        createdAt: new Date(),
      }))
    );

    console.log(`✅ Seeded ${result.insertedCount} certifications`);
    console.log("Certifications created:");
    certifications.forEach((cert) => {
      console.log(`  - ${cert.title} (${cert.issuer})`);
    });
  } catch (error) {
    console.error("Error seeding certifications:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedCertifications();

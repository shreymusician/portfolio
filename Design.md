# Portfolio Website — Design Document

## 1. Executive Summary

This document outlines the architectural, technical, and design decisions for a professional AI/ML portfolio website built with latest stable Next.js, MongoDB Atlas, and modern web standards. It serves as both an architecture specification and a usable visual-design system. The design prioritizes:

- **User experience**: Fast, responsive, accessible portfolio for recruiters and peers.
- **Developer experience**: Clean separation of concerns, reusable patterns, minimal friction for content updates.
- **Maintainability**: Clear data models, explicit caching, centralized configuration, type safety with TypeScript.
- **Scalability**: Modular components, database indexes, efficient API usage, room to grow (blog, testimonials, projects).
- **Security**: End-to-end validation, authentication/authorization at every layer, secure image uploads, rate limiting.

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Deployment)                      │
├─────────────────────────────────────────────────────────────┤
│              Latest Stable Next.js (App Router)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Public Pages (Cache Components, on-demand reval)      │   │
│  │ - Home, About, Projects, GitHub, Contact links        │   │
│  │ - Certifications, Hackathons, SR Builds (Phase 2)     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Admin Pages (dynamic, auth-gated)                     │   │
│  │ - Login, Dashboard, Projects, Certs, Hackathons      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Server Actions & API Routes                           │   │
│  │ - Server Actions for mutations, API routes for webhooks   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│         Middleware (Auth checks, redirects)                  │
├─────────────────────────────────────────────────────────────┤
│                   External Services                          │
│  • MongoDB Atlas (data store)                               │
│  • Auth.js / next-auth (session management)                 │
│  • GitHub API (live repo data)                              │
│  • Cloudinary (image storage & optimization)                │
│  • Resend/SendGrid (email, Phase 2)                         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Request Flow

#### Public Content Fetch (e.g., `/projects`)
1. User visits `/projects`.
2. Next.js checks Cache Components; if stale or missing, calls cached read function.
3. Cached function (wrapped with `'use cache'` + `cacheTag('projects')`) queries MongoDB for `published: true` projects with cache lifetime (`cacheLife('days')`).
4. Component renders with `next/image` optimized images from Cloudinary/external URLs.
5. Page served with tagged cache.
6. **On admin update**: Server Action calls `updateTag('projects')` to expire cached data, then `revalidatePath('/projects')` to refresh the page immediately.

#### Admin Content Create (e.g., create project)
1. Admin logs in via `/admin/login` → Auth.js session established (HTTP-only cookie).
2. Admin navigates to `/admin/projects`, form visible.
3. Admin submits form → Server Action invoked.
4. Server Action:
   - Validates session (must exist, user.id === 'admin').
   - Validates input with Zod schema.
   - Uploads image to Cloudinary (if provided) → gets signed URL.
   - Inserts document into `projects` collection.
   - Calls `updateTag('projects')` to expire cached project data.
   - Calls `revalidatePath('/projects')` to refresh the projects page immediately.
5. Client redirected to `/admin/projects` (list page updated, new project visible within seconds).
6. Cached project data invalidated and page refreshed on-demand (no timed ISR).

#### GitHub Data Fetch (e.g., `/github`)
1. User visits `/github`.
2. Next.js checks cache; if fresh (within 6 hours), serves cached data.
3. If stale, fetches from GitHub API (`GET /users/{username}/repos`, etc.).
4. Server Component fetches with `next/fetch` using `cache: 'force-cache'` and `revalidate: 21600` (6 hours).
5. Fetch includes `Authorization: Bearer {GITHUB_PAT}` header (5000 req/hr limit vs 60 public).
6. Data shaped into UI-ready format (sort by stars, extract languages, etc.).
7. Page rendered and cached for 6 hours.

---

## 3. Technology Decisions & Rationale

### 3.1 Framework: Latest Stable Next.js (App Router)

**Decision**: Use latest stable Next.js with App Router and TypeScript.

**Rationale**:
- **App Router** provides modern file-based routing, Server Components (reduce client JS), and cleaner API routes organization.
- **Server Components** by default reduce bundle size and enable direct database queries on the server (no need for `/api` for reads).
- **Built-in features**: ISR, revalidation, image optimization, font loading, middleware.
- **TypeScript**: Catches type errors at compile time, improves IDE support, documents code intent.
- **Vercel integration**: Seamless deployment, edge functions, analytics, error reporting.
- **Latest stable** ensures security patches and latest performance improvements without committing to bleeding-edge beta features.

### 3.2 Database: MongoDB Atlas

**Decision**: Use MongoDB Atlas (cloud-hosted, free tier) with official `mongodb` driver (not Mongoose).

**Rationale**:
- **Free tier**: 512 MB storage, suitable for portfolio use case.
- **Document model**: Flexible schema aligns with varied content (projects, certifications, etc.).
- **Official driver**: Lightweight, no ORM overhead, explicit control over queries and connections.
- **Indexes**: Easily set indexes on commonly queried fields (published, featured, slug) for performance.
- **Serverless-friendly**: Connection pooling, no need to manage database server.
- **Atlas Data App** (optional): Provides REST API if needed for future client-side data fetches.

**Alternative considered & rejected**:
- PostgreSQL + Prisma: Would work but adds complexity for this project scale; MongoDB's document model is more natural for varied content types.
- Firebase/Firestore: Vendor lock-in, higher costs, less control over queries.

### 3.3 Authentication: Auth.js / next-auth

**Decision**: Use Auth.js (next-auth) with Credentials provider for single admin user.

**Rationale**:
- **Battle-tested**: Industry standard for Next.js auth, handles session management and cookies securely.
- **Single user**: Credentials provider (username/password) is simplest approach; no need for OAuth.
- **Secure defaults**: HTTP-only cookies, session encryption, no passwords in database.
- **Middleware integration**: Easy to protect routes with middleware checks.

**Alternative considered & rejected**:
- Manual session management: Error-prone, security risks, reinventing the wheel.
- Supabase Auth: Overkill for single admin user, adds another external dependency.

### 3.4 Image Hosting: Cloudinary

**Decision**: Use Cloudinary for image uploads, optimization, and CDN delivery (Phase 2); Phase 1 uses external URLs.

**Rationale**:
- **Free tier**: Plenty of storage and transformations for portfolio use.
- **Automatic optimization**: Cloudinary auto-detects client capabilities (WebP, AVIF), resizes on-the-fly, optimizes quality.
- **Signed uploads**: Server-side signing ensures only admin can upload; prevents abuse.
- **API integration**: Easy to fetch and delete images programmatically.
- **CDN**: Global distribution, fast image delivery.

**Integration approach**:
- Admin uploads image via form in `/admin/projects`.
- Client-side `FormData` sends image file to `/api/upload`.
- Server validates MIME type, size, dimensions; signs Cloudinary upload token.
- Cloudinary returns optimized URL (e.g., `https://res.cloudinary.com/{cloud}/image/upload/w_800,h_450,c_fill,q_auto/project1.jpg`).
- URL stored in MongoDB; rendered via `next/image` with Cloudinary URL loader.

### 3.5 GitHub API

**Decision**: Use GitHub REST API for repositories and activity; recommend `react-github-calendar` or dedicated SVG service for contribution calendar (Phase 2).

**Rationale**:
- **REST API**: Simpler to use than GraphQL for basic repo metadata (name, stars, languages, updated_at).
- **Free access**: Public repos don't require authentication (though rate limit is low without PAT).
- **PAT in production**: Store `GITHUB_PAT` in env vars on Vercel to increase rate limit from 60 req/hr (public) to 5000 req/hr.
- **Caching**: Fetch with 6-hour revalidation to batch requests and avoid hitting limits.
- **Graceful degradation**: If rate-limited or `GITHUB_PAT` missing, return empty arrays and show friendly message instead of crashing.

**Contribution calendar reasoning** (Phase 2):
- GitHub REST `/repos/{owner}/{repo}` endpoint does NOT return commit history or contribution data.
- Do NOT build a custom GraphQL pipeline; instead use `react-github-calendar` npm package (handles auth, caching, SSR-friendly) or integrate a third-party SVG badge service.
- Phase 1 skips this; Phase 2 can add it if desired.

**Graceful degradation example** (lib/github.ts):
```typescript
export async function getPublishedRepos() {
  if (!process.env.GITHUB_USERNAME) {
    return []; // No GitHub username configured
  }
  try {
    const response = await fetch(
      `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
      {
        headers: {
          Authorization: process.env.GITHUB_PAT ? `Bearer ${process.env.GITHUB_PAT}` : undefined,
        },
        next: { revalidate: 21600 }, // 6 hours
      }
    );
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return []; // Return empty array on error (rate limit, network, etc.)
    }
    const repos = await response.json();
    return repos.filter(r => !r.private);
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return []; // Graceful fallback on exception
  }
}
```

### 3.6 Styling: Tailwind CSS + shadcn/ui

**Decision**: Use Tailwind CSS for utility-first styling and shadcn/ui for pre-built, accessible components.

**Rationale**:
- **Tailwind**: Industry standard, extremely fast development, small bundle size with tree-shaking.
- **shadcn/ui**: Accessible by default (WCAG 2.1 AA), built on Radix UI primitives, copy-paste components (no dependency hell), fully customizable via Tailwind.
- **Consistency**: Both work seamlessly together; Tailwind classes can override shadcn styles if needed.
- **Responsive**: Tailwind's breakpoint system (sm, md, lg, xl) handles mobile-first design.
- **Dark mode**: Built into both; easy to add theme toggle later.

**Alternative considered & rejected**:
- Material-UI: Heavier, more opinionated, larger bundle.
- CSS Modules + custom CSS: More verbose, slower to build components.

### 3.7 Animations: Framer Motion (Phase 2)

**Decision**: Use Framer Motion for scroll-triggered animations and micro-interactions.

**Rationale**:
- **Declarative API**: Simple React component integration, smooth animations out of the box.
- **Performance**: GPU-accelerated, does not block main thread.
- **Scroll hooks**: `useInView` makes scroll animations trivial.
- **Phased**: Not critical for MVP; adds polish in Phase 2.

---

## 4. Caching Strategy

### 4.1 Public Pages (Server Component Data Fetching with On-Demand Revalidation)

**Decision**: Use standard Next.js 15 Server Component data fetching combined with Server Actions for immediate cache invalidation. No experimental Cache Components; use `revalidatePath()` for zero-lag cache purging.

**Rationale**:
- **Performance**: Server-side rendering + Vercel edge caching means zero database hits for repeat visitors; fast responses globally.
- **Cost**: Fewer database queries = lower Atlas usage, faster API response times.
- **Freshness**: Server Actions invalidate cache immediately via `revalidatePath('/projects')`, ensuring updates appear instantly without stale-while-revalidate delays.
- **Stability**: Rely on stable Next.js 15 patterns, not canary features.

**Implementation**:
```typescript
// In lib/projects.ts - Standard async function
export async function getPublishedProjects() {
  const projects = await db
    .collection('projects')
    .find({ published: true })
    .sort({ featured: -1, order: 1 })
    .toArray();
  return projects;
}

// In app/projects/page.tsx (Server Component)
import { getPublishedProjects } from '@/lib/projects';
export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return <ProjectGrid projects={projects} />;
}

// In app/admin/actions.ts (Server Action for mutations)
'use server'
export async function createProject(formData: FormData) {
  // Auth check, validation, Cloudinary upload, MongoDB insert...
  revalidatePath('/projects');  // Immediately invalidate /projects cache
  revalidatePath('/');  // Optionally also invalidate home if featured projects visible there
}
```

**When to invalidate**:
- Admin creates/updates/deletes project → `revalidatePath('/projects')` + optionally `revalidatePath('/')`
- Admin creates/updates/deletes any content (Phase 2) → `revalidatePath()` on relevant routes (e.g., `/certifications`, `/hackathons`)
- Admin login/logout → no revalidation needed (session-specific, not cached)

### 4.2 GitHub Section (Cached with Timed Revalidation)

**Decision**: Cache GitHub data for 6 hours to respect rate limits and avoid excessive API calls.

**Rationale**:
- **Rate limits**: Public API = 60 req/hr; with PAT = 5000 req/hr. Caching batches requests.
- **Freshness**: 6-hour window is reasonable for a portfolio (user rarely updates GitHub multiple times per hour).
- **No on-demand revalidation**: GitHub is external; admin doesn't control it. Timed cache is appropriate.

**Implementation**:
```typescript
// In lib/github.ts
const response = await fetch('https://api.github.com/users/{username}/repos', {
  headers: { Authorization: `Bearer ${process.env.GITHUB_PAT}` },
  next: { revalidate: 21600 }, // 6 hours
});
```

### 4.3 Admin Pages (Always Dynamic)

**Decision**: Admin pages are always dynamic; never cached.

**Rationale**:
- **Freshness**: Admin sees latest data from database every time.
- **Security**: No risk of serving stale user session data.

**Implementation**:
```typescript
// In /admin/projects/page.tsx
export const dynamic = 'force-dynamic';
export default async function AdminProjectsPage() {
  // Fetch fresh data on every request
  const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
  return <AdminProjectsList projects={projects} />;
}
```

**Mutations via Server Actions**:
- Use Server Actions for all project mutations (create, update, delete).
- Server Actions are always dynamic by default.
- After a successful mutation, call `revalidatePath('/projects')` to immediately refresh public cache and page.
- Never rely on middleware alone; always validate session explicitly inside each Server Action with `getServerSession()`.

---

## 5. Data Model & Database Design

### 5.1 Collections & Schemas

#### Projects (Phase 1 MVP)
```typescript
type Project = {
  _id: ObjectId;
  slug: string;              // unique, URL-friendly identifier (e.g., "ai-chatbot")
  title: string;             // "AI Chatbot with RAG"
  description: string;       // detailed project description
  techStack: string[];       // ["React", "Node.js", "MongoDB", "OpenAI"]
  coverImageUrl: string;     // Cloudinary URL (Phase 2) or external URL
  githubUrl?: string;        // https://github.com/user/project
  liveUrl?: string;          // https://project.vercel.app
  published: boolean;        // false = hidden from public site
  featured: boolean;         // true = pin to top of /projects list
  order: number;             // sort priority among featured projects
  createdAt: Date;
  updatedAt: Date;
};

// Indexes
db.projects.createIndex({ published: 1, featured: -1, order: 1 });
db.projects.createIndex({ slug: 1 }, { unique: true });
```

**Rationale for fields**:
- **slug**: Unique identifier for future `/projects/[slug]` detail pages. URL-safe, human-readable.
- **published**: Soft-delete pattern; allows drafting projects before public launch.
- **featured/order**: Enables user to curate display order without code changes.
- **timestamps**: Track creation/modification for sorting and auditing.

#### Certifications (Phase 2)
```typescript
type Certification = {
  _id: ObjectId;
  title: string;             // "Google Cloud Professional ML Engineer"
  issuer: string;            // "Google Cloud"
  issueDate: Date;
  badgeImageUrl: string;     // Cloudinary CDN URL
  verifyUrl?: string;        // https://cloud.google.com/verify-cert?id=123
  published: boolean;        // controls visibility on public site
  createdAt: Date;
  updatedAt: Date;
};

// Indexes
db.certifications.createIndex({ published: 1, createdAt: -1 });
```

#### Hackathons (Phase 2)
```typescript
type Hackathon = {
  _id: ObjectId;
  name: string;              // "HackMIT 2024"
  date: Date;
  location: string;          // "MIT, Cambridge"
  result: string;            // "1st Place - Best AI"
  description: string;
  imageUrl: string;          // Cloudinary CDN URL
  published: boolean;        // controls visibility on public site
  createdAt: Date;
  updatedAt: Date;
};

// Indexes
db.hackathons.createIndex({ published: 1, date: -1 });
```

#### Videos (Phase 2)
```typescript
type Video = {
  _id: ObjectId;
  title: string;             // "Building a Transformer from Scratch"
  youtubeId: string;         // embed-friendly ID from YouTube URL
  description: string;
  order: number;
  published: boolean;        // controls visibility on public site
  createdAt: Date;
  updatedAt: Date;
};

// Indexes
db.videos.createIndex({ order: 1 });
```

### 5.2 Index Strategy

**Why indexes**?
- **Query performance**: Indexed fields are O(log n) instead of O(n) full scan.
- **Sort performance**: Indexes on `order`, `date`, `createdAt` make sorting fast.
- **Uniqueness**: Unique index on `slug` prevents duplicate project slugs.

**Indexes chosen**:
- **projects (compound)**: `{ published: 1, featured: -1, order: 1 }` matches the exact query filter and sort on public pages: filter by `published: true`, sort by `featured DESC` then `order ASC`.
- **projects.slug (unique)**: Ensures no two projects share a slug; supports future detail pages.
- **Phase 2 (compound)**: `{ published: 1, createdAt: -1 }` for certifications; `{ published: 1, date: -1 }` for hackathons; enables efficient filtering and sorting.

---

## 6. Security Model

### 6.1 Middleware Configuration

**Decision**: Use a strict route matcher in `middleware.ts` to protect admin routes while allowing unauthenticated access to `/admin/login`.

**Why this approach**:
- **Prevent redirect loops**: Without explicit exclusion, unauthenticated users trying to reach `/admin/login` would be redirected to `/admin/login`, causing infinite loops.
- **Efficient gating**: Middleware is the first gate; subsequent Server Actions enforce auth again (defense in depth).

**Implementation** (middleware.ts):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Allow unauthenticated access to /admin/login
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect all other /admin/* routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Use regex to protect /admin/* except /admin/login
  matcher: ['/admin((?!/login$).*)', '/api/admin/:path*'],
};
```

### 6.2 Authentication (Login)

**Decision**: Single admin user with username/password (bcrypt-hashed), stored in environment variables.

**Flow**:
1. Admin navigates to `/admin/login`.
2. Enters username and password.
3. Auth.js (next-auth) Credentials provider compares input against `process.env.ADMIN_USERNAME` and bcrypt hash of `process.env.ADMIN_PASSWORD`.
4. On success, Auth.js creates an encrypted session (stored in HTTP-only cookie).
5. Session payload: `{ user: { id: 'admin', email: 'admin@portfolio.com' } }`.

**Security properties**:
- **HTTP-only cookies**: Session cannot be stolen via XSS (JavaScript cannot access the cookie).
- **Session encryption**: Auth.js encrypts session data; cannot be tampered with.
- **No passwords in database**: Passwords hashed in env vars; never stored in MongoDB.

### 6.3 Authorization (Access Control)

**Decision**: Every Server Action and API route validates session independently via explicit `getServerSession()` checks. Middleware provides an additional gate, never the sole protection.

**Defense-in-depth pattern**:
```typescript
// In server action (app/admin/actions.ts)
'use server'
export async function updateProject(formData: FormData) {
  // MANDATORY: Explicit session check inside every server action
  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  // Validate input
  const projectId = formData.get('id') as string;
  const data = ProjectSchema.parse(Object.fromEntries(formData));
  
  // Mutate
  await db.collection('projects').updateOne(
    { _id: new ObjectId(projectId) },
    { $set: { ...data, updatedAt: new Date() } }
  );
  
  // Invalidate cache
  revalidatePath('/projects');
}

// In API route (app/api/projects/[id]/route.ts)
import { getServerSession } from 'next-auth/next';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // MANDATORY: Explicit session check inside every API route
  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // ... rest of handler
}
```

**Why this approach**:
- **Defense in depth**: Middleware enforces route-level access; each Server Action/API handler enforces method-level access.
- **No reliance on middleware alone**: If middleware is accidentally misconfigured or bypassed, Server Actions still reject unauthorized requests.
- **Self-documenting**: Every mutation explicitly shows its auth requirement; no need to cross-reference middleware to understand security.
- **Principle of least privilege**: Each handler asserts its own auth, not inherited from middleware.

### 6.4 Input Validation

**Decision**: All user input validated with Zod schemas on the server; validation also on client for UX.

**Example**:
```typescript
// validations.ts
const ProjectSchema = z.object({
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  techStack: z.array(z.string()).min(1).max(20),
  coverImageUrl: z.string().url(),
  published: z.boolean(),
  featured: z.boolean(),
  order: z.number().int().min(0),
});

// In server action
const validData = ProjectSchema.parse(formData);
```

**Protections**:
- **Type checking**: Zod ensures data matches expected schema.
- **Range/length limits**: Prevents excessively long strings, empty fields, invalid formats.
- **Server-side validation**: Cannot be bypassed by client tampering.

### 6.5 Image Upload Security

**Decision**: Image uploads signed server-side; MIME type and file size validated; Cloudinary upload unsigned feature disabled.

**Flow**:
1. Admin selects image file in form.
2. Form submits to `/api/upload` (POST).
3. Server validates:
   - MIME type in `['image/jpeg', 'image/png', 'image/webp']` (no SVG to prevent XSS).
   - File size ≤ 5 MB.
   - Dimensions (if applicable) within expected range (e.g., project cover 1200x630).
4. Server signs upload request with Cloudinary API key + secret (server-side only).
5. Signed URL sent to client, client uploads directly to Cloudinary.
6. Cloudinary returns final optimized URL; server stores in MongoDB.

**Rationale**:
- **No direct bucket access**: Client never has Cloudinary credentials.
- **Signed uploads**: Cloudinary verifies signature; prevents spoofed uploads.
- **Format whitelist**: Prevents uploading executable files or SVGs with embedded JavaScript.

### 6.6 CSRF Protection

**Decision**: Auth.js protects its own authentication flow. For the Phase 2 optional contact form (public, unauthenticated), implement independent CSRF protection.

**Admin forms** (authenticated):
- Auth.js provides session-based protection via secure cookies.
- Server Actions are protected by default.

**Public contact form** (Phase 2, unauthenticated):
- Do NOT rely on Auth.js CSRF behavior for public forms; they bypass the auth session.
- Implement: explicit CSRF tokens, origin validation, server-side Zod validation, rate limiting, honeypot or CAPTCHA.
- The contact form is considered an external-facing endpoint and requires independent security controls.

### 6.7 Rate Limiting (Phase 2, Contact Form)

**Decision**: Rate-limit contact form submissions (e.g., 5 per hour per IP) to prevent spam/abuse.

**Implementation**:
- Use `ratelimit` library (e.g., `upstash/ratelimit` or Vercel Middleware) to track submissions by IP.
- On form submission, check rate limit; return 429 (Too Many Requests) if exceeded.
- Show user-friendly error message: "Please wait before submitting another message."

---

## 7. Performance Considerations

### 7.1 Image Optimization

**Strategy**: Use `next/image` with Cloudinary for automatic format selection, resizing, and lazy loading. Configure a strict `remotePatterns` allowlist in `next.config.js` to prevent runtime "Invalid src prop" errors.

**Benefits**:
- **Format negotiation**: Cloudinary returns WebP for modern browsers, JPEG for older browsers, auto-selects based on client capability.
- **Responsive images**: `next/image` generates multiple sizes; srcset attribute lets browser choose best size for viewport.
- **Lazy loading**: Images below the fold are not fetched until needed.
- **No layout shift**: `next/image` requires explicit width/height; CLS metric stays low.

**Configuration** (next.config.js):
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
};
```
Never use `hostname: '*'` to avoid security issues and unexpected external dependencies. Add only known, trusted sources upfront.

**Usage**:
```typescript
<Image
  src="https://res.cloudinary.com/{cloud}/image/upload/w_1200,h_630,c_fill,q_auto/project1.jpg"
  alt="Project cover image showing AI dashboard interface"
  width={1200}
  height={630}
  priority={false}  // lazy load below-the-fold
/>
```

### 7.2 Code Splitting & Bundle Size

**Strategy**: Server Components by default; Client Components only where necessary (interactivity).

**Benefits**:
- **No hydration overhead**: Server Components don't ship JavaScript to browser.
- **Direct database access**: Server Components can query MongoDB directly; no round-trip through `/api`.
- **Smaller JS bundle**: Only interactive components (forms, dropdowns, etc.) shipped to client.

**Example**:
```typescript
// app/projects/page.tsx - Server Component (default)
export default async function ProjectsPage() {
  const projects = await db.collection('projects').find({ published: true }).toArray();
  return <ProjectGrid projects={projects} />;  // renders on server
}

// components/ProjectGrid.tsx - Client Component (interactive)
'use client';
export default function ProjectGrid({ projects }) {
  const [filtered, setFiltered] = useState(projects);
  // state, event handlers, etc.
  return ...;
}
```

### 7.3 Database Query Optimization

**Strategy**: Use indexes, projection, and pagination to minimize data fetched.

**Example**:
```typescript
// Project listing query
const projects = await db
  .collection('projects')
  .find({ published: true })
  .project({ title: 1, description: 1, coverImageUrl: 1, techStack: 1 })  // only fields needed
  .sort({ featured: -1, order: 1 })
  .toArray();
```

**Benefits**:
- **Indexes**: Filtered and sorted fields are indexed for O(log n) performance.
- **Projection**: Only fetch fields displayed on UI; reduces network latency and memory.
- **No N+1 queries**: Fetch all projects in one query; don't loop and fetch each individually.

### 7.4 External API Caching

**Strategy**: Cache external API responses (GitHub) to reduce rate limit impact and latency.

**GitHub API caching**:
```typescript
const repos = await fetch('https://api.github.com/users/{username}/repos', {
  headers: { Authorization: `Bearer ${GITHUB_PAT}` },
  next: { revalidate: 21600 },  // 6 hours
});
```

**Benefits**:
- **Rate limit respect**: 6-hour cache reduces API calls from every page load to every 6 hours.
- **Faster response**: Cached data served from Vercel edge; no round-trip to GitHub.
- **Fail-safe**: If GitHub is temporarily down, cache serves stale data (graceful degradation).

### 7.5 Lighthouse & Core Web Vitals

**Target**:
- **Largest Contentful Paint (LCP)**: < 2.5 seconds (measure when main content visible).
- **Cumulative Layout Shift (CLS)**: < 0.1 (minimize unexpected layout changes).
- **Interaction to Next Paint (INP)**: < 200 milliseconds (responsiveness to user input).

**Strategies to achieve targets**:
- Use `next/image` with explicit dimensions (prevents CLS).
- Lazy-load below-the-fold content (improves LCP).
- Use Server Components to reduce client-side JavaScript (faster hydration, lower INP).
- Cache aggressively (edge caching, stale-while-revalidate).
- Defer non-critical scripts (analytics, ads).

---

## 8. Content Management & Workflow

### 8.1 Content Creation Flow

**Admin perspective**:
1. Log in to `/admin`.
2. Navigate to `/admin/projects`.
3. Click "New Project".
4. Fill form: title, description, tech stack, upload image, add links.
5. Click "Publish" → document inserted into MongoDB, public `/projects` page revalidated.
6. New project appears on portfolio website immediately.

**Benefits**:
- **No code edits**: Admin doesn't need to commit code or restart the server.
- **Instant updates**: On-demand revalidation means public site updates within seconds.
- **Drafts**: Can save projects with `published: false` to draft them without public visibility.

### 8.2 Content Versioning

**Decision**: Store `createdAt` and `updatedAt` timestamps; no content versioning (history tracking).

**Rationale**:
- **Simplicity**: For a portfolio, version control is not critical; edits are typically small tweaks.
- **Git for architecture**: If major structure changes needed, committed to Git for team review (future enhancement).

**Alternative considered & rejected**:
- Full version history (store all revisions): Adds complexity, increases storage; not needed for portfolio.

### 8.3 Soft Deletes

**Decision**: Use `published` flag instead of hard-deleting projects.

**Rationale**:
- **Safety**: Admin can unpublish a project instead of deleting it; can restore later if needed.
- **Analytics**: Soft deletes allow tracking historical project count, trends.
- **Recovery**: If admin accidentally deletes a project, it's easy to republish (no data loss).

**Implementation**:
```typescript
// Hide unpublished projects from public
const projects = await db.collection('projects').find({ published: true }).toArray();

// Admin can toggle published flag
await db.collection('projects').updateOne(
  { _id: projectId },
  { $set: { published: false } }
);
```

---

## 9. API & Route Design

### 9.1 REST API Principles

**Decision**: Use REST conventions for API routes; standard HTTP verbs (GET, POST, PUT, DELETE) for CRUD operations.

**Routes** (Phase 1 MVP):
```
GET    /api/projects              # list projects (public, cached)
GET    /api/projects/[id]         # get single project (public, cached)
POST   /api/projects              # create project (admin only, write)
PUT    /api/projects/[id]         # update project (admin only, write)
DELETE /api/projects/[id]         # delete project (admin only, write)
POST   /api/upload                # upload image (admin only, write)
```

**Rationale**:
- **Familiar conventions**: Developers understand REST; easy to onboard new contributors.
- **Caching headers**: GET requests cacheable; POST/PUT/DELETE are never cached.
- **HTTP semantics**: Correct status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 409 Conflict).

### 9.2 Server Actions vs. API Routes

**Decision**: Prefer Server Actions for form submissions; use API routes for external integrations.

**Server Actions** (forms, mutations):
- Invoked directly from client components with `action={serverAction}`.
- Simpler syntax; no route file needed; function body runs on server.
- Built-in CSRF protection.
- Example: create project form → call server action → revalidate → redirect.

**API Routes** (external integrations, webhooks):
- For integrations that need explicit HTTP semantics (GitHub webhook, Cloudinary callback).
- When client must fetch data without form submission.
- Example: `/api/upload` receives image file → validates → uploads to Cloudinary → returns URL.

**Phase 1 approach**: Use Server Actions for all admin forms (projects, etc.); `/api/upload` for Cloudinary uploads.

### 9.3 Error Handling

**Client errors** (4xx):
- **400 Bad Request**: Invalid input (e.g., missing required field, invalid slug format).
- **401 Unauthorized**: Missing or invalid session.
- **403 Forbidden**: Session exists but user lacks permission (e.g., non-admin trying to edit project).
- **404 Not Found**: Requested resource doesn't exist.
- **409 Conflict**: Constraint violation (e.g., duplicate slug).

**Server errors** (5xx):
- **500 Internal Server Error**: Unhandled exception (log for debugging).
- **503 Service Unavailable**: External service down (MongoDB, Cloudinary, etc.).

**Response format** (server actions):
```typescript
try {
  const validData = ProjectSchema.parse(formData);
  await db.collection('projects').insertOne(validData);
  revalidatePath('/projects', 'page');
  return { success: true, message: 'Project created' };
} catch (error) {
  if (error instanceof z.ZodError) {
    return { success: false, errors: error.flatten() };
  }
  return { success: false, message: 'Database error' };
}
```

---

## 10. SEO & Accessibility

### 10.1 Search Engine Optimization (SEO)

**Metadata per page** (using `generateMetadata`):
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projects | AI/ML Portfolio',
    description: 'Explore my AI and machine learning projects, including NLP, computer vision, and MLOps.',
    openGraph: {
      title: 'Projects | AI/ML Portfolio',
      description: 'Explore my AI and machine learning projects...',
      url: 'https://yourportfolio.com/projects',
      images: [{ url: 'https://yourportfolio.com/og-image.png' }],
    },
    canonical: 'https://yourportfolio.com/projects',
  };
}
```

**Structured data** (JSON-LD):
- Add `@context: "https://schema.org"` JSON-LD for projects, certifications (optional Phase 2).
- Helps search engines understand content type and relationships.

**Sitemap & Robots** (Next.js metadata routes):
- `app/sitemap.ts`: Dynamically generates sitemap listing all public pages (Home, About, Projects, GitHub, etc.). Can programmatically include future project-detail pages (`/projects/[slug]`).
- `app/robots.ts`: Configures crawler rules and references the sitemap.

**Canonical tags**: Prevent duplicate content issues if portfolio is accessible via multiple URLs.

### 10.2 Web Accessibility (WCAG 2.1 AA)

**Principles**:
- **Perceivable**: Content visible/readable to all (contrast ratio, alt text, captions).
- **Operable**: Navigation via keyboard, no traps, clear focus indicators.
- **Understandable**: Text easy to read, consistent UI, error messages clear.
- **Robust**: Valid HTML, proper ARIA attributes, compatible with assistive technology.

**Practices**:
- **Image alt text**: Every `<img>` or `next/image` has descriptive alt text (e.g., "Screenshot of AI chatbot interface" not "screenshot.png").
- **Color contrast**: Text-to-background contrast ≥ 4.5:1 for normal text, 3:1 for large text.
- **Keyboard navigation**: All interactive elements (links, buttons, form fields) accessible via Tab key.
- **Focus indicators**: Clear visual indicator (outline) when element has focus.
- **Form labels**: Every `<input>` associated with `<label>` (not just placeholder text).
- **ARIA attributes**: Use `aria-label`, `aria-describedby`, `aria-live` for dynamic content.
- **Semantic HTML**: Use `<button>`, `<a>`, `<nav>`, `<header>`, `<main>`, `<footer>` instead of `<div>` + CSS.
- **Skip links**: Optionally add "Skip to main content" link to bypass navigation on every page.

**Tools for testing**:
- WAVE (WebAIM) browser extension: Detects WCAG violations.
- axe DevTools: Accessibility testing in Chrome DevTools.
- Lighthouse: Built into Chrome; includes accessibility audit.

---

## 11. Deployment & Monitoring

### 11.1 Deployment Pipeline

**Workflow**:
1. Code committed to GitHub `main` branch.
2. Vercel GitHub integration detects push.
3. Vercel runs build: `next build` (type-check, compile, optimize).
4. Build succeeds → deployment created with new edge function and cached content.
5. Deployment promoted to production (auto or manual).
6. Old deployment kept as rollback point.

**Environment variables**:
- `.env.local` (development): contains secrets for local testing.
- Vercel project settings (production): contains production secrets (Mongo URI, GitHub PAT, etc.).

**Secrets to configure on Vercel**:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
GITHUB_USERNAME=john-doe
GITHUB_PAT=ghp_xxxxxxxxxxxx
NEXTAUTH_SECRET=random_secret_key_here
NEXTAUTH_URL=https://yourportfolio.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt_hash_here
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=key_here
CLOUDINARY_API_SECRET=secret_here
```

**Note**: `GITHUB_PAT` is essential in production to increase GitHub API rate limits from 60 req/hr (public) to 5000 req/hr. Without it, high traffic may exhaust the public rate limit.

### 11.2 Monitoring & Observability

**Vercel Analytics**:
- Automatic Core Web Vitals tracking (LCP, CLS, INP).
- Edge function execution times.
- Deployment history and rollback tracking.

**Error logging** (optional):
- Sentry or Vercel Error Reporting for unhandled exceptions.
- Logs sent to external service for alerting and debugging.

**Monitoring checks**:
- Uptime monitoring (UptimeRobot, Pingdom): Check portfolio is responding.
- Monthly lighthouse audit: Maintain performance and accessibility scores.
- Database usage: Monitor MongoDB Atlas storage, connections (avoid exhaustion).
- API rate limits: Track GitHub API calls; ensure not hitting limits.

### 11.3 Rollback Strategy

**If production bug detected**:
1. Identify problematic deployment in Vercel dashboard.
2. Click "Rollback" to previous stable version.
3. Instant revert (30 seconds to 2 minutes).
4. Fix bug in code, test locally, re-deploy to `main`.

---

## 12. Future Scalability & Extensions

### 12.1 Potential Features (post-MVP)

- **Blog**: Add `/blog` page with Markdown-based articles. Use MDX or simple MongoDB `posts` collection.
- **Dark mode**: Add theme toggle using Tailwind's dark mode + `next-themes` library.
- **Testimonials**: Add section with quotes from colleagues/mentors. Approve before publishing.
- **Skills showcase**: Interactive skill cards with proficiency levels (beginner, intermediate, advanced).
- **Newsletter signup**: Collect emails for portfolio updates. Integrate with Mailchimp or Substack.
- **Comments on projects**: Allow visitors to comment on projects (moderate before publishing).
- **Analytics dashboard**: Admin view of visitor stats (Vercel Analytics integration).
- **Multi-language**: Support Spanish, Mandarin, etc. using i18n library.
- **Resume download**: PDF version of resume hosted on Cloudinary or as static asset.
- **Project filtering**: Advanced filters (tech stack, date range, difficulty level).

### 12.2 Architectural Extensibility

**Adding new content types**:
1. Create MongoDB collection schema (e.g., `testimonials`).
2. Add Zod validation schema in `validations.ts`.
3. Create server actions for CRUD in `/admin/testimonials/actions.ts`.
4. Add admin pages `/admin/testimonials`.
5. Add public page `/testimonials`.
6. Update revalidation paths in server actions.

**No changes needed to core architecture**; pattern is repeatable.

### 12.3 Performance at Scale

**If portfolio grows to thousands of projects**:
- Pagination: Fetch 20 projects per page instead of all at once.
- Search: Add MongoDB text index on `title`, `description`; support full-text search.
- Filtering: UI filters trigger server-side queries with indexes.
- CDN: Vercel Edge Config for feature flags, A/B testing.
- Database sharding: MongoDB Atlas handles automatically at scale.

---

## 13. Design Rationale Summary

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Latest stable Next.js (App Router) | Modern, fast, Server Components, Cache Components, built-in features | Requires verifying latest setup during implementation |
| MongoDB + official driver | Flexible schema, free tier, lightweight | Schema validation burden on developer (Zod) |
| Tailwind + shadcn/ui | Fast development, accessible components, consistent | Initial setup time; opinionated component choices |
| Auth.js / next-auth | Battle-tested, OAuth-ready, secure session management | Single auth provider; rolling your own is not recommended |
| Cloudinary | Auto-optimization, CDN, free tier | Vendor lock-in; data stored with external service |
| GitHub REST API + PAT | Simple, familiar, high rate limits in production | Limited features (no contribution calendar); requires PAT for production |
| Cache Components + on-demand revalidation | Instant updates via `updateTag()`, no timed ISR overhead | Requires careful tag management; complex debug scenarios |
| Server Components default | Smaller bundle, faster rendering, direct DB access | Cannot use browser APIs; some state management patterns unavailable |
| Single admin user | Simplicity, no signup flow needed | Not scalable if multiple admins needed (Phase 2 could add roles) |

---

## 14. Development Guidelines

### 14.1 Code Organization

**Naming conventions**:
- Page components: `PascalCase` (e.g., `ProjectsPage.tsx`).
- Utility functions: `camelCase` (e.g., `fetchGitHubRepos.ts`).
- Components: `PascalCase` (e.g., `ProjectCard.tsx`).
- Types/interfaces: `PascalCase` (e.g., `Project`, `GitHubRepo`).
- CSS classes: `kebab-case` via Tailwind (e.g., `flex items-center gap-4`).

**File structure logic**:
- `/app`: Pages and routes (file-based routing).
- `/components`: Reusable UI components (not pages).
- `/lib`: Utilities, helpers, database, auth (no JSX).
- `/public`: Static assets (images, favicon, robots.txt).

### 14.2 Code Quality

**Type safety**:
- Enforce TypeScript strict mode (`strict: true` in `tsconfig.json`).
- No `any` types without justification.
- Use discriminated unions for error handling (Result<T, E> pattern).

**Testing** (optional, post-MVP):
- Unit tests for utility functions and Zod schemas (Jest).
- Integration tests for API routes (test database queries).
- E2E tests for critical user flows (Playwright or Cypress).

**Linting & formatting**:
- ESLint: Enforce code quality (no unused vars, correct imports).
- Prettier: Auto-format code (consistent indentation, quotes).
- Pre-commit hooks: Run linter/formatter before committing (Husky + lint-staged).

### 14.3 Documentation

**Inline comments**:
- Only for non-obvious logic (e.g., why a specific algorithm chosen, workarounds for bugs).
- Not for obvious code: `// increment counter` is unnecessary.

**README.md**: Getting started, local development, environment setup, deployment steps.

**API documentation**: Route purposes, request/response formats, error codes (in comments or separate API doc).

---

## 15. Visual Design System & UX Specification

This section provides concrete visual and interaction design guidance for building a professional, human-centered portfolio that feels technically capable without falling into generic "AI cyberpunk" tropes.

### 15.1 Design Philosophy & Direction

**Principles**:
- **Confident but human**: The portfolio reflects genuine work and expertise, not marketing hype. Copy is specific, not superlative.
- **Editorial-technical**: Strong typography, generous whitespace, and evidence-led content. The design supports reading and scanning, not decoration.
- **Restrained motion**: Animations enhance clarity and navigation, never distract. Respect `prefers-reduced-motion`.
- **Accessible by default**: Color is never the only signal. Contrast meets WCAG AA. Interactive elements are keyboard-navigable.
- **Light theme, expandable**: Default to light for clarity and approachability. Dark mode can be a Phase 2 enhancement.

### 15.2 Design Tokens

**Colors**:
```
Background:         #F8FAFC  (light neutral, inviting)
Surface:            #FFFFFF  (cards, containers)
Primary text:       #0F172A  (dark slate, high contrast)
Secondary text:     #475569  (neutral, supporting information)
Border:             #E2E8F0  (subtle dividers, outlines)
Primary accent:     #2563EB  (interactive, focus, calls-to-action)
Accent hover:       #1D4ED8  (darker blue for hover states)
Success/highlight:  #0F766E  (teal, for achievements, badges)
Error:              #B91C1C  (red, validation, warnings)
```

**Spacing scale**: 4px base unit. Common values: 4, 8, 12, 16, 24, 32, 48, 64px.

**Layout**:
- Maximum content width: 1200px
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Padding: 16px on mobile, 32px on tablet+

**Typography**:
- **UI/Body text**: Geist Sans or Inter (fallback: system sans-serif)
- **Code/metadata**: Geist Mono or JetBrains Mono (fallback: monospace)
- **Responsive type scale** (using `clamp()`):
  - Hero heading: `clamp(2rem, 5vw, 3.5rem)`
  - Page title: `clamp(1.5rem, 4vw, 2.25rem)`
  - Section heading: `clamp(1.25rem, 3vw, 1.5rem)`
  - Body: `clamp(1rem, 1.2vw, 1.125rem)`
  - Small text: `clamp(0.875rem, 1vw, 1rem)`

**Shadows**: Minimal use. Prefer borders and spacing for depth.
- Card shadow: `0 1px 2px rgba(0, 0, 0, 0.05)`
- Elevated shadow: `0 4px 6px rgba(0, 0, 0, 0.07)`

### 15.3 Page Hierarchy & Layouts

#### Header
- **Layout**: Logo/name at left; navigation links (About, Projects, GitHub, Resume, Contact) at right; below 768px, collapse into hamburger menu.
- **Height**: 64px; sticky on scroll.
- **Navigation links**: Use active state (border-bottom, bold, or accent color) to indicate current page.
- **Mobile menu**: Accessible dropdown, 300px width max, keyboard-navigable, close on ESC or item click.

#### Home / Hero
- **Layout**: Two-column grid (image on left or right) or stacked (image below on mobile).
- **Content**:
  - Name as page heading (e.g., "Jamie Chen")
  - Identity line: "AI/ML Engineer, [Brief specific title]" (one line max)
  - Value statement: 2–3 sentences, specific outcomes not claims (e.g., "I build NLP systems that process 10M+ documents daily" not "world-class engineer")
  - Primary CTA: "View Projects" button (prominent, accessible)
  - Secondary CTA: "Download Resume" or GitHub link (lower emphasis)
  - Profile image: 200–300px, rounded corners (12–16px), subtle border
  - 2–3 proof points (bullets or small cards): e.g., "Published 5 papers", "Led team of 3", "Built 15+ projects"
- **Spacing**: 48–64px vertical rhythm between sections.

#### Projects Page
- **Featured section** (top): 1–3 featured projects in grid (2 columns on tablet+, 1 on mobile).
- **All projects**: Below featured, sorted by date or manual order.
- **Card anatomy**:
  - Project image: 100% width, 16:9 aspect ratio, `next/image`, lazy-loaded.
  - Title: 1.25rem, medium weight.
  - Outcome: One-sentence result or impact (e.g., "Reduced inference latency by 40%").
  - Tech stack: Tags, non-interactive by default, muted text, left-aligned.
  - Links: "View on GitHub" / "Live Demo" buttons (secondary style, small).
  - Hover state: Subtle background shift, image brightens slightly.
  - Focus state: Clear outline (2px solid accent color).
- **Filtering** (optional for MVP): Tag/tech stack filter on mobile as a sticky select, on desktop as clickable buttons.

#### About Page
- **Bio section**: 2–3 short paragraphs, authentic voice, specific achievements.
- **Education**: School, degree, graduation date. Optionally: thesis title or relevant coursework.
- **Skills**:
  - Grouped by category (Languages, ML Frameworks, Tools, Cloud Platforms, etc.)
  - **No percentage bars** — skill bars are vague and often inaccurate. Use descriptive tiers instead (e.g., "Proficient", "Familiar", or just list as-is).
  - Format as tag-like pill buttons or text list.
- **Timeline/highlights**: Simple vertical timeline or alternating cards (left/right layout on desktop) showing key career milestones, projects, or learning events.

#### GitHub Page
- **Repo list**: Table or cards showing top repos (sorted by stars). Include:
  - Repo name (link to GitHub)
  - One-line description
  - Star count (visual: small icon + number)
  - Language (colored dot + name, standard GitHub colors)
  - Last updated date
- **Language breakdown**: Bar chart or pie chart (optional, supporting visual).
- **Recent public activity**: List of recent commits or releases (sourced from GitHub events API), but **label clearly as "Recent public GitHub activity"** to avoid implying a complete commit history.
- **Empty state**: If no repos or activity, show friendly message: "No public activity yet. Check back soon or visit [GitHub profile link]."

#### Certifications (Phase 2)
- **Card layout**: Badge image, title, issuer, issue date, "Verify" link.
- **Cards**: 12–16px radius, subtle border, 200–250px width, 3-column grid (tablet+), 1 on mobile.
- **Empty state**: "No certifications yet." (or omit section if count is zero).

#### Hackathons (Phase 2)
- **Timeline layout** (desktop): Vertical line, alternating cards left/right. (Mobile: stacked, centered.)
- **Card anatomy**: Date, event name, location, result/achievement, short description, optional image.
- **Sorting**: Most recent first.
- **Empty state**: "No hackathons yet."

#### SR Builds (Phase 2)
- **Video grid**: 2–3 columns (desktop), 1 (mobile). Each card:
  - YouTube thumbnail (auto-fetched via API)
  - Video title overlay on hover
  - Play icon (centered, large)
  - Click navigates to embedded player or opens in lightbox
- **Link to channel**: Button below grid.

#### Contact (Footer & Phase 2 Form)
- **Footer links**: Email, LinkedIn, GitHub, Twitter/X (if applicable). Icons + text (or text only for clarity).
- **Contact form** (Phase 2, optional): Name, email, message fields. Clear submit button. Show success message after submission. Include privacy notice: "Your message will be kept confidential. [Privacy Policy]"

### 15.4 Reusable Component Rules

**Buttons**:
- **Primary**: Background = accent (#2563EB), text = white, 12px padding vertical, 16px horizontal, 8px radius.
  - Hover: Background = accent hover (#1D4ED8).
  - Focus-visible: 2px outline offset 2px from button edge.
  - Disabled: Opacity 50%, cursor not-allowed.
  - Loading: Show spinner icon, text hidden or "Loading...".
- **Secondary**: Background = border (#E2E8F0), text = primary (#0F172A), same sizing.
  - Hover: Background lightens slightly.
  - Focus/disabled: Same rules as primary.
- **Ghost** (text-only): No background, text = accent, underline on hover.
- **Destructive** (for delete actions): Background = error (#B91C1C), text = white. Require confirmation before action.

**Cards**:
- Background: white surface, 12–16px radius, 1px border (border color), subtle shadow (1px 2px).
- Padding: 20–24px.
- Hover: Subtle background color shift (to lighten by 1–2%) or border color change (to accent).
- Focus (if clickable): 2px outline, 2px offset.

**Tags** (tech stack, skills):
- Background: light neutral (e.g., #F1F5F9), text = primary text, 8px vertical / 12px horizontal padding.
- Border: 1px light border.
- Radius: 4–6px.
- Non-interactive by default (no click handler, no cursor: pointer).
- Color is never the only distinguishing feature; include text or pattern.

**Forms**:
- **Labels**: Persistent (always visible, not just on focus). Font size: 0.875rem, weight 500.
- **Inputs**: 40px height minimum (touch target), 8px padding, 1px border (border color), 4px radius.
  - Focus: 2px accent outline, 2px offset.
  - Disabled: Opacity 50%, background lightened.
  - Error: 1px red border, error message below in red text, 0.875rem, margin-top 4px.
- **Validation**: Show inline errors as user types (after blur or with debounce). Display error summary above form on submit.
- **Success feedback**: Green checkmark icon + success message, auto-dismiss after 3 seconds.
- **Helper text**: Muted secondary text, 0.875rem, margin-top 4px.

**Navigation**:
- Active state: Use accent color (bold, border-bottom, or background), never rely on color alone.
- Focus state: 2px outline, 2px offset.
- Skip link: "Skip to main content", placed first in tab order, hidden visually (or visible on focus), links to `<main>` or first h1.

**Images**:
- **Meaningful images**: Always include alt text (e.g., "Screenshot of real-time dashboard showing traffic metrics").
- **Decorative images**: Empty alt text (`alt=""`).
- Use `next/image` with explicit `width` and `height` to prevent layout shift.
- Lazy-load images below the fold; use `priority={true}` only for above-the-fold hero images.

### 15.5 Responsive & Motion Behavior

**Mobile-first approach**:
- Start with single-column layout, stack all elements.
- At 768px (md): Shift to 2-column layout, side-by-side navigation.
- At 1024px (lg): 3-column grid, expanded content width.
- Touch targets: Minimum 44×44px (buttons, links).

**Animations**:
- **Duration**: 150–250ms for interactions (hover, focus, click feedback).
- **Easing**: Use `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)` for natural motion.
- **Types allowed**: Opacity fade-in/out, subtle scale (0.98 → 1.0 on hover), transform (translateY by 2–4px).
- **NO**: Auto-playing video, scroll-jacking, animated gradients, parallax that distracts.
- **Accessibility**: Always respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

**Loading states**:
- Show spinner or skeleton loader while fetching data.
- Skeleton loaders should roughly match content shape (e.g., card skeleton for project cards).
- Keep loader visible for minimum 100ms to avoid flash.

**Empty states**:
- Friendly, specific message (not just "No data").
- Optionally include icon or illustration.
- Example: "You haven't attended any hackathons yet. [Learn about hackathons →]"

**Error states**:
- Clear error message: "Something went wrong. Please try again."
- Optional: Show error details in smaller text (for debugging).
- Retry button.

### 15.6 Design QA Checklist

Before deployment, verify:

- [ ] **Clear value proposition**: Without scrolling, a visitor understands what you do (job title, one-line value statement, primary CTA visible).
- [ ] **Mobile & desktop**: Primary CTA visible and accessible on 375px, 768px, and 1440px viewports.
- [ ] **Keyboard navigation**: Tab through entire site; all interactive elements are reachable; focus states are visible (2px outline, 2px offset).
- [ ] **Contrast**: Use axe DevTools or WAVE; all text ≥ 4.5:1 ratio (normal), ≥ 3:1 (large text, icons).
- [ ] **Form errors**: Fill form with invalid data; error messages appear inline and in summary; error text is red + icon (not color alone).
- [ ] **Loading states**: Simulate slow network (DevTools throttle); skeleton loaders or spinners appear for 2+ seconds; content doesn't flash.
- [ ] **Empty states**: If no projects/certifications/videos, page shows friendly empty state (not blank or broken layout).
- [ ] **Success feedback**: Form submission shows success message; optional: redirect after 2 seconds.
- [ ] **No layout shift**: Run Lighthouse; CLS < 0.1. All images have explicit width/height.
- [ ] **Images**: All meaningful images have descriptive alt text; decorative images have `alt=""`. Images load via `next/image`, lazy-loaded below fold.
- [ ] **Links and buttons**: Underlined links (or contextual color change on hover). Buttons: primary (accent) and secondary (neutral) states clear.
- [ ] **Reduced motion**: In DevTools, enable `prefers-reduced-motion: reduce`; verify animations are off or minimal.
- [ ] **Lighthouse audit**:
  - Performance: LCP < 2.5s, INP < 200ms, CLS < 0.1.
  - Accessibility: All > 90.
  - Best Practices: All > 90.
  - SEO: All > 90.
- [ ] **Real-device testing**: Open site on iOS Safari, Android Chrome; verify touch targets, form inputs, video playback (if applicable).

---

## 16. Conclusion

This design document establishes a clear, well-reasoned architecture for a professional AI/ML portfolio website. The decisions prioritize **developer experience** (type safety, clear patterns, easy updates), **user experience** (fast, accessible, responsive), and **maintainability** (modular design, explicit caching, security at every layer).

The phased approach (MVP Phase 1, Enhancements Phase 2) balances shipping quickly with room to grow. The technology stack (Next.js, MongoDB, NextAuth, Cloudinary) is proven, well-documented, and suitable for portfolios and small-to-medium projects.

Future contributors and the author can refer to this document to understand the "why" behind architectural choices, enabling informed decisions when extending or refactoring the codebase.

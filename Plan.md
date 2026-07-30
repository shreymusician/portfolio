# Personal AI/ML Portfolio Website — Build Plan

## Context

The user is a 3rd-year AI/ML engineering student who wants a professional, regularly-updated portfolio site to showcase projects, GitHub activity, YouTube channel (SR Builds), certifications, and hackathons. The site needs to be polished/attractive and easy to update without editing code. The build is split into two phases for pragmatic delivery: Phase 1 delivers a solid MVP (Home, About, Projects, GitHub, Contact links, Admin dashboard), while Phase 2 adds rich content types and polish.

**Key decisions:**
- **Framework**: Latest stable Next.js with App Router and TypeScript — one codebase, deployed to Vercel.
- **Database**: MongoDB Atlas — single source of truth for projects, certifications, hackathons, and SR Builds videos.
- **Content updates**: Password-protected `/admin` dashboard with forms to add/edit/delete content, writing directly to MongoDB. No code pushes for routine updates.
- **GitHub**: Live data from GitHub REST API (repos, stars, languages, activity). Use GitHub PAT in production to avoid rate limits. Contribution calendar (if desired) requires GitHub GraphQL or a dedicated service, not the repos endpoint.
- **Images**: Uploaded through admin dashboard to Cloudinary for optimization and CDN delivery. URLs stored in MongoDB.
- **Styling**: Tailwind CSS + shadcn/ui for modern, accessible, professional components.
- **Caching**: On-demand revalidation with `revalidatePath`/tags when admins update content; explicit caching rules for public vs. admin pages.

## Tech Stack Summary

| Layer | Choice |
|---|---|
| Framework | Latest stable Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui + lucide-react icons |
| Database | MongoDB Atlas (official `mongodb` driver, not Mongoose) |
| Auth (admin only) | Auth.js / `next-auth` (Credentials provider, single admin user) |
| Image optimization | `next/image` + Cloudinary (dynamic image resizing, format negotiation) |
| External APIs | GitHub REST API with PAT in env vars (production), REST for repos/activity; GraphQL or dedicated service for contribution calendar (Phase 2) |
| Animations | Framer Motion (Phase 2; subtle scroll/hover effects) |
| Email (Phase 2) | Resend or similar if contact form is added; includes rate limiting and spam protection |
| Deployment | Vercel (free tier) — auto-deploy from GitHub main branch |
| Env/secrets | `.env.local` (never committed) — Mongo URI, Cloudinary keys, NextAuth secret, admin password hash, GitHub username, GitHub PAT |

## Site Structure / Sections (public site)

### Phase 1 (MVP)
1. **Home / Hero** — name, title ("AI/ML Engineering Student"), tagline, CTA buttons (View Projects, Explore GitHub, Contact), profile photo (static or Cloudinary URL).
2. **About Me** — bio, education, skills (grouped: languages, ML/AI frameworks, tools), timeline/highlights.
3. **Projects** — cards pulled from MongoDB (`projects` collection, filtered by `published: true`): title, description, tech stack tags, cover image (optimized via `next/image`), links (GitHub/live demo), filter by tag. Clickable slug for future detail pages.
4. **GitHub** — live stats and repo cards pulled from GitHub REST API: public repositories (sorted by stars/updated), top languages bar chart, recent public GitHub activity. PAT-authenticated in production. Cached with 6-hour revalidation.
5. **Contact Links** — footer with email, LinkedIn, GitHub profile links (hardcoded or from config). Contact form deferred to Phase 2.

### Phase 2 (Enhancements)
6. **SR Builds** — curated YouTube videos (`videos` collection) shown as embedded thumbnails in a grid, link to the channel.
7. **Certifications** — grid/list from MongoDB (`certifications` collection): title, issuer, date, badge image (Cloudinary), verify link.
8. **Hackathons** — timeline/cards from MongoDB (`hackathons` collection): name, date, location, result/achievement, description, photo (Cloudinary).
9. **Contact Form** — (only if email delivery is configured via Resend or similar). Includes rate limiting, CSRF protection, spam checks. Messages either stored in MongoDB or sent directly to email; behavior clearly documented.
10. **Contribution Calendar** — (optional) GitHub GraphQL endpoint or third-party contribution-graph service to display commit activity — not derived from the repos REST endpoint.

## Admin Dashboard (private)

### Phase 1 (MVP)
- Route group `/admin`, protected by Auth.js middleware — redirects `/admin/login` if unauthenticated, **but explicitly excludes `/admin/login` to allow unauthenticated users to reach the login page without a redirect loop**.
- Single admin user; credentials (username + bcrypt-hashed password) stored in env vars, not a public signup flow.
- Pages: `/admin` (overview dashboard), `/admin/projects` (list/create/edit/delete projects).
- Project management form (via Server Action):
  1. Validate input with zod (shared between client/server).
  2. Image upload to Cloudinary (optional for Phase 1; can use external URLs initially).
  3. Write document to `projects` collection.
  4. Call `updateTag('projects')` to invalidate cached projects data, then `revalidatePath('/projects')` to refresh the public projects page immediately.

### Phase 2
- Expand admin pages: `/admin/certifications`, `/admin/hackathons`, `/admin/videos` — each with list/create/edit/delete forms.
- Add image upload flow for all content types with Cloudinary integration (format/size validation).

### Security & Caching
- **Authentication**: Middleware checks NextAuth session on all `/admin/*` routes; redirects to login if missing.
- **Authorization**: Every admin server action and API route validates session and confirms user identity (do NOT rely on middleware alone).
- **Input validation**: Zod schemas validate all incoming data server-side; never trust client input.
- **Cache invalidation**: When admin creates/edits/deletes content, use `revalidatePath()` or tag-based revalidation to purge cached public pages immediately. No timed ISR; updates appear instantly.
- **Image security**: Cloudinary upload signed server-side (unsigned uploads disabled); define allowed formats (JPEG, PNG, WebP), max file size (5 MB), and dimensions per content type.

## Data Models (MongoDB collections)

### Phase 1 (MVP)
```javascript
// projects
{
  _id: ObjectId,
  slug: string,           // unique; used for future detail pages (/projects/[slug])
  title: string,
  description: string,
  techStack: [string],    // ["React", "Node.js", "MongoDB"]
  coverImageUrl: string,  // Cloudinary or external URL
  githubUrl: string,      // optional
  liveUrl: string,        // optional
  published: boolean,     // controls visibility on public site
  featured: boolean,      // pins to top of /projects
  order: number,          // sort order
  createdAt: Date,
  updatedAt: Date
}
```

### Phase 2
```javascript
// certifications
{
  _id: ObjectId,
  title: string,
  issuer: string,
  issueDate: Date,
  badgeImageUrl: string,  // Cloudinary
  verifyUrl: string,      // optional link to credential
  published: boolean,     // controls visibility on public site
  createdAt: Date,
  updatedAt: Date
}

// hackathons
{
  _id: ObjectId,
  name: string,
  date: Date,
  location: string,
  result: string,         // e.g., "2nd Place", "Winner"
  description: string,
  imageUrl: string,       // Cloudinary
  published: boolean,     // controls visibility on public site
  createdAt: Date,
  updatedAt: Date
}

// videos
{
  _id: ObjectId,
  title: string,
  youtubeId: string,      // embed-friendly ID
  description: string,
  order: number,
  published: boolean,     // controls visibility on public site (if not all videos should be shown)
  createdAt: Date,
  updatedAt: Date
}
```

### Database Indexes (Phase 1 MVP)
```javascript
// projects collection — compound index for the public query filter and sort
db.projects.createIndex({ published: 1, featured: -1, order: 1 });

// unique index on slug for future detail pages and constraint enforcement
db.projects.createIndex({ slug: 1 }, { unique: true });

// Phase 2: add to certifications, hackathons, videos
db.certifications.createIndex({ published: 1, createdAt: -1 });
db.hackathons.createIndex({ published: 1, date: -1 });
db.videos.createIndex({ order: 1 });
```

### External Data (NOT stored in MongoDB)
GitHub data is fetched live from `api.github.com/users/{username}/repos` (and activity endpoints) at request time. Cached with 6-hour revalidation via Next.js fetch options. Uses GitHub PAT in production to avoid public rate limits (60 req/hr → 5000 req/hr).

## Folder Structure

### Phase 1 (MVP)
```
/app
  /(public)
    /page.tsx                     → Home/Hero
    /about/page.tsx
    /projects/page.tsx            → list projects (published: true, sorted by featured/order)
    /github/page.tsx              → live GitHub stats/repos
    /layout.tsx                   → shared header/footer with contact links
  /(auth)
    /admin/login/page.tsx
  /admin
    /(protected)
      /page.tsx                   → dashboard overview (Milestone 4+)
      /projects/page.tsx          → list/create/edit/delete projects (Milestone 5)
      /projects/[id]/edit/page.tsx
  /api
    /auth/[...nextauth]/route.ts  → Auth.js handler
    /projects/route.ts            → GET (list), POST (create) with auth/validation/revalidation
    /projects/[id]/route.ts       → GET (single), PATCH (update), DELETE (remove) with auth/validation/revalidation

/components
  /ui                             → shadcn/ui primitives
  /sections                       → Hero, ProjectCard, GithubStats, Footer
  /admin                          → ProjectForm, DataTable
/lib
  mongodb.ts                      → cached Mongo client (singleton for serverless)
  github.ts                       → fetch/cache GitHub API data
  auth.ts                         → NextAuth config + helper functions
  validations.ts                  → zod schemas (Project, etc.)
  images.ts                       → image optimization config (Phase 1: minimal; Phase 2: Cloudinary)

/public
  /images                         → static images (logo, favicon, OG image, etc.)

.env.local                        → secrets (Mongo URI, GitHub username, GitHub PAT, NextAuth secret, admin creds)
.env.example                      → template of all required env vars (committed)
```

### Phase 2 additions
```
/app
  /sr-builds/page.tsx
  /certifications/page.tsx
  /hackathons/page.tsx
  /admin/certifications/page.tsx (+ [id]/edit)
  /admin/hackathons/page.tsx (+ [id]/edit)
  /admin/videos/page.tsx (+ [id]/edit)
  /api/upload/route.ts            → Cloudinary upload handler (signed server-side)
  /api/{certifications,hackathons,videos}/route.ts (CRUD endpoints)

/components
  /sections                       → add CertificationGrid, HackathonTimeline, VideoGrid
  /admin                          → add ImageUploader, CertificationForm, etc.

/lib
  cloudinary.ts                   → Cloudinary API config + upload helpers
  images.ts                       → expand with image validation (format, size, dimensions)
```

## Key Implementation Notes

### Database & Connection
- **Mongo client**: Cached global client promise (standard Next.js serverless pattern) in `lib/mongodb.ts` to avoid connection exhaustion on every request. Do NOT close the database connection after each serverless request; connection reuse across invocations is critical for performance.
- **Database indexing**: Create compound and unique indexes on Phase 1 launch (published+featured+order compound index, unique slug index) to avoid N+1 queries and slow sorts.

### Public vs. Admin Caching Strategy
- **Public pages**: Server-rendered with on-demand revalidation when admin updates content. NO timed ISR; rely on immediate invalidation for fresh data.
  - **Cached MongoDB reads**: Use Next.js Cache Components to wrap cached MongoDB read functions:
    ```ts
    async function getPublishedProjects() {
      'use cache'
      cacheTag('projects')
      cacheLife('days')  // Cache for one day; configure custom profiles in Next.js config if needed
      // Query MongoDB for published projects here
      const projects = await db.collection('projects').find({ published: true }).toArray();
      return projects;
    }
    ```
  - **Immediate updates (Server Actions)**: Use Server Actions for project mutations (create/update/delete). After the MongoDB operation succeeds, call:
    ```ts
    updateTag('projects')
    revalidatePath('/projects')
    ```
    `updateTag('projects')` immediately expires cached project data; `revalidatePath('/projects')` refreshes the page.
  - **Alternative (API routes with stale-while-revalidate)**: If API routes are used instead of Server Actions, call:
    ```ts
    revalidateTag('projects', 'max')
    revalidatePath('/projects')
    ```
    This does NOT guarantee immediate updates; expect stale-while-revalidate behavior (page refreshes in the background). Do not use the deprecated one-argument form `revalidateTag('projects')`.
  - **Do NOT use** `revalidatePath('/', 'layout')` as it over-invalidates the entire application. Revalidate only affected routes (e.g., `/projects`).
  - GitHub section cached with 6-hour revalidation (`next/fetch` with `revalidate: 21600`) to respect rate limits; does not use tags.
- **Admin pages**: Always dynamic (`export const dynamic = 'force-dynamic'`). Never cache `/admin/*` or write API routes.
- **Static assets**: Favicon, social preview image (OG) stored in `/public`. Social preview image is a static image (Phase 1) or user-uploaded via Cloudinary (Phase 2).

### Image Handling
- **Phase 1**: Use `next/image` with external URLs (GitHub profile photo, Cloudinary or external project images). Configure `remotePatterns` allowlist in `next.config.js` to whitelist approved domains. Prevent "Invalid src prop" runtime errors by adding all expected sources upfront:
  ```js
  // next.config.js
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
  Never allow arbitrary external domains (`hostname: '*'`). Add only known, trusted sources.
- **Phase 2**: Cloudinary integration for admin uploads. Configure allowed MIME types (image/jpeg, image/png, image/webp), max file size (5 MB), and image dimensions per content type (e.g., project cover 1200x630, cert badge 256x256). Upload flow:
  1. Admin form submits file to `/api/upload`.
  2. Server validates MIME type and size.
  3. Call Cloudinary upload API with signed credentials (never expose unsigned upload token).
  4. Return optimized Cloudinary URL (with auto-format, quality tuning) to client.
  5. Store URL in MongoDB; render via `next/image` with Cloudinary domain in `remotePatterns`.

### Security & Authorization
- **Authentication**: Auth.js (next-auth) Credentials provider with bcrypt-hashed admin password in env vars. Verify latest stable setup during implementation.
- **Authorization**: Every server action and API route must validate session AND confirm admin identity (middleware is an additional layer, not the sole gate). Pattern:
  ```typescript
  // In server action or API handler
  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== 'admin') {
    throw new Error('Unauthorized');
  }
  ```
- **Input validation**: Zod schemas on all mutations (creates, updates). Examples: `projectSchema.parse(formData)`. Validate file uploads server-side (MIME type, size, dimensions if applicable).
- **CSRF**: Auth.js protects its own authentication flow, but public forms require independent security controls. The Phase 2 contact form must use origin validation, explicit CSRF protection, server-side Zod validation, rate limiting, and a honeypot or CAPTCHA. Do not rely on Auth.js CSRF behavior for unauthenticated contact-form submissions.
- **Rate limiting**: (Phase 2 contact form) Implement rate limiting on form submissions (e.g., 5 submissions per hour per IP) via middleware or a dedicated package.

### SEO & Social Preview
- **Metadata**: Use `generateMetadata` on all public pages (Home, About, Projects, GitHub, etc.). Define title, description, canonical URL, and Open Graph tags (og:image, og:title, og:description).
- **Social preview image**: Static `/public/og-image.png` (Phase 1) or user-uploaded Cloudinary image (Phase 2). Dimensions 1200x630 pixels.
- **Sitemap**: Use Next.js metadata route `app/sitemap.ts` (not static `/public/sitemap.xml`) to dynamically list all public routes, including future project-detail pages (`/projects/[slug]`). Sitemap routes generated programmatically from database.
- **Robots.txt**: Use Next.js metadata route `app/robots.ts` (not static `/public/robots.txt`) to configure crawler rules and reference the sitemap.

### Performance & Analytics
- **Lighthouse**: Target Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1). Use Vercel Analytics to monitor real-world performance.
- **Image optimization**: `next/image` handles lazy loading and format negotiation. Set explicit `width` and `height` on all images to prevent layout shift (CLS).
- **GitHub API caching**: Fetch with `cache: 'force-cache'` and `revalidate: 21600` (6 hours) to batch requests and avoid hitting rate limits.

### Responsive & Accessible
- **Mobile-first**: Tailwind's responsive utilities (sm, md, lg, xl breakpoints) for layout.
- **Accessibility**: shadcn/ui components are WCAG 2.1 AA compliant by default. Ensure images have alt text, form labels are associated, and color contrast meets standards.
- **UTF-8 encoding**: All text files (.tsx, .ts, .json, .md) saved as UTF-8 (no BOM) to ensure em-dashes, arrows, and international characters render correctly. Configure editor to enforce UTF-8.

### GitHub API Details
- **Public API**: Use GitHub REST API v3 for repositories (`GET /users/{username}/repos`), languages (`GET /repos/{owner}/{repo}/languages`), and recent public GitHub activity (`GET /users/{username}/events`). Note: the events endpoint returns diverse event types (pushes, issues, PRs, etc.) limited to recent public activity, not a complete commit history.
- **Authentication**: No token required for public repos (60 req/hr public limit). For production, store `GITHUB_PAT` (personal access token) in env vars and include `Authorization: token {PAT}` header to increase limit to 5000 req/hr.
- **Contribution calendar**: If desired, use GitHub GraphQL API (requires PAT) or a third-party service like GitHub Stats — NOT the repos REST endpoint, which only returns repository metadata, not commit history.

## Build Order (Phased Milestones)

### Phase 1: MVP (weeks 1–3)

1. **Scaffold**: Next.js (latest stable) + TypeScript + Tailwind CSS + shadcn/ui + lucide-react. Create folder structure (Phase 1 only). Set up `.env.example` and `.env.local` (gitignored). Ensure UTF-8 encoding enforced in editor.

2. **Database setup**: MongoDB Atlas free cluster. Wire up `lib/mongodb.ts` with cached client singleton. Test connectivity with a simple query.

3. **Projects data model & validation**: Define Zod schema (`validations.ts`) for Project with `slug`, `title`, `description`, `techStack`, `coverImageUrl`, `githubUrl`, `liveUrl`, `published`, `featured`, `order`, `createdAt`, `updatedAt`. Create database indexes (compound index on published+featured+order, unique index on slug). Wrap MongoDB read function in a cached function with `cacheTag('projects')` for use by public pages.

4. **Auth setup**: Configure Auth.js (next-auth) with Credentials provider (single admin user). Hash password with bcrypt. Store in env vars. Create `lib/auth.ts` with session helpers. Verify latest stable setup during implementation.

5. **Admin project CRUD**: 
   - Build `/admin/login` page with username/password form.
   - Build `/admin` dashboard (overview) with link to projects management.
   - Build `/admin/projects` page: list/table of projects with edit/delete buttons; create new project form.
   - **Use Server Actions for mutations** (create, update, delete) to guarantee immediate updates:
     - Auth checks: Always call `getServerSession()` inside each Server Action (explicit, not middleware-dependent).
     - Zod validation for input.
     - After MongoDB mutation succeeds, call `revalidatePath('/projects')` to immediately purge cache and refresh the page.
   - Alternatively, if API routes are used instead of Server Actions, same pattern applies: validate auth, mutate, call `revalidatePath('/projects')` for immediate cache invalidation.
   - **Middleware configuration** (in `middleware.ts`): Use strict route matcher `/admin((?!/login$).*)` to protect all admin routes EXCEPT `/admin/login`:
     ```typescript
     export const config = {
       matcher: ['/admin((?!/login$).*)', '/api/admin/:path*'],
     };
     ```
     This prevents redirect loops: unauthenticated users can reach `/admin/login`, but all other `/admin/*` routes redirect to login if session missing.
   - **Defense-in-depth**: Middleware is a gate, not the sole protection. Every Server Action and API route must also call `getServerSession()` and verify `session.user.id === 'admin'`.

6. **Public project page**: Build `/projects` page (Server Component). Query MongoDB for `published: true` projects, sorted by `featured` DESC, then `order` ASC. Display project cards with `next/image` for cover images (external URLs). Support tag/tech-stack filtering (client-side for MVP).

7. **Home & About pages**:
   - `/` (home): Hero section with name, title, brief tagline, CTA buttons (View Projects, Explore GitHub, Contact).
   - `/about`: Bio, education, skills grouped by category (languages, ML/AI frameworks, tools), highlight timeline.
   - Create layout with responsive header/footer. Add contact links (LinkedIn, GitHub, email) in footer.

8. **GitHub integration**: Build `lib/github.ts` to fetch live data via GitHub REST API (repos, languages, activity). Implement graceful degradation: if GITHUB_PAT is missing or rate-limited, return empty arrays instead of crashing. Fetch in `/github` page with 6-hour revalidation (via `next.revalidate` option on fetch). Display repo cards sorted by stars, language breakdown, recent activity snippet. Use `GITHUB_USERNAME` and `GITHUB_PAT` env vars. For contribution calendar (Phase 2), integrate `react-github-calendar` npm package or use a third-party SVG service instead of building custom GraphQL.

9. **Polish (Phase 1)**:
   - Responsive design QA on mobile/tablet/desktop.
   - Accessibility audit (alt text, color contrast, keyboard navigation).
   - Add favicon and static OG social preview image (`/public/og-image.png`, 1200x630).
   - SEO metadata on all pages (Home, About, Projects, GitHub) using `generateMetadata`.
   - Create metadata routes `app/sitemap.ts` and `app/robots.ts` (not static `/public/sitemap.xml` and `robots.txt`).
   - Empty states and error handling (404 page, error boundaries).
   - Loading states for Projects and GitHub sections.
   - Verify Lighthouse targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.

10. **Deploy to Vercel**: Connect GitHub repo, configure environment variables:
    - `MONGODB_URI` (MongoDB Atlas connection string)
    - `GITHUB_USERNAME` (your GitHub username)
    - `GITHUB_PAT` (GitHub Personal Access Token for production API calls; optional but recommended)
    - `NEXTAUTH_SECRET` (Auth.js/next-auth session secret)
    - `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` (bcrypt-hashed admin credentials)
    - Deploy and test all MVP features on live URL.

### Phase 2: Enhancements (weeks 4+)

11. **Cloudinary setup**: Create free Cloudinary account, store cloud name, API key, API secret in env vars. Build `/api/upload` endpoint to accept image uploads (POST), validate MIME type/size server-side, sign upload with Cloudinary API, return optimized URL. Define allowed formats (JPEG, PNG, WebP), max 5 MB. Ensure `res.cloudinary.com` is in `next.config.js` image `remotePatterns` allowlist (already added in Phase 1 setup).

12. **SR Builds (YouTube)**: 
    - Add `videos` collection schema (title, youtubeId, description, order).
    - Build `/admin/videos` page: form to add/edit/delete videos.
    - Build `/sr-builds` public page: grid of embedded YouTube video players/thumbnails with link to channel. Revalidate on admin changes.

13. **Certifications**:
    - Add `certifications` collection schema (title, issuer, issueDate, badgeImageUrl, verifyUrl).
    - Build `/admin/certifications` page: form to add/edit/delete with image upload to Cloudinary.
    - Build `/certifications` public page: grid/list display. Revalidate on admin changes.

14. **Hackathons**:
    - Add `hackathons` collection schema (name, date, location, result, description, imageUrl).
    - Build `/admin/hackathons` page: form with image upload to Cloudinary.
    - Build `/hackathons` public page: timeline or card layout sorted by date DESC. Revalidate on admin changes.

15. **Contact form** (conditional):
    - If email delivery is available (Resend or SendGrid configured), build contact form on `/` or `/contact`.
    - Implement security measures: rate limiting (e.g., 5 submissions/hour per IP), origin validation, CSRF token verification, honeypot or CAPTCHA field, server-side Zod schema validation, and clear privacy notice.
    - Do NOT rely on Auth.js CSRF protection alone; the public contact form is unauthenticated, so explicit CSRF tokens and origin checks are necessary.
    - Define storage: either save to MongoDB (`messages` collection) or send directly to configured email.
    - Document behavior clearly (confirmation message, privacy policy link, data retention).

16. **Animations & refinements**:
    - Add Framer Motion animations: scroll-triggered reveals on section cards, hover effects on project cards, subtle page transitions.
    - Refine typography, spacing, color palette for cohesion.
    - Add micro-interactions (button hover states, form feedback).

17. **GitHub GraphQL & contribution calendar** (optional):
    - If desired, integrate GitHub GraphQL API (requires `GITHUB_PAT`) to fetch commit history and render contribution calendar.
    - Alternatively, link to third-party service (e.g., GitHub Profile Stats badge).

18. **Analytics & monitoring**:
    - Set up Vercel Analytics for Core Web Vitals tracking.
    - Monitor Cloudinary usage (bandwidth, transformations).
    - Add error logging (Sentry or Vercel Error Reporting).

19. **Final polish**:
    - Comprehensive accessibility audit (WAVE, axe DevTools).
    - Lighthouse performance audit (target green scores: LCP < 2.5s, INP < 200ms, CLS < 0.1, Accessibility > 90, Best Practices > 90, SEO > 90).
    - Cross-browser testing (Chrome, Safari, Firefox, Edge).
    - Mobile responsiveness final QA.
    - Update `.env.example` with all new env vars.

20. **Redeploy & announce**: Push final Phase 2 changes to GitHub, Vercel auto-deploys. Test all features on production. Share portfolio with networks.

## Information Needed from the User

### Before Phase 1 start:
- **GitHub username** (e.g., `john-doe`) — used to fetch repos and activity via GitHub REST API.
- **GitHub Personal Access Token (PAT)** (optional but recommended for production) — increases rate limit from 60 req/hr to 5000 req/hr. Create at https://github.com/settings/tokens with `public_repo` scope.
- **Contact links** — email address, LinkedIn profile URL, any other social profiles to display in footer.
- **Admin credentials** — desired username and password (will be bcrypt-hashed, stored in env vars).
- **MongoDB Atlas connection string** — create a free cluster at https://www.mongodb.com/cloud/atlas and provide the connection URI.
- **Auth.js/next-auth secret** — generate a random secure string for `NEXTAUTH_SECRET` env var. Verify latest setup guidance during implementation.

### Before Phase 2 start:
- **YouTube channel handle** — for the SR Builds section and links.
- **Cloudinary account** — free tier at https://cloudinary.com. Provide cloud name, API key, and API secret.
- **Brand colors** (optional) — if you have a preferred palette; otherwise use a professional default (grays, blues, accents).
- **Email provider** (optional, for Phase 2 contact form) — Resend, SendGrid, or similar. Provide API key.

### Throughout development:
- Review pages as they're built locally (`npm run dev`) and provide feedback on copy, layout, color, tone.
- Provide sample project data (title, description, tech stack, GitHub link, live demo link) to populate initial projects.
- Provide sample certifications, hackathons, and SR Builds videos if proceeding to Phase 2.

## Testing & Verification

### Phase 1 (MVP)
After each milestone, run `npm run dev` and manually test:

1. **Scaffold & auth** (Milestone 1–4):
   - Navigate to `http://localhost:3000` → Home page loads.
   - Navigate to `/admin/login` → Login form appears.
   - Enter admin credentials → redirects to `/admin` dashboard.
   - Log out → redirects to `/admin/login`.

2. **Projects admin & public** (Milestone 5–6):
   - Log in to `/admin/projects`.
   - Create new project: fill form, click Submit. Page should revalidate and redirect.
   - Verify new project appears on `/projects` page.
   - Edit project: change title, save. Verify change on public page.
   - Delete project: confirm deletion dialog, project disappears from `/projects`.
   - Verify `published: false` projects don't appear on public site.
   - Verify `featured: true` projects appear at top, sorted by `order`.

3. **Home, About, GitHub** (Milestone 7–8):
   - `/` renders with hero, CTA buttons work.
   - `/about` displays bio, skills, highlights.
   - `/github` fetches and displays repos, languages, activity. Verify data matches GitHub account.

4. **Responsive & SEO** (Milestone 9):
   - Test on mobile (375px), tablet (768px), desktop (1440px) → layout shifts smoothly.
   - Inspect page source → `<title>`, `<meta name="description">`, and Open Graph tags present and correct.
   - Verify `app/sitemap.ts` dynamically generates and lists Home, About, Projects, GitHub routes.
   - Verify `app/robots.ts` allows all crawlers and references the sitemap.
   - Run Lighthouse: target green scores (LCP < 2.5s, INP < 200ms, CLS < 0.1).

5. **Deployment** (Milestone 10):
   - `npm run build` completes without errors or warnings.
   - Deploy to Vercel, confirm environment variables set.
   - Test all public routes on live URL (e.g., https://yourportfolio.vercel.app).
   - Test admin login on live URL.
   - Lighthouse audit: target green scores (LCP < 2.5s, INP < 200ms, CLS < 0.1).

### Phase 2 (Enhancements)
After each Phase 2 milestone:

6. **Cloudinary & image uploads** (Milestone 11):
   - Upload image in admin form → `/api/upload` handles it, returns Cloudinary URL.
   - Verify optimized image displays on public page with `next/image`.
   - Test invalid file (non-image, >5MB) → rejection with clear error message.

7. **SR Builds, Certifications, Hackathons** (Milestone 12–14):
   - Admin form for each content type works (create/edit/delete).
   - Public pages display content correctly sorted/filtered.
   - On admin mutation, public pages revalidate immediately (not delayed by ISR).

8. **Contact form** (Milestone 15, if added):
   - Form submits successfully.
   - Rate limiting blocks >5 submissions/hour from same IP.
   - Email or MongoDB message sent/stored correctly.
   - Confirmation message displayed to user.

9. **Animations, analytics, final polish** (Milestone 16–19):
   - Scroll animations trigger smoothly without jank.
   - Vercel Analytics dashboard shows Core Web Vitals.
   - WAVE, axe DevTools accessibility audits pass (no errors).
   - Lighthouse audit: Accessibility, Best Practices, SEO all >90.
   - Test on real devices (iOS, Android, Windows, macOS).

10. **Final production check**:
    - All env vars configured on Vercel.
    - No console errors or warnings in prod.
    - Smoke test all public routes + admin login on live URL.
    - Share portfolio link with others for feedback.

## Additional Considerations

- **Monitoring & logging**: Consider Sentry or Vercel Error Reporting for production bug tracking.
- **Future scalability**: The architecture supports adding a blog, testimonials, or other content types by following the existing patterns (Mongo collection → Zod schema → CRUD routes → admin forms → public pages).
- **Custom domain**: Once MVP is solid, register a domain (e.g., yourname.dev) and configure it on Vercel.
- **Analytics**: Vercel Analytics is free; use it to track real-world performance and user behavior over time.
- **Maintenance**: As an AI/ML student, this portfolio is a living document. Plan to update projects, certifications, and hackathons regularly via the admin dashboard.

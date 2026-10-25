# 🏛️ Project Structure & Module Boundaries (2026)
*Project: Model Disabled Society Rasuwa (नमूना अपाङ्ग समाज रसुवा)*

This document delineates the code architecture, folder hierarchy, and isolation boundaries between public assets, frontend components, administrative modules, and serverless edge functions.

---

## 1. Directory Tree Overview

```
.
├── api/                  # Vercel Serverless Edge/Node Functions
│   └── index.js          # Dynamic OpenGraph/SEO SSR metadata injector
├── public/               # Raw public static assets (favicons, robots.txt, sitemap.xml)
├── src/                  # Client-side React Application
│   ├── assets/           # Local static images, branding, and bundled webfonts
│   ├── components/       # Reusable accessible UI components (Header, Footer, Cards)
│   │   └── admin/        # Isolated admin UI controls (AdminFields, etc.)
│   ├── context/          # React Contexts (SiteContentContext, AuthContext, LanguageContext)
│   ├── hooks/            # Custom hooks (useAdminContent, useFocusTrap, useUnsavedChanges)
│   ├── lib/              # Pure business logic, converters, formatters, and API clients
│   │   ├── activities.js # Activity sorting, validation, and slug management
│   │   ├── bsDate.js     # Bikram Sambat (B.S.) to Gregorian (A.D.) date converter
│   │   ├── imageFile.js  # Client-side canvas image optimization & WebP conversion
│   │   ├── supabaseClient.js # Authenticated Supabase client
│   │   └── uploadFile.js # Secured file upload handler
│   └── pages/            # Application views
│       ├── admin/        # Lazy-loaded admin panel pages (AdminLayout, AdminActivities, etc.)
│       └── ...           # Public pages (Home, About, Activities, Programs, Resources)
├── supabase/             # PostgreSQL database schemas, triggers, and migrations
├── vercel.json           # Vercel configuration, routing rewrites, and security headers
└── package.json          # Pinned project dependencies and scripts
```

---

## 2. Code Splitting & Bundle Isolation

1. **Lazy Loading of Administration Code:**
   - All `/admin/*` routes (`AdminLogin`, `AdminLayout`, `AdminActivities`, `AdminSettings`, `AdminCollection`) are dynamically imported via `React.lazy()`.
   - General visitors never download administrative UI chunks or management logic.

2. **Route Guard Hierarchy:**
   - Public Routes (`/`, `/about`, `/programs`, `/activities`, `/notices`, `/resources`, `/contact`, policies): Freely accessible.
   - Admin Base (`/admin`): Guarded by `<RequireAuth>` — requires an authenticated Supabase user on the `ngo_admins` allowlist.
   - Developer-Only Admin (`/admin/settings`, `/admin/programs`, `/admin/board`, `/admin/notices`, `/admin/resources`): Guarded by `<RequireDeveloper>` — non-developer staff are bounced back to `/admin/activities`.

3. **Serverless Function Separation (`api/index.js`):**
   - Operates in Node.js runtime on Vercel.
   - Fetches public content using Supabase's anonymous RPC and injects customized `<title>` and `<meta property="og:*">` tags into `dist/index.html` before dispatching to search crawlers and social share bots.

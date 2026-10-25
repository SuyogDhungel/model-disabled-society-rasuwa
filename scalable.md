# ⚡ Scalability & Performance Strategy (2026)
*Project: Model Disabled Society Rasuwa (नमूना अपाङ्ग समाज रसुवा)*

This document specifies the caching protocols, query optimizations, and database scaling practices designed to handle traffic spikes smoothly without degrading server response times or exceeding free-tier limits.

---

## 1. Caching & Edge Propagation

1. **Static Hashed Assets (`/assets/*`):**
   - Configured in `vercel.json` with immutable long-term caching:
     ```http
     Cache-Control: public, max-age=31536000, immutable
     ```
   - Vite automatically attaches content hashes to all generated script, stylesheet, and font bundles.

2. **Serverless Dynamic Shell (`api/index.js`):**
   - Employs Stale-While-Revalidate edge caching:
     ```http
     Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300
     ```
   - Global CDN edge servers cache the fully meta-rendered HTML shell for 60 seconds. Subsequent visits are served instantaneously from edge cache while asynchronously revalidating with Supabase.

3. **In-Memory Client State:**
   - `SiteContentContext` retains fetched content in React state across route navigations, eliminating repeated network requests as visitors navigate between Home, About, Programs, and Activities.

---

## 2. Image Optimization & Compression

1. **Client-Side Canvas Processing (`src/lib/imageFile.js`):**
   - Raw multi-megabyte camera photos are resized down to web-appropriate dimensions (1600px max width/height for galleries, 512px for logos, 1200x630 for social cards).
   - Converted to modern `.webp` format at 86% quality before network upload.
   - Saves bandwidth, storage space, and page load time.

2. **Responsive Images:**
   - Standard `loading="lazy"` attributes on non-hero imagery.
   - Clean aspect ratio preservation to eliminate layout shifts (CLS).

---

## 3. Database Scalability & Query Hygiene

1. **Singleton Aggregate Model:**
   - Content is read in a single optimized RPC call (`get_public_site_content`), avoiding N+1 roundtrips.
2. **Indexed Keys:**
   - Primary key indexes on `site_content(id)` and `ngo_admins(user_id)`.
3. **Optimistic Concurrency Control:**
   - `useAdminContent` conditions updates on `updated_at` matching the tab's load timestamp. Prevents silent overwrite conflicts when multiple administrators are active simultaneously.

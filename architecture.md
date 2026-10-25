# 📐 System Architecture & Data Flow (2026)
*Project: Model Disabled Society Rasuwa (नमूना अपाङ्ग समाज रसुवा)*

This document outlines the data pathways, serverless infrastructure, and PostgreSQL database boundaries.

---

## 1. High-Level Topology

```
                  ┌────────────────────────────────────────┐
                  │    User Browser / Social Crawler       │
                  └───────────────────┬────────────────────┘
                                      │ HTTPS
                                      ▼
                  ┌────────────────────────────────────────┐
                  │        Vercel Global CDN Edge          │
                  │  (Strict Headers, HSTS, CSP, Caching)  │
                  └──────┬──────────────────────────┬──────┘
                         │ Static /assets           │ HTML Requests
                         ▼                          ▼
                  ┌──────────────┐          ┌──────────────────────┐
                  │ Pre-rendered │          │ Vercel Serverless    │
                  │ Client Dist  │          │ `api/index.js` (SSR) │
                  └──────────────┘          └──────────┬───────────┘
                                                       │
                                 RPC get_public_site_content
                                                       │
                                                       ▼
                                            ┌──────────────────────┐
                                            │   Supabase Cloud     │
                                            │  (PostgreSQL + RLS)  │
                                            └──────────────────────┘
```

---

## 2. Database Schema & RLS Security

The database is built on PostgreSQL inside Supabase with Row Level Security (RLS) active on all tables.

### 2.1 Tables
- **`public.site_content`**:
  - Singleton record (`id = 'main'`) storing all structured site content in JSONB: `organization`, `appearance`, `seo`, `about`, `board`, `programs`, `activities`, `notices`, `resources`.
  - Audited via `updated_at` timestamps for concurrency conflict prevention.
- **`public.ngo_admins`**:
  - Contains UUID foreign keys referencing `auth.users(id)`.
  - Roles: `role in ('developer', 'editor')`.
  - `editor`: Can only add, edit, or delete items within `content->'activities'`.
  - `developer`: Has complete editing access to the entire singleton JSON payload.

### 2.2 Security Functions & Triggers
- **`public.get_public_site_content()`**:
  - `SECURITY DEFINER` function executing with elevated privileges.
  - Returns only published items. Automatically filters out drafts and unverified committee members.
- **`public.validate_site_content()`**:
  - `BEFORE UPDATE` trigger on `site_content`.
  - Enforces mandatory photo alt-text, YYYY-MM-DD date formats, and bilingual title constraints.
- **`public.guard_site_content_scope()`**:
  - Prevents `editor` accounts from modifying any JSON key other than `activities`.
- **`public.is_ngo_admin()` & `public.is_ngo_developer()`**:
  - Cryptographically verify permissions against `auth.uid()`.

---

## 3. Storage Buckets
- **`site-images`**: Stores web-optimized WebP photos and logos.
- **`report-files`**: Stores official PDFs (audits, constitutions, annual reports).
- **Access Policies**:
  - Public Read: Allows all visitors to download documents and render photos.
  - Authenticated Insert: Admin users can upload new photos and documents.
  - Developer-Only Update & Delete: Prevents regular editors from altering or deleting existing legal records or site images.

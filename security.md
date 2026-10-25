# 🛡️ Security Guidelines & Policy (2026)
*Project: Model Disabled Society Rasuwa (नमूना अपाङ्ग समाज रसुवा)*

This document defines the strict, non-negotiable security requirements for all AI-assisted and developer code in this project.

---

## 1. Transport & Network Security (Layer 1)
- **HTTPS Enforcement:** All traffic must resolve over HTTPS. Strict HSTS header configured:
  ```http
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```
- **Clickjacking Defense:** Prevent iframe embedding via:
  ```http
  X-Frame-Options: DENY
  Content-Security-Policy: ... frame-ancestors 'none';
  ```
- **MIME Sniffing Prevention:**
  ```http
  X-Content-Type-Options: nosniff
  ```
- **Referrer Policy:**
  ```http
  Referrer-Policy: strict-origin-when-cross-origin
  ```
- **Permissions Policy:** Block unauthorized browser device access:
  ```http
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  ```
- **Content Security Policy (CSP):**
  - Scripts: `'self'`
  - Styles: `'self' 'unsafe-inline'`
  - Images: `'self' data: blob: https:`
  - Connections: `'self' https://*.supabase.co wss://*.supabase.co`
  - Objects: `'none'`
  - Frames: `https://www.openstreetmap.org`

---

## 2. Authentication & Authorization (Layer 2)
- **Default Deny:** All administrative endpoints and actions require active authentication and allowlist verification.
- **Role-Based Access Control (RBAC):**
  - `editor` (Staff Account): Permitted ONLY to post and manage activities/news stories (`activities`).
  - `developer` (Site Developer): Has full administrative authority over site settings, programs, committee, notices, and documents.
  - Enforced client-side via `RequireAuth` and `RequireDeveloper` route guards, and server-side in PostgreSQL triggers (`guard_site_content_scope`).
- **Brute-Force & Rate Limiting Protection:**
  - Login attempts enforce progressive cooldown (max 5 failed attempts before 30-second lockout).
- **Session Tokens:** Handled via Supabase Auth with token expiry and refresh rotation. No plain tokens or sensitive credentials stored in unencrypted persistent storage.

---

## 3. Code Vulnerabilities & Injection Defenses (Layer 3)
- **XSS Prevention:** Zero use of unescaped HTML injection (`dangerouslySetInnerHTML`). Dynamic values in SSR templates (`api/index.js`) must be passed through `escapeHtml()`.
- **SQL Injection Prevention:** No string-interpolated SQL. All database mutations occur through parameterized Supabase client queries or pre-compiled PostgreSQL RPC functions (`get_public_site_content`, `is_ngo_admin`, `is_ngo_developer`).
- **File Upload Validation (`src/lib/uploadFile.js`):**
  - Enforce whitelist on target buckets (`site-images`, `report-files`).
  - Strict file size limits: 10MB for images, 25MB for official documents.
  - Allowed extension validation (`jpg`, `jpeg`, `png`, `webp`, `svg`, `pdf`, `doc`, `docx`, `xls`, `xlsx`).
  - Path normalization: Filenames sanitized with regex `[^a-zA-Z0-9_-]` to eliminate path traversal (`../`) attacks.
  - Images sanitized and re-encoded to WebP via client-side canvas rasterization before storage (`src/lib/imageFile.js`).

---

## 4. Dependencies & Supply Chain Hygiene (Layer 4)
- **Zero High/Critical CVEs:** Regular audits via `npm audit`. Pinned packages and deterministic builds guaranteed by `package-lock.json`.
- **Minimal Footprint:** No unneeded, unmaintained, or bloated external dependencies.

---

## 5. Secrets & Environment Configuration (Layer 5)
- **Zero Secrets in Git:** `.env`, `.env.local`, and `.env*.local` strictly excluded in `.gitignore`.
- **Client Secret Isolation:** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or publishable key) are exposed to client bundles. The `SUPABASE_SERVICE_ROLE_KEY` must **NEVER** be prefixed with `VITE_` or included in frontend client builds.

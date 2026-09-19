# Verification report

Prepared 18 September 2026. Tests run against the delivered React source and Cloudflare function code in the local environment.

## Passed

- Production Vite build. Main public JavaScript bundle approximately 315 KB / 98 KB gzip; admin pages load separately. No Supabase client remains.
- 24 unit/security tests: schema/default content, English/Nepali fallback, multiple PDF/Word attachments, URL validation, draft filtering, verified roster, authentication failure behavior, cross-origin write rejection, file signatures, upload limits, download headers and save conflicts.
- 28 axe accessibility scans: ten public routes in both light and dark modes, Nepali homepage, and seven admin pages. Zero automated violations in the selected WCAG A/AA rule sets.
- Browser interactions: skip-link focus, mobile navigation and Escape, 375px horizontal overflow, language toggle, Nepali text lang attributes, PDF and DOCX links on the same report, searching, all admin routes, notice creation, and retention of the unsaved form after a simulated save conflict. No uncaught browser errors.
- Local Cloudflare runtime integration using real emulated D1 and R2 bindings: SQL migration, content save/read, stale revision rejection, server-side HTML metadata, canonical URL, security headers, 404 responses, admin noindex, unauthenticated API denial, PDF upload/download, and hiding files when their last public reference becomes a draft.
- Wrangler Pages Functions compilation and local D1 migration.
- Dependency audit of production packages reported zero known vulnerabilities at the time checked.
- Desktop/mobile homepage and editor screenshots visually reviewed. Screenshots are in test-results/.

## Scope of the results

Browser admin interaction tests use a mocked authenticated session and API responses. The separate Cloudflare runtime tests exercise D1/R2 and actual server functions locally. Neither test performs live email sign-in or writes to the NGO's Cloudflare account.

Live Access policies, production domain/HTTPS, actual account quotas, email delivery, social-network cache refresh and real uploaded documents must be checked after deployment. No service account was created and no paid service was enabled.

Automated scans are not a claim of complete WCAG conformance. NVDA, real Nepali voice switching, Windows high-contrast mode, zoom and usability with disabled users still require hands-on review. Uploaded files need their own accessibility checks; PDF/Word support does not make an inaccessible document accessible.

## Reproduce

1. Install Node 22.12+ and run npm ci.
2. Run npm test, npm run lint and npm run build.
3. Run npm run test:cloudflare (uses the Wrangler toolchain's local runtime).
4. Run npm run test:browser. On systems without the bundled Linux Chromium support, set CHROME_PATH to a locally installed Chromium executable. TEST_URL is optional; otherwise the suite starts its own localhost server.

The test suite contains fixtures, not real published NGO reports or notices.

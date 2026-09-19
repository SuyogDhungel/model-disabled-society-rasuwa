# Research and implementation decisions

Reviewed for this delivery, 18 September 2026. Features are informed by these organizations and official developer guidance, not copied claims or assets.

## NGO patterns

- CBM Global — https://cbm-global.org/ — clear mission, focus areas, partnerships, updates and organizational contact/legal information. Applied: mission-first homepage, programs and registration details.
- Humanity & Inclusion — https://www.hi.org/en/index — publications, institutional information, accountability and opportunities. Applied: report library, multiple document formats, policy/feedback pages and clear contact routes.
- Sightsavers — https://www.sightsavers.org/ — work in action, reports, accessibility and safeguarding. Applied: accessible information hierarchy, resource access and plain-language accessibility statement.
- National Federation of the Disabled Nepal — https://www.nfdn.org.np/ — Nepal-relevant bilingual information, notices and resources. Applied: English/Nepali interface, single-language uploads, language-aware text fallback, search and document-language filter.

The supplied portfolio and second reference project informed centralized settings, OG/Twitter cards, image sizing, readable admin forms, draft visibility, backup/restore and document upload workflows. Their full applications were not copied wholesale, and speculative AI models were not added where deterministic code is safer.

The only verified social link supplied for this organization is:
https://www.facebook.com/p/Model-Disabled-Society-Rasuwa-61581739607367/
No additional social accounts are claimed. The supplied logo is retained. No fabricated donors, partners, statistics, events, projects, testimonials or payment accounts are added.

## Developer and accessibility guidance

- W3C WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/ — text alternatives, keyboard access, focus visibility, headings, labels, status messages, page/part language. Applied via semantic elements, per-field lang attributes, focus management, skip link, usable mobile menu, contrast-aware styling, and tests.
- MDN lang: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang — actual content language matters, not the user's current UI preference. Applied to Nepali reports shown on an English page.
- Cloudflare JWT validation: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/ — authenticate at the API using signed tokens, not merely client routes or forwarded email.
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/ — server execution for protected API operations and server-visible social metadata.
- OWASP upload guidance: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html — allowlisted formats, size checks, random storage keys, trusted uploader identity and safe delivery. The implementation performs signature checks, but does not claim full malware scanning.
- Established libraries: React, React Router, Zod for runtime schemas, JOSE for token verification, Wrangler for Cloudflare integration, Playwright and axe-core for browser checks. These reduce custom infrastructure code; they do not guarantee a bug-free site.

## Architecture choice

Cloudflare Pages + D1 is a better fit here than Supabase Free because the NGO may not update or visit the site weekly, and Cloudflare DNS is already configured. Supabase remains capable, but its free inactivity pause is a real operational concern for this use case:
https://supabase.com/pricing
https://supabase.com/docs/guides/deployment/going-into-prod

D1/Pages free-plan constraints and optional R2 metering are documented in DEPLOYMENT.md. No service should be described as permanently free without limits. The default disables R2 so browser uploads require an explicit account/billing decision.

## Content safeguards

Legal/contact details came from supplied documents. The source's mission/objective translation is retained as an editable draft for organizational approval; this delivery does not certify it as a complete legal transcription. The 22-page scanned PDF is not a screen-reader-accessible publication, and contains material that should be reviewed/redacted before release. It is deliberately not republished. Privacy, accessibility and safeguarding text also needs organizational approval.

// Vercel serverless function: serves the built SPA shell, but first
// rewrites its <title> and Open Graph/Twitter meta tags using the LIVE
// Supabase content -- so changing the logo, site title or social preview
// image in /admin/settings updates what Facebook/WhatsApp/Twitter show
// when the link is shared, without a rebuild or redeploy. A static Vite
// build can't do this on its own (the tags would be frozen at build time),
// which is why this function exists -- the same technique
// suyog-dhungel-portfolio's api/index.js uses for its own profile/social
// image.
//
// Falls back to the static tags already baked into dist/index.html
// whenever Supabase isn't configured or isn't reachable, so a visitor
// never sees a broken page because of this function.
import fs from "node:fs";
import path from "node:path";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function setMeta(html, attribute, key, content) {
  if (!content) return html;
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, "i");
  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);
}

let cachedHtml = null;
function readIndexHtml() {
  if (cachedHtml) return cachedHtml;
  try {
    cachedHtml = fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf8");
    return cachedHtml;
  } catch {
    return null;
  }
}

async function fetchPublicSiteContent() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/get_public_site_content`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && Object.keys(data).length ? data : null;
  } catch {
    return null;
  }
}

export default async function handler(request, response) {
  const baseHtml = readIndexHtml();
  if (!baseHtml) {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    return response
      .status(200)
      .send('<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Namuna Apanga Samaj Rasuwa</title></head><body><div id="root"></div></body></html>');
  }

  let html = baseHtml;
  const content = await fetchPublicSiteContent();

  if (content) {
    const org = content.organization || {};
    const seo = content.seo || {};
    const domain = org.domain || "modeldisabledsocietyrasuwa.org.np";
    const siteUrl = `https://${domain}`;
    const requestPath = (request.url || "/").split("?")[0];
    const pageUrl = siteUrl + requestPath;

    const title = seo.title || org.nameEn || org.shortNameEn || "Namuna Apanga Samaj Rasuwa";
    const description = seo.description || "";
    const absolute = (u) => (u ? (u.startsWith("http") ? u : siteUrl + (u.startsWith("/") ? u : "/" + u)) : "");
    const image = absolute(seo.socialImageUrl) || absolute(org.logoUrl) || siteUrl + "/og-image.png";
    const imageAlt = seo.socialImageAlt || org.logoAlt || `${title} logo`;

    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    html = setMeta(html, "name", "description", description);
    html = setMeta(html, "property", "og:title", title);
    html = setMeta(html, "property", "og:description", description);
    html = setMeta(html, "property", "og:url", pageUrl);
    html = setMeta(html, "property", "og:image", image);
    html = setMeta(html, "property", "og:image:secure_url", image.startsWith("https://") ? image : "");
    html = setMeta(html, "property", "og:image:alt", imageAlt);
    if (seo.socialImageWidth) html = setMeta(html, "property", "og:image:width", String(seo.socialImageWidth));
    if (seo.socialImageHeight) html = setMeta(html, "property", "og:image:height", String(seo.socialImageHeight));
    html = setMeta(html, "name", "twitter:title", title);
    html = setMeta(html, "name", "twitter:description", description);
    html = setMeta(html, "name", "twitter:url", pageUrl);
    html = setMeta(html, "name", "twitter:image", image);
    html = setMeta(html, "name", "twitter:image:alt", imageAlt);
    html = html.replace(
      /<link rel="canonical" href="[^"]*" \/>/i,
      `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`,
    );
  }

  response.setHeader("Content-Type", "text/html; charset=utf-8");
  // Short edge cache so a settings save shows up quickly without hitting
  // Supabase on every single page view.
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  return response.status(200).send(html);
}

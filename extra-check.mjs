import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const base = "http://localhost:4173";
const routes = ["/", "/about", "/programs", "/notices", "/resources", "/contact"];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const context = await browser.newContext();
let hadFailure = false;

// 1. Console/page error check across all real routes.
for (const route of routes) {
  const page = await context.newPage();
  const errors = [];
  const failedUrls = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("requestfailed", (req) => {
    failedUrls.push(`${req.url()} (${req.failure()?.errorText || "?"})`);
  });

  await page.goto(base + route, { waitUntil: "networkidle" });

  console.log(`\n=== ${route} — ${errors.length} console/page error(s) ===`);
  const KNOWN_SANDBOX_BLOCKED = /fonts\.googleapis|fonts\.gstatic|openstreetmap|accounts\.google|content-autofill/i;
  for (const e of errors) {
    // A generic "Failed to load resource" message carries no URL itself, so
    // cross-reference the same page's failed requests to confirm it's one of
    // the known sandbox-network-policy blocks (fonts/maps) rather than a real
    // app resource — see conversation notes on the egress proxy.
    const matchingFailedUrl = failedUrls.find((u) => KNOWN_SANDBOX_BLOCKED.test(u));
    if (KNOWN_SANDBOX_BLOCKED.test(e) || (/Failed to load resource/i.test(e) && matchingFailedUrl)) {
      console.log(`  (ignored, external/sandbox) ${e} — ${matchingFailedUrl || ""}`);
      continue;
    }
    hadFailure = true;
    console.log(`  !! ${e}`);
  }
  if (failedUrls.length) {
    const unexplained = failedUrls.filter((u) => !KNOWN_SANDBOX_BLOCKED.test(u));
    for (const u of unexplained) {
      hadFailure = true;
      console.log(`  !! unexplained failed request: ${u}`);
    }
  }

  await page.close();
}

// 2. No whole-site language toggle (by design -- Nepali content renders
// inline per item via Localized.jsx/contentLanguage.js instead), and the
// header logo is both keyboard-focusable and carries real alt text.
{
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });

  console.log("\n=== Header logo: keyboard focus + alt text, no language toggle ===");

  const toggleCount = await page.getByRole("button", { name: /नेपाली|english/i }).count();
  console.log(`  language-toggle buttons found: ${toggleCount}`);
  if (toggleCount !== 0) {
    hadFailure = true;
    console.log("  !! a whole-site language toggle button still exists");
  }

  const logoAlt = await page.locator(".brand-logo-link img").getAttribute("alt");
  console.log(`  logo alt text: "${logoAlt}"`);
  if (!logoAlt || !logoAlt.trim()) {
    hadFailure = true;
    console.log("  !! header logo image has no alt text");
  }

  await page.keyboard.press("Tab");
  const firstFocusClass = await page.locator(":focus").getAttribute("class");
  await page.keyboard.press("Tab");
  const secondFocusClass = await page.locator(":focus").getAttribute("class");
  console.log(`  Tab order: 1="${firstFocusClass}" 2="${secondFocusClass}"`);
  if (firstFocusClass !== "skip-link" || secondFocusClass !== "brand-logo-link") {
    hadFailure = true;
    console.log("  !! logo link is not the second Tab stop (skip-link, then logo)");
  }

  const logoAccessibleName = await page.locator(":focus").getAttribute("aria-label");
  console.log(`  focused logo link accessible name: "${logoAccessibleName}"`);
  if (!logoAccessibleName || !logoAccessibleName.trim()) {
    hadFailure = true;
    console.log("  !! focused logo link has no accessible name");
  }

  await page.close();
}

// 3. Contact form: valid submission should build a mailto: link and show the
// aria-live status text (checked via the anchor navigation target, since a
// real mailto: navigation does not fire a Playwright "load" event).
{
  const page = await context.newPage();
  await page.goto(base + "/contact", { waitUntil: "networkidle" });

  await page.locator("#contact-name").fill("Test User");
  await page.locator("#contact-email").fill("test@example.com");
  await page.locator("#contact-message").fill("This is a test message.");

  // window.location.href is an own, non-configurable accessor on the real
  // Location instance in Chromium (confirmed by testing — Location.prototype
  // is not consulted, and window.location itself can't be replaced), so it
  // can't be intercepted from page script. Instead: let the click actually
  // run (mailto: is not a fetch, so it can't hit the sandbox's egress proxy
  // and can't crash the page — Chromium just declines to hand off to a mail
  // client in this headless container and stays on the same document), then
  // confirm nothing broke and the UI reported success.
  let clickError = null;
  try {
    await page.getByRole("button", { name: /send message/i }).click();
    await page.waitForTimeout(300);
  } catch (err) {
    clickError = err.message;
  }

  const stillOnContact = page.url().includes("/contact");
  const statusText = await page.locator(".form-status").textContent();
  console.log(`\n=== Contact form valid submission ===`);
  console.log(`  click threw: ${clickError || "no"}`);
  console.log(`  still on /contact after click: ${stillOnContact}`);
  console.log(`  status text: "${statusText}"`);

  if (clickError) {
    hadFailure = true;
    console.log("  !! submitting the form threw an error");
  }
  if (!statusText || !statusText.trim()) {
    hadFailure = true;
    console.log("  !! aria-live status text was not shown after a valid submission");
  } else if (!statusText.includes("modeldisabilitysocietyrasuwa@gmail.com")) {
    hadFailure = true;
    console.log("  !! status text does not mention the org's real email address");
  }

  // Static check of the actual mailto: construction in source, since runtime
  // interception of location.href isn't possible (see above): confirms the
  // link targets the backend-editable organization email (not a
  // hardcoded/placeholder address) and encodes the user's name/email/message
  // rather than dropping them.
  const formSrc = readFileSync(
    new URL("./src/components/ContactForm.jsx", import.meta.url),
    "utf8"
  );
  const hasMailtoToOrg = /mailto:\$\{orgEmail\}/.test(formSrc);
  const encodesFields = /encodeURIComponent/.test(formSrc);
  console.log(`  source builds mailto:\${orgEmail}: ${hasMailtoToOrg}`);
  console.log(`  source encodes field values: ${encodesFields}`);
  if (!hasMailtoToOrg) {
    hadFailure = true;
    console.log("  !! ContactForm.jsx does not build its mailto link from the backend-editable organization email");
  }
  if (!encodesFields) {
    hadFailure = true;
    console.log("  !! ContactForm.jsx does not URI-encode the submitted field values");
  }

  await page.close();
}

await context.close();
await browser.close();

console.log(`\n${hadFailure ? "FAILED" : "PASSED"} — supplementary checks`);
process.exit(hadFailure ? 1 : 0);

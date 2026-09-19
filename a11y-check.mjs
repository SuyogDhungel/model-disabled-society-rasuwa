import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/about",
  "/programs",
  "/notices",
  "/resources",
  "/contact",
  "/accessibility",
  "/privacy",
  "/safeguarding",
  "/no-such-page",
];
const base = "http://localhost:4173";

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const context = await browser.newContext();
let totalViolations = 0;
let hadFailure = false;

for (const route of routes) {
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();

  console.log(`\n=== ${route} — ${results.violations.length} violation(s) ===`);
  for (const v of results.violations) {
    hadFailure = true;
    totalViolations += v.nodes.length;
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    for (const n of v.nodes.slice(0, 3)) {
      console.log(`      target: ${n.target.join(" ")}`);
    }
  }

  // Manual structural checks beyond axe's own ruleset.
  const h1Count = await page.locator("h1").count();
  const mainCount = await page.locator("main").count();
  const skipLinkHref = await page.locator(".skip-link").getAttribute("href").catch(() => null);
  console.log(`  h1 count: ${h1Count}, main landmark count: ${mainCount}, skip link href: ${skipLinkHref}`);

  if (route !== "/no-such-page" && h1Count !== 1) {
    hadFailure = true;
    console.log(`  !! expected exactly one <h1> on ${route}, found ${h1Count}`);
  }
  if (mainCount !== 1) {
    hadFailure = true;
    console.log(`  !! expected exactly one <main> landmark on ${route}, found ${mainCount}`);
  }

  await page.close();
}

// Keyboard check: skip link should be the first focusable element and should
// move focus to #main-content when activated.
{
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement.className);
  console.log(`\n=== Keyboard: first Tab stop class = "${focused}" ===`);
  if (!focused.includes("skip-link")) {
    hadFailure = true;
    console.log("  !! first Tab stop is not the skip link");
  }
  await page.keyboard.press("Enter");
  const activeId = await page.evaluate(() => document.activeElement.id);
  console.log(`  after activating skip link, focused element id = "${activeId}"`);
  if (activeId !== "main-content") {
    hadFailure = true;
    console.log("  !! skip link did not move focus to #main-content");
  }

  // Mobile nav toggle: closed panel must not be keyboard-reachable, and
  // opening it must expose aria-expanded=true plus reachable links.
  await page.setViewportSize({ width: 375, height: 800 });
  await page.reload({ waitUntil: "networkidle" });
  const navVisibleWhenClosed = await page.locator("#primary-nav-panel a").first().isVisible();
  console.log(`  mobile nav link visible before opening: ${navVisibleWhenClosed}`);
  if (navVisibleWhenClosed) {
    hadFailure = true;
    console.log("  !! mobile nav links visible/reachable while menu is closed");
  }
  const toggle = page.locator(".nav-toggle");
  await toggle.focus();
  await page.keyboard.press("Enter");
  const expanded = await toggle.getAttribute("aria-expanded");
  const navVisibleWhenOpen = await page.locator("#primary-nav-panel a").first().isVisible();
  console.log(`  aria-expanded after opening: ${expanded}, nav link visible: ${navVisibleWhenOpen}`);
  if (expanded !== "true" || !navVisibleWhenOpen) {
    hadFailure = true;
    console.log("  !! mobile nav toggle did not correctly open the panel");
  }
  await page.keyboard.press("Escape");
  const stillFocusedOnToggle = await page.evaluate(
    () => document.activeElement.className.includes("nav-toggle")
  );
  console.log(`  focus returned to toggle after Escape: ${stillFocusedOnToggle}`);
  if (!stillFocusedOnToggle) {
    hadFailure = true;
    console.log("  !! Escape did not return focus to the nav toggle");
  }

  await page.close();
}

// Contact form: label association + validation focus behaviour.
{
  const page = await context.newPage();
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  const nameLabelFor = await page.locator('label[for="contact-name"]').count();
  const emailLabelFor = await page.locator('label[for="contact-email"]').count();
  const messageLabelFor = await page.locator('label[for="contact-message"]').count();
  console.log(`\n=== Contact form label checks: name=${nameLabelFor} email=${emailLabelFor} message=${messageLabelFor} ===`);
  if (!nameLabelFor || !emailLabelFor || !messageLabelFor) {
    hadFailure = true;
    console.log("  !! a contact form field is missing its label association");
  }

  await page.getByRole("button", { name: /send message/i }).click();
  const focusedAfterInvalidSubmit = await page.evaluate(() => document.activeElement.id);
  console.log(`  focus after submitting empty form: "${focusedAfterInvalidSubmit}"`);
  if (focusedAfterInvalidSubmit !== "contact-name") {
    hadFailure = true;
    console.log("  !! focus did not move to the first invalid field");
  }
  await page.close();
}

await context.close();
await browser.close();

console.log(`\n${hadFailure ? "FAILED" : "PASSED"} — total axe violation instances: ${totalViolations}`);
process.exit(hadFailure ? 1 : 0);

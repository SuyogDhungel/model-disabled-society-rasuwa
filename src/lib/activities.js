// Shared helpers for the "Activities" section (news-style posts about
// completed trainings, events and programmes, each with 1-6 photos).
//
// Dates are stored as plain "YYYY-MM-DD" strings in the A.D. (Gregorian)
// calendar. They are parsed by hand rather than with new Date("YYYY-MM-DD"),
// because that form is read as UTC midnight and can show as the previous
// day for visitors in time zones west of UTC.
import { defaultActivities } from "../data/activities.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parts(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, mo, d };
}

export function isValidIsoDate(iso) {
  return Boolean(parts(iso));
}

// "8 July 2026"
export function formatDate(iso) {
  const p = parts(iso);
  return p ? `${p.d} ${MONTHS[p.mo - 1]} ${p.y}` : "";
}

// "15 May – 14 June 2026", "11–25 April 2026", "3 December 2025",
// "28 December 2025 – 4 January 2026"
export function formatDateRange(start, end) {
  const a = parts(start);
  const b = parts(end);
  if (!a) return "";
  if (!b || end <= start) return formatDate(start);
  if (a.y !== b.y) return `${formatDate(start)} – ${formatDate(end)}`;
  if (a.mo !== b.mo) return `${a.d} ${MONTHS[a.mo - 1]} – ${b.d} ${MONTHS[b.mo - 1]} ${b.y}`;
  return `${a.d}–${b.d} ${MONTHS[b.mo - 1]} ${b.y}`;
}

// Machine-readable value for <time dateTime>.
export function isoForTime(iso) {
  return parts(iso) ? iso : undefined;
}

// Today's date in the visitor's/editor's own time zone, as YYYY-MM-DD.
export function todayIso() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Newest first, by the day the activity finished (or its single date).
export function sortActivities(list) {
  return [...list].sort((x, y) => {
    const ax = x.endDate && x.endDate > x.date ? x.endDate : x.date || "";
    const ay = y.endDate && y.endDate > y.date ? y.endDate : y.date || "";
    return ay.localeCompare(ax);
  });
}

export function slugify(text) {
  return (
    String(text || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70)
      .replace(/-+$/g, "") || "activity"
  );
}

// Unique slug among existing activities (ignoring the item being edited).
export function uniqueSlug(base, list, ownId) {
  const taken = new Set(list.filter((a) => a.id !== ownId).map((a) => a.slug));
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

// The content object only gains an "activities" key once the database has
// been updated (supabase/activities-migration.sql) or an admin saves an
// activity for the first time. Until then, fall back to the bundled
// starting activities so the section is never empty.
export function activitiesFrom(content) {
  return Array.isArray(content?.activities) ? content.activities : defaultActivities;
}

export function publishedActivities(content) {
  return sortActivities(activitiesFrom(content).filter((a) => a.published !== false));
}

export function photoAlt(photo) {
  return (photo?.altEn || photo?.altNe || "").trim();
}

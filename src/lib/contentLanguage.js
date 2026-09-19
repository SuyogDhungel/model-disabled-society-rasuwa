// Per-item bilingual helpers.
//
// This replaces a whole-site language toggle: instead of one button that
// switches every string on the page, each content item (a program, a
// committee member, a notice, a report) carries its own contentLanguage
// ("en" | "ne" | "bilingual") and is rendered with the right text and the
// right <span lang="..."> automatically. See Localized.jsx, which uses
// these functions to render one field of one item.
export function languageOf(item, preferred = "en") {
  if (item?.contentLanguage === "ne") return "ne";
  if (item?.contentLanguage === "en") return "en";
  return preferred;
}

// Given an item and a field base name (e.g. "title"), work out which
// language suffix ("En" or "Ne") actually has content, falling back to
// whichever language the item does have if the preferred one is empty.
export function itemLang(item, field, preferred = "en") {
  const wanted = languageOf(item, preferred);
  if (item?.[field + (wanted === "ne" ? "Ne" : "En")]) return wanted;
  return wanted === "ne" ? "en" : "ne";
}

export function localized(item, field, preferred = "en") {
  const lang = itemLang(item, field, preferred);
  return item?.[field + (lang === "ne" ? "Ne" : "En")] || item?.[field] || "";
}

// Detects actual Nepali (Devanagari) text so the rendered lang attribute is
// always correct even if an item's contentLanguage metadata is wrong or
// missing -- screen readers mispronounce text tagged with the wrong lang.
export function isNepaliText(text) {
  return typeof text === "string" && /[ऀ-ॿ]/.test(text);
}

export function newId(prefix = "item") {
  return prefix + "-" + crypto.randomUUID();
}

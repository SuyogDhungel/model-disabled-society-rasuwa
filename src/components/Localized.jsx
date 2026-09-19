import { localized, itemLang, isNepaliText } from "../lib/contentLanguage.js";

// Renders one bilingual field of one content item (a program, a committee
// member, a notice, a report) with the correct text and the correct
// lang="en"/"ne" attribute -- no site-wide language toggle involved. See
// contentLanguage.js for the selection/fallback logic.
export default function Localized({ item, field, lang, as: Tag = "span", ...props }) {
  const text = localized(item, field, lang);
  const detectedLang = isNepaliText(text) ? "ne" : itemLang(item, field, lang);
  return (
    <Tag lang={detectedLang} {...props}>
      {text}
    </Tag>
  );
}

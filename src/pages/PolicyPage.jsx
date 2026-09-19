import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

const TITLES = {
  accessibility: { en: "Accessibility statement", ne: "पहुँचयोग्यता विवरण" },
  privacy: { en: "Privacy notice", ne: "गोपनीयता सूचना" },
  safeguarding: { en: "Safeguarding & feedback", ne: "सुरक्षा तथा गुनासो" },
};

// Shared component for the three fixed policy pages -- backend-editable
// text at /admin/settings, so the organization can keep this accurate
// without needing a code change.
export default function PolicyPage({ type }) {
  const { lang } = useLanguage();
  const { content } = useSiteContent();
  const title = TITLES[type]?.[lang] || TITLES[type]?.en || "Policy";
  const bodyEn = content.policies?.[type + "En"] || "";
  const bodyNe = content.policies?.[type + "Ne"] || "";
  const body = lang === "ne" ? bodyNe || bodyEn : bodyEn || bodyNe;

  usePageTitle(title);

  return (
    <div className="container page">
      <h1>{title}</h1>
      <p className="lede preserve-lines">{body}</p>
    </div>
  );
}

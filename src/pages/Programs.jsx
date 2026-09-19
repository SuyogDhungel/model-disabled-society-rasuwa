import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import Localized from "../components/Localized.jsx";

export default function Programs() {
  const { t, lang } = useLanguage();
  const { programs } = t;
  const { content } = useSiteContent();

  usePageTitle(programs.pageTitle);

  const items = [...content.programs]
    .filter((p) => p.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="container page">
      <h1>{programs.pageTitle}</h1>
      <p className="lede">{programs.intro}</p>

      <div className="card-grid">
        {items.map((area) => (
          <article className="card" key={area.id}>
            {area.imageUrl ? (
              <img
                className="card-image"
                src={area.imageUrl}
                alt={
                  (lang === "ne" && area.imageAltNe) ||
                  area.imageAltEn ||
                  area.imageAltNe ||
                  ""
                }
              />
            ) : null}
            <h2>
              <Localized item={area} field="title" lang={lang} as="span" />
            </h2>
            <p>
              <Localized item={area} field="body" lang={lang} as="span" />
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

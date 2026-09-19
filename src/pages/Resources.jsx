import { useLanguage } from "../context/LanguageContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { useResources } from "../hooks/useResources.js";
import Localized from "../components/Localized.jsx";

export default function Resources() {
  const { t, lang } = useLanguage();
  const { resources: resourcesText } = t;
  const { resources, loading, error } = useResources();

  usePageTitle(resourcesText.pageTitle);

  return (
    <div className="container page">
      <h1>{resourcesText.pageTitle}</h1>
      <p className="lede">{resourcesText.intro}</p>

      {loading ? <p>{lang === "ne" ? "लोड हुँदैछ…" : "Loading…"}</p> : null}
      {error ? (
        <p className="field-error" role="alert">
          {lang === "ne"
            ? "स्रोतहरू लोड गर्न सकिएन। पछि फेरि प्रयास गर्नुहोस्।"
            : "Couldn't load resources right now — please try again shortly."}
        </p>
      ) : null}

      {!loading && !error && resources.length === 0 ? (
        <p>{resourcesText.empty}</p>
      ) : !loading && !error ? (
        <ul className="resource-list">
          {resources.map((resource) => (
            <li key={resource.id}>
              <h2>
                <Localized item={resource} field="title" lang={lang} as="span" />
              </h2>
              <p className="meta">
                <Localized item={resource} field="type" lang={lang} as="span" />
                {resource.year ? ` · ${resource.year}` : ""}
              </p>
              {resource.imageUrl ? (
                <img
                  className="card-image"
                  src={resource.imageUrl}
                  alt={
                    (lang === "ne" && resource.imageAltNe) ||
                    resource.imageAltEn ||
                    resource.imageAltNe ||
                    ""
                  }
                />
              ) : null}
              {resource.descriptionEn || resource.descriptionNe ? (
                <p>
                  <Localized item={resource} field="description" lang={lang} as="span" />
                </p>
              ) : null}
              {resource.attachments?.length ? (
                <ul className="attachment-list">
                  {resource.attachments.map((file) => (
                    <li key={file.id}>
                      <a href={file.url}>
                        {file.label} ({file.format?.toUpperCase()})
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

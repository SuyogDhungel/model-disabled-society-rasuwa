import { useLanguage } from "../context/LanguageContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { useNotices } from "../hooks/useNotices.js";
import Localized from "../components/Localized.jsx";

export default function Notices() {
  const { t, lang } = useLanguage();
  const { notices: noticesText } = t;
  const { notices, loading, error } = useNotices();

  usePageTitle(noticesText.pageTitle);

  return (
    <div className="container page">
      <h1>{noticesText.pageTitle}</h1>
      <p className="lede">{noticesText.intro}</p>

      {loading ? <p>{lang === "ne" ? "लोड हुँदैछ…" : "Loading…"}</p> : null}
      {error ? (
        <p className="field-error" role="alert">
          {lang === "ne"
            ? "सूचनाहरू लोड गर्न सकिएन। पछि फेरि प्रयास गर्नुहोस्।"
            : "Couldn't load notices right now — please try again shortly."}
        </p>
      ) : null}

      {!loading && !error && notices.length === 0 ? (
        <p>{noticesText.empty}</p>
      ) : !loading && !error ? (
        <ul className="notice-list">
          {notices.map((notice) => (
            <li key={notice.id}>
              <article>
                <h2>
                  <Localized item={notice} field="title" lang={lang} as="span" />
                </h2>
                <p className="meta">{notice.date}</p>
                {notice.imageUrl ? (
                  <img
                    className="card-image"
                    src={notice.imageUrl}
                    alt={
                      (lang === "ne" && notice.imageAltNe) ||
                      notice.imageAltEn ||
                      notice.imageAltNe ||
                      ""
                    }
                  />
                ) : null}
                <p className="preserve-lines">
                  <Localized item={notice} field="body" lang={lang} as="span" />
                </p>
                {notice.attachments?.length ? (
                  <ul className="attachment-list">
                    {notice.attachments.map((file) => (
                      <li key={file.id}>
                        <a href={file.url}>
                          {file.label} ({file.format?.toUpperCase()})
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

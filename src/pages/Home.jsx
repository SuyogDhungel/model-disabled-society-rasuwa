import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { useNotices } from "../hooks/useNotices.js";
import Localized from "../components/Localized.jsx";
import orgLogo from "../assets/org-logo.png";

export default function Home() {
  const { t, lang } = useLanguage();
  const { home } = t;
  const { content } = useSiteContent();
  const org = content.organization;
  const { notices, loading: noticesLoading } = useNotices();
  const latestNotices = notices.slice(0, 3);

  usePageTitle(null);

  // No hero image set yet? Fall back to the organization logo, then to the
  // bundled asset -- so changing the logo in /admin/settings updates the
  // hero too, and the hero section is never blank while a real photograph
  // is still being collected.
  const heroImageUrl = content.appearance.heroImageUrl || org.logoUrl || orgLogo;
  const heroImageAlt = content.appearance.heroImageUrl
    ? (lang === "ne" && content.appearance.heroImageAltNe) ||
      content.appearance.heroImageAltEn ||
      content.appearance.heroImageAltNe ||
      `${org.nameEn || org.shortNameEn} hero image`
    : org.logoAlt || `${org.nameEn || org.shortNameEn} logo`;

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <Localized item={content.home} field="eyebrow" lang={lang} as="span" />
            </p>
            <h1>
              <Localized item={content.home} field="title" lang={lang} as="span" />
            </h1>
            <p className="hero-subtitle">
              <Localized item={content.home} field="subtitle" lang={lang} as="span" />
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/about">
                {home.ctaPrimary}
              </Link>
              <Link className="btn btn-secondary" to="/contact">
                {home.ctaSecondary}
              </Link>
            </div>
          </div>
          <div
            className={"hero-media" + (!content.appearance.heroImageUrl ? " hero-logo" : "")}
          >
            {/* Real <img> with a real alt attribute -- not a CSS background-image,
                which is what made hero photography invisible to screen readers
                on 7 of the 9 audited sites (CWIN, Consortium, Peace, Sabal, etc). */}
            <img src={heroImageUrl} alt={heroImageAlt} width="800" height="500" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{home.introHeading}</h2>
          <p className="lede preserve-lines">
            <Localized item={content.home} field="intro" lang={lang} as="span" />
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>{home.focusHeading}</h2>
          <p className="lede">{home.focusIntro}</p>
          <div className="card-grid">
            {content.programs
              .filter((p) => p.published)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .slice(0, 3)
              .map((area) => (
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
                  <h3>
                    <Localized item={area} field="title" lang={lang} as="span" />
                  </h3>
                  <p>
                    <Localized item={area} field="body" lang={lang} as="span" />
                  </p>
                </article>
              ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{home.noticesHeading}</h2>
          {noticesLoading ? null : latestNotices.length === 0 ? (
            <p>{home.noticesEmpty}</p>
          ) : (
            <ul className="notice-list">
              {latestNotices.map((notice) => (
                <li key={notice.id}>
                  <article>
                    <h3>
                      <Localized item={notice} field="title" lang={lang} as="span" />
                    </h3>
                    <p className="meta">{notice.date}</p>
                  </article>
                </li>
              ))}
            </ul>
          )}
          <Link className="btn btn-secondary" to="/notices">
            {home.viewAllNotices}
          </Link>
        </div>
      </section>
    </>
  );
}

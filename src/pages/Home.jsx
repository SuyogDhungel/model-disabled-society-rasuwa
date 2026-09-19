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
            <div className="hero-badge-wrap">
              <span className="eyebrow">
                Naukunda-3, Parchyang • Rasuwa District, Nepal
              </span>
            </div>
            <h1>
              Empowering Persons with Disabilities in Rasuwa
            </h1>
            <p className="hero-subtitle">
              A dedicated grassroots organization advocating for the dignity, equal rights, barrier-free accessibility, and active social inclusion of persons with disabilities.
            </p>
          </div>
          <div
            className={"hero-media" + (!content.appearance.heroImageUrl ? " hero-logo" : "")}
          >
            {/* Real <img> with a real alt attribute */}
            <img src={heroImageUrl} alt={heroImageAlt} width="800" height="500" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>About the Organization</h2>
          <div className="intro-badge-row">
            <span className="info-badge"><strong>Regd. No:</strong> {org.registrationNo || "523/2081-82"} (DAO Rasuwa)</span>
            <span className="info-badge"><strong>SWC Affiliation:</strong> {org.affiliationNo ? org.affiliationNo.split(" ")[0] : "58380"}</span>
            <span className="info-badge"><strong>Location:</strong> Naukunda-3, Parchyang, Rasuwa</span>
          </div>
          <p className="lede preserve-lines">
            Model Disabled Society Rasuwa is a non-profit community organization legally registered with the District Administration Office (DAO), Rasuwa and affiliated with the Social Welfare Council (SWC). Headquartered in Naukunda Rural Municipality – 3, Parchyang, we work collaboratively with persons with disabilities, their families, local governments, and civil society partners to provide assistive referrals, champion disability rights, and build self-reliant, inclusive communities across Rasuwa District.
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

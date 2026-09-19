import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import ContactForm from "../components/ContactForm.jsx";

export default function Contact() {
  const { t } = useLanguage();
  const { contact } = t;
  const { content } = useSiteContent();
  const org = content.organization;

  usePageTitle(contact.pageTitle);

  return (
    <div className="container page">
      <h1>{contact.pageTitle}</h1>
      <p className="lede">{contact.intro}</p>

      <div className="contact-grid">
        <div>
          <h2>{contact.addressHeading}</h2>
          <p>
            <span lang="ne">{org.wardNe}</span>
            <br />
            <span lang="ne">{org.districtNe}</span>, {org.provinceEn}
          </p>
          <p>
            <a href={`tel:+977${org.phone}`}>{org.phone}</a>
            <br />
            <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>

          {/* Descriptive iframe title — every one of the nine audits flagged an
              embedded map or video with no title, so a screen reader announced
              only "frame". This is an approximate district-level view, not a
              precise pin on the office building; replace with real
              coordinates once confirmed. */}
          <iframe
            title={contact.mapTitle}
            className="map-frame"
            src="https://www.openstreetmap.org/export/embed.html?bbox=85.05%2C27.98%2C85.55%2C28.35&layer=mapnik&marker=28.1167%2C85.3167"
            loading="lazy"
          />
          <p className="map-caption">
            {t.lang === "ne"
              ? "कार्यालय क्षेत्र — नौकुण्ड गाउँपालिका, रसुवा जिल्ला"
              : "Office location — Naukunda Rural Municipality, Rasuwa District"}
          </p>
        </div>

        <div>
          <h2>{contact.formHeading}</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

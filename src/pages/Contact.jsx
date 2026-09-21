import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import ContactForm from "../components/ContactForm.jsx";
import SocialIcons from "../components/SocialIcons.jsx";

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
            {org.wardEn || "Naukunda Rural Municipality – 3, Parchyang"}
            <br />
            {org.districtEn || "Rasuwa District"}, {org.provinceEn || "Bagmati Province, Nepal"}
          </p>
          <p>
            <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>
          <div style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
            <SocialIcons org={org} className="contact-socials" />
          </div>

          <iframe
            title={contact.mapTitle || "Map of Rasuwa District"}
            className="map-frame"
            src="https://www.openstreetmap.org/export/embed.html?bbox=85.05%2C27.98%2C85.55%2C28.35&layer=mapnik&marker=28.1167%2C85.3167"
            loading="lazy"
          />
          <p className="map-caption">
            Office location — Naukunda Rural Municipality, Rasuwa District
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

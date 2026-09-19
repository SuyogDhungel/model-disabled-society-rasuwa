import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

export default function Footer() {
  const { t } = useLanguage();
  const { content } = useSiteContent();
  const org = content.organization;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div>
          <p className="footer-org-name" lang="ne">
            {org.nameNe}
          </p>
          <p>{org.shortNameEn}</p>
          <div className="footer-reg-info">
            <p className="footer-reg-item">
              <span className="footer-reg-label">
                {t.lang === "ne" ? "दर्ता नं." : "Regd. No."}:
              </span>{" "}
              <strong>{org.registrationNo}</strong>{" "}
              <span className="footer-reg-office">
                ({t.lang === "ne" ? "जि.प्र.का. रसुवा" : "DAO Rasuwa"})
              </span>
            </p>
            <p className="footer-reg-item">
              <span className="footer-reg-label">
                {t.lang === "ne" ? "स.क.प. आबद्धता" : "SWC Affiliation"}:
              </span>{" "}
              <strong>{org.affiliationNo.split(" ")[0]}</strong>
            </p>
          </div>
        </div>

        <nav aria-label="Footer">
          <h2>{t.footer.quickLinks}</h2>
          <ul>
            <li>
              <Link to="/about">{t.nav.about}</Link>
            </li>
            <li>
              <Link to="/programs">{t.nav.programs}</Link>
            </li>
            <li>
              <Link to="/notices">{t.nav.notices}</Link>
            </li>
            <li>
              <Link to="/resources">{t.nav.resources}</Link>
            </li>
            <li>
              <Link to="/accessibility">
                {t.lang === "ne" ? "पहुँचयोग्यता" : "Accessibility"}
              </Link>
            </li>
            <li>
              <Link to="/privacy">{t.lang === "ne" ? "गोपनीयता" : "Privacy"}</Link>
            </li>
            <li>
              <Link to="/safeguarding">
                {t.lang === "ne" ? "सुरक्षा तथा गुनासो" : "Safeguarding & feedback"}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2>{t.footer.contactHeading}</h2>
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
          {org.facebook ? (
            <p>
              <a href={org.facebook}>{org.shortNameEn} on Facebook</a>
            </p>
          ) : null}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {year} {org.shortNameEn}. {t.footer.rights}
        </p>
        {/*
          Per explicit client instruction: only the name "Suyog Dhungel" is a
          hyperlink here (to his personal site) — the surrounding credit text
          is plain, unlinked text either side of it.
        */}
        <p className="footer-credit">
          {t.footer.developedBy}{" "}
          <a
            href="https://www.suyogdhungel.com.np/"
            target="_blank"
            rel="noopener noreferrer"
            lang="en"
          >
            Suyog Dhungel
          </a>
        </p>
      </div>
    </footer>
  );
}

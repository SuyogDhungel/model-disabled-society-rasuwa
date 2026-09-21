import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

import SocialIcons from "./SocialIcons.jsx";

export default function Footer() {
  const { t } = useLanguage();
  const { content } = useSiteContent();
  const org = content.organization;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div>
          <h3 className="footer-org-name">{org.shortNameEn || org.nameEn || "Model Disabled Society Rasuwa"}</h3>
          <p className="footer-tagline">{org.wardEn || "Naukunda-3, Rasuwa, Bagmati Province, Nepal"}</p>
          <div className="footer-reg-info">
            <p className="footer-reg-item">
              <span className="footer-reg-label">Registration No:</span>{" "}
              <strong>{org.registrationNo}</strong>{" "}
              <span className="footer-reg-office">(DAO Rasuwa)</span>
            </p>
            <p className="footer-reg-item">
              <span className="footer-reg-label">SWC Affiliation:</span>{" "}
              <strong>{org.affiliationNo.split(" ")[0]}</strong>
            </p>
          </div>
        </div>

        <nav aria-label="Footer">
          <h2>Quick Links</h2>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/programs">Programs</Link>
            </li>
            <li>
              <Link to="/notices">Notices</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
            <li>
              <Link to="/accessibility">Accessibility</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/safeguarding">Safeguarding & Feedback</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2>Contact</h2>
          <p>
            {org.wardEn || "Naukunda Rural Municipality – 3, Parchyang"}
            <br />
            {org.districtEn || "Rasuwa District"}, {org.provinceEn || "Bagmati Province, Nepal"}
          </p>
          <p>
            <a href={`mailto:${org.email}`}>{org.email}</a>
          </p>
          <SocialIcons org={org} className="footer-socials" />
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {year} {org.shortNameEn || "Model Disabled Society Rasuwa"}. All rights reserved.
        </p>
        <p className="footer-credit">
          Developed and maintained by:{" "}
          <a
            href="https://www.suyogdhungel.com.np/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suyog Dhungel
          </a>
        </p>
      </div>
    </footer>
  );
}

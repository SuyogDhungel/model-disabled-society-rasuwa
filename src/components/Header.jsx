import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import orgLogo from "../assets/org-logo.png";

/**
 * Deliberately NOT a hover-dependent dropdown menu — that single pattern
 * (parent item opens only on mouse hover, with no keyboard equivalent) is
 * the single most repeated Critical finding across the nine audited NGO
 * sites (CWIN, Peace Nepal, CCR Karnali, Consortium Nepal, YAE, Sabal all
 * failed on it). With only six destinations, a flat, always-real-link nav
 * that collapses into a keyboard- and screen-reader-correct disclosure panel
 * on narrow screens avoids the whole failure class instead of patching it.
 *
 * The logo is its own real <a href="/"> (not a decorative image inside a
 * bigger link) with a real, non-empty alt/aria-label, and it is sourced
 * from the backend-editable content object (falling back to the bundled
 * asset) rather than a hardcoded import -- change the logo once in
 * /admin/settings and it updates here, in the browser tab's social preview,
 * and in the homepage hero, all from the same value.
 */
export default function Header() {
  const { t, lang, setLang, otherLang } = useLanguage();
  const { content } = useSiteContent();
  const org = content.organization;
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelId = "primary-nav-panel";
  const logoAlt =
    org.logoAlt || `${org.nameEn || org.shortNameEn || "Model Disabled Society Rasuwa"} logo`;

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About Us" },
    { to: "/programs", label: "Programs" },
    { to: "/notices", label: "Notices" },
    { to: "/resources", label: "Resources" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="site-header">
      <div className="container site-header-bar">
        <div className="brand">
          <a
            className="brand-logo-link"
            href="/"
            aria-label={logoAlt}
            title={logoAlt}
          >
            <span className="brand-mark">
              <img src={org.logoUrl || orgLogo} alt={logoAlt} width="40" height="40" />
            </span>
          </a>
          <a className="brand-text-link" href="/">
            <span className="brand-text">
              <span className="brand-title">{org.shortNameEn || org.nameEn || "Model Disabled Society Rasuwa"}</span>
              <span className="brand-sub">Naukunda, Rasuwa, Nepal</span>
            </span>
          </a>
        </div>

        <div className="site-header-controls">
          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((v) => !v)}
          >
            <span className="visually-hidden">
              {isOpen ? "Close main menu" : "Open main menu"}
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              {isOpen ? (
                <path
                  d="M5 5l14 14M19 5L5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        <nav
          id={panelId}
          className={"primary-nav" + (isOpen ? " is-open" : "")}
          aria-label="Primary"
        >
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => (isActive ? "is-active" : undefined)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

import { useState } from "react";
import { useAdminContent } from "../../hooks/useAdminContent.js";
import { uploadFile } from "../../lib/uploadFile.js";
import defaultLogo from "../../assets/org-logo.png";
import { SOCIAL_PLATFORMS, getPlatformIcon } from "../../components/SocialIcons.jsx";

function Group({ title, children }) {
  return (
    <fieldset className="admin-fieldset">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

export default function AdminSettings() {
  const { content, setContent, loading, loadError, saving, status, save } = useAdminContent();
  const [formError, setFormError] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [socialUploading, setSocialUploading] = useState(false);
  const [newPlatform, setNewPlatform] = useState("facebook");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  const update = (section, key, value) =>
    setContent((c) => ({ ...c, [section]: { ...c[section], [key]: value } }));

  const listValue = (key) => (content.about[key] || []).join("\n");
  const setList = (key, value) =>
    update(
      "about",
      key,
      value.split("\n").map((line) => line.trim()).filter(Boolean),
    );

  async function handleUpload(file, setUploading, onUploaded) {
    setUploading(true);
    setFormError("");
    try {
      const url = await uploadFile("site-images", file);
      onUploaded(url);
    } catch (err) {
      setFormError("Couldn't upload the image: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  function addSocialProfile() {
    if (!newSocialUrl.trim()) return;
    const currentList = Array.isArray(org.socials)
      ? [...org.socials]
      : org.facebook
      ? [{ id: "fb-default", platform: "facebook", url: org.facebook }]
      : [];
    const updated = [
      ...currentList,
      { id: "soc-" + Date.now(), platform: newPlatform, url: newSocialUrl.trim() },
    ];
    update("organization", "socials", updated);
    if (newPlatform === "facebook") {
      update("organization", "facebook", newSocialUrl.trim());
    }
    setNewSocialUrl("");
  }

  function removeSocialProfile(id) {
    const currentList = Array.isArray(org.socials)
      ? [...org.socials]
      : org.facebook
      ? [{ id: "fb-default", platform: "facebook", url: org.facebook }]
      : [];
    const updated = currentList.filter((s) => s.id !== id);
    update("organization", "socials", updated);
    const fb = updated.find((s) => s.platform === "facebook");
    update("organization", "facebook", fb ? fb.url : "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    // Fast, friendly checks up front -- the database trigger enforces the
    // same rules and is the real authority, but this saves a round trip.
    if (content.organization.logoUrl && !content.organization.logoAlt?.trim()) {
      setFormError("Add alternative text for the logo before saving — it's mandatory whenever a logo image is set.");
      return;
    }
    if (
      content.appearance.heroImageUrl &&
      !content.appearance.heroImageAltEn?.trim() &&
      !content.appearance.heroImageAltNe?.trim()
    ) {
      setFormError("Add alternative text for the hero image (English or Nepali) before saving.");
      return;
    }
    if (content.seo.socialImageUrl && !content.seo.socialImageAlt?.trim()) {
      setFormError("Add alternative text for the social preview image before saving.");
      return;
    }

    await save(content);
  }

  if (loading) return <p>Loading…</p>;
  if (loadError)
    return (
      <p className="field-error" role="alert">
        {loadError}
      </p>
    );

  const org = content.organization;

  return (
    <div>
      <h2>Site identity, pages and social preview</h2>
      <p className="lede">
        Everything here is editable. Changing the logo updates the header, the browser tab's
        social preview, and the homepage hero (when no separate hero photo is set) — they all
        read from this same value, nothing is hardcoded.
      </p>

      <form noValidate onSubmit={handleSubmit} className="contact-form admin-form">
        <Group title="Organization details">
          <div className="field">
            <label htmlFor="logo-upload">Upload logo</label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              disabled={logoUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file, setLogoUploading, (url) => update("organization", "logoUrl", url));
              }}
            />
            {logoUploading ? <p>Uploading…</p> : null}
          </div>
          <div className="field">
            <label htmlFor="logo-url">Logo URL (blank uses the original bundled logo)</label>
            <input
              id="logo-url"
              value={org.logoUrl}
              onChange={(e) => update("organization", "logoUrl", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="logo-alt">Logo alternative text (mandatory for accessibility)</label>
            <input
              id="logo-alt"
              value={org.logoAlt || ""}
              onChange={(e) => update("organization", "logoAlt", e.target.value)}
            />
            <p className="field-help">Describe the logo for screen-reader users and search engines.</p>
          </div>
          <div className="logo-preview-box" aria-label="Logo live preview">
            <p className="preview-label">
              Live preview — this is exactly what will show in the header and (unless a separate
              hero photo is set) the homepage hero once you save:
            </p>
            <div className="logo-preview-item">
              <img
                tabIndex={0}
                src={org.logoUrl || defaultLogo}
                alt={org.logoAlt || `${org.nameEn || "Model Disabled Society Rasuwa"} logo`}
                width="80"
                height="80"
              />
              <p className="meta">Current alt text: {org.logoAlt || "(none set — required before saving)"}</p>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="name-en">Public name (English)</label>
              <input id="name-en" value={org.nameEn} onChange={(e) => update("organization", "nameEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="name-ne">Public name (Nepali)</label>
              <input id="name-ne" lang="ne" value={org.nameNe} onChange={(e) => update("organization", "nameNe", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="short-name">Short name (English)</label>
              <input id="short-name" value={org.shortNameEn} onChange={(e) => update("organization", "shortNameEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="reg-no">Registration number</label>
              <input id="reg-no" value={org.registrationNo} onChange={(e) => update("organization", "registrationNo", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="reg-date">Registration date</label>
              <input id="reg-date" value={org.registrationDate} onChange={(e) => update("organization", "registrationDate", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="affiliation">Affiliation</label>
              <input id="affiliation" value={org.affiliationNo} onChange={(e) => update("organization", "affiliationNo", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" value={org.phone} onChange={(e) => update("organization", "phone", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={org.email} onChange={(e) => update("organization", "email", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="domain">Domain</label>
              <input id="domain" value={org.domain} onChange={(e) => update("organization", "domain", e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border, #333)" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.05rem" }}>Social Media Profiles</h4>
            <p className="field-help" style={{ marginBottom: "1rem" }}>
              Add links for Facebook, Instagram, TikTok, LinkedIn, YouTube, X, WhatsApp, etc. Their official icons will automatically appear on the website.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div className="field" style={{ minWidth: "150px", marginBottom: 0 }}>
                <label htmlFor="platform-select">Platform</label>
                <select id="platform-select" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)}>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ flex: "1", minWidth: "220px", marginBottom: 0 }}>
                <label htmlFor="platform-url">URL / Profile link</label>
                <input
                  id="platform-url"
                  type="url"
                  placeholder="https://..."
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addSocialProfile}
                style={{ height: "42px" }}
              >
                + Add Profile
              </button>
            </div>

            <div className="admin-social-list">
              {(Array.isArray(org.socials) && org.socials.length > 0
                ? org.socials
                : org.facebook
                ? [{ id: "fb-default", platform: "facebook", url: org.facebook }]
                : []
              ).map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.8rem",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "6px",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ display: "inline-flex", color: "var(--brand, #38bdf8)" }}>
                      {getPlatformIcon(item.platform)}
                    </span>
                    <strong>{SOCIAL_PLATFORMS.find((p) => p.id === item.platform)?.name || item.platform}</strong>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="meta" style={{ wordBreak: "break-all" }}>
                      {item.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeSocialProfile(item.id)}
                    style={{ padding: "0.2rem 0.6rem", fontSize: "0.85rem" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="ward-en">Ward / municipality (English)</label>
              <input id="ward-en" value={org.wardEn} onChange={(e) => update("organization", "wardEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="ward-ne">Ward / municipality (Nepali)</label>
              <input id="ward-ne" lang="ne" value={org.wardNe} onChange={(e) => update("organization", "wardNe", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="district-en">District (English)</label>
              <input id="district-en" value={org.districtEn} onChange={(e) => update("organization", "districtEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="district-ne">District (Nepali)</label>
              <input id="district-ne" lang="ne" value={org.districtNe} onChange={(e) => update("organization", "districtNe", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="province-en">Province (English)</label>
              <input id="province-en" value={org.provinceEn} onChange={(e) => update("organization", "provinceEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="province-ne">Province (Nepali)</label>
              <input id="province-ne" lang="ne" value={org.provinceNe} onChange={(e) => update("organization", "provinceNe", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="chair-en">Chairperson name (English)</label>
              <input id="chair-en" value={org.chairpersonEn} onChange={(e) => update("organization", "chairpersonEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="chair-ne">Chairperson name (Nepali)</label>
              <input id="chair-ne" lang="ne" value={org.chairpersonNe} onChange={(e) => update("organization", "chairpersonNe", e.target.value)} />
            </div>
          </div>
        </Group>

        <Group title="Homepage">
          <div className="field-row">
            <div className="field">
              <label htmlFor="eyebrow-en">Location line (English)</label>
              <input id="eyebrow-en" value={content.home.eyebrowEn} onChange={(e) => update("home", "eyebrowEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="eyebrow-ne">Location line (Nepali)</label>
              <input id="eyebrow-ne" lang="ne" value={content.home.eyebrowNe} onChange={(e) => update("home", "eyebrowNe", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="hero-upload">Upload hero image</label>
            <input
              id="hero-upload"
              type="file"
              accept="image/*"
              disabled={heroUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file, setHeroUploading, (url) => update("appearance", "heroImageUrl", url));
              }}
            />
            {heroUploading ? <p>Uploading…</p> : null}
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="hero-title-en">Hero title (English)</label>
              <input id="hero-title-en" value={content.home.titleEn} onChange={(e) => update("home", "titleEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="hero-title-ne">Hero title (Nepali)</label>
              <input id="hero-title-ne" lang="ne" value={content.home.titleNe} onChange={(e) => update("home", "titleNe", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="hero-sub-en">Hero summary (English)</label>
            <textarea id="hero-sub-en" rows="2" value={content.home.subtitleEn} onChange={(e) => update("home", "subtitleEn", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="hero-sub-ne">Hero summary (Nepali)</label>
            <textarea id="hero-sub-ne" lang="ne" rows="2" value={content.home.subtitleNe} onChange={(e) => update("home", "subtitleNe", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="intro-en">Introduction (English)</label>
            <textarea id="intro-en" rows="4" value={content.home.introEn} onChange={(e) => update("home", "introEn", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="intro-ne">Introduction (Nepali)</label>
            <textarea id="intro-ne" lang="ne" rows="4" value={content.home.introNe} onChange={(e) => update("home", "introNe", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="hero-url">Hero image URL</label>
            <input
              id="hero-url"
              value={content.appearance.heroImageUrl}
              onChange={(e) => update("appearance", "heroImageUrl", e.target.value)}
              placeholder="Use the uploader above, or leave blank to show the logo instead"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="hero-alt-en">Hero image alternative text (English)</label>
              <input id="hero-alt-en" value={content.appearance.heroImageAltEn} onChange={(e) => update("appearance", "heroImageAltEn", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="hero-alt-ne">Hero image alternative text (Nepali)</label>
              <input id="hero-alt-ne" lang="ne" value={content.appearance.heroImageAltNe} onChange={(e) => update("appearance", "heroImageAltNe", e.target.value)} />
            </div>
          </div>
          <p className="field-help">
            Mandatory whenever a hero image is set (English, Nepali, or both). Leave the hero
            image blank and the homepage shows the logo instead.
          </p>
        </Group>

        <Group title="About page">
          <div className="field">
            <label htmlFor="vision-en">Vision (English)</label>
            <textarea id="vision-en" rows="4" value={content.about.visionEn} onChange={(e) => update("about", "visionEn", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="vision-ne">Vision (Nepali)</label>
            <textarea id="vision-ne" lang="ne" rows="4" value={content.about.visionNe} onChange={(e) => update("about", "visionNe", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="mission-en">Mission (English)</label>
            <textarea id="mission-en" rows="4" value={content.about.missionEn} onChange={(e) => update("about", "missionEn", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="mission-ne">Mission (Nepali)</label>
            <textarea id="mission-ne" lang="ne" rows="4" value={content.about.missionNe} onChange={(e) => update("about", "missionNe", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="history-en">History (English)</label>
            <textarea id="history-en" rows="3" value={content.about.historyEn} onChange={(e) => update("about", "historyEn", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="history-ne">History (Nepali)</label>
            <textarea id="history-ne" lang="ne" rows="3" value={content.about.historyNe} onChange={(e) => update("about", "historyNe", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="objectives-en">Objectives (English — one per line)</label>
            <textarea id="objectives-en" rows="10" value={listValue("objectivesEn")} onChange={(e) => setList("objectivesEn", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="objectives-ne">Objectives (Nepali — one per line)</label>
            <textarea id="objectives-ne" lang="ne" rows="10" value={listValue("objectivesNe")} onChange={(e) => setList("objectivesNe", e.target.value)} />
          </div>
        </Group>

        <Group title="Policy pages">
          {[
            ["accessibility", "Accessibility"],
            ["privacy", "Privacy"],
            ["safeguarding", "Safeguarding and feedback"],
          ].map(([key, label]) => (
            <div key={key}>
              <div className="field">
                <label htmlFor={`${key}-en`}>{label} (English)</label>
                <textarea id={`${key}-en`} rows="4" value={content.policies[`${key}En`]} onChange={(e) => update("policies", `${key}En`, e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor={`${key}-ne`}>{label} (Nepali)</label>
                <textarea id={`${key}-ne`} lang="ne" rows="4" value={content.policies[`${key}Ne`]} onChange={(e) => update("policies", `${key}Ne`, e.target.value)} />
              </div>
            </div>
          ))}
        </Group>

        <Group title="Search and social sharing">
          <div className="field">
            <label htmlFor="social-upload">Upload social preview image (1200 × 630 recommended)</label>
            <input
              id="social-upload"
              type="file"
              accept="image/*"
              disabled={socialUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file, setSocialUploading, (url) => update("seo", "socialImageUrl", url));
              }}
            />
            {socialUploading ? <p>Uploading…</p> : null}
          </div>
          <div className="field">
            <label htmlFor="seo-title">Site title</label>
            <input id="seo-title" value={content.seo.title} onChange={(e) => update("seo", "title", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="seo-description">Meta description</label>
            <textarea id="seo-description" rows="2" value={content.seo.description} onChange={(e) => update("seo", "description", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="social-image">Social preview image URL</label>
            <input id="social-image" value={content.seo.socialImageUrl} onChange={(e) => update("seo", "socialImageUrl", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="social-alt">Social image alternative text (mandatory whenever an image is set)</label>
            <input id="social-alt" value={content.seo.socialImageAlt} onChange={(e) => update("seo", "socialImageAlt", e.target.value)} />
          </div>
        </Group>

        {formError ? (
          <p className="field-error" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving || logoUploading || heroUploading || socialUploading}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
        <p aria-live="polite" className="form-status">
          {status}
        </p>
      </form>
    </div>
  );
}

import { useRef, useState } from "react";
import { useAdminContent } from "../../hooks/useAdminContent.js";
import { uploadFile } from "../../lib/uploadFile.js";
import { isNepaliText, newId } from "../../lib/contentLanguage.js";

const NAMES = {
  board: "Committee",
  programs: "Programs",
  notices: "News & notices",
  resources: "Reports & documents",
};

const SINGULAR_NAMES = {
  board: "Committee Member",
  programs: "Program",
  notices: "Notice / Announcement",
  resources: "Report / Document",
};

export const BIDHAN_POSITIONS = [
  { id: "chairperson", en: "Chairperson", ne: "अध्यक्ष" },
  { id: "vice_chairperson", en: "Vice-Chairperson", ne: "उपाध्यक्ष" },
  { id: "secretary", en: "Secretary", ne: "सचिव" },
  { id: "joint_secretary", en: "Joint Secretary", ne: "सह-सचिव" },
  { id: "treasurer", en: "Treasurer", ne: "कोषाध्यक्ष" },
  { id: "joint_treasurer", en: "Joint Treasurer", ne: "सह-कोषाध्यक्ष" },
  { id: "executive_member", en: "Executive Member", ne: "कार्यसमिति सदस्य" },
  { id: "member", en: "Member", ne: "सदस्य" },
  { id: "senior_advisor", en: "Senior Advisor", ne: "वरिष्ठ सल्लाहकार" },
  { id: "advisor", en: "Advisor", ne: "सल्लाहकार" },
  { id: "legal_advisor", en: "Legal Advisor", ne: "कानुनी सल्लाहकार" },
  { id: "general_member", en: "General Member", ne: "साधारण सदस्य" },
  { id: "other", en: "Other (Custom)", ne: "अन्य (कस्टम)" },
];

const RESOURCE_CATEGORIES = [
  "Annual Report",
  "Audit Report",
  "Financial Report",
  "Constitution / Bidhan (विधान)",
  "Policy Document",
  "Brochure / Newsletter",
  "Other",
];

function blank() {
  return {
    id: "",
    contentLanguage: "auto",
    published: true, // Default to true so newly added items appear on site immediately
    verified: true,  // Default to true for committee members
    sortOrder: 1,
    titleEn: "",
    titleNe: "",
    nameEn: "",
    nameNe: "",
    positionEn: "",
    positionNe: "",
    positionPreset: "",
    customPosition: "",
    bodyEn: "",
    bodyNe: "",
    typeEn: "",
    typeNe: "",
    descriptionEn: "",
    descriptionNe: "",
    imageUrl: "",
    imageAltEn: "",
    imageAltNe: "",
    photoUrl: "",
    photoAlt: "",
    date: new Date().toISOString().slice(0, 10),
    year: "",
    attachments: [],
  };
}

export default function AdminCollection({ type }) {
  const { content, loading, loadError, saving, status, save } = useAdminContent();
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showManualBilingual, setShowManualBilingual] = useState(false);
  const heading = useRef(null);
  const formRef = useRef(null);

  const titleField = type === "board" ? "name" : "title";
  const bodyField = type === "resources" ? "description" : "body";
  const items = content[type] || [];
  const singularLabel = SINGULAR_NAMES[type] || "Item";

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Smart single-field input handler: automatically detects English vs Nepali
  function handleMainTitleChange(value) {
    const isNe = isNepaliText(value);
    setForm((f) => ({
      ...f,
      [titleField + (isNe ? "Ne" : "En")]: value,
      // If the counterpart isn't set, keep it mirrored so no screen is blank
      [titleField + (isNe ? "En" : "Ne")]: f[titleField + (isNe ? "En" : "Ne")] || value,
      contentLanguage: isNe ? "ne" : "en",
    }));
  }

  function handleMainBodyChange(value) {
    const isNe = isNepaliText(value);
    setForm((f) => ({
      ...f,
      [bodyField + (isNe ? "Ne" : "En")]: value,
      [bodyField + (isNe ? "En" : "Ne")]: f[bodyField + (isNe ? "En" : "Ne")] || value,
    }));
  }

  function handlePositionSelect(presetId) {
    const found = BIDHAN_POSITIONS.find((p) => p.id === presetId);
    if (presetId === "other") {
      setForm((f) => ({
        ...f,
        positionPreset: "other",
        positionEn: f.customPosition || "",
        positionNe: f.customPosition || "",
      }));
    } else if (found) {
      setForm((f) => ({
        ...f,
        positionPreset: presetId,
        positionEn: found.en,
        positionNe: found.ne,
        customPosition: "",
      }));
    } else {
      setForm((f) => ({
        ...f,
        positionPreset: "",
        positionEn: "",
        positionNe: "",
      }));
    }
  }

  function handleCustomPositionChange(val) {
    const isNe = isNepaliText(val);
    setForm((f) => ({
      ...f,
      customPosition: val,
      positionEn: isNe ? f.positionEn || val : val,
      positionNe: isNe ? val : f.positionNe || val,
    }));
  }

  function edit(item) {
    // Check if position matches a preset
    let matchedPreset = "";
    if (type === "board") {
      const match = BIDHAN_POSITIONS.find(
        (p) =>
          p.en.toLowerCase() === (item.positionEn || "").toLowerCase() ||
          p.ne === item.positionNe
      );
      matchedPreset = match ? match.id : item.positionEn || item.positionNe ? "other" : "";
    }

    setForm({
      ...blank(),
      ...structuredClone(item),
      positionPreset: matchedPreset,
      customPosition: matchedPreset === "other" ? item.positionEn || item.positionNe : "",
    });
    setFormError("");
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      heading.current?.focus();
    });
  }

  function startNew() {
    setForm({ ...blank(), sortOrder: items.length + 1 });
    setFormError("");
    setShowManualBilingual(false);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      heading.current?.focus();
    });
  }

  async function uploadImage(file, onUploaded) {
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

  async function uploadAttachment(file) {
    setUploading(true);
    setFormError("");
    try {
      const url = await uploadFile("report-files", file);
      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      change("attachments", [
        ...form.attachments,
        {
          id: newId("file"),
          label: file.name,
          url,
          language: isNepaliText(file.name) ? "ne" : "en",
          format: ext,
        },
      ]);
    } catch (err) {
      setFormError("Couldn't upload the file: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  function attachment(i, key, value) {
    change("attachments", form.attachments.map((a, n) => (n === i ? { ...a, [key]: value } : a)));
  }

  function validate() {
    const mainTitle = form[titleField + "En"] || form[titleField + "Ne"];
    if (!mainTitle?.trim()) {
      return `Please enter a ${titleField === "name" ? "name" : "title"}.`;
    }
    if (type === "board" && !form.positionEn?.trim() && !form.positionNe?.trim()) {
      return "Please select or type a committee position (as per Bidhan / विधान).";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError("");

    // Ensure fallback fields are populated
    const titleVal = form[titleField + "En"] || form[titleField + "Ne"];
    const item = {
      ...form,
      id: form.id || newId(type),
      [titleField + "En"]: form[titleField + "En"] || titleVal,
      [titleField + "Ne"]: form[titleField + "Ne"] || titleVal,
      photoAlt: form.photoAlt || (type === "board" ? `${titleVal} photo` : ""),
      imageAltEn: form.imageAltEn || form.imageAltNe || titleVal,
      imageAltNe: form.imageAltNe || form.imageAltEn || titleVal,
    };

    const nextList = form.id ? items.map((x) => (x.id === form.id ? item : x)) : [...items, item];
    const ok = await save({ ...content, [type]: nextList });
    if (ok) {
      setForm(blank());
      setShowManualBilingual(false);
    }
  }

  async function remove(item) {
    const label = item.titleEn || item.nameEn || item.titleNe || item.nameNe;
    if (!window.confirm(`Delete "${label}"? This change will be saved to the live site.`)) return;
    const ok = await save({ ...content, [type]: items.filter((x) => x.id !== item.id) });
    if (ok && form.id === item.id) setForm(blank());
  }

  if (loading) return <p>Loading…</p>;
  if (loadError) {
    return (
      <p className="field-error" role="alert">
        {loadError}
      </p>
    );
  }

  // Active value in the main single input
  const activeTitle = form[titleField + "En"] || form[titleField + "Ne"] || "";
  const activeBody = form[bodyField + "En"] || form[bodyField + "Ne"] || "";
  const detectedLang = isNepaliText(activeTitle || activeBody) ? "Nepali (नेपाली)" : "English";

  return (
    <section>
      {/* Top Header & Prominent Add Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border, rgba(255,255,255,0.1))",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>{NAMES[type]}</h2>
          <p className="meta" style={{ margin: "0.25rem 0 0 0" }}>
            {items.length} {items.length === 1 ? "entry" : "entries"} total
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ fontSize: "1rem", padding: "0.6rem 1.4rem", fontWeight: "600" }}
          onClick={startNew}
        >
          + Add New {singularLabel}
        </button>
      </div>

      {/* Existing items list */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Existing {NAMES[type]}</h3>
        <ul className="admin-list">
          {items.map((x) => (
            <li className="admin-list-item" key={x.id}>
              <div className="admin-list-details">
                <p className="admin-list-name">
                  <strong>{x.titleEn || x.nameEn || x.titleNe || x.nameNe}</strong>
                  {type === "board" && (x.positionEn || x.positionNe) ? (
                    <span style={{ color: "var(--brand, #38bdf8)", marginLeft: "0.5rem" }}>
                      ({x.positionEn || x.positionNe})
                    </span>
                  ) : null}
                  {x.published === false ? (
                    <span className="admin-flag" style={{ background: "#eab308", color: "#000" }}>
                      {" "}— Draft (Hidden)
                    </span>
                  ) : null}
                </p>
                <p className="admin-list-meta">
                  {x.published !== false ? "Live on site" : "Draft"}
                  {x.date ? ` · Date: ${x.date}` : ""}
                  {x.year ? ` · Fiscal Year: ${x.year}` : ""}
                  {type === "board" ? ` · Order: ${x.sortOrder}` : ""}
                  {x.attachments?.length ? ` · ${x.attachments.length} attachment(s)` : ""}
                </p>
              </div>
              <div className="admin-list-actions">
                <button type="button" className="btn btn-secondary" onClick={() => edit(x)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => remove(x)}
                  disabled={saving}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 ? (
            <li style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
              No {NAMES[type].toLowerCase()} added yet. Click "+ Add New {singularLabel}" above to add one.
            </li>
          ) : null}
        </ul>
      </div>

      {/* Add / Edit Form */}
      <div
        ref={formRef}
        style={{
          padding: "1.5rem",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "10px",
          border: "1px solid var(--border, rgba(255,255,255,0.1))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 ref={heading} tabIndex={-1} style={{ margin: 0 }}>
            {form.id ? `Edit ${singularLabel}` : `Add New ${singularLabel}`}
          </h3>
          {form.id ? (
            <button type="button" className="btn btn-secondary btn-sm" onClick={startNew}>
              Cancel editing & start new
            </button>
          ) : null}
        </div>

        <form noValidate onSubmit={handleSubmit} className="contact-form admin-form">
          {/* Main Title / Name (Auto-Detects English or Nepali) */}
          <div className="field">
            <label htmlFor="item-main-title">
              {type === "board" ? "Full Name (नाम)" : "Title / Heading (शीर्षक)"}{" "}
              <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                [Auto-detected: <strong>{detectedLang}</strong>]
              </span>
            </label>
            <input
              id="item-main-title"
              value={activeTitle}
              onChange={(e) => handleMainTitleChange(e.target.value)}
              placeholder={
                type === "board"
                  ? "e.g. Kishor Thing Tamang / किशोर थिङ तामाङ"
                  : "e.g. Annual General Meeting / वार्षिक साधारण सभा"
              }
              required
            />
          </div>

          {/* Committee Position as per Bidhan */}
          {type === "board" ? (
            <div className="field-row">
              <div className="field" style={{ flex: "1" }}>
                <label htmlFor="position-preset">Position / पद (as per Bidhan / विधान)</label>
                <select
                  id="position-preset"
                  value={form.positionPreset}
                  onChange={(e) => handlePositionSelect(e.target.value)}
                >
                  <option value="">-- Choose Position as per Bidhan --</option>
                  {BIDHAN_POSITIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.en} / {p.ne}
                    </option>
                  ))}
                </select>
              </div>
              {form.positionPreset === "other" ? (
                <div className="field" style={{ flex: "1" }}>
                  <label htmlFor="custom-position">Type Custom Position (पद लेख्नुहोस्)</label>
                  <input
                    id="custom-position"
                    value={form.customPosition || ""}
                    onChange={(e) => handleCustomPositionChange(e.target.value)}
                    placeholder="e.g. Program Coordinator / कार्यक्रम संयोजक"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Details / Body / Description */}
          {type !== "board" ? (
            <div className="field">
              <label htmlFor="item-main-body">
                {type === "resources" ? "Description / Overview" : "Details / Announcement Content (विवरण)"}
              </label>
              <textarea
                id="item-main-body"
                rows="4"
                value={activeBody}
                onChange={(e) => handleMainBodyChange(e.target.value)}
                placeholder="Write or paste details here in English or Nepali..."
              />
            </div>
          ) : null}

          {/* Report Category & Year for Resources */}
          {type === "resources" ? (
            <div className="field-row">
              <div className="field">
                <label htmlFor="resource-category">Category</label>
                <input
                  id="resource-category"
                  list="category-suggestions"
                  value={form.typeEn || form.typeNe || ""}
                  onChange={(e) => {
                    change("typeEn", e.target.value);
                    change("typeNe", e.target.value);
                  }}
                  placeholder="e.g. Annual Report, Audit Report, Constitution"
                />
                <datalist id="category-suggestions">
                  {RESOURCE_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="field">
                <label htmlFor="resource-year">Fiscal Year / Year (e.g. 2081/82 or 2024)</label>
                <input
                  id="resource-year"
                  value={form.year || ""}
                  onChange={(e) => change("year", e.target.value)}
                  placeholder="e.g. 2081/82 B.S."
                />
              </div>
            </div>
          ) : null}

          {/* Notice Publication Date */}
          {type === "notices" ? (
            <div className="field">
              <label htmlFor="notice-date">Publication Date</label>
              <input
                id="notice-date"
                type="date"
                value={form.date}
                onChange={(e) => change("date", e.target.value)}
              />
            </div>
          ) : null}

          {/* Optional: Add separate manual translation accordion */}
          <div style={{ margin: "1rem 0" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowManualBilingual(!showManualBilingual)}
            >
              {showManualBilingual
                ? "▲ Hide manual translations"
                : "▼ Optional: Add separate manual English and Nepali translations"}
            </button>

            {showManualBilingual ? (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                  border: "1px dashed var(--border, #444)",
                }}
              >
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="manual-title-en">{titleField === "name" ? "Name" : "Title"} (English)</label>
                    <input
                      id="manual-title-en"
                      value={form[titleField + "En"] || ""}
                      onChange={(e) => change(titleField + "En", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="manual-title-ne">{titleField === "name" ? "Name" : "Title"} (Nepali)</label>
                    <input
                      id="manual-title-ne"
                      lang="ne"
                      value={form[titleField + "Ne"] || ""}
                      onChange={(e) => change(titleField + "Ne", e.target.value)}
                    />
                  </div>
                </div>

                {type !== "board" ? (
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="manual-body-en">Content (English)</label>
                      <textarea
                        id="manual-body-en"
                        rows="3"
                        value={form[bodyField + "En"] || ""}
                        onChange={(e) => change(bodyField + "En", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="manual-body-ne">Content (Nepali)</label>
                      <textarea
                        id="manual-body-ne"
                        lang="ne"
                        rows="3"
                        value={form[bodyField + "Ne"] || ""}
                        onChange={(e) => change(bodyField + "Ne", e.target.value)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Photo / Image Upload */}
          <div className="field">
            <label htmlFor="item-photo-upload">
              {type === "board" ? "Photo (फोटो) — Optional" : "Featured Image (तस्बिर) — Optional"}
            </label>
            <input
              id="item-photo-upload"
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadImage(file, (url) => change(type === "board" ? "photoUrl" : "imageUrl", url));
                }
              }}
            />
            {uploading ? <p className="meta">Uploading…</p> : null}
            {(type === "board" ? form.photoUrl : form.imageUrl) ? (
              <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img
                  src={type === "board" ? form.photoUrl : form.imageUrl}
                  alt="Preview"
                  width="60"
                  height="60"
                  style={{ borderRadius: "6px", objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => change(type === "board" ? "photoUrl" : "imageUrl", "")}
                >
                  Remove image
                </button>
              </div>
            ) : null}
          </div>

          {/* Display Order for Committee */}
          {type === "board" ? (
            <div className="field" style={{ maxWidth: "200px" }}>
              <label htmlFor="sort-order">Display Order (१, २, ३...)</label>
              <input
                id="sort-order"
                type="number"
                min="1"
                value={form.sortOrder || 1}
                onChange={(e) => change("sortOrder", Number(e.target.value))}
              />
            </div>
          ) : null}

          {/* Attachments for Notices / Resources */}
          {["notices", "resources"].includes(type) ? (
            <fieldset className="admin-fieldset" style={{ marginTop: "1rem" }}>
              <legend>Document Attachments (PDF / Word) — Optional</legend>
              <p className="field-help" style={{ marginBottom: "0.5rem" }}>
                Upload official notice PDFs, circulars, or report documents.
              </p>
              <input
                type="file"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAttachment(file);
                }}
              />
              {form.attachments?.map((file, i) => (
                <div
                  key={file.id || i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "6px",
                    marginTop: "0.5rem",
                  }}
                >
                  <div>
                    <strong>{file.label}</strong>
                    <span className="meta" style={{ marginLeft: "0.5rem" }}>
                      ({file.format?.toUpperCase()})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => change("attachments", form.attachments.filter((_, n) => n !== i))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </fieldset>
          ) : null}

          {/* Publish checkbox (default is checked) */}
          <div style={{ margin: "1.25rem 0 0.5rem 0" }}>
            <label className="field-checkbox" style={{ fontWeight: "600" }}>
              <input
                type="checkbox"
                checked={form.published !== false}
                onChange={(e) => change("published", e.target.checked)}
              />{" "}
              Publish immediately on website (सार्वजनिक रूपमा वेबसाइटमा देखाउनुहोस्)
            </label>
          </div>

          {formError ? (
            <p className="field-error" role="alert">
              {formError}
            </p>
          ) : null}

          {/* Form action buttons */}
          <div className="admin-form-actions" style={{ marginTop: "1.5rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || uploading}
              style={{ padding: "0.6rem 1.5rem", fontWeight: "bold" }}
            >
              {saving ? "Saving…" : form.id ? "Save Changes" : `+ Add ${singularLabel}`}
            </button>
            <button type="button" className="btn btn-secondary" onClick={startNew}>
              Reset Form
            </button>
          </div>
          <p aria-live="polite" className="form-status">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

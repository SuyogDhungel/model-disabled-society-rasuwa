import { useRef, useState } from "react";
import { useAdminContent } from "../../hooks/useAdminContent.js";
import { uploadFile } from "../../lib/uploadFile.js";
import { newId } from "../../lib/contentLanguage.js";

const NAMES = {
  board: "Committee",
  programs: "Programs",
  notices: "News & notices",
  resources: "Reports & documents",
};

function blank() {
  return {
    id: "",
    contentLanguage: "en",
    published: false,
    verified: false,
    sortOrder: 1,
    titleEn: "",
    titleNe: "",
    nameEn: "",
    nameNe: "",
    positionEn: "",
    positionNe: "",
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
  const heading = useRef(null);

  const titleField = type === "board" ? "name" : "title";
  const bodyField = type === "resources" ? "description" : "body";
  const items = content[type] || [];

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function edit(item) {
    setForm({ ...blank(), ...structuredClone(item) });
    setFormError("");
    requestAnimationFrame(() => heading.current?.focus());
  }

  function startNew() {
    setForm({ ...blank(), sortOrder: items.length + 1 });
    setFormError("");
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
        { id: newId("file"), label: file.name, url, language: form.contentLanguage === "ne" ? "ne" : "en", format: ext },
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

  const languages = form.contentLanguage === "bilingual" ? ["En", "Ne"] : [form.contentLanguage === "ne" ? "Ne" : "En"];

  function validate() {
    const imageUrl = type === "board" ? form.photoUrl : form.imageUrl;
    if (type !== "board" && imageUrl && !form.imageAltEn?.trim() && !form.imageAltNe?.trim()) {
      return "Add image alternative text (English or Nepali) before saving — it's mandatory whenever an image is set.";
    }
    for (const suffix of languages) {
      if (!form[titleField + suffix]?.trim()) {
        return `Fill in the ${suffix === "Ne" ? "Nepali" : "English"} ${titleField === "name" ? "name" : "title"} for this content language.`;
      }
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
    const item = { ...form, id: form.id || newId(type) };
    const nextList = form.id ? items.map((x) => (x.id === form.id ? item : x)) : [...items, item];
    const ok = await save({ ...content, [type]: nextList });
    if (ok) {
      setForm(blank());
    }
  }

  async function remove(item) {
    const label = item.titleEn || item.nameEn || item.titleNe || item.nameNe;
    if (!window.confirm(`Delete "${label}"? Download a JSON backup first if you may need it.`)) return;
    const ok = await save({ ...content, [type]: items.filter((x) => x.id !== item.id) });
    if (ok && form.id === item.id) setForm(blank());
  }

  if (loading) return <p>Loading…</p>;
  if (loadError)
    return (
      <p className="field-error" role="alert">
        {loadError}
      </p>
    );

  return (
    <section>
      <h2>{NAMES[type]}</h2>
      <p className="lede">
        English is the default. Choose Nepali-only when no English translation exists yet.
        Changes go live only after saving.
      </p>

      <ul className="admin-list">
        {items.map((x) => (
          <li className="admin-list-item" key={x.id}>
            <div className="admin-list-details">
              <p className="admin-list-name">
                {x.titleEn || x.nameEn || x.titleNe || x.nameNe}
                {type === "board" && !x.verified ? <span className="admin-flag"> — unverified spelling</span> : null}
              </p>
              <p className="admin-list-meta">
                {x.published ? "Published" : "Draft"} · {x.contentLanguage}
                {type === "board" ? ` · order ${x.sortOrder}` : ""}
              </p>
            </div>
            <div className="admin-list-actions">
              <button type="button" className="btn btn-secondary" onClick={() => edit(x)}>
                Edit<span className="visually-hidden"> {x.titleEn || x.nameEn}</span>
              </button>
              <button type="button" className="btn btn-danger" onClick={() => remove(x)} disabled={saving}>
                Delete<span className="visually-hidden"> {x.titleEn || x.nameEn}</span>
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 ? <li>Nothing here yet.</li> : null}
      </ul>

      <h3 ref={heading} tabIndex={-1}>
        {form.id ? "Edit item" : "Add item"}
      </h3>
      <form noValidate onSubmit={handleSubmit} className="contact-form admin-form">
        <div className="field">
          <label htmlFor="item-language">Content language</label>
          <select id="item-language" value={form.contentLanguage} onChange={(e) => change("contentLanguage", e.target.value)}>
            <option value="en">English only</option>
            <option value="ne">Nepali only</option>
            <option value="bilingual">English and Nepali</option>
          </select>
        </div>

        {languages.map((suffix) => (
          <div className="field-row" key={suffix}>
            <div className="field">
              <label htmlFor={`item-title-${suffix}`}>
                {(type === "board" ? "Name" : "Title")} ({suffix === "Ne" ? "Nepali" : "English"})
              </label>
              <input
                id={`item-title-${suffix}`}
                lang={suffix === "Ne" ? "ne" : "en"}
                value={form[titleField + suffix]}
                onChange={(e) => change(titleField + suffix, e.target.value)}
              />
            </div>
            {type === "board" ? (
              <div className="field">
                <label htmlFor={`position-${suffix}`}>Position ({suffix})</label>
                <input
                  id={`position-${suffix}`}
                  lang={suffix === "Ne" ? "ne" : "en"}
                  value={form["position" + suffix]}
                  onChange={(e) => change("position" + suffix, e.target.value)}
                />
              </div>
            ) : (
              <div className="field">
                <label htmlFor={`body-${suffix}`}>
                  {type === "resources" ? "Description" : "Readable text"} ({suffix === "Ne" ? "Nepali" : "English"})
                </label>
                <textarea
                  id={`body-${suffix}`}
                  lang={suffix === "Ne" ? "ne" : "en"}
                  rows="4"
                  value={form[bodyField + suffix]}
                  onChange={(e) => change(bodyField + suffix, e.target.value)}
                />
              </div>
            )}
            {["resources"].includes(type) ? (
              <div className="field">
                <label htmlFor={`category-${suffix}`}>Category ({suffix})</label>
                <input
                  id={`category-${suffix}`}
                  value={form["type" + suffix]}
                  onChange={(e) => change("type" + suffix, e.target.value)}
                  placeholder="e.g. Annual report, Audit report"
                />
              </div>
            ) : null}
          </div>
        ))}

        {["board", "programs"].includes(type) ? (
          <>
            <div className="field">
              <label htmlFor="item-order">Display order (lower shows first)</label>
              <input id="item-order" type="number" min="0" value={form.sortOrder} onChange={(e) => change("sortOrder", Number(e.target.value))} />
            </div>
            <div className="field">
              <label htmlFor="item-image-upload">{type === "board" ? "Photo" : "Image"} (optional)</label>
              <input
                id="item-image-upload"
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, (url) => change(type === "board" ? "photoUrl" : "imageUrl", url));
                }}
              />
            </div>
            {type === "board" ? (
              <div className="field">
                <label htmlFor="photo-alt">
                  Photo alternative text (optional — the name and position are already shown as
                  visible text beside the photo, so it's fine to leave this blank)
                </label>
                <input id="photo-alt" value={form.photoAlt || ""} onChange={(e) => change("photoAlt", e.target.value)} />
              </div>
            ) : (
              languages.map((s) => (
                <div className="field" key={s}>
                  <label htmlFor={`image-alt-${s}`}>Image alternative text ({s}) — mandatory once an image is set</label>
                  <input id={`image-alt-${s}`} value={form["imageAlt" + s] || ""} onChange={(e) => change("imageAlt" + s, e.target.value)} />
                </div>
              ))
            )}
            {type === "board" ? (
              <label className="field-checkbox">
                <input type="checkbox" checked={form.verified} onChange={(e) => change("verified", e.target.checked)} /> Name and role
                verified with the organization
              </label>
            ) : null}
          </>
        ) : null}

        {["notices", "resources"].includes(type) ? (
          <>
            <div className="field">
              <label htmlFor="item-image-upload-2">Image (optional)</label>
              <input
                id="item-image-upload-2"
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, (url) => change("imageUrl", url));
                }}
              />
            </div>
            {form.imageUrl
              ? languages.map((s) => (
                  <div className="field" key={s}>
                    <label htmlFor={`image-alt-${s}`}>Image alternative text ({s}) — mandatory once an image is set</label>
                    <input id={`image-alt-${s}`} value={form["imageAlt" + s] || ""} onChange={(e) => change("imageAlt" + s, e.target.value)} />
                  </div>
                ))
              : null}
          </>
        ) : null}

        {type === "notices" ? (
          <div className="field">
            <label htmlFor="date">Publication date</label>
            <input id="date" type="date" value={form.date} onChange={(e) => change("date", e.target.value)} />
          </div>
        ) : null}

        {type === "resources" ? (
          <div className="field">
            <label htmlFor="year">Year / fiscal year (B.S. or A.D.; label it clearly)</label>
            <input id="year" value={form.year} onChange={(e) => change("year", e.target.value)} />
          </div>
        ) : null}

        {["notices", "resources"].includes(type) ? (
          <fieldset className="admin-fieldset">
            <legend>Attachments — add a PDF and a Word copy to the same item</legend>
            <p>Include readable text above. Scanned PDFs alone are not accessible.</p>
            <input type="file" disabled={uploading} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadAttachment(file);
            }} />
            {form.attachments.map((file, i) => (
              <fieldset className="admin-fieldset" key={file.id}>
                <legend>Attachment {i + 1}</legend>
                <div className="field">
                  <label htmlFor={`attachment-label-${i}`}>Download link text</label>
                  <input id={`attachment-label-${i}`} value={file.label} onChange={(e) => attachment(i, "label", e.target.value)} required />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor={`file-lang-${i}`}>Document language</label>
                    <select id={`file-lang-${i}`} value={file.language} onChange={(e) => attachment(i, "language", e.target.value)}>
                      <option value="en">English</option>
                      <option value="ne">Nepali</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor={`file-format-${i}`}>Format</label>
                    <select id={`file-format-${i}`} value={file.format} onChange={(e) => attachment(i, "format", e.target.value)}>
                      {["pdf", "doc", "docx", "odt", "txt", "html"].map((f) => (
                        <option key={f} value={f}>
                          {f.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => change("attachments", form.attachments.filter((_, n) => n !== i))}
                >
                  Remove attachment {i + 1}
                </button>
              </fieldset>
            ))}
          </fieldset>
        ) : null}

        <label className="field-checkbox">
          <input type="checkbox" checked={form.published} onChange={(e) => change("published", e.target.checked)} /> Publish on website
        </label>

        {formError ? (
          <p className="field-error" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
            {saving ? "Saving…" : form.id ? "Save item" : "Create item"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={startNew}>
            Clear form
          </button>
        </div>
        <p aria-live="polite" className="form-status">
          {status}
        </p>
      </form>
    </section>
  );
}

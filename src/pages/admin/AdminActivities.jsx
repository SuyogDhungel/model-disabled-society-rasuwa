import { useMemo, useRef, useState } from "react";
import { useAdminContent } from "../../hooks/useAdminContent.js";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges.js";
import { uploadFile } from "../../lib/uploadFile.js";
import { optimizeImage } from "../../lib/imageFile.js";
import { newId } from "../../lib/contentLanguage.js";
import {
  activitiesFrom,
  formatDate,
  formatDateRange,
  isValidIsoDate,
  photoAlt,
  slugify,
  sortActivities,
  todayIso,
  uniqueSlug,
} from "../../lib/activities.js";
import { BS_MONTHS, BS_YEARS, bsMonthLength, bsToAd, currentBsYear } from "../../lib/bsDate.js";
import ActivityCard from "../../components/ActivityCard.jsx";

const MAX_PHOTOS = 8;
const SUMMARY_LIMIT = 220;

function blank() {
  return {
    id: "",
    slug: "",
    contentLanguage: "en",
    published: true,
    date: todayIso(),
    endDate: "",
    location: "",
    titleEn: "",
    titleNe: "",
    summaryEn: "",
    bodyEn: "",
    bodyNe: "",
    photos: [],
    attachments: [],
  };
}

// Alt text that is really just a file name ("IMG_2034.jpg") or a stub
// ("photo", "image of") doesn't describe anything to a screen-reader user.
function weakAlt(text) {
  const t = (text || "").trim();
  if (t.length < 8) return true;
  if (/\.(jpe?g|png|webp|heic|gif)$/i.test(t)) return true;
  if (/^(img|dsc|pxl|photo|image|whatsapp)[\s_-]?\d/i.test(t)) return true;
  return false;
}

function BsConverter({ onUse }) {
  const [year, setYear] = useState(String(currentBsYear()));
  const [month, setMonth] = useState("1");
  const [day, setDay] = useState("1");
  const days = bsMonthLength(Number(year), Number(month)) || 32;
  const ad = bsToAd(year, month, day);

  return (
    <details className="bs-converter">
      <summary>Have the date in B.S. (Nepali calendar)? Convert it here</summary>
      <div className="bs-converter-body">
        <div className="bs-converter-fields">
          <div className="field">
            <label htmlFor="bs-year">Year (B.S.)</label>
            <select id="bs-year" value={year} onChange={(e) => setYear(e.target.value)}>
              {BS_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="bs-month">Month</label>
            <select id="bs-month" value={month} onChange={(e) => setMonth(e.target.value)}>
              {BS_MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {i + 1}. {m}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="bs-day">Day</label>
            <select id="bs-day" value={day} onChange={(e) => setDay(e.target.value)}>
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="bs-converter-result" role="status">
          {ad ? (
            <>
              = <strong>{formatDate(ad)}</strong> (A.D.)
            </>
          ) : (
            "That day doesn't exist in this month."
          )}
        </p>
        <div className="admin-button-row">
          <button type="button" className="btn btn-secondary btn-sm" disabled={!ad} onClick={() => onUse("date", ad)}>
            Use as date / start date
          </button>
          <button type="button" className="btn btn-secondary btn-sm" disabled={!ad} onClick={() => onUse("endDate", ad)}>
            Use as end date
          </button>
        </div>
      </div>
    </details>
  );
}

export default function AdminActivities() {
  const { content, loading, loadError, saving, status, setStatus, save } = useAdminContent();
  const [form, setForm] = useState(blank);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState("");
  const [showForm, setShowForm] = useState(false);
  const formHeading = useRef(null);
  const errorBox = useRef(null);

  useUnsavedChanges(dirty);

  const items = useMemo(() => sortActivities(activitiesFrom(content)), [content]);
  const storedInDb = Array.isArray(content?.activities);

  const change = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  function openForm(next) {
    if (dirty && !window.confirm("You have unsaved changes in the form. Discard them?")) return;
    setForm(next);
    setErrors([]);
    setDirty(false);
    setStatus("");
    setShowForm(true);
    requestAnimationFrame(() => {
      formHeading.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formHeading.current?.focus({ preventScroll: true });
    });
  }

  function closeForm() {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setForm(blank());
    setDirty(false);
    setErrors([]);
    setShowForm(false);
  }

  // ---------- photos ----------
  async function addPhotos(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const room = MAX_PHOTOS - form.photos.length;
    if (room <= 0) {
      setErrors([`You can add up to ${MAX_PHOTOS} photos per activity.`]);
      return;
    }
    const chosen = files.slice(0, room);
    const failed = [];
    for (let i = 0; i < chosen.length; i++) {
      setUploading(`Uploading photo ${i + 1} of ${chosen.length}…`);
      try {
        // Resize big phone photos (often 4-12 MB) to max 1600px WebP before
        // uploading: much faster on mobile data and faster for visitors.
        const { file } = await optimizeImage(chosen[i], "photo");
        const url = await uploadFile("site-images", file);
        setForm((f) => ({
          ...f,
          photos: [...f.photos, { id: newId("photo"), url, altEn: "", captionEn: "" }],
        }));
        setDirty(true);
      } catch (err) {
        failed.push(`${chosen[i].name}: ${err.message}`);
      }
    }
    setUploading("");
    const msgs = [];
    if (failed.length) msgs.push("Some photos couldn't be uploaded — " + failed.join("; "));
    if (files.length > room) msgs.push(`Only the first ${room} photo(s) were added (limit ${MAX_PHOTOS}).`);
    setErrors(msgs);
  }

  function updatePhoto(index, key, value) {
    change(
      "photos",
      form.photos.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    );
  }

  function movePhoto(index, delta) {
    const next = [...form.photos];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    change("photos", next);
  }

  function removePhoto(index) {
    if (!window.confirm("Remove this photo from the activity?")) return;
    change(
      "photos",
      form.photos.filter((_, i) => i !== index),
    );
  }

  // ---------- attachments (optional report PDF etc.) ----------
  async function addAttachment(file) {
    if (!file) return;
    setUploading("Uploading document…");
    try {
      const url = await uploadFile("report-files", file);
      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const label = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
      change("attachments", [
        ...(form.attachments || []),
        { id: newId("file"), label, url, language: "en", format: ext },
      ]);
    } catch (err) {
      setErrors(["Couldn't upload the document: " + err.message]);
    } finally {
      setUploading("");
    }
  }

  // ---------- validation & save ----------
  function validate(f) {
    const list = [];
    if (!f.titleEn.trim()) list.push("Add a title.");
    if (!isValidIsoDate(f.date)) list.push("Choose the date of the activity.");
    if (f.endDate && !isValidIsoDate(f.endDate)) list.push("The end date isn't a valid date.");
    if (f.endDate && isValidIsoDate(f.date) && f.endDate < f.date)
      list.push("The end date is before the start date.");
    if (!f.summaryEn.trim()) list.push("Add a short summary (it's shown on the home page card).");
    if (f.summaryEn.length > SUMMARY_LIMIT)
      list.push(`Shorten the summary to ${SUMMARY_LIMIT} characters or fewer.`);
    if (f.published && f.photos.length === 0)
      list.push("Add at least one photo before publishing (or untick “Publish”, to save as a draft).");
    f.photos.forEach((p, i) => {
      if (!photoAlt(p)) list.push(`Photo ${i + 1}: describe the photo in the “Alt text” box.`);
      else if (weakAlt(p.altEn))
        list.push(`Photo ${i + 1}: the alt text should describe what the photo shows, not a file name.`);
    });
    return list;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = {
      ...form,
      titleEn: form.titleEn.trim(),
      titleNe: form.titleNe.trim(),
      summaryEn: form.summaryEn.trim(),
      location: form.location.trim(),
      endDate: form.endDate && form.endDate !== form.date ? form.endDate : "",
      photos: form.photos.map((p) => ({ ...p, altEn: p.altEn.trim(), captionEn: (p.captionEn || "").trim() })),
    };
    const problems = validate(trimmed);
    setErrors(problems);
    if (problems.length) {
      requestAnimationFrame(() => errorBox.current?.focus());
      return;
    }

    const current = activitiesFrom(content);
    const id = trimmed.id || newId("activity");
    // The slug (the activity's web address) is fixed on first save so
    // links already shared on Facebook/WhatsApp keep working after edits.
    const slug = trimmed.slug || uniqueSlug(slugify(trimmed.titleEn), current, id);
    const item = { ...trimmed, id, slug };
    const nextList = trimmed.id
      ? current.map((a) => (a.id === trimmed.id ? item : a))
      : [...current, item];

    const ok = await save({ ...content, activities: nextList });
    if (ok) {
      setDirty(false);
      setForm(blank());
      setShowForm(false);
      setStatus(
        item.published
          ? `Saved. “${item.titleEn}” is now live on the website.`
          : `Saved as a draft. “${item.titleEn}” is hidden from the website.`,
      );
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete “${item.titleEn}”? This removes it from the live website.`)) return;
    const ok = await save({
      ...content,
      activities: activitiesFrom(content).filter((a) => a.id !== item.id),
    });
    if (ok && form.id === item.id) {
      setForm(blank());
      setShowForm(false);
      setDirty(false);
    }
  }

  async function togglePublished(item) {
    await save({
      ...content,
      activities: activitiesFrom(content).map((a) =>
        a.id === item.id ? { ...a, published: a.published === false } : a,
      ),
    });
  }

  if (loading) return <p>Loading…</p>;
  if (loadError)
    return (
      <p className="field-error" role="alert">
        {loadError}
      </p>
    );

  const isMultiDay = Boolean(form.endDate);
  const publishedCount = items.filter((a) => a.published !== false).length;
  const previewItem = {
    ...form,
    titleEn: form.titleEn || "Your title will appear here",
    summaryEn: form.summaryEn || "Your short summary will appear here.",
  };

  return (
    <section className="admin-activities">
      <div className="admin-section-head">
        <div>
          <h2>Activities</h2>
          <p className="meta">
            News about completed trainings, events and programmes, with photos. The latest 4 published
            activities appear on the home page under “Our Recent Activities”.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openForm(blank())}>
          + Add new activity
        </button>
      </div>

      {!storedInDb ? (
        <p className="admin-note">
          These are the starting activities built into the website. They will be saved to the
          database the first time you add, edit or delete an activity.
        </p>
      ) : null}

      <p className="form-status" role="status">
        {!showForm ? status : ""}
      </p>

      <h3 className="admin-subheading">
        All activities <span className="meta">({publishedCount} live, {items.length - publishedCount} draft)</span>
      </h3>
      <ul className="admin-activity-list" role="list">
        {items.map((a) => (
          <li key={a.id} className="admin-activity-item">
            {a.photos?.[0]?.url ? (
              <img className="admin-activity-thumb" src={a.photos[0].url} alt="" />
            ) : (
              <span className="admin-activity-thumb admin-activity-thumb-empty" aria-hidden="true">
                No photo
              </span>
            )}
            <div className="admin-activity-info">
              <p className="admin-list-name">{a.titleEn || a.titleNe}</p>
              <p className="admin-list-meta">
                {formatDateRange(a.date, a.endDate)} · {a.photos?.length || 0} photo
                {(a.photos?.length || 0) === 1 ? "" : "s"} ·{" "}
                {a.published === false ? (
                  <span className="admin-badge admin-badge-draft">Draft</span>
                ) : (
                  <span className="admin-badge admin-badge-live">Live</span>
                )}
              </p>
            </div>
            <div className="admin-activity-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => openForm({ ...blank(), ...structuredClone(a) })}>
                Edit<span className="visually-hidden"> {a.titleEn}</span>
              </button>
              {a.published !== false ? (
                <a className="btn btn-secondary btn-sm" href={`/activities/${a.slug || a.id}`} target="_blank" rel="noopener">
                  View<span className="visually-hidden"> {a.titleEn} on the website (new tab)</span>
                </a>
              ) : null}
              <button type="button" className="btn btn-secondary btn-sm" disabled={saving} onClick={() => togglePublished(a)}>
                {a.published === false ? "Publish" : "Unpublish"}
                <span className="visually-hidden"> {a.titleEn}</span>
              </button>
              <button type="button" className="btn btn-danger btn-sm" disabled={saving} onClick={() => remove(a)}>
                Delete<span className="visually-hidden"> {a.titleEn}</span>
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 ? <li className="admin-note">No activities yet. Tap “+ Add new activity” to post one.</li> : null}
      </ul>

      {showForm ? (
        <div className="admin-activity-form-wrap">
          <h3 ref={formHeading} tabIndex={-1} className="admin-form-title">
            {form.id ? "Edit activity" : "Add a new activity"}
          </h3>

          <form noValidate onSubmit={handleSubmit} className="contact-form admin-form admin-activity-form">
            <div className="field">
              <label htmlFor="act-title">Title *</label>
              <input
                id="act-title"
                value={form.titleEn}
                onChange={(e) => change("titleEn", e.target.value)}
                placeholder="e.g. MDSR completes 30-day computer training"
                autoComplete="off"
                required
              />
            </div>

            <fieldset className="admin-fieldset">
              <legend>Date (A.D.) *</legend>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="act-date">{isMultiDay ? "Start date" : "Date"}</label>
                  <input
                    id="act-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => change("date", e.target.value)}
                    required
                  />
                  <div className="admin-button-row">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => change("date", todayIso())}>
                      Today
                    </button>
                  </div>
                </div>
                {isMultiDay ? (
                  <div className="field">
                    <label htmlFor="act-end-date">End date</label>
                    <input
                      id="act-end-date"
                      type="date"
                      value={form.endDate}
                      min={form.date || undefined}
                      onChange={(e) => change("endDate", e.target.value)}
                    />
                    <div className="admin-button-row">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => change("endDate", "")}>
                        One-day event (remove end date)
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              {!isMultiDay ? (
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => change("endDate", form.date || todayIso())}
                  >
                    + It ran over several days (add end date)
                  </button>
                </div>
              ) : null}
              <p className="field-help">
                Shown on the website as: <strong>{formatDateRange(form.date, form.endDate) || "—"}</strong>
              </p>
              <BsConverter onUse={(key, value) => change(key, value)} />
            </fieldset>

            <div className="field">
              <label htmlFor="act-location">Place (optional)</label>
              <input
                id="act-location"
                value={form.location}
                onChange={(e) => change("location", e.target.value)}
                placeholder="e.g. Naukunda Rural Municipality–3, Rasuwa"
              />
            </div>

            <div className="field">
              <label htmlFor="act-summary">Short summary * (shown on cards)</label>
              <textarea
                id="act-summary"
                rows={3}
                value={form.summaryEn}
                onChange={(e) => change("summaryEn", e.target.value)}
                aria-describedby="act-summary-help"
                placeholder="One or two sentences: who took part and what was achieved."
              />
              <p
                id="act-summary-help"
                className={"field-help" + (form.summaryEn.length > SUMMARY_LIMIT ? " field-error" : "")}
              >
                {form.summaryEn.length}/{SUMMARY_LIMIT} characters
              </p>
            </div>

            <div className="field">
              <label htmlFor="act-body">Full description</label>
              <textarea
                id="act-body"
                rows={8}
                value={form.bodyEn}
                onChange={(e) => change("bodyEn", e.target.value)}
                placeholder={"What happened, who organised and supported it, how many took part, and the result.\n\nLeave an empty line between paragraphs."}
              />
            </div>

            <fieldset className="admin-fieldset">
              <legend>Photos * ({form.photos.length}/{MAX_PHOTOS})</legend>
              <p className="field-help">
                Add 2–3 clear photos. The <strong>first photo is the cover</strong> shown on the home
                page — use the arrows to change the order. Large phone photos are resized automatically.
              </p>
              <div className="field">
                <label htmlFor="act-photos">
                  {form.photos.length ? "Add more photos" : "Choose photos"} (you can select several at once)
                </label>
                <input
                  id="act-photos"
                  className="admin-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={Boolean(uploading) || form.photos.length >= MAX_PHOTOS}
                  onChange={(e) => {
                    addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>
              {uploading ? (
                <p className="meta" role="status">
                  {uploading}
                </p>
              ) : null}

              <ol className="admin-photo-list">
                {form.photos.map((photo, i) => (
                  <li key={photo.id || i} className="admin-photo-item">
                    <div className="admin-photo-preview">
                      <img src={photo.url} alt="" />
                      {i === 0 ? <span className="admin-photo-cover">Cover</span> : null}
                    </div>
                    <div className="admin-photo-fields">
                      <div className="field">
                        <label htmlFor={`alt-${photo.id}`}>Photo {i + 1} — alt text *</label>
                        <textarea
                          id={`alt-${photo.id}`}
                          rows={2}
                          value={photo.altEn}
                          onChange={(e) => updatePhoto(i, "altEn", e.target.value)}
                          aria-describedby={`alt-help-${photo.id}`}
                          placeholder="e.g. Students practise typing on laptops in the computer lab."
                        />
                        <p id={`alt-help-${photo.id}`} className="field-help">
                          Describe what the photo shows for people who can't see it. Don't start with
                          “Photo of”.
                        </p>
                      </div>
                      <div className="field">
                        <label htmlFor={`cap-${photo.id}`}>Caption (optional, shown under the photo)</label>
                        <input
                          id={`cap-${photo.id}`}
                          value={photo.captionEn || ""}
                          onChange={(e) => updatePhoto(i, "captionEn", e.target.value)}
                        />
                      </div>
                      <div className="admin-button-row">
                        <button type="button" className="btn btn-secondary btn-sm" disabled={i === 0} onClick={() => movePhoto(i, -1)}>
                          ↑ Move up<span className="visually-hidden"> photo {i + 1}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={i === form.photos.length - 1}
                          onClick={() => movePhoto(i, 1)}
                        >
                          ↓ Move down<span className="visually-hidden"> photo {i + 1}</span>
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removePhoto(i)}>
                          Remove<span className="visually-hidden"> photo {i + 1}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </fieldset>

            <details className="admin-more">
              <summary>More options (Nepali title, full description in Nepali, documents)</summary>
              <div className="admin-more-body">
                <div className="field">
                  <label htmlFor="act-title-ne">Title in Nepali (optional)</label>
                  <input
                    id="act-title-ne"
                    lang="ne"
                    value={form.titleNe}
                    onChange={(e) => change("titleNe", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="act-body-ne">Full description in Nepali (optional)</label>
                  <textarea
                    id="act-body-ne"
                    lang="ne"
                    rows={6}
                    value={form.bodyNe}
                    onChange={(e) => change("bodyNe", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="act-doc">Attach the report or another document (PDF/Word, optional)</label>
                  <input
                    id="act-doc"
                    className="admin-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.odt"
                    disabled={Boolean(uploading)}
                    onChange={(e) => {
                      addAttachment(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </div>
                {form.attachments?.length ? (
                  <ul className="admin-doc-list">
                    {form.attachments.map((file, i) => (
                      <li key={file.id || i}>
                        <div className="field">
                          <label htmlFor={`doc-label-${file.id}`}>Link text ({file.format?.toUpperCase()})</label>
                          <input
                            id={`doc-label-${file.id}`}
                            value={file.label}
                            onChange={(e) =>
                              change(
                                "attachments",
                                form.attachments.map((x, n) => (n === i ? { ...x, label: e.target.value } : x)),
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => change("attachments", form.attachments.filter((_, n) => n !== i))}
                        >
                          Remove document
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </details>

            <div className="admin-preview">
              <p className="preview-label">Preview — how the card looks on the home page</p>
              <div className="admin-preview-card">
                <ActivityCard activity={previewItem} headingLevel={4} />
              </div>
            </div>

            <label className="field-checkbox admin-publish-toggle">
              <input
                type="checkbox"
                checked={form.published !== false}
                onChange={(e) => change("published", e.target.checked)}
              />
              Publish on the website now (untick to save as a hidden draft)
            </label>

            {errors.length ? (
              <div className="admin-error-box" role="alert" tabIndex={-1} ref={errorBox}>
                <p>
                  <strong>Please fix {errors.length === 1 ? "this" : `these ${errors.length} things`}:</strong>
                </p>
                <ul>
                  {errors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="admin-sticky-actions">
              <button type="submit" className="btn btn-primary" disabled={saving || Boolean(uploading)}>
                {saving ? "Saving…" : form.id ? "Save changes" : form.published ? "Publish activity" : "Save draft"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeForm}>
                Cancel
              </button>
            </div>
            <p className="form-status" role="status">
              {showForm ? status : ""}
            </p>
          </form>
        </div>
      ) : null}
    </section>
  );
}

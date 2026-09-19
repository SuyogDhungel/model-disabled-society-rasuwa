export function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  lang,
  help,
  required = false,
  ...props
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        type={type}
        lang={lang}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        {...props}
      />
      {help ? <p className="field-help">{help}</p> : null}
    </div>
  );
}

export function TextArea({
  label,
  id,
  value,
  onChange,
  lang,
  help,
  rows = 5,
  ...props
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        lang={lang}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        {...props}
      />
      {help ? <p className="field-help">{help}</p> : null}
    </div>
  );
}

export function Select({ label, id, value, onChange, children, help }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
      {help ? <p className="field-help">{help}</p> : null}
    </div>
  );
}

export function SaveBar({ saving, status, onSave, label = "Save changes" }) {
  return (
    <div className="admin-save-bar">
      <button
        type="button"
        className="btn btn-primary"
        disabled={saving}
        onClick={onSave}
      >
        {saving ? "Saving…" : label}
      </button>
      <p className="form-status" role="status">
        {status}
      </p>
    </div>
  );
}

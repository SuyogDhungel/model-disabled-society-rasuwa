export default function Attachments({ files = [] }) {
  return files.length ? (
    <ul className="attachment-list">
      {files.map((f, i) => (
        <li key={f.id || i}>
          <a href={f.url} lang={f.language} hrefLang={f.language}>
            {f.label || f.name || "Document"}
          </a>{" "}
          <span className="file-format" lang="en">
            {(f.format || "file").toUpperCase()} ·{" "}
            {f.language === "ne" ? "Nepali" : "English"}
            {f.size ? " · " + (f.size / 1048576).toFixed(2) + " MB" : ""}
          </span>
        </li>
      ))}
    </ul>
  ) : null;
}

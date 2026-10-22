import { Link, useParams } from "react-router-dom";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import {
  formatDateRange,
  isoForTime,
  photoAlt,
  publishedActivities,
} from "../lib/activities.js";
import NotFound from "./NotFound.jsx";

export default function ActivityDetail() {
  const { slug } = useParams();
  const { content, loading } = useSiteContent();
  const all = publishedActivities(content);
  const activity = all.find((a) => a.slug === slug || a.id === slug);

  usePageTitle(activity ? activity.titleEn || activity.titleNe : loading ? null : "Activity not found");

  if (loading && !activity) {
    return (
      <div className="container page">
        <p>Loading…</p>
      </div>
    );
  }
  if (!activity) return <NotFound />;

  const index = all.indexOf(activity);
  const newer = all[index - 1];
  const older = all[index + 1];
  const showNepaliTitle =
    activity.titleNe && activity.titleNe.trim() && activity.titleNe !== activity.titleEn;

  return (
    <div className="container page activity-detail">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/activities">Activities</Link>
          </li>
          <li aria-current="page">{activity.titleEn || activity.titleNe}</li>
        </ol>
      </nav>

      <article>
        <header className="activity-detail-header">
          <h1>{activity.titleEn || activity.titleNe}</h1>
          {showNepaliTitle ? (
            <p className="activity-title-ne" lang="ne">
              {activity.titleNe}
            </p>
          ) : null}
          <p className="activity-meta">
            <span>
              <span className="visually-hidden">Date: </span>
              <time dateTime={isoForTime(activity.date)}>
                {formatDateRange(activity.date, activity.endDate)}
              </time>
            </span>
            {activity.location ? (
              <span>
                <span className="visually-hidden">Location: </span>
                {activity.location}
              </span>
            ) : null}
          </p>
          {activity.summaryEn ? <p className="lede">{activity.summaryEn}</p> : null}
        </header>

        {activity.photos?.length ? (
          <div
            className={
              "activity-gallery" + (activity.photos.length === 1 ? " activity-gallery-single" : "")
            }
          >
            {activity.photos.map((photo, i) => (
              <figure key={photo.id || i} className={i === 0 ? "activity-gallery-lead" : undefined}>
                <a href={photo.url} target="_blank" rel="noopener">
                  <img
                    src={photo.url}
                    alt={photoAlt(photo)}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <span className="visually-hidden"> (opens full-size photo in a new tab)</span>
                </a>
                {photo.captionEn ? <figcaption>{photo.captionEn}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}

        {activity.bodyEn ? (
          <div className="activity-body preserve-lines">{activity.bodyEn}</div>
        ) : null}
        {activity.bodyNe ? (
          <div className="activity-body preserve-lines" lang="ne">
            {activity.bodyNe}
          </div>
        ) : null}

        {activity.attachments?.length ? (
          <section className="section-block">
            <h2>Documents</h2>
            <ul className="attachment-list">
              {activity.attachments.map((file) => (
                <li key={file.id}>
                  <a href={file.url}>
                    {file.label} ({file.format?.toUpperCase()})
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      <nav aria-label="More activities" className="activity-pager">
        {newer ? (
          <Link to={`/activities/${newer.slug || newer.id}`} className="activity-pager-link">
            <span className="activity-pager-label">Newer</span>
            {newer.titleEn || newer.titleNe}
          </Link>
        ) : (
          <span />
        )}
        {older ? (
          <Link
            to={`/activities/${older.slug || older.id}`}
            className="activity-pager-link activity-pager-older"
          >
            <span className="activity-pager-label">Older</span>
            {older.titleEn || older.titleNe}
          </Link>
        ) : null}
      </nav>
      <p>
        <Link className="btn btn-secondary" to="/activities">
          All activities
        </Link>
      </p>
    </div>
  );
}

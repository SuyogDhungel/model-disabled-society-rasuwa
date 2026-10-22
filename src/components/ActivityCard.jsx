import { Link } from "react-router-dom";
import { formatDateRange, isoForTime, photoAlt } from "../lib/activities.js";

// One activity as a card: cover photo, date, title (the link), summary.
// The whole card is clickable via a stretched link on the title, so screen
// readers hear a single, meaningful link name instead of "Read more" x4.
export default function ActivityCard({ activity, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const cover = activity.photos?.[0];
  const count = activity.photos?.length || 0;

  return (
    <article className="activity-card">
      <div className="activity-card-media">
        {cover?.url ? (
          <img src={cover.url} alt={photoAlt(cover)} loading="lazy" decoding="async" />
        ) : (
          <div className="activity-card-placeholder" aria-hidden="true" />
        )}
        {count > 1 ? (
          <span className="activity-card-count">
            {count} photos
          </span>
        ) : null}
      </div>
      <div className="activity-card-body">
        <p className="activity-date">
          <time dateTime={isoForTime(activity.date)}>
            {formatDateRange(activity.date, activity.endDate)}
          </time>
        </p>
        <Heading className="activity-card-title">
          <Link to={`/activities/${activity.slug || activity.id}`} className="activity-card-link">
            {activity.titleEn || activity.titleNe}
          </Link>
        </Heading>
        {activity.summaryEn ? <p className="activity-card-summary">{activity.summaryEn}</p> : null}
      </div>
    </article>
  );
}

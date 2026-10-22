import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { publishedActivities } from "../lib/activities.js";
import ActivityCard from "../components/ActivityCard.jsx";

export default function Activities() {
  const { content, loading } = useSiteContent();
  const activities = publishedActivities(content);

  usePageTitle("Activities");

  return (
    <div className="container page">
      <h1>Our Activities</h1>
      <p className="lede">
        Trainings, workshops and events run by Model Disabled Society Rasuwa with persons with
        disabilities, their families and our partners — newest first.
      </p>

      {loading ? <p>Loading…</p> : null}

      {!loading && activities.length === 0 ? (
        <p>No activities have been posted yet. Please check back soon.</p>
      ) : null}

      {!loading && activities.length > 0 ? (
        <ul className="activity-grid activity-grid-page" role="list">
          {activities.map((a) => (
            <li key={a.id}>
              <ActivityCard activity={a} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

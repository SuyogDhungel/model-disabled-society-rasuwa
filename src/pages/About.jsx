import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { useBoardMembers } from "../hooks/useBoardMembers.js";
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

export default function About() {
  const { t, lang } = useLanguage();
  const { about } = t;
  const { content } = useSiteContent();
  const org = content.organization;
  const a = content.about;
  const { members: boardMembers, loading: boardLoading, error: boardError } = useBoardMembers();

  usePageTitle(about.pageTitle);

  const pick = (en, ne) => (lang === "ne" ? ne || en : en || ne);
  const objectives = lang === "ne" ? a.objectivesNe : a.objectivesEn;

  return (
    <div className="container page">
      <h1>{about.pageTitle}</h1>

      <section className="section-block">
        <h2>{about.registrationHeading}</h2>
        <p>{about.registrationIntro}</p>
        <dl className="fact-list">
          <div>
            <dt>{about.regNoLabel}</dt>
            <dd>{org.registrationNo}</dd>
          </div>
          <div>
            <dt>{about.regDateLabel}</dt>
            <dd>{org.registrationDate}</dd>
          </div>
          <div>
            <dt>{about.affiliationLabel}</dt>
            <dd>
              {lang === "ne" ? "समाज कल्याण परिषद्" : "Social Welfare Council"}, {org.affiliationNo.split(" ")[0]}
            </dd>
          </div>
          <div>
            <dt>{about.locationLabel}</dt>
            <dd>
              <span lang="ne">{org.wardNe}</span>, <span lang="ne">{org.districtNe}</span>,{" "}
              {org.provinceEn}
            </dd>
          </div>
        </dl>
      </section>

      <section className="section-block">
        <h2>{about.visionHeading}</h2>
        <p className="preserve-lines">{pick(a.visionEn, a.visionNe)}</p>
      </section>

      <section className="section-block">
        <h2>{about.missionHeading}</h2>
        <p className="preserve-lines">{pick(a.missionEn, a.missionNe)}</p>
      </section>

      <section className="section-block">
        <h2>{about.objectivesHeading}</h2>
        <p>{about.objectivesIntro}</p>
        <ol className="objectives-list">
          {(objectives || []).map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ol>
      </section>

      <section className="section-block">
        <h2>{about.historyHeading}</h2>
        <p className="preserve-lines">{pick(a.historyEn, a.historyNe)}</p>
      </section>

      <section className="section-block">
        <h2>{about.boardHeading}</h2>
        <p>{about.boardIntro}</p>
        {/*
          Data-driven board grid, backend-editable at /admin/board. Members
          without a photo fall back to a neutral, decorative silhouette
          (aria-hidden in the SVG itself) rather than a broken image or an
          empty box. Committee photos are treated as decorative (alt="")
          because the name and position are always shown as visible text
          right beside the photo -- unless an admin has entered specific
          alt text for a photo, in which case that is used instead.
        */}
        {boardLoading ? <p>Loading…</p> : null}
        {boardError ? (
          <p className="field-error" role="alert">
            Couldn't load the committee list right now — please try again shortly.
          </p>
        ) : null}
        <ul className="board-grid">
          {boardMembers.map((member) => {
            const name = pick(member.nameEn, member.nameNe);
            const position = pick(member.positionEn, member.positionNe);
            return (
              <li className="board-card" key={member.id}>
                <img
                  className="board-card-photo"
                  src={member.photoUrl || avatarPlaceholder}
                  alt={member.photoAlt || ""}
                  width="120"
                  height="120"
                />
                <p className="board-card-name">{name}</p>
                <p className="board-card-position">{position}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

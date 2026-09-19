import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";

export default function NotFound() {
  const { t } = useLanguage();
  const { notFound } = t;

  usePageTitle(notFound.title);

  return (
    <div className="container page">
      <h1>{notFound.title}</h1>
      <p className="lede">{notFound.body}</p>
      <Link className="btn btn-primary" to="/">
        {notFound.cta}
      </Link>
    </div>
  );
}

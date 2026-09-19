import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { content } from "../data/content";

const LanguageContext = createContext(null);

function readStoredLang() {
  return "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang === "ne" ? "ne" : "en";
  }, [lang]);

  function setLang(next) {
    setLangState(next);
    try {
      window.localStorage.setItem("ngo-site-lang", next);
    } catch {
      /* per-viewer convenience only — safe to ignore if storage is blocked */
    }
  }

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: content[lang],
      otherLang: lang === "en" ? "ne" : "en",
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside a LanguageProvider");
  return ctx;
}

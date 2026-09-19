import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — Namuna Apanga Samaj Rasuwa` : previous;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * SPA route changes are invisible to a screen reader unless something
 * announces them. On every link-driven navigation (PUSH) this scrolls to the
 * top and moves focus to the page's <main> landmark; on browser Back/Forward
 * (POP) it only moves focus, leaving the browser's own scroll restoration
 * alone. This is the exact gap flagged in PN-03 (Peace Nepal) and the
 * general SPA/keyboard-focus-order findings across the audits.
 */
export default function RouteFocusManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const main = document.getElementById("main-content");
    if (!main) return;

    if (navigationType !== "POP") {
      window.scrollTo(0, 0);
    }

    // <main> carries a permanent tabIndex={-1} (see App.jsx) specifically so
    // both this route change and the skip link below can focus it.
    main.focus({ preventScroll: true });
  }, [location.pathname, navigationType]);

  return null;
}

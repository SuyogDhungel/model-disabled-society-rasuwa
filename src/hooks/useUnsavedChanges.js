import { useEffect } from "react";
export function useUnsavedChanges(dirty) {
  useEffect(() => {
    if (!dirty) return;
    function unload(e) {
      e.preventDefault();
      e.returnValue = "";
    }
    function navigate(e) {
      const anchor = e.target.closest?.("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.getAttribute("href").startsWith("#")
      )
        return;
      if (
        !window.confirm(
          "You have unsaved changes. Leave this page and discard them?",
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", navigate, true);
    };
  }, [dirty]);
}

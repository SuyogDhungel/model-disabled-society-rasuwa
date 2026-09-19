import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Self-hosted fonts (bundled at build time, no third-party font CDN at
// runtime) -- more reliable for visitors on slow or restricted connections
// than a Google Fonts <link>, and lets the Content-Security-Policy in
// vercel.json avoid allow-listing an external font host at all.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/500.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "@fontsource/noto-sans-devanagari/700.css";
import "./index.css";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SiteContentProvider } from "./context/SiteContentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SiteContentProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SiteContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);

# 🎨 Design System & Accessibility Standards (2026)
*Project: Model Disabled Society Rasuwa (नमूना अपाङ्ग समाज रसुवा)*

As a digital platform representing persons with disabilities in Rasuwa, Nepal, this website prioritizes **universal accessibility (WCAG 2.1 AA / AAA)** and bilingual clarity above all else.

---

## 1. Accessibility First Principles

1. **Screen Reader Optimization:**
   - Every meaningful image **must** include descriptive alternative text (`alt`).
   - Purely decorative images use `alt=""` and `aria-hidden="true"`.
   - Skip links (`#main-content`) are positioned at the very top of the DOM.
   - Live regions (`role="status"`, `role="alert"`) inform assistive technologies of dynamic feedback (saving status, error alerts).

2. **Keyboard Navigation & Focus Management:**
   - All interactive controls (buttons, links, form inputs) are fully operable via keyboard (`Tab`, `Enter`, `Space`, `Escape`).
   - High-visibility focus rings (`outline: 3px solid var(--accent)` with offset) are strictly preserved across all states.
   - `RouteFocusManager` resets focus to the main heading upon route transitions.

3. **Color Contrast:**
   - Text color meets or exceeds a **4.5:1** contrast ratio for normal text and **3:1** for large text (WCAG AA).
   - High-contrast elements meet **7:1** (WCAG AAA).

---

## 2. Typography & Bilingual Support

- **Latin Characters:** Font family `Inter`, sans-serif. Clean, legibly distinct letterforms.
- **Devanagari (Nepali) Characters:** Font family `Noto Sans Devanagari`. High legibility across all weights (400, 500, 600, 700).
- **Self-Hosted Webfonts:** All font binaries (`woff2`, `woff`) are bundled locally under `src/assets/fonts/` to prevent external CDN tracking and guarantee offline availability.

---

## 3. Core UI Tokens

- **Primary Brand Color:** `--primary: #0f3d59;` (Deep Accessible Navy)
- **Accent / Interactive:** `--accent: #1967d2;` (High-contrast Sapphire Blue)
- **Background:** `--bg: #f8fafc;` (Soft Neutral White)
- **Text:** `--text: #0f172a;` (Slate 900)
- **Muted Text:** `--muted: #475569;` (Slate 600)
- **Border:** `--border: #cbd5e1;` (Slate 300)
- **Success:** `--success: #15803d;` (Green 700)
- **Error:** `--error: #b91c1c;` (Red 700)
- **Border Radius:** `--radius: 8px;`

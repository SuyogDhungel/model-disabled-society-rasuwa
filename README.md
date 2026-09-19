# Model Disabled Society Rasuwa — Official Website

Official website for **Model Disabled Society Rasuwa (नमुना अपाङ्ग समाज रसुवा)**, a community non-governmental organization working for the rights, dignity, and inclusion of persons with disabilities in Rasuwa District, Nepal.

Built with **React**, **Vite**, **Supabase** (Database, Auth, Storage), and deployed on **Vercel**.

---

## Features

- **English-first accessible layout with Nepali support**: Automatically tags Nepali content (`lang="ne"`) for screen readers.
- **Accessible & Focusable Branding**: Keyboard-focusable top and hero logos with mandatory dynamic alternative text.
- **Admin CMS (`/admin`)**: Single-source-of-truth management for organization info, programs, verified committee members, news/notices, documents, and policies.
- **Dynamic SEO & Social Sharing**: Serverless Open Graph and Twitter card injection via Vercel serverless function (`api/index.js`), staying synchronized with Supabase updates without redeploying.
- **Document Hub**: Public downloads supporting both Unicode text/Word and PDF formats.

---

## Getting Started

### Prerequisites
- Node.js 22.12+ (Node 24 recommended)
- Supabase project credentials

### Setup
```sh
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

# 3. Start local development server
npm run dev
```

### Build and Lint
```sh
npm run lint
npm run build
```

See [EDITING_GUIDE.md](file:///c:/Users/Suyog/Documents/personal/website/Model-Disabled-Society-Rasuwa-final/EDITING_GUIDE.md) and [DEPLOYMENT.md](file:///c:/Users/Suyog/Documents/personal/website/Model-Disabled-Society-Rasuwa-final/DEPLOYMENT.md) for full administrative and deployment guides.

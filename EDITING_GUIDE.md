# Editing this site

The site has an admin panel at `/admin`: log in from your browser, edit
anything, click save — no code, no rebuilding, no re-uploading files. This
document covers the one-time setup (Supabase + Vercel, the stack you're
comfortable with) and then how to use the admin panel day to day.

If you haven't done the one-time setup yet, the public site still works —
it just shows the built-in starting content until it's connected.

## One-time setup (do this once)

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up / log in.
2. Click "New project". Pick any name (e.g. "namuna-apanga-samaj-rasuwa"),
   set a database password (save it somewhere safe), and pick a region
   close to Nepal if offered (e.g. Singapore).
3. Wait a minute or two for the project to finish setting up.

### 2. Run the database setup script

1. In your new Supabase project, open the **SQL Editor** (left sidebar) →
   "New query".
2. Open `supabase/schema.sql` in this project folder, copy its entire
   contents, and paste it into the SQL Editor. Click "Run".
3. This creates one content table (`site_content`) holding everything on
   the site as a single editable record, an admin allow-list table
   (`ngo_admins`), the two storage buckets, and a database-level rule that
   **rejects any save that's missing required alt text** — so a page can
   never accidentally go live with an undescribed image, even if someone
   edits the database directly instead of through the admin panel.

### 3. Create your admin login

1. Open **Authentication** → **Users** in the left sidebar → "Add user" →
   "Create new user". Enter your email and choose a password. This is what
   you'll use to log into `/admin/login` on the live site — Claude never
   sees or stores this password; Supabase handles it entirely.
2. Copy the new user's **UID** (shown in the Users list once created).
3. Back in the **SQL Editor**, run this once, replacing the UUID with the
   one you just copied:
   ```sql
   insert into ngo_admins (user_id) values ('paste-the-uuid-here');
   ```
   This is the allow-list step: creating a Supabase login is not enough by
   itself — only UUIDs listed in `ngo_admins` can save changes. Add a row
   here for anyone else (a co-editor, a future webmaster) the same way,
   after creating their own login in step 1.

### 4. Confirm the storage buckets

The script in step 2 already created two **public** buckets: `site-images`
(logo, hero photo, program/notice/resource images) and `report-files`
(PDF/Word attachments). You can see them under **Storage** in the sidebar
— nothing else to do here unless one is missing, in which case re-run
`supabase/schema.sql`.

### 5. Get your connection details

1. Open **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **anon / public** key (labelled
   "publishable" on newer Supabase projects — NOT the "service_role" key,
   which must never be used in this app).
3. Copy `.env.example` in this project folder to a new file named `.env`,
   and paste your two values in:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```
   `.env` is git-ignored on purpose — it holds your real keys and should
   never be committed or shared. (This key is safe to expose in the
   browser by design; every write it can attempt is still checked against
   `ngo_admins` and the validation rule on the server.)

### 6. Deploy to Vercel

1. Push this project to a GitHub (or GitLab/Bitbucket) repository, if it
   isn't already in one.
2. Go to [vercel.com](https://vercel.com), sign up / log in, click "Add
   New… → Project", and import that repository. Vercel auto-detects it as
   a Vite project.
3. Before deploying, open **Environment Variables** on the project setup
   screen and add the same two values from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Click Deploy. Once it finishes, Vercel gives you a live URL — point
   your real domain (modeldisabledsocietyrasuwa.org.np) at it later from
   Vercel's Domains settings.
5. If you ever change these values, update them in Vercel's project
   Settings → Environment Variables, then redeploy (Vercel's "Redeploy"
   button on the latest deployment is enough — no code change needed).

That's it — the site is live and self-editable. You'll only come back to
Vercel/GitHub when the code itself changes (layout, wording outside the
admin panel, new features); day-to-day content changes never need a
redeploy.

## Day-to-day editing

Go to `yoursite.com/admin/login` and sign in with the email and password
from step 3. The admin panel has five sections:

**Site settings** — organization details (name, registration info,
contact details, address in both languages), the logo, the homepage hero
image and text, the About page (vision/mission/history/objectives), the
three policy pages (accessibility, privacy, safeguarding), and the search/
social-sharing preview (page title, description, and the image shown when
the site is shared on Facebook/WhatsApp/Twitter).

Everything here is genuinely wired up — nothing is hardcoded. Change the
logo once and it updates the header, the browser tab, the homepage hero
(whenever no separate hero photo is set), and the link preview people see
when they share the site, because they all read from the one logo value
you set here. A live preview box under the logo field shows exactly what
will appear once you save.

**Programs**, **Committee**, **News & notices**, **Reports & documents** —
one shared editor for each of these lists. For each item you choose a
**content language**: English only, Nepali only, or both. Pick "both" for
anything with a full translation, and one of the single-language options
for content that only exists in one language for now — the form then only
shows the fields for that language, and the page displays it correctly
without a site-wide language toggle (there isn't one anymore; each piece
of content simply renders in whichever language(s) it was written in,
tagged correctly for screen readers).

A few things worth knowing:

- **Alt text is mandatory, not optional, whenever an image is attached.**
  The form checks this before it lets you save, and the database checks it
  again independently — so it can't be skipped even by accident. The one
  exception is committee photos, where alt text is optional because the
  name and role are already shown as visible text right next to the
  photo (leaving it blank there is the correct, accessible choice, not an
  oversight).
- **Notices and resources take multiple attachments per item** — add a PDF
  and a Word copy of the same document, for example. Always fill in the
  actual text in the form fields too; a scanned PDF alone can't be read by
  screen-reader software, so the attachment is additional, never a
  replacement for real text on the page.
- **"Publish on website"** must be checked for an item to appear publicly;
  unchecked items are saved as drafts only you can see.
- **Committee members** also have a "Name and role verified with the
  organization" checkbox. A few names were originally read off a scanned,
  handwritten document by automatic text recognition; please confirm each
  one against the real बिधान document or with the person directly, then
  tick the box.
- Every "Edit" button loads that item into the form below the list;
  "Delete" asks you to confirm first, since it can't be undone.
- If you and someone else happen to save at the same moment, the second
  save is stopped with a clear message rather than silently overwriting
  the first — reload the page and re-apply your change.

Changes take effect immediately on the public site — no rebuild, no
waiting (link-preview images on Facebook/WhatsApp/Twitter can take up to a
minute to update, and those platforms may also cache an older preview
until you re-share the link).

## If something looks wrong

- **"Couldn't load…" message on the public site or in the admin panel**:
  usually means the Supabase project is paused (free-tier projects pause
  after a week of no activity — open the Supabase dashboard once to wake
  it back up) or the environment variables in Vercel are missing or wrong.
- **Can't log in**: double-check the email/password against Supabase →
  Authentication → Users (you can reset a password there). If login
  succeeds but you're immediately signed out with a "not listed as a site
  administrator" message, the account exists but hasn't been added to
  `ngo_admins` — repeat step 3's SQL insert with that user's UID.
- **Save is refused with a message about missing alt text or a missing
  title**: that's the database's validation rule working as intended —
  fill in the missing field and save again.
- **A photo or file won't upload**: check the file isn't unusually large,
  and that the `site-images` / `report-files` buckets exist and are Public
  (Storage in the Supabase sidebar).

## Before this site is truly "final"

- Confirm the committee members still flagged as unverified (see above).
- Add real photos of the organisation's members/activities once available,
  via Site settings → Homepage, or per-item images on Programs/Notices.

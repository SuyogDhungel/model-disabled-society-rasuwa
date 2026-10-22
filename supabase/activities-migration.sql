-- Activities feature — one-time database update
-- =============================================
-- Run this ONCE in Supabase → SQL Editor → New query → paste → Run.
-- (A fresh project only needs supabase/schema.sql, which already includes all of this.)
--
-- What it does:
--   1. Save-time check: every activity photo must have alt text, and a
--      published activity must have a title, an A.D. date and at least one photo.
--   2. Public read: hides draft (unpublished) activities from the website.
--   3. Adds admin roles: "editor" accounts (staff) can only post
--      activities; "developer" accounts can change everything.
--   4. Adds the four starting activities (from the 2082/83 programme reports)
--      if the database has no activities yet. Safe to re-run: it never
--      overwrites activities you've already added.

begin;

create or replace function public.validate_site_content()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  item jsonb;
  langs text[];
begin
  if jsonb_typeof(new.content) <> 'object' then
    raise exception 'Site content must be a JSON object.';
  end if;

  if jsonb_typeof(coalesce(new.content->'programs', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(new.content->'board', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(new.content->'notices', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(new.content->'resources', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(new.content->'activities', '[]'::jsonb)) <> 'array' then
    raise exception 'Site content collections (programs, board, notices, resources, activities) must be JSON arrays.';
  end if;

  if coalesce(new.content#>>'{organization,logoUrl}', '') <> ''
     and btrim(coalesce(new.content#>>'{organization,logoAlt}', '')) = '' then
    raise exception 'Logo alternative text is required whenever a logo image is set.';
  end if;

  if coalesce(new.content#>>'{appearance,heroImageUrl}', '') <> ''
     and btrim(coalesce(new.content#>>'{appearance,heroImageAltEn}', '')) = ''
     and btrim(coalesce(new.content#>>'{appearance,heroImageAltNe}', '')) = '' then
    raise exception 'Hero image alternative text is required whenever a hero image is set.';
  end if;

  if coalesce(new.content#>>'{seo,socialImageUrl}', '') <> ''
     and btrim(coalesce(new.content#>>'{seo,socialImageAlt}', '')) = '' then
    raise exception 'Social preview image alternative text is required whenever a social image is set.';
  end if;

  -- programs: image alt text mandatory; published items need a title in
  -- every language their contentLanguage selects.
  for item in select value from jsonb_array_elements(new.content->'programs')
  loop
    if coalesce(item->>'imageUrl', '') <> ''
       and btrim(coalesce(item->>'imageAltEn', '')) = ''
       and btrim(coalesce(item->>'imageAltNe', '')) = '' then
      raise exception 'Every program image requires alternative text.';
    end if;
    langs := case coalesce(item->>'contentLanguage', 'bilingual')
      when 'en' then array['En'] when 'ne' then array['Ne'] else array['En','Ne'] end;
    if coalesce(item->>'published', 'false') = 'true' then
      if 'En' = any(langs) and btrim(coalesce(item->>'titleEn', '')) = '' then
        raise exception 'A published program needs an English title.';
      end if;
      if 'Ne' = any(langs) and btrim(coalesce(item->>'titleNe', '')) = '' then
        raise exception 'A published program needs a Nepali title.';
      end if;
    end if;
  end loop;

  -- board: alt text NOT required (decorative photo beside visible name),
  -- but a published member still needs a name in each selected language.
  for item in select value from jsonb_array_elements(new.content->'board')
  loop
    langs := case coalesce(item->>'contentLanguage', 'bilingual')
      when 'en' then array['En'] when 'ne' then array['Ne'] else array['En','Ne'] end;
    if coalesce(item->>'published', 'false') = 'true' then
      if 'En' = any(langs) and btrim(coalesce(item->>'nameEn', '')) = '' then
        raise exception 'A published committee member needs an English name.';
      end if;
      if 'Ne' = any(langs) and btrim(coalesce(item->>'nameNe', '')) = '' then
        raise exception 'A published committee member needs a Nepali name.';
      end if;
    end if;
  end loop;

  -- notices: image alt text mandatory; published items need a title.
  for item in select value from jsonb_array_elements(new.content->'notices')
  loop
    if coalesce(item->>'imageUrl', '') <> ''
       and btrim(coalesce(item->>'imageAltEn', '')) = ''
       and btrim(coalesce(item->>'imageAltNe', '')) = '' then
      raise exception 'Every notice image requires alternative text.';
    end if;
    langs := case coalesce(item->>'contentLanguage', 'bilingual')
      when 'en' then array['En'] when 'ne' then array['Ne'] else array['En','Ne'] end;
    if coalesce(item->>'published', 'false') = 'true' then
      if 'En' = any(langs) and btrim(coalesce(item->>'titleEn', '')) = '' then
        raise exception 'A published notice needs an English title.';
      end if;
      if 'Ne' = any(langs) and btrim(coalesce(item->>'titleNe', '')) = '' then
        raise exception 'A published notice needs a Nepali title.';
      end if;
    end if;
  end loop;

  -- resources: same rules as notices.
  for item in select value from jsonb_array_elements(new.content->'resources')
  loop
    if coalesce(item->>'imageUrl', '') <> ''
       and btrim(coalesce(item->>'imageAltEn', '')) = ''
       and btrim(coalesce(item->>'imageAltNe', '')) = '' then
      raise exception 'Every resource image requires alternative text.';
    end if;
    langs := case coalesce(item->>'contentLanguage', 'bilingual')
      when 'en' then array['En'] when 'ne' then array['Ne'] else array['En','Ne'] end;
    if coalesce(item->>'published', 'false') = 'true' then
      if 'En' = any(langs) and btrim(coalesce(item->>'titleEn', '')) = '' then
        raise exception 'A published resource needs an English title.';
      end if;
      if 'Ne' = any(langs) and btrim(coalesce(item->>'titleNe', '')) = '' then
        raise exception 'A published resource needs a Nepali title.';
      end if;
    end if;
  end loop;

  -- activities: every photo needs alt text; a published activity needs a
  -- title, a valid A.D. date (YYYY-MM-DD) and at least one photo.
  for item in select value from jsonb_array_elements(coalesce(new.content->'activities', '[]'::jsonb))
  loop
    if jsonb_typeof(coalesce(item->'photos', '[]'::jsonb)) <> 'array' then
      raise exception 'Activity photos must be a JSON array.';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(item->'photos', '[]'::jsonb)) as photo
      where coalesce(photo->>'url', '') <> ''
        and btrim(coalesce(photo->>'altEn', '')) = ''
        and btrim(coalesce(photo->>'altNe', '')) = ''
    ) then
      raise exception 'Every activity photo requires alternative text (activity: %).',
        coalesce(nullif(item->>'titleEn', ''), item->>'id');
    end if;
    if coalesce(item->>'published', 'false') = 'true' then
      if btrim(coalesce(item->>'titleEn', '')) = '' and btrim(coalesce(item->>'titleNe', '')) = '' then
        raise exception 'A published activity needs a title.';
      end if;
      if coalesce(item->>'date', '') !~ '^\d{4}-\d{2}-\d{2}$' then
        raise exception 'A published activity needs a date in YYYY-MM-DD (A.D.) format.';
      end if;
      if jsonb_array_length(coalesce(item->'photos', '[]'::jsonb)) = 0 then
        raise exception 'A published activity needs at least one photo.';
      end if;
    end if;
  end loop;

  return new;
end;
$$;

revoke all on function public.validate_site_content() from public;

create or replace function public.get_public_site_content()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  result jsonb;
begin
  select content into result from public.site_content where id = 'main';
  if result is null then
    return '{}'::jsonb;
  end if;

  result := jsonb_set(result, '{programs}', public._site_public_items(result->'programs'), true);
  result := jsonb_set(result, '{board}', public._site_public_items(result->'board', true), true);
  result := jsonb_set(result, '{notices}', public._site_public_items(result->'notices'), true);
  result := jsonb_set(result, '{resources}', public._site_public_items(result->'resources'), true);
  -- Only touch "activities" once it exists, so a database that hasn't been
  -- given any activities yet lets the site show its built-in starting set.
  if result ? 'activities' then
    result := jsonb_set(result, '{activities}', public._site_public_items(result->'activities'), true);
  end if;

  return result;
end;
$$;

revoke all on function public.get_public_site_content() from public;
grant execute on function public.get_public_site_content() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Admin roles: "developer" can change everything; "editor" (the
-- organisation's staff) can only add, edit and delete ACTIVITIES.
-- The website's admin panel hides the other sections from editors, and
-- this trigger enforces it in the database too.
-- New accounts added to ngo_admins are editors unless you say otherwise:
--   insert into public.ngo_admins (user_id) values ('<user id>');                      -- editor
--   insert into public.ngo_admins (user_id, role) values ('<user id>', 'developer');   -- developer
--   update public.ngo_admins set role = 'developer' where user_id = '<user id>';
-- ---------------------------------------------------------------------
alter table public.ngo_admins add column if not exists role text not null default 'editor';
alter table public.ngo_admins drop constraint if exists ngo_admins_role_check;
alter table public.ngo_admins add constraint ngo_admins_role_check check (role in ('developer', 'editor'));

create or replace function public.ngo_admin_role()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from public.ngo_admins where user_id = auth.uid();
$$;

revoke all on function public.ngo_admin_role() from public;
grant execute on function public.ngo_admin_role() to authenticated;

create or replace function public.is_ngo_developer()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(public.ngo_admin_role() = 'developer', false);
$$;

revoke all on function public.is_ngo_developer() from public;
grant execute on function public.is_ngo_developer() to authenticated;

create or replace function public.guard_site_content_scope()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Changes made in the Supabase dashboard / SQL editor have no signed-in
  -- user and are always allowed.
  if auth.uid() is null or public.is_ngo_developer() then
    return new;
  end if;
  if (new.content - 'activities') is distinct from (old.content - 'activities') then
    raise exception 'This account can only post and edit activities. Ask the site developer to change other parts of the website.';
  end if;
  return new;
end;
$$;

revoke all on function public.guard_site_content_scope() from public;

drop trigger if exists site_content_guard_scope on public.site_content;
create trigger site_content_guard_scope
before update on public.site_content
for each row execute function public.guard_site_content_scope();

-- Editors may upload new photos/documents (for activities) but only a
-- developer may replace or delete existing files (logo, reports, ...).
drop policy if exists "Admin can update site images" on storage.objects;
create policy "Admin can update site images"
on storage.objects for update
to authenticated
using (bucket_id = 'site-images' and (select public.is_ngo_developer()))
with check (bucket_id = 'site-images' and (select public.is_ngo_developer()));

drop policy if exists "Admin can delete site images" on storage.objects;
create policy "Admin can delete site images"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-images' and (select public.is_ngo_developer()));

drop policy if exists "Admin can update report files" on storage.objects;
create policy "Admin can update report files"
on storage.objects for update
to authenticated
using (bucket_id = 'report-files' and (select public.is_ngo_developer()))
with check (bucket_id = 'report-files' and (select public.is_ngo_developer()));

drop policy if exists "Admin can delete report files" on storage.objects;
create policy "Admin can delete report files"
on storage.objects for delete
to authenticated
using (bucket_id = 'report-files' and (select public.is_ngo_developer()));

update public.site_content
set content = jsonb_set(content, '{activities}', $seed$[
  {
    "id": "activity-digital-literacy-workshop-2026",
    "slug": "one-day-digital-literacy-workshop-kalika",
    "contentLanguage": "en",
    "published": true,
    "date": "2026-07-08",
    "endDate": "",
    "location": "Kalika Rural Municipality–2, Rasuwa",
    "titleEn": "One-day digital literacy workshop held in Kalika",
    "titleNe": "एक दिने डिजिटल साक्षरता कार्यशाला",
    "summaryEn": "36 persons with disabilities learned to use smartphones, the internet, digital payments and online government services safely, with support from Nepal Telecom.",
    "bodyEn": "Model Disabled Society Rasuwa organised a one-day digital literacy workshop for persons with disabilities in Kalika Rural Municipality–2, Rasuwa, with CSR support from Nepal Telecom. 36 participants took part.\n\nThe programme was chaired by the society's President, Kishor Thing. Chief guest Mira Lama, Vice-Chairperson of Kalika Rural Municipality, spoke about why everyone now needs basic digital skills. Facilitator Umesh Devkota then led sessions on what artificial intelligence (AI) is and how it works, safe use of the internet, and online risks.\n\nThrough presentations, hands-on practice and group discussion, participants practised using smartphones, email, the internet, social media, digital payments and online government services on their own phones, and learned about password safety and avoiding online fraud.\n\nParticipants said they now feel more confident using digital services, and asked for similar programmes to be extended to every ward, along with more advanced training on cyber security.",
    "bodyNe": "",
    "photos": [
      {
        "id": "photo-dlw-1",
        "url": "/images/activities/digital-literacy-workshop-group.webp",
        "altEn": "Workshop participants and guests stand together in a hall, holding a banner that reads 'Digital Literacy Program' in Nepali.",
        "captionEn": "Participants and guests at the digital literacy workshop."
      },
      {
        "id": "photo-dlw-2",
        "url": "/images/activities/digital-literacy-workshop-facilitator.webp",
        "altEn": "A facilitator stands and speaks to seated participants beside a table with a projector and laptop.",
        "captionEn": "Facilitator Umesh Devkota leads a session on AI and online safety."
      },
      {
        "id": "photo-dlw-3",
        "url": "/images/activities/digital-literacy-workshop-session.webp",
        "altEn": "Participants seated in rows watch a presentation projected on a screen at the front of the hall.",
        "captionEn": "Participants follow a presentation on digital services."
      }
    ]
  },
  {
    "id": "activity-computer-ai-training-2026",
    "slug": "30-day-computer-and-ai-education-training",
    "contentLanguage": "en",
    "published": true,
    "date": "2026-05-15",
    "endDate": "2026-06-14",
    "location": "Naukunda Rural Municipality, Rasuwa",
    "titleEn": "30-day basic computer and AI education training completed",
    "titleNe": "३० दिने आधारभूत कम्प्युटर तथा एआई एजुकेशन तालिम",
    "summaryEn": "15 students with disabilities, from very poor families or without parents, completed a month of hands-on computer, internet and AI training and received certificates.",
    "bodyEn": "In partnership with Naukunda Rural Municipality, Model Disabled Society Rasuwa ran a 30-day basic computer and AI education training for students with disabilities, students from very poor families and students without parents. Fifteen students, recommended by their wards, took part. The training ran from 15 May to 13 June 2026, with a closing and certificate ceremony on 14 June 2026.\n\nStarting from the basics, students learned the parts of a computer, Windows, using the mouse and keyboard, English and Nepali (Unicode) typing, and file management. They went on to Microsoft Word, Excel and PowerPoint, preparing their own applications, CVs, simple mark sheets, expense sheets and short presentations about their village or school.\n\nLater sessions covered the internet, searching for and checking information, email and attachments, online forms, digital safety and passwords, and how to use AI tools safely and responsibly for study, writing, translation and summaries.\n\nEach topic was taught through demonstration, practice and daily review, at a pace that suited each student's needs. The programme cost Rs. 500,000 and was carried out under an agreement with Naukunda Rural Municipality.",
    "bodyNe": "",
    "photos": [
      {
        "id": "photo-cat-1",
        "url": "/images/activities/computer-ai-training-lab.webp",
        "altEn": "Students work at laptops and desktop computers in a green-walled computer lab while an instructor looks on; the training banner hangs on the wall.",
        "captionEn": "Students practising in the computer lab."
      },
      {
        "id": "photo-cat-2",
        "url": "/images/activities/computer-ai-training-laptop.webp",
        "altEn": "A participant types on a laptop during a hands-on practice session, with a smartphone on the desk beside her.",
        "captionEn": "Hands-on practice on a laptop."
      },
      {
        "id": "photo-cat-3",
        "url": "/images/activities/computer-ai-training-certificate.webp",
        "altEn": "At the closing ceremony, a participant receives her training certificate from guests seated at a curved table.",
        "captionEn": "Certificate distribution at the closing ceremony."
      }
    ]
  },
  {
    "id": "activity-chowmein-chips-training-2026",
    "slug": "15-day-chowmein-and-potato-chips-training",
    "contentLanguage": "en",
    "published": true,
    "date": "2026-04-11",
    "endDate": "2026-04-25",
    "location": "Rasuwa",
    "titleEn": "15-day chowmein and potato chips making and marketing training",
    "titleNe": "१५ दिने व्यवसायीक चाउमिन र आलु चिप्स बनाउने तथा बजारिकरण तालिम",
    "summaryEn": "Persons with disabilities and their family members learned to make, pack and sell chowmein noodles and potato chips as a small business.",
    "bodyEn": "Model Disabled Society Rasuwa ran a 15-day commercial chowmein and potato chips making and marketing training for persons with disabilities and their family members, from 11 to 25 April 2026. The training was funded by the Bagmati Province Ministry of Social Development, through the Social Development Office, Dhading, as part of the Government of Nepal's programme for the rights, capacity building and empowerment of persons with disabilities.\n\nTrainer Ramhari Devkota opened with three days on entrepreneurship: what a business is, how to manage its finances, how markets work, and how to make a simple business plan.\n\nParticipants then practised making chowmein noodles with a noodle machine, making potato chips, and packing and marketing the products. The aim is for participants to start their own small businesses and earn an income.\n\nThe training ended with participants receiving their certificates.",
    "bodyNe": "",
    "photos": [
      {
        "id": "photo-ccc-1",
        "url": "/images/activities/chowmein-chips-training-certificates.webp",
        "altEn": "Training participants sit in rows on the floor and on chairs, holding up their completion certificates beneath the training banner.",
        "captionEn": "Participants with their completion certificates."
      },
      {
        "id": "photo-ccc-2",
        "url": "/images/activities/chowmein-chips-training-noodle-machine.webp",
        "altEn": "Participants wearing hairnets and face masks watch as a sheet of dough is fed through a noodle-making machine.",
        "captionEn": "Making chowmein noodles with a noodle machine."
      },
      {
        "id": "photo-ccc-3",
        "url": "/images/activities/chowmein-chips-training-products.webp",
        "altEn": "Sealed packets of homemade potato chips stacked beside bundles of fresh chowmein noodles made during the training.",
        "captionEn": "Packed potato chips and noodles made by participants."
      }
    ]
  },
  {
    "id": "activity-idpd-2025",
    "slug": "34th-international-day-of-persons-with-disabilities-2025",
    "contentLanguage": "en",
    "published": true,
    "date": "2025-12-03",
    "endDate": "",
    "location": "Rasuwa",
    "titleEn": "34th International Day of Persons with Disabilities marked in Rasuwa",
    "titleNe": "३४ औं अन्तर्राष्ट्रिय अपाङ्गता दिवस",
    "summaryEn": "An awareness and interaction programme brought together local government, civil society and journalists to discuss the issues facing persons with disabilities in Rasuwa.",
    "bodyEn": "Model Disabled Society Rasuwa marked the 34th International Day of Persons with Disabilities on 3 December 2025 with an awareness and interaction programme on the problems faced by persons with disabilities in Rasuwa.\n\nThe programme was chaired by the society's President, Kishor Thing, and hosted by Pratima Tamang. Chief guest Harikrishna Devkota, Chairperson of Kalika Rural Municipality, said that even with limited local income, the municipality would continue to give what support it can to persons with disabilities, including scholarships for higher education at Kalika College.\n\nSpecial guest Hemnath Khatiwada, Chairperson of the NGO Federation and a journalist, noted that the Constitution of Nepal (2015) guarantees the rights of persons with disabilities, but that these rights are not yet fully practised, and stressed the need to end discrimination in daily life.\n\nParticipants called for training that builds the knowledge, skills and abilities of persons with disabilities according to their needs.",
    "bodyNe": "",
    "photos": [
      {
        "id": "photo-idpd-1",
        "url": "/images/activities/disability-day-2025-speaker.webp",
        "altEn": "A woman speaks into a microphone at the front of a hall while guests sit behind low tables on a stage with the Nepali flag.",
        "captionEn": "Speakers address the International Day of Persons with Disabilities programme."
      },
      {
        "id": "photo-idpd-2",
        "url": "/images/activities/disability-day-2025-participants.webp",
        "altEn": "Participants sit at long tables in a hall, listening to the programme.",
        "captionEn": "Participants at the interaction programme."
      }
    ]
  }
]$seed$::jsonb, true)
where id = 'main'
  and not (content ? 'activities');

commit;

-- AFTER RUNNING: make YOUR OWN account a developer (every existing admin
-- becomes an "editor" by default), replacing the email below:
--   update public.ngo_admins set role = 'developer'
--   where user_id = (select id from auth.users where email = 'developer@example.com');
--
-- Check: should list the 4 activity titles.
select a->>'date' as date, a->>'titleEn' as title
from public.site_content, jsonb_array_elements(content->'activities') a
where id = 'main'
order by 1 desc;

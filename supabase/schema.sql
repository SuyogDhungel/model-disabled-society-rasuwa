-- Namuna Apanga Samaj Rasuwa — Supabase schema (v2)
--
-- This mirrors the same architecture as suyog-dhungel-portfolio's own
-- Supabase backend: one JSONB "content" row edited wholesale from the admin
-- panel, an explicit admin allowlist table (not "any authenticated user"),
-- a BEFORE INSERT/UPDATE trigger that rejects a save outright if it's
-- missing required alt text or a required bilingual title, and a
-- SECURITY DEFINER function that hands the public site a filtered,
-- published-only view without ever exposing the admin-only read/write path.
--
-- HOW TO RUN THIS (fresh project):
--   1. Open your project at supabase.com → SQL Editor → "New query".
--   2. Paste this entire file and click "Run". It's wrapped in a single
--      transaction, so if anything fails, nothing is left half-applied.
--   3. Go to Authentication → Users → "Add user" and create your admin
--      login (your email + a password you choose).
--   4. Copy that new user's UUID (Authentication → Users → click them).
--   5. Run this once, with the UUID substituted in:
--         insert into public.ngo_admins (user_id) values ('PASTE-UUID-HERE');
--   6. Go to Storage (left sidebar) and confirm the two buckets below
--      ("site-images", "report-files") were created — this script creates
--      them for you; you don't need to do it by hand.
--
-- Re-running this file is safe: every create is guarded with "if not
-- exists" / "or replace", and the seed content only inserts once.
--
-- REPLACING THE OLDER (v1) THREE-TABLE SCHEMA: if you already ran the
-- previous version of this file (separate board_members/notices/resources
-- tables, no site_content row), this version drops those three tables and
-- replaces them with one JSONB row that holds everything, including the
-- board roster. Nothing has been deployed to production yet as of this
-- writing, so this is a clean swap, not a migration — if you've already
-- entered real content into the old tables, export it first.

begin;

drop table if exists public.board_members cascade;
drop table if exists public.notices cascade;
drop table if exists public.resources cascade;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Admin allowlist — who is allowed to read/write the content row.
-- Deliberately NOT "any authenticated user": this is a named allowlist you
-- control by inserting/deleting rows, exactly like portfolio_admins in
-- suyog-dhungel-portfolio.
-- ---------------------------------------------------------------------
create table if not exists public.ngo_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- The entire site's editable content, as one JSON object.
-- ---------------------------------------------------------------------
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint site_content_singleton check (id = 'main'),
  constraint site_content_is_object check (jsonb_typeof(content) = 'object')
);

insert into public.site_content (id, content)
values (
  'main',
  $site_json$
{
  "schemaVersion": 1,
  "organization": {
    "nameEn": "Namuna Apanga Samaj Rasuwa",
    "nameNe": "नमुना अपाङ्ग समाज रसुवा",
    "shortNameEn": "Model Disabled Society Rasuwa",
    "registrationNo": "523/2081-82",
    "registrationDate": "2082/03/17 (B.S.)",
    "affiliationNo": "58380 (Social Welfare Council)",
    "wardEn": "Naukunda Rural Municipality – 3, Parchyang",
    "wardNe": "नौकुण्ड गाउँपालिका – ३, पार्च्याङ",
    "districtEn": "Rasuwa District",
    "districtNe": "रसुवा जिल्ला",
    "provinceEn": "Bagmati Province, Nepal",
    "provinceNe": "बागमती प्रदेश, नेपाल",
    "chairpersonEn": "Kishor Thing Tamang",
    "chairpersonNe": "किशोर थिङ तामाङ",
    "chairpersonTitleEn": "Chairperson",
    "chairpersonTitleNe": "अध्यक्ष",
    "phone": "9841083320",
    "email": "modeldisabilitysocietyrasuwa@gmail.com",
    "facebook": "https://www.facebook.com/share/17rRicSfu8/",
    "domain": "modeldisabledsocietyrasuwa.org.np",
    "logoUrl": "",
    "logoAlt": "Model Disabled Society Rasuwa logo"
  },
  "appearance": {
    "heroImageUrl": "",
    "heroImageAltEn": "",
    "heroImageAltNe": ""
  },
  "seo": {
    "title": "Namuna Apanga Samaj Rasuwa",
    "description": "A community organisation working for the rights, dignity and inclusion of persons with disabilities in Rasuwa, Nepal.",
    "socialImageUrl": "",
    "socialImageAlt": "",
    "socialImageWidth": 1200,
    "socialImageHeight": 630
  },
  "home": {
    "eyebrowEn": "Naukunda-3, Parchyang · Rasuwa District",
    "eyebrowNe": "नौकुण्ड-३, पार्च्याङ · रसुवा जिल्ला",
    "titleEn": "Namuna Apanga Samaj Rasuwa",
    "titleNe": "नमुना अपाङ्ग समाज रसुवा",
    "subtitleEn": "A community organisation working for the rights, dignity and inclusion of persons with disabilities in Rasuwa.",
    "subtitleNe": "रसुवामा अपाङ्गता भएका व्यक्तिहरूको अधिकार, सम्मान र समावेशीकरणका लागि कार्यरत सामुदायिक संस्था।",
    "introEn": "Namuna Apanga Samaj Rasuwa is registered with the District Administration Office, Rasuwa (registration no. 523/2081-82) and affiliated with the Social Welfare Council (affiliation no. 58380). We work with persons with disabilities and their families in Naukunda Rural Municipality and across Rasuwa district.",
    "introNe": "नमुना अपाङ्ग समाज रसुवा जिल्ला प्रशासन कार्यालय, रसुवामा दर्ता (दर्ता नं. ५२३/२०८१-८२) भएको र समाज कल्याण परिषद्‌मा आबद्ध (आबद्धता नं. ५८३८०) संस्था हो। हामी नौकुण्ड गाउँपालिका र रसुवा जिल्लाभर अपाङ्गता भएका व्यक्ति र उनीहरूका परिवारसँग काम गर्छौं।"
  },
  "about": {
    "visionEn": "Nepal's Constitution and prevailing laws guarantee the rights, welfare, protection and advancement of persons with disabilities. Guided by that constitutional spirit, and working within prevailing law and due process, this organisation exists to build the capacity and self-reliance of persons with all kinds of disabilities across Rasuwa district — ensuring their equal participation, dignified living and rights — while protecting and advancing their rights and interests, furthering social inclusion, ending every form of disability-based discrimination, and contributing to a dignified life for persons with disabilities.",
    "visionNe": "नेपालको संविधान तथा प्रचलित कानुनले अपाङ्गता भएका व्यक्तिहरूको हक, हित, संरक्षण र संवर्द्धनको व्यवस्था गरेको छ। संविधानको यस मर्मलाई ध्यानमा राख्दै, प्रचलित कानून र कार्यविधिका आधारमा रसुवा जिल्लामा रहने सबै किसिमका अपाङ्गता भएका व्यक्तिहरूको क्षमता विकास र सशक्तिकरण गर्दै उनीहरूको समान सहभागिता, सम्मानजनक जीवनयापन तथा अधिकारको सुनिश्चितता गराई हक, हितको संरक्षण, संवर्द्धन र सामाजिक समावेशीकरणलाई बढाउँदै अपाङ्गतामा आधारित सबै प्रकारका भेदभावको अन्त्य गरी अपाङ्गता भएका व्यक्तिहरूको मर्यादित जीवन निर्माणमा योगदान दिने ध्येयका साथ यो संस्था स्थापना भएको हो।",
    "missionEn": "As a non-profit, non-political, public-welfare social organisation, Namuna Apanga Samaj Rasuwa works to protect and promote the rights and dignity of persons with disabilities in Rasuwa district — through advocacy, awareness, accessibility, capacity-building and coordination with government and civil-society partners — so that no person is excluded from community life because of disability.",
    "missionNe": "नाफारहित, गैर-राजनीतिक र जनहितकारी सामाजिक संस्थाको रूपमा, नमुना अपाङ्ग समाज रसुवाले रसुवा जिल्लामा अपाङ्गता भएका व्यक्तिहरूको हक र सम्मानको संरक्षण र प्रवर्द्धन गर्न वकालत, सचेतना, पहुँचयोग्यता, क्षमता विकास र सरकार तथा नागरिक समाजसँगको समन्वयमार्फत काम गर्दछ, ताकि कसैले पनि अपाङ्गताका कारण सामुदायिक जीवनबाट बहिष्कृत हुनु नपरोस्।",
    "historyEn": "Placeholder — add a short founding history: when and why the organisation was formed, and what it has done since registration in 2082 B.S.",
    "historyNe": "प्लेसहोल्डर — संस्था कहिले र किन स्थापना भयो र २०८२ सालमा दर्ता भएदेखि के गरेको छ भन्ने छोटो विवरण थप्नुहोस्।",
    "objectivesEn": [
      "Protect and promote the human rights of persons with disabilities.",
      "Advocate for equal opportunity for persons with disabilities in education, health, employment, social security and other spheres of life.",
      "Help persons with disabilities build their capacities so they become self-reliant and self-sufficient.",
      "Raise awareness about disability, end social discrimination and stigma, and contribute to building an inclusive society.",
      "Coordinate and advocate with relevant bodies to make physical infrastructure, information and communication technology, and transport systems accessible and disability-friendly.",
      "Play an active role in shaping policies, rules and laws concerning persons with disabilities, and run effective programs to implement them.",
      "Work to end all forms of violence, mistreatment and exploitation against persons with disabilities.",
      "Give special emphasis to protecting the rights and interests of women, children and senior citizens with disabilities.",
      "Help ensure the availability of assistive devices and technology that persons with disabilities need.",
      "Collect data on, study, research and publish information about persons with disabilities.",
      "Support local-level development while helping communities become self-reliant and sustainable.",
      "Run programs in partnership with other organisations that share similar objectives, among other related work."
    ],
    "objectivesNe": [
      "अपाङ्गता भएका व्यक्तिको मानव अधिकारको संरक्षण र प्रवर्द्धन गर्ने।",
      "अपाङ्गता भएका व्यक्तिलाई शिक्षा, स्वास्थ्य, रोजगारी, सामाजिक सुरक्षा तथा अन्य क्षेत्रमा समान अवसर प्रदान गर्न पैरवी गर्ने।",
      "अपाङ्गता भएका व्यक्तिको क्षमता विकास गरी उनीहरूलाई आत्मनिर्भर र स्वावलम्बी बनाउन सहयोग गर्ने।",
      "अपाङ्गता सम्बन्धी सचेतना अभिवृद्धि गर्ने, सामाजिक भेदभाव र कलंकको अन्त्य गरी समावेशी समाज निर्माणमा योगदान पुर्‍याउने।",
      "अपाङ्गता भएका व्यक्तिको पहुँचका लागि भौतिक संरचना, सूचना तथा सञ्चार प्रविधि र यातायात प्रणालीलाई मैत्रीपूर्ण बनाउन सम्बन्धित निकायसँग समन्वय तथा पैरवी गर्ने।",
      "अपाङ्गता भएका व्यक्तिसँग सम्बन्धित नीति, नियम तथा कानुन निर्माणमा सक्रिय भूमिका खेल्ने र कार्यान्वयनका लागि प्रभावकारी कार्यक्रमहरू सञ्चालन गर्ने।",
      "अपाङ्गता भएका व्यक्ति विरुद्ध हुने सबै प्रकारका हिंसा, दुर्व्यवहार र शोषणको अन्त्य गर्न कार्य गर्ने।",
      "अपाङ्गता भएका महिला, बालबालिका तथा ज्येष्ठ नागरिकको विशेष हकहितको संरक्षणमा जोड दिने।",
      "अपाङ्गता भएका व्यक्तिको लागि आवश्यक पर्ने सहायक सामग्री तथा प्रविधिको उपलब्धतामा सहयोग पुर्‍याउने।",
      "अपाङ्गता भएका व्यक्तिको तथ्याङ्क सङ्कलन, अध्ययन, अनुसन्धान र प्रकाशन गर्ने।",
      "स्थानीय स्तरको विकासमा हातेमालो गर्दै आत्मनिर्भर र दिगो बनाउन मदत गर्ने।",
      "साझा उद्देश्य भएका संस्थाहरुसँगको सहकार्यमा कार्यक्रमहरु सञ्चालन गर्ने, इत्यादि।"
    ]
  },
  "policies": {
    "accessibilityEn": "We are committed to making this website usable by disabled people. Content is written as real text, keyboard access is supported, and uploaded documents should include an accessible Word or HTML alternative whenever a PDF is scanned or otherwise inaccessible. If you encounter a barrier, please contact us.",
    "accessibilityNe": "हामी यो वेबसाइट अपाङ्गता भएका व्यक्तिहरूका लागि प्रयोगयोग्य बनाउन प्रतिबद्ध छौं। सामग्री वास्तविक पाठको रूपमा राखिन्छ, किबोर्ड पहुँच समर्थित छ, र स्क्यान गरिएको वा पहुँचयोग्य नभएको PDF सँग पहुँचयोग्य Word वा HTML विकल्प राख्नुपर्छ। कुनै अवरोध भेटिएमा हामीलाई सम्पर्क गर्नुहोस्।",
    "privacyEn": "We collect only the information you choose to send by email or telephone. We use it to respond to your enquiry and do not sell it. Do not send sensitive personal or medical information through the public contact form.",
    "privacyNe": "हामी तपाईंले इमेल वा फोनबाट स्वेच्छाले पठाएको जानकारी मात्र सङ्कलन गर्छौं। यो तपाईंको सोधपुछको जवाफ दिन प्रयोग हुन्छ र बेचिँदैन। सार्वजनिक सम्पर्क फारामबाट संवेदनशील व्यक्तिगत वा स्वास्थ्य जानकारी नपठाउनुहोस्।",
    "safeguardingEn": "Concerns about abuse, exploitation, discrimination or misconduct can be reported confidentially by phone or email. In an immediate emergency, contact the appropriate local emergency service or authority.",
    "safeguardingNe": "दुर्व्यवहार, शोषण, भेदभाव वा गलत आचरणसम्बन्धी चिन्ता फोन वा इमेलबाट गोप्य रूपमा जानकारी गराउन सकिन्छ। तत्काल आपतकालमा सम्बन्धित स्थानीय आपतकालीन सेवा वा निकायलाई सम्पर्क गर्नुहोस्।"
  },
  "programs": [
    {
      "id": "program-1",
      "contentLanguage": "bilingual",
      "titleEn": "Rights and advocacy",
      "titleNe": "अधिकार र वकालत",
      "bodyEn": "Advocating for the rights of persons with disabilities under Nepal's disability rights law and at the local government level.",
      "bodyNe": "नेपालको अपाङ्गता अधिकार कानून र स्थानीय सरकार तहमा अपाङ्गता भएका व्यक्तिको अधिकारका लागि वकालत।",
      "imageUrl": "",
      "imageAltEn": "",
      "imageAltNe": "",
      "published": true,
      "sortOrder": 1
    },
    {
      "id": "program-2",
      "contentLanguage": "bilingual",
      "titleEn": "Awareness and inclusion",
      "titleNe": "सचेतना र समावेशीकरण",
      "bodyEn": "Raising community awareness to reduce stigma and support the inclusion of persons with disabilities in local life.",
      "bodyNe": "कलंक घटाउन र सामुदायिक जीवनमा अपाङ्गता भएका व्यक्तिको समावेशीकरणलाई सहयोग गर्न सामुदायिक सचेतना।",
      "imageUrl": "",
      "imageAltEn": "",
      "imageAltNe": "",
      "published": true,
      "sortOrder": 2
    },
    {
      "id": "program-3",
      "contentLanguage": "bilingual",
      "titleEn": "Support and referral",
      "titleNe": "सहयोग र सिफारिस",
      "bodyEn": "Helping members and their families connect with government services, assistive devices and health referrals.",
      "bodyNe": "सदस्य र परिवारलाई सरकारी सेवा, सहायक सामग्री र स्वास्थ्य सिफारिससँग जोड्न सहयोग।",
      "imageUrl": "",
      "imageAltEn": "",
      "imageAltNe": "",
      "published": true,
      "sortOrder": 3
    }
  ],
  "board": [
    {
      "id": "chairperson",
      "contentLanguage": "bilingual",
      "nameEn": "Kishor Thing Tamang",
      "nameNe": "किशोर थिङ तामाङ",
      "positionEn": "Chairperson",
      "positionNe": "अध्यक्ष",
      "photoUrl": "",
      "photoAlt": "",
      "verified": true,
      "published": true,
      "sortOrder": 1
    },
    {
      "id": "vice-chairperson",
      "contentLanguage": "bilingual",
      "nameEn": "Prasai Rumba",
      "nameNe": "प्रसाई रुम्बा",
      "positionEn": "Vice-Chairperson",
      "positionNe": "उपाध्यक्ष",
      "photoUrl": "",
      "photoAlt": "",
      "verified": false,
      "published": true,
      "sortOrder": 2
    },
    {
      "id": "secretary",
      "contentLanguage": "bilingual",
      "nameEn": "Kamisya Lama",
      "nameNe": "कमिस्या लामा",
      "positionEn": "Secretary",
      "positionNe": "सचिव",
      "photoUrl": "",
      "photoAlt": "",
      "verified": false,
      "published": true,
      "sortOrder": 3
    },
    {
      "id": "joint-secretary",
      "contentLanguage": "bilingual",
      "nameEn": "Rajani Negi",
      "nameNe": "रजनी नेगी",
      "positionEn": "Joint Secretary",
      "positionNe": "सह-सचिव",
      "photoUrl": "",
      "photoAlt": "",
      "verified": false,
      "published": true,
      "sortOrder": 4
    },
    {
      "id": "treasurer",
      "contentLanguage": "bilingual",
      "nameEn": "Manisha Tamang",
      "nameNe": "मनिषा तामाङ",
      "positionEn": "Treasurer",
      "positionNe": "कोषाध्यक्ष",
      "photoUrl": "",
      "photoAlt": "",
      "verified": false,
      "published": true,
      "sortOrder": 5
    },
    {
      "id": "member-1",
      "contentLanguage": "bilingual",
      "nameEn": "Gauri Sherpa",
      "nameNe": "गौरी शेर्पा",
      "positionEn": "Member",
      "positionNe": "सदस्य",
      "photoUrl": "",
      "photoAlt": "",
      "verified": false,
      "published": true,
      "sortOrder": 6
    },
    {
      "id": "member-2",
      "contentLanguage": "bilingual",
      "nameEn": "Seti Maya Lopchan",
      "nameNe": "सेती माया लोप्चन",
      "positionEn": "Member",
      "positionNe": "सदस्य",
      "photoUrl": "",
      "photoAlt": "",
      "verified": false,
      "published": true,
      "sortOrder": 7
    }
  ],
  "notices": [],
  "resources": []
}
$site_json$::jsonb
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Admin check — SECURITY DEFINER so it can read ngo_admins even though
-- ngo_admins itself has no public/anon read policy.
-- ---------------------------------------------------------------------
create or replace function public.is_ngo_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.ngo_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_ngo_admin() from public;
grant execute on function public.is_ngo_admin() to authenticated;

create or replace function public.set_site_content_metadata()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

revoke all on function public.set_site_content_metadata() from public;

-- ---------------------------------------------------------------------
-- Validation trigger — this is the real, server-side enforcement of
-- "alt text is mandatory": a save that violates any of these rules is
-- rejected outright with a clear error, the same way
-- suyog-dhungel-portfolio's validate_portfolio_content() trigger works.
-- Committee/board photos are exempt from the alt-text requirement: the
-- member's name and position are always shown as visible text right next
-- to the photo, so the image itself is decorative there (the same
-- accessibility rationale already used in Header.jsx's brand lockup).
-- ---------------------------------------------------------------------
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
     or jsonb_typeof(coalesce(new.content->'resources', '[]'::jsonb)) <> 'array' then
    raise exception 'Site content collections (programs, board, notices, resources) must be JSON arrays.';
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

  return new;
end;
$$;

revoke all on function public.validate_site_content() from public;

drop trigger if exists site_content_validate on public.site_content;
create trigger site_content_validate
before insert or update on public.site_content
for each row execute function public.validate_site_content();

drop trigger if exists site_content_set_metadata on public.site_content;
create trigger site_content_set_metadata
before update on public.site_content
for each row execute function public.set_site_content_metadata();

alter table public.ngo_admins enable row level security;
alter table public.site_content enable row level security;

revoke all on public.ngo_admins from anon, authenticated;
revoke all on public.site_content from anon, authenticated;
grant select on public.ngo_admins to authenticated;
grant select, update on public.site_content to authenticated;

drop policy if exists "Administrator can verify own access" on public.ngo_admins;
create policy "Administrator can verify own access"
on public.ngo_admins
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Administrator can read site content" on public.site_content;
create policy "Administrator can read site content"
on public.site_content
for select
to authenticated
using ((select public.is_ngo_admin()));

drop policy if exists "Administrator can update site content" on public.site_content;
create policy "Administrator can update site content"
on public.site_content
for update
to authenticated
using ((select public.is_ngo_admin()))
with check ((select public.is_ngo_admin()));

-- ---------------------------------------------------------------------
-- Public read path — the ONLY way the public site reads content. It
-- filters out drafts and unverified committee members before anyone
-- outside admin ever sees the JSON, so an unverified name never
-- accidentally appears on the live site the way it could before this row
-- filtered at read time.
-- ---------------------------------------------------------------------
create or replace function public._site_public_items(items jsonb, require_verified boolean default false)
returns jsonb
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(item order by coalesce((item->>'sortOrder')::int, 0)), '[]'::jsonb)
  from jsonb_array_elements(coalesce(items, '[]'::jsonb)) as item
  where coalesce(item->>'published', 'false') = 'true'
    and (not require_verified or coalesce(item->>'verified', 'false') = 'true');
$$;

revoke all on function public._site_public_items(jsonb, boolean) from public;

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

  return result;
end;
$$;

revoke all on function public.get_public_site_content() from public;
grant execute on function public.get_public_site_content() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Storage buckets
--   "site-images"  — logo, hero image, program images, committee photos.
--   "report-files" — notice/resource attachments (PDF, Word, ODT, text).
--   Both are PUBLIC buckets (a public bucket already allows anyone to READ
--   a file by URL); the policies below additionally restrict
--   uploading/replacing/deleting to admin accounts, not just "any signed-in
--   user" — matching the site_content policies above.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('report-files', 'report-files', true)
on conflict (id) do nothing;

drop policy if exists "Admin can upload site images" on storage.objects;
create policy "Admin can upload site images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-images' and (select public.is_ngo_admin()));

drop policy if exists "Admin can update site images" on storage.objects;
create policy "Admin can update site images"
on storage.objects for update
to authenticated
using (bucket_id = 'site-images' and (select public.is_ngo_admin()))
with check (bucket_id = 'site-images' and (select public.is_ngo_admin()));

drop policy if exists "Admin can delete site images" on storage.objects;
create policy "Admin can delete site images"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-images' and (select public.is_ngo_admin()));

drop policy if exists "Admin can upload report files" on storage.objects;
create policy "Admin can upload report files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'report-files' and (select public.is_ngo_admin()));

drop policy if exists "Admin can update report files" on storage.objects;
create policy "Admin can update report files"
on storage.objects for update
to authenticated
using (bucket_id = 'report-files' and (select public.is_ngo_admin()))
with check (bucket_id = 'report-files' and (select public.is_ngo_admin()));

drop policy if exists "Admin can delete report files" on storage.objects;
create policy "Admin can delete report files"
on storage.objects for delete
to authenticated
using (bucket_id = 'report-files' and (select public.is_ngo_admin()));

commit;

-- ---------------------------------------------------------------------
-- IMPORTANT — committee roster verification status (unchanged from the
-- original release note): only the Chairperson (Kishor Thing Tamang) is
-- independently verified against the registration certificate. The other
-- six names were OCR-transcribed from a scanned, handwritten bylaws
-- signature page and are seeded with verified=false, which means
-- get_public_site_content() hides them from the live About page until you
-- tick "Verified" for each one in /admin/board after confirming the
-- spelling — please do that before treating the roster as final.
-- ---------------------------------------------------------------------

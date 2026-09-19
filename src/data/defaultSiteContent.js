// The offline/fallback shape of the site's editable content -- read before
// Supabase has answered (or if it isn't configured yet), so the site never
// shows a blank page during setup. This mirrors the seed data inserted by
// supabase/schema.sql; once Supabase is configured, the live database is
// always the source of truth and this is only ever the starting point / the
// safety net, exactly like defaultContent.js in the portfolio project.
import { orgFacts, content } from "./content.js";
import { boardMembers } from "./board.js";

export const SITE_CONTENT_VERSION = 1;

export const defaultSiteContent = {
  schemaVersion: SITE_CONTENT_VERSION,
  organization: {
    nameEn: orgFacts.nameEn,
    nameNe: orgFacts.nameNe,
    shortNameEn: orgFacts.shortNameEn,
    registrationNo: orgFacts.registrationNo,
    registrationDate: orgFacts.registrationDate,
    affiliationNo: orgFacts.affiliationNo,
    wardEn: orgFacts.wardEn,
    wardNe: orgFacts.wardNe,
    districtEn: orgFacts.districtEn,
    districtNe: orgFacts.districtNe,
    provinceEn: orgFacts.provinceEn,
    provinceNe: orgFacts.provinceNe,
    chairpersonEn: orgFacts.chairpersonEn,
    chairpersonNe: orgFacts.chairpersonNe,
    chairpersonTitleEn: orgFacts.chairpersonTitleEn,
    chairpersonTitleNe: orgFacts.chairpersonTitleNe,
    phone: orgFacts.phone,
    email: orgFacts.email,
    facebook: orgFacts.facebook,
    domain: orgFacts.domain,
    logoUrl: "",
    logoAlt: `${orgFacts.shortNameEn} logo`,
  },
  appearance: {
    heroImageUrl: "",
    heroImageAltEn: "",
    heroImageAltNe: "",
  },
  seo: {
    title: orgFacts.nameEn,
    description: content.en.home.heroSubtitle,
    socialImageUrl: "",
    socialImageAlt: "",
    socialImageWidth: 1200,
    socialImageHeight: 630,
  },
  home: {
    eyebrowEn: content.en.home.heroEyebrow,
    eyebrowNe: content.ne.home.heroEyebrow,
    titleEn: content.en.home.heroTitle,
    titleNe: content.ne.home.heroTitle,
    subtitleEn: content.en.home.heroSubtitle,
    subtitleNe: content.ne.home.heroSubtitle,
    introEn: content.en.home.introBody,
    introNe: content.ne.home.introBody,
  },
  about: {
    visionEn: content.en.about.visionBody,
    visionNe: content.ne.about.visionBody,
    missionEn: content.en.about.missionBody,
    missionNe: content.ne.about.missionBody,
    historyEn: content.en.about.historyBody,
    historyNe: content.ne.about.historyBody,
    objectivesEn: content.en.about.objectives,
    objectivesNe: content.ne.about.objectives,
  },
  policies: {
    accessibilityEn:
      "We are committed to making this website usable by disabled people. Content is written as real text, keyboard access is supported, and uploaded documents should include an accessible Word or HTML alternative whenever a PDF is scanned or otherwise inaccessible. If you encounter a barrier, please contact us.",
    accessibilityNe:
      "हामी यो वेबसाइट अपाङ्गता भएका व्यक्तिहरूका लागि प्रयोगयोग्य बनाउन प्रतिबद्ध छौं। सामग्री वास्तविक पाठको रूपमा राखिन्छ, किबोर्ड पहुँच समर्थित छ, र स्क्यान गरिएको वा पहुँचयोग्य नभएको PDF सँग पहुँचयोग्य Word वा HTML विकल्प राख्नुपर्छ। कुनै अवरोध भेटिएमा हामीलाई सम्पर्क गर्नुहोस्।",
    privacyEn:
      "We collect only the information you choose to send by email or telephone. We use it to respond to your enquiry and do not sell it. Do not send sensitive personal or medical information through the public contact form.",
    privacyNe:
      "हामी तपाईंले इमेल वा फोनबाट स्वेच्छाले पठाएको जानकारी मात्र सङ्कलन गर्छौं। यो तपाईंको सोधपुछको जवाफ दिन प्रयोग हुन्छ र बेचिँदैन। सार्वजनिक सम्पर्क फारामबाट संवेदनशील व्यक्तिगत वा स्वास्थ्य जानकारी नपठाउनुहोस्।",
    safeguardingEn:
      "Concerns about abuse, exploitation, discrimination or misconduct can be reported confidentially by phone or email. In an immediate emergency, contact the appropriate local emergency service or authority.",
    safeguardingNe:
      "दुर्व्यवहार, शोषण, भेदभाव वा गलत आचरणसम्बन्धी चिन्ता फोन वा इमेलबाट गोप्य रूपमा जानकारी गराउन सकिन्छ। तत्काल आपतकालमा सम्बन्धित स्थानीय आपतकालीन सेवा वा निकायलाई सम्पर्क गर्नुहोस्।",
  },
  programs: content.en.home.focusAreas.map((item, index) => ({
    id: `program-${index + 1}`,
    contentLanguage: "bilingual",
    titleEn: item.title,
    titleNe: content.ne.home.focusAreas[index]?.title || "",
    bodyEn: item.body,
    bodyNe: content.ne.home.focusAreas[index]?.body || "",
    imageUrl: "",
    imageAltEn: "",
    imageAltNe: "",
    published: true,
    sortOrder: index + 1,
  })),
  board: boardMembers.map((member, index) => ({
    id: member.id,
    contentLanguage: "bilingual",
    nameEn: member.nameEn,
    nameNe: member.nameNe,
    positionEn: member.positionEn,
    positionNe: member.positionNe,
    photoUrl: "",
    photoAlt: "",
    verified: member.verified,
    published: true,
    sortOrder: index + 1,
  })),
  notices: [],
  resources: [],
};

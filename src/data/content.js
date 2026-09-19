// Bilingual site content.
//
// CONTENT STATUS — read before publishing:
//   REAL, verified facts (from registration certificate, renewal record, domain
//   registration cover letter, and letterhead supplied by the client):
//     - Organisation name, registration number, registration date, ward/municipality,
//       district, province, affiliation number, chairperson name, phone, email,
//       Facebook page.
//     - The header/favicon logo (src/assets/org-logo.jpg + org-logo.png) is the
//       org's real profile picture, pulled directly from its Facebook page
//       (facebook.com/share/17rRicSfu8) at the client's request on 2026-09-17.
//       org-logo.png is a circular-alpha-masked version of the same source
//       image, used in the header/favicons so it sits cleanly on any
//       background instead of showing a white square behind the badge.
//   PLACEHOLDER, needs the client's real input before launch:
//     - Programs/focus-area descriptions, history/founding story, board/team list,
//       photographs (hero, gallery, team), notices/news items, and the full
//       objectives list from the बिधान (bylaws) — the bylaws PDF was only opened
//       far enough to confirm its title page during this session; its full
//       objectives/structure clauses still need to be read in and transcribed.
//   Every placeholder string below is written as honest, generic, non-specific
//   mission language — never a fabricated statistic, quote, or claim.

export const orgFacts = {
  nameEn: "Namuna Apanga Samaj Rasuwa",
  nameNe: "नमुना अपाङ्ग समाज रसुवा",
  shortNameEn: "Model Disabled Society Rasuwa",
  registrationNo: "523/2081-82",
  registrationDate: "2082/03/17 (B.S.)",
  affiliationNo: "58380 (Social Welfare Council)",
  wardEn: "Naukunda Rural Municipality – 3, Parchyang",
  wardNe: "नौकुण्ड गाउँपालिका – ३, पार्च्याङ",
  districtEn: "Rasuwa District",
  districtNe: "रसुवा जिल्ला",
  provinceEn: "Bagmati Province, Nepal",
  provinceNe: "बागमती प्रदेश, नेपाल",
  chairpersonEn: "Kishor Thing Tamang",
  chairpersonNe: "किशोर थिङ तामाङ",
  chairpersonTitleEn: "Chairperson",
  chairpersonTitleNe: "अध्यक्ष",
  phone: "9841083320",
  email: "modeldisabilitysocietyrasuwa@gmail.com",
  facebook: "https://www.facebook.com/share/17rRicSfu8/",
  domain: "modeldisabledsocietyrasuwa.org.np",
};

export const content = {
  en: {
    lang: "en",
    nav: {
      home: "Home",
      about: "About Us",
      programs: "Programs",
      notices: "Notices",
      resources: "Resources",
      contact: "Contact",
      skipToContent: "Skip to main content",
      switchLanguage: "नेपालीमा हेर्नुहोस्",
    },
    home: {
      heroEyebrow: "Naukunda-3, Parchyang · Rasuwa District",
      heroTitle: "Namuna Apanga Samaj Rasuwa",
      heroSubtitle:
        "A community organisation working for the rights, dignity and inclusion of persons with disabilities in Rasuwa.",
      heroImageAlt:
        "Placeholder — replace with a real photograph of the organisation's members or activities before launch.",
      ctaPrimary: "Learn about our work",
      ctaSecondary: "Get in touch",
      introHeading: "Who we are",
      introBody:
        "Namuna Apanga Samaj Rasuwa is registered with the District Administration Office, Rasuwa (registration no. 523/2081-82) and affiliated with the Social Welfare Council (affiliation no. 58380). We work with persons with disabilities and their families in Naukunda Rural Municipality and across Rasuwa district.",
      focusHeading: "What we work on",
      focusIntro:
        "The sections below describe the organisation's general areas of work. Replace with the specific programs listed in the बिधान (bylaws) and any current project information before publishing.",
      focusAreas: [
        {
          title: "Rights and advocacy",
          body: "Advocating for the rights of persons with disabilities under Nepal's disability rights law and at the local government level.",
        },
        {
          title: "Awareness and inclusion",
          body: "Raising community awareness to reduce stigma and support the inclusion of persons with disabilities in local life.",
        },
        {
          title: "Support and referral",
          body: "Helping members and their families connect with government services, assistive devices and health referrals.",
        },
      ],
      noticesHeading: "Latest notices",
      noticesEmpty: "No notices have been published yet. Check back soon.",
      viewAllNotices: "View all notices",
      contactHeading: "Contact the organisation",
    },
    about: {
      pageTitle: "About Us",
      registrationHeading: "Registration and affiliation",
      registrationIntro:
        "Namuna Apanga Samaj Rasuwa is a legally registered, non-profit community organisation.",
      regNoLabel: "Registration number",
      regDateLabel: "Registration date (B.S.)",
      affiliationLabel: "Affiliation",
      locationLabel: "Location",
      visionHeading: "Our vision",
      visionBody:
        "Nepal's Constitution and prevailing laws guarantee the rights, welfare, protection and advancement of persons with disabilities. Guided by that constitutional spirit, and working within prevailing law and due process, this organisation exists to build the capacity and self-reliance of persons with all kinds of disabilities across Rasuwa district — ensuring their equal participation, dignified living and rights — while protecting and advancing their rights and interests, furthering social inclusion, ending every form of disability-based discrimination, and contributing to a dignified life for persons with disabilities.",
      visionNote:
        "Adapted from the Preamble (प्रस्तावना) of the organisation's bylaws (बिधान, २०८२), which serves as its founding statement of purpose.",
      missionHeading: "Our mission",
      missionBody:
        "As a non-profit, non-political, public-welfare social organisation, Namuna Apanga Samaj Rasuwa works to protect and promote the rights and dignity of persons with disabilities in Rasuwa district — through advocacy, awareness, accessibility, capacity-building and coordination with government and civil-society partners — so that no person is excluded from community life because of disability.",
      missionNote:
        "A plain-language summary of the purpose and objectives set out in दफा १-२ of the bylaws; see Objectives below for the full list.",
      objectivesHeading: "Our objectives",
      objectivesIntro:
        "The bylaws (दफा २) set out twelve specific objectives for the organisation:",
      objectives: [
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
        "Run programs in partnership with other organisations that share similar objectives, among other related work.",
      ],
      historyHeading: "Our history",
      historyBody:
        "Placeholder — add a short founding history: when and why the organisation was formed, and what it has done since registration in 2082 B.S.",
      boardHeading: "Executive Committee",
      boardIntro:
        "Under दफा १३ of the bylaws, the Executive Committee has seven fixed seats — Chairperson, Vice-Chairperson, Secretary, Treasurer and three Members — serving a four-year term. The committee listed below is the organisation's founding committee, formed at registration; per दफा ३३ of the bylaws, it is to be replaced by a committee elected at the organisation's first Annual General Meeting.",
      boardPhotoAlt: "Portrait photo not yet available.",
    },
    programs: {
      pageTitle: "Programs",
      intro:
        "The organisation's work follows the objectives set out in its bylaws (see About Us for the full list) — rights and advocacy, awareness and inclusion, accessibility, and support for persons with disabilities in Rasuwa district. The areas below describe that ongoing work; specific current projects and activities will be added here as they run.",
    },
    notices: {
      pageTitle: "Notices",
      intro:
        "Public notices, announcements and press releases will be published here as real, readable text — never as a scanned image or a PDF-only download, so that every visitor, including screen-reader users, can read them.",
      empty: "No notices have been published yet.",
    },
    resources: {
      pageTitle: "Resources",
      intro:
        "Downloadable publications and documents will appear here. Following accessible-publishing practice, every Nepali document will be offered as accessible Unicode HTML or Word text, with any PDF provided only as an additional copy — never as the only format.",
      empty: "No resources have been published yet.",
    },
    contact: {
      pageTitle: "Contact Us",
      intro: "We welcome calls, emails and messages from the community.",
      formHeading: "Send a message",
      formName: "Full name",
      formEmail: "Email address",
      formMessage: "Message",
      formSubmit: "Send message",
      formNote:
        "This form needs a working mail backend connected before launch (see the delivery notes) — until then it will not actually send.",
      addressHeading: "Address",
      mapTitle: "Map showing Naukunda Rural Municipality – 3, Parchyang, Rasuwa District",
    },
    footer: {
      registered: "Registered with the District Administration Office, Rasuwa",
      affiliated: "Affiliated with the Social Welfare Council",
      quickLinks: "Quick links",
      contactHeading: "Contact",
      rights: "All rights reserved.",
      developedBy: "Developed and maintained by:",
    },
    notFound: {
      title: "Page not found",
      body: "The page you were looking for doesn't exist or may have moved.",
      cta: "Return to the home page",
    },
  },

  ne: {
    lang: "ne",
    nav: {
      home: "गृहपृष्ठ",
      about: "हाम्रो बारे",
      programs: "कार्यक्रमहरू",
      notices: "सूचनाहरू",
      resources: "स्रोतहरू",
      contact: "सम्पर्क",
      skipToContent: "मुख्य सामग्रीमा जानुहोस्",
      switchLanguage: "View in English",
    },
    home: {
      heroEyebrow: "नौकुण्ड-३, पार्च्याङ · रसुवा जिल्ला",
      heroTitle: "नमुना अपाङ्ग समाज रसुवा",
      heroSubtitle: "रसुवामा अपाङ्गता भएका व्यक्तिहरूको अधिकार, सम्मान र समावेशीकरणका लागि कार्यरत सामुदायिक संस्था।",
      heroImageAlt: "प्लेसहोल्डर — प्रकाशन अघि संस्थाका सदस्य वा गतिविधिको वास्तविक तस्बिरले प्रतिस्थापन गर्नुहोस्।",
      ctaPrimary: "हाम्रो काम बारे जान्नुहोस्",
      ctaSecondary: "सम्पर्क गर्नुहोस्",
      introHeading: "हामी को हौं",
      introBody:
        "नमुना अपाङ्ग समाज रसुवा जिल्ला प्रशासन कार्यालय, रसुवामा दर्ता (दर्ता नं. ५२३/२०८१-८२) भएको र समाज कल्याण परिषद्‌मा आबद्ध (आबद्धता नं. ५८३८०) संस्था हो। हामी नौकुण्ड गाउँपालिका र रसुवा जिल्लाभर अपाङ्गता भएका व्यक्ति र उनीहरूका परिवारसँग काम गर्छौं।",
      focusHeading: "हामी के काम गर्छौं",
      focusIntro: "तलका खण्डहरूले संस्थाको सामान्य कार्यक्षेत्र वर्णन गर्छन्। प्रकाशन अघि बिधानमा उल्लेखित वास्तविक कार्यक्रमहरूले प्रतिस्थापन गर्नुहोस्।",
      focusAreas: [
        { title: "अधिकार र वकालत", body: "नेपालको अपाङ्गता अधिकार कानून र स्थानीय सरकार तहमा अपाङ्गता भएका व्यक्तिको अधिकारका लागि वकालत।" },
        { title: "सचेतना र समावेशीकरण", body: "कलंक घटाउन र सामुदायिक जीवनमा अपाङ्गता भएका व्यक्तिको समावेशीकरणलाई सहयोग गर्न सामुदायिक सचेतना।" },
        { title: "सहयोग र सिफारिस", body: "सदस्य र परिवारलाई सरकारी सेवा, सहायक सामग्री र स्वास्थ्य सिफारिससँग जोड्न सहयोग।" },
      ],
      noticesHeading: "पछिल्ला सूचनाहरू",
      noticesEmpty: "हाल कुनै सूचना प्रकाशित गरिएको छैन।",
      viewAllNotices: "सबै सूचना हेर्नुहोस्",
      contactHeading: "संस्थालाई सम्पर्क गर्नुहोस्",
    },
    about: {
      pageTitle: "हाम्रो बारे",
      registrationHeading: "दर्ता र आबद्धता",
      registrationIntro: "नमुना अपाङ्ग समाज रसुवा कानुनी रूपमा दर्ता भएको गैर-नाफामुखी सामुदायिक संस्था हो।",
      regNoLabel: "दर्ता नम्बर",
      regDateLabel: "दर्ता मिति (वि.सं.)",
      affiliationLabel: "आबद्धता",
      locationLabel: "ठेगाना",
      visionHeading: "हाम्रो दृष्टिकोण",
      visionBody:
        "नेपालको संविधान तथा प्रचलित कानुनले अपाङ्गता भएका व्यक्तिहरूको हक, हित, संरक्षण र संवर्द्धनको व्यवस्था गरेको छ। संविधानको यस मर्मलाई ध्यानमा राख्दै, प्रचलित कानून र कार्यविधिका आधारमा रसुवा जिल्लामा रहने सबै किसिमका अपाङ्गता भएका व्यक्तिहरूको क्षमता विकास र सशक्तिकरण गर्दै उनीहरूको समान सहभागिता, सम्मानजनक जीवनयापन तथा अधिकारको सुनिश्चितता गराई हक, हितको संरक्षण, संवर्द्धन र सामाजिक समावेशीकरणलाई बढाउँदै अपाङ्गतामा आधारित सबै प्रकारका भेदभावको अन्त्य गरी अपाङ्गता भएका व्यक्तिहरूको मर्यादित जीवन निर्माणमा योगदान दिने ध्येयका साथ यो संस्था स्थापना भएको हो।",
      visionNote:
        "संस्थाको बिधान, २०८२ को प्रस्तावनामा आधारित, जुन संस्थाको स्थापनाको उद्देश्य कथन हो।",
      missionHeading: "हाम्रो उद्देश्य (सारांश)",
      missionBody:
        "नाफारहित, गैर-राजनीतिक र जनहितकारी सामाजिक संस्थाको रूपमा, नमुना अपाङ्ग समाज रसुवाले रसुवा जिल्लामा अपाङ्गता भएका व्यक्तिहरूको हक र सम्मानको संरक्षण र प्रवर्द्धन गर्न वकालत, सचेतना, पहुँचयोग्यता, क्षमता विकास र सरकार तथा नागरिक समाजसँगको समन्वयमार्फत काम गर्दछ, ताकि कसैले पनि अपाङ्गताका कारण सामुदायिक जीवनबाट बहिष्कृत हुनु नपरोस्।",
      missionNote:
        "बिधानको दफा १-२ मा उल्लेखित उद्देश्यको सरल भाषामा सारांश; पूर्ण सूचीका लागि तल उद्देश्यहरू हेर्नुहोस्।",
      objectivesHeading: "हाम्रा उद्देश्यहरू",
      objectivesIntro: "बिधान (दफा २) ले संस्थाका बाह्र विशिष्ट उद्देश्यहरू तोकेको छ:",
      objectives: [
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
        "साझा उद्देश्य भएका संस्थाहरुसँगको सहकार्यमा कार्यक्रमहरु सञ्चालन गर्ने, इत्यादि।",
      ],
      historyHeading: "हाम्रो इतिहास",
      historyBody: "प्लेसहोल्डर — संस्था कहिले र किन स्थापना भयो र २०८२ सालमा दर्ता भएदेखि के गरेको छ भन्ने छोटो विवरण थप्नुहोस्।",
      boardHeading: "कार्य समिति",
      boardIntro:
        "बिधानको दफा १३ अनुसार कार्य समितिमा सात निश्चित पद हुन्छन् — अध्यक्ष, उपाध्यक्ष, सचिव, कोषाध्यक्ष र तीन सदस्य — जसको कार्यकाल चार वर्षको हुन्छ। तलको सूची संस्था दर्ताका बेला गठित तदर्थ (founding) समिति हो; दफा ३३ अनुसार पहिलो साधारण सभाबाट निर्वाचित समितिले यसलाई प्रतिस्थापन गर्नेछ।",
      boardPhotoAlt: "फोटो हाल उपलब्ध छैन।",
    },
    programs: {
      pageTitle: "कार्यक्रमहरू",
      intro:
        "संस्थाको काम बिधानमा उल्लेखित उद्देश्यहरूमा आधारित छ (पूर्ण सूचीका लागि हाम्रो बारे पृष्ठ हेर्नुहोस्) — अधिकार र वकालत, सचेतना र समावेशीकरण, पहुँचयोग्यता, र रसुवा जिल्लामा अपाङ्गता भएका व्यक्तिहरूलाई सहयोग। तलका खण्डहरूले यो निरन्तर कामलाई वर्णन गर्छन्; विशिष्ट हालका परियोजना र गतिविधिहरू सञ्चालन हुँदै जाँदा यहाँ थपिनेछन्।",
    },
    notices: {
      pageTitle: "सूचनाहरू",
      intro: "सार्वजनिक सूचना, घोषणा र प्रेस विज्ञप्तिहरू यहाँ वास्तविक, पढ्न मिल्ने पाठको रूपमा प्रकाशित हुनेछन् — कहिल्यै स्क्यान गरिएको तस्बिर वा PDF-मात्र डाउनलोडको रूपमा होइन।",
      empty: "हाल कुनै सूचना प्रकाशित गरिएको छैन।",
    },
    resources: {
      pageTitle: "स्रोतहरू",
      intro: "डाउनलोड गर्न मिल्ने प्रकाशन र कागजातहरू यहाँ देखा पर्नेछन्। प्रत्येक नेपाली कागजात पहुँचयोग्य युनिकोड HTML वा वर्ड ढाँचामा उपलब्ध गराइनेछ, PDF थप प्रति मात्र हो।",
      empty: "हाल कुनै स्रोत प्रकाशित गरिएको छैन।",
    },
    contact: {
      pageTitle: "सम्पर्क गर्नुहोस्",
      intro: "हामी समुदायबाट फोन, इमेल र सन्देशहरूको स्वागत गर्छौं।",
      formHeading: "सन्देश पठाउनुहोस्",
      formName: "पूरा नाम",
      formEmail: "इमेल ठेगाना",
      formMessage: "सन्देश",
      formSubmit: "सन्देश पठाउनुहोस्",
      formNote: "यो फारम प्रकाशित हुनु अघि वास्तविक इमेल ब्याकइन्डसँग जोड्न आवश्यक छ — हाल यसले सन्देश पठाउँदैन।",
      addressHeading: "ठेगाना",
      mapTitle: "नौकुण्ड गाउँपालिका – ३, पार्च्याङ, रसुवा जिल्ला देखाउने नक्सा",
    },
    footer: {
      registered: "जिल्ला प्रशासन कार्यालय, रसुवामा दर्ता",
      affiliated: "समाज कल्याण परिषद्‌मा आबद्ध",
      quickLinks: "द्रुत लिङ्कहरू",
      contactHeading: "सम्पर्क",
      rights: "सर्वाधिकार सुरक्षित।",
      developedBy: "निर्माण र सञ्चालन:",
    },
    notFound: {
      title: "पृष्ठ फेला परेन",
      body: "तपाईंले खोज्नुभएको पृष्ठ अवस्थित छैन वा सारिएको हुन सक्छ।",
      cta: "गृहपृष्ठमा फर्कनुहोस्",
    },
  },
};

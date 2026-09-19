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
      heroImageAlt: "Namuna Apanga Samaj Rasuwa Official Emblem",
      ctaPrimary: "Learn about our work",
      ctaSecondary: "Get in touch",
      introHeading: "Who we are",
      introBody:
        "Namuna Apanga Samaj Rasuwa is registered with the District Administration Office, Rasuwa (Regd. No. 523/2081-82) and affiliated with the Social Welfare Council (Affiliation No. 58380). We work with persons with disabilities and their families in Naukunda Rural Municipality and across Rasuwa district.",
      focusHeading: "What we work on",
      focusIntro:
        "Our initiatives focus on community-level empowerment, rights advocacy, and support services for persons with disabilities across Rasuwa district.",
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
      missionHeading: "Our mission",
      missionBody:
        "As a non-profit, non-political, public-welfare social organisation, Namuna Apanga Samaj Rasuwa works to protect and promote the rights and dignity of persons with disabilities in Rasuwa district — through advocacy, awareness, accessibility, capacity-building and coordination with government and civil-society partners — so that no person is excluded from community life because of disability.",
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
        "Founded by community advocates in Naukunda Rural Municipality, Namuna Apanga Samaj Rasuwa was established to address the unique challenges faced by persons with disabilities in the mountainous terrain of Rasuwa. Legally registered in 2081/82 B.S., the organization actively collaborates with local governments, community leaders, and civil society partners to foster an inclusive, accessible, and dignified society.",
      boardHeading: "Executive Committee",
      boardIntro:
        "The Executive Committee leads the governance, strategic direction, and public initiatives of Namuna Apanga Samaj Rasuwa, dedicated to serving persons with disabilities across Rasuwa district.",
      boardPhotoAlt: "Portrait photo not yet available.",
    },
    programs: {
      pageTitle: "Programs",
      intro:
        "The organisation's work follows the objectives set out in its bylaws — rights and advocacy, awareness and inclusion, accessibility, and support for persons with disabilities in Rasuwa district.",
    },
    notices: {
      pageTitle: "Notices",
      intro:
        "Official public notices, announcements, and circulars from Namuna Apanga Samaj Rasuwa.",
      empty: "No notices have been published yet.",
    },
    resources: {
      pageTitle: "Resources",
      intro:
        "Reports, guidelines, policy documents, and publications issued by the organization.",
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
        "We typically respond to community inquiries within 1–2 business days.",
      addressHeading: "Address",
      mapTitle: "Map showing Naukunda Rural Municipality – 3, Parchyang, Rasuwa District",
    },
    footer: {
      regLabel: "Regd. No.",
      affilLabel: "SWC Affiliation",
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
      heroImageAlt: "नमुना अपाङ्ग समाज रसुवा आधिकारिक लोगो",
      ctaPrimary: "हाम्रो काम बारे जान्नुहोस्",
      ctaSecondary: "सम्पर्क गर्नुहोस्",
      introHeading: "हामी को हौं",
      introBody:
        "नमुना अपाङ्ग समाज रसुवा जिल्ला प्रशासन कार्यालय, रसुवामा दर्ता (दर्ता नं. ५२३/२०८१-८२) भएको र समाज कल्याण परिषद्‌मा आबद्ध (आबद्धता नं. ५८३८०) संस्था हो। हामी नौकुण्ड गाउँपालिका र रसुवा जिल्लाभर अपाङ्गता भएका व्यक्ति र उनीहरूका परिवारसँग काम गर्छौं।",
      focusHeading: "हामी के काम गर्छौं",
      focusIntro:
        "रसुवा जिल्लाभर अपाङ्गता भएका व्यक्तिहरूको सशक्तीकरण, अधिकार वकालत र सहयोग सेवाहरूमा हाम्रो कार्य केन्द्रित छ।",
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
      missionHeading: "हाम्रो उद्देश्य (सारांश)",
      missionBody:
        "नाफारहित, गैर-राजनीतिक र जनहितकारी सामाजिक संस्थाको रूपमा, नमुना अपाङ्ग समाज रसुवाले रसुवा जिल्लामा अपाङ्गता भएका व्यक्तिहरूको हक र सम्मानको संरक्षण र प्रवर्द्धन गर्न वकालत, सचेतना, पहुँचयोग्यता, क्षमता विकास र सरकार तथा नागरिक समाजसँगको समन्वयमार्फत काम गर्दछ, ताकि कसैले पनि अपाङ्गताका कारण सामुदायिक जीवनबाट बहिष्कृत हुनु नपरोस्।",
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
      historyBody:
        "नौकुण्ड गाउँपालिकाका सचेत नागरिक तथा अपाङ्गता अधिकारकर्मीहरूको पहलमा रसुवा जिल्लाको विकट भौगोलिक परिवेशमा रहेका अपाङ्गता भएका व्यक्तिहरूका समस्या समाधान गर्न नमुना अपाङ्ग समाज रसुवाको स्थापना भएको हो। वि.सं. २०८१/८२ मा संस्था दर्ता भई स्थानीय सरकार, सरोकारवाला निकाय र समुदायसँग सहकार्य गर्दै संस्थाले निरन्तर कार्य गर्दै आएको छ।",
      boardHeading: "कार्य समिति",
      boardIntro:
        "नमुना अपाङ्ग समाज रसुवाको नीति निर्माण, रणनीतिक मार्गदर्शन तथा सामाजिक अभियानहरूको नेतृत्व कार्य समितिले गर्दछ।",
      boardPhotoAlt: "फोटो हाल उपलब्ध छैन।",
    },
    programs: {
      pageTitle: "कार्यक्रमहरू",
      intro:
        "संस्थाको काम बिधानमा उल्लेखित उद्देश्यहरूमा आधारित छ — अधिकार र वकालत, सचेतना र समावेशीकरण, पहुँचयोग्यता, र रसुवा जिल्लामा अपाङ्गता भएका व्यक्तिहरूलाई सहयोग।",
    },
    notices: {
      pageTitle: "सूचनाहरू",
      intro:
        "नमुना अपाङ्ग समाज रसुवाका आधिकारिक सूचना, सूचना-पाटी, प्रेस विज्ञप्ति तथा गतिविधि सम्बन्धी जानकारी।",
      empty: "हाल कुनै सूचना प्रकाशित गरिएको छैन।",
    },
    resources: {
      pageTitle: "स्रोतहरू",
      intro:
        "संस्थाका वार्षिक प्रतिवेदन, निर्देशिका, नीतिगत कागजात तथा उपयोगी सामग्रीहरू।",
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
      formNote: "हामी १–२ कार्यदिन भित्र तपाईंको सन्देशको जवाफ दिने प्रयास गर्नेछौं।",
      addressHeading: "ठेगाना",
      mapTitle: "नौकुण्ड गाउँपालिका – ३, पार्च्याङ, रसुवा जिल्ला देखाउने नक्सा",
    },
    footer: {
      regLabel: "दर्ता नं.",
      affilLabel: "स.क.प. आबद्धता",
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

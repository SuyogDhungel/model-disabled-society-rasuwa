// Starting set of activities, written from the organisation's own programme
// reports (प्रतिवेदन). Dates were converted from B.S. to A.D.:
//   17 Mangsir 2082            -> 3 December 2025
//   2082/12/28 – 2083/01/12    -> 11–25 April 2026
//   2083 Jestha 1 – Jestha 31  -> 15 May – 14 June 2026 (closing on Jestha 31)
//   2083 Asar 24               -> 8 July 2026
//
// This is only the fallback / first-run content. Once the database holds an
// "activities" list (after running supabase/activities-migration.sql, or the
// first time an admin saves an activity), /admin/activities is the place to
// add, edit or remove them -- not this file.
const img = (file) => `/images/activities/${file}`;

export const defaultActivities = [
  {
    id: "activity-digital-literacy-workshop-2026",
    slug: "one-day-digital-literacy-workshop-kalika",
    contentLanguage: "en",
    published: true,
    date: "2026-07-08",
    endDate: "",
    location: "Kalika Rural Municipality–2, Rasuwa",
    titleEn: "One-day digital literacy workshop held in Kalika",
    titleNe: "एक दिने डिजिटल साक्षरता कार्यशाला",
    summaryEn:
      "36 persons with disabilities learned to use smartphones, the internet, digital payments and online government services safely, with support from Nepal Telecom.",
    bodyEn:
      "Model Disabled Society Rasuwa organised a one-day digital literacy workshop for persons with disabilities in Kalika Rural Municipality–2, Rasuwa, with CSR support from Nepal Telecom. 36 participants took part.\n\nThe programme was chaired by the society's President, Kishor Thing. Chief guest Mira Lama, Vice-Chairperson of Kalika Rural Municipality, spoke about why everyone now needs basic digital skills. Facilitator Umesh Devkota then led sessions on what artificial intelligence (AI) is and how it works, safe use of the internet, and online risks.\n\nThrough presentations, hands-on practice and group discussion, participants practised using smartphones, email, the internet, social media, digital payments and online government services on their own phones, and learned about password safety and avoiding online fraud.\n\nParticipants said they now feel more confident using digital services, and asked for similar programmes to be extended to every ward, along with more advanced training on cyber security.",
    bodyNe: "",
    photos: [
      {
        id: "photo-dlw-1",
        url: img("digital-literacy-workshop-group.webp"),
        altEn:
          "Workshop participants and guests stand together in a hall, holding a banner that reads 'Digital Literacy Program' in Nepali.",
        captionEn: "Participants and guests at the digital literacy workshop.",
      },
      {
        id: "photo-dlw-2",
        url: img("digital-literacy-workshop-facilitator.webp"),
        altEn:
          "A facilitator stands and speaks to seated participants beside a table with a projector and laptop.",
        captionEn: "Facilitator Umesh Devkota leads a session on AI and online safety.",
      },
      {
        id: "photo-dlw-3",
        url: img("digital-literacy-workshop-session.webp"),
        altEn:
          "Participants seated in rows watch a presentation projected on a screen at the front of the hall.",
        captionEn: "Participants follow a presentation on digital services.",
      },
    ],
  },
  {
    id: "activity-computer-ai-training-2026",
    slug: "30-day-computer-and-ai-education-training",
    contentLanguage: "en",
    published: true,
    date: "2026-05-15",
    endDate: "2026-06-14",
    location: "Naukunda Rural Municipality, Rasuwa",
    titleEn: "30-day basic computer and AI education training completed",
    titleNe: "३० दिने आधारभूत कम्प्युटर तथा एआई एजुकेशन तालिम",
    summaryEn:
      "15 students with disabilities, from very poor families or without parents, completed a month of hands-on computer, internet and AI training and received certificates.",
    bodyEn:
      "In partnership with Naukunda Rural Municipality, Model Disabled Society Rasuwa ran a 30-day basic computer and AI education training for students with disabilities, students from very poor families and students without parents. Fifteen students, recommended by their wards, took part. The training ran from 15 May to 13 June 2026, with a closing and certificate ceremony on 14 June 2026.\n\nStarting from the basics, students learned the parts of a computer, Windows, using the mouse and keyboard, English and Nepali (Unicode) typing, and file management. They went on to Microsoft Word, Excel and PowerPoint, preparing their own applications, CVs, simple mark sheets, expense sheets and short presentations about their village or school.\n\nLater sessions covered the internet, searching for and checking information, email and attachments, online forms, digital safety and passwords, and how to use AI tools safely and responsibly for study, writing, translation and summaries.\n\nEach topic was taught through demonstration, practice and daily review, at a pace that suited each student's needs. The programme cost Rs. 500,000 and was carried out under an agreement with Naukunda Rural Municipality.",
    bodyNe: "",
    photos: [
      {
        id: "photo-cat-1",
        url: img("computer-ai-training-lab.webp"),
        altEn:
          "Students work at laptops and desktop computers in a green-walled computer lab while an instructor looks on; the training banner hangs on the wall.",
        captionEn: "Students practising in the computer lab.",
      },
      {
        id: "photo-cat-2",
        url: img("computer-ai-training-laptop.webp"),
        altEn:
          "A participant types on a laptop during a hands-on practice session, with a smartphone on the desk beside her.",
        captionEn: "Hands-on practice on a laptop.",
      },
      {
        id: "photo-cat-3",
        url: img("computer-ai-training-certificate.webp"),
        altEn:
          "At the closing ceremony, a participant receives her training certificate from guests seated at a curved table.",
        captionEn: "Certificate distribution at the closing ceremony.",
      },
    ],
  },
  {
    id: "activity-chowmein-chips-training-2026",
    slug: "15-day-chowmein-and-potato-chips-training",
    contentLanguage: "en",
    published: true,
    date: "2026-04-11",
    endDate: "2026-04-25",
    location: "Rasuwa",
    titleEn: "15-day chowmein and potato chips making and marketing training",
    titleNe: "१५ दिने व्यवसायीक चाउमिन र आलु चिप्स बनाउने तथा बजारिकरण तालिम",
    summaryEn:
      "Persons with disabilities and their family members learned to make, pack and sell chowmein noodles and potato chips as a small business.",
    bodyEn:
      "Model Disabled Society Rasuwa ran a 15-day commercial chowmein and potato chips making and marketing training for persons with disabilities and their family members, from 11 to 25 April 2026. The training was funded by the Bagmati Province Ministry of Social Development, through the Social Development Office, Dhading, as part of the Government of Nepal's programme for the rights, capacity building and empowerment of persons with disabilities.\n\nTrainer Ramhari Devkota opened with three days on entrepreneurship: what a business is, how to manage its finances, how markets work, and how to make a simple business plan.\n\nParticipants then practised making chowmein noodles with a noodle machine, making potato chips, and packing and marketing the products. The aim is for participants to start their own small businesses and earn an income.\n\nThe training ended with participants receiving their certificates.",
    bodyNe: "",
    photos: [
      {
        id: "photo-ccc-1",
        url: img("chowmein-chips-training-certificates.webp"),
        altEn:
          "Training participants sit in rows on the floor and on chairs, holding up their completion certificates beneath the training banner.",
        captionEn: "Participants with their completion certificates.",
      },
      {
        id: "photo-ccc-2",
        url: img("chowmein-chips-training-noodle-machine.webp"),
        altEn:
          "Participants wearing hairnets and face masks watch as a sheet of dough is fed through a noodle-making machine.",
        captionEn: "Making chowmein noodles with a noodle machine.",
      },
      {
        id: "photo-ccc-3",
        url: img("chowmein-chips-training-products.webp"),
        altEn:
          "Sealed packets of homemade potato chips stacked beside bundles of fresh chowmein noodles made during the training.",
        captionEn: "Packed potato chips and noodles made by participants.",
      },
    ],
  },
  {
    id: "activity-idpd-2025",
    slug: "34th-international-day-of-persons-with-disabilities-2025",
    contentLanguage: "en",
    published: true,
    date: "2025-12-03",
    endDate: "",
    location: "Rasuwa",
    titleEn: "34th International Day of Persons with Disabilities marked in Rasuwa",
    titleNe: "३४ औं अन्तर्राष्ट्रिय अपाङ्गता दिवस",
    summaryEn:
      "An awareness and interaction programme brought together local government, civil society and journalists to discuss the issues facing persons with disabilities in Rasuwa.",
    bodyEn:
      "Model Disabled Society Rasuwa marked the 34th International Day of Persons with Disabilities on 3 December 2025 with an awareness and interaction programme on the problems faced by persons with disabilities in Rasuwa.\n\nThe programme was chaired by the society's President, Kishor Thing, and hosted by Pratima Tamang. Chief guest Harikrishna Devkota, Chairperson of Kalika Rural Municipality, said that even with limited local income, the municipality would continue to give what support it can to persons with disabilities, including scholarships for higher education at Kalika College.\n\nSpecial guest Hemnath Khatiwada, Chairperson of the NGO Federation and a journalist, noted that the Constitution of Nepal (2015) guarantees the rights of persons with disabilities, but that these rights are not yet fully practised, and stressed the need to end discrimination in daily life.\n\nParticipants called for training that builds the knowledge, skills and abilities of persons with disabilities according to their needs.",
    bodyNe: "",
    photos: [
      {
        id: "photo-idpd-1",
        url: img("disability-day-2025-speaker.webp"),
        altEn:
          "A woman speaks into a microphone at the front of a hall while guests sit behind low tables on a stage with the Nepali flag.",
        captionEn: "Speakers address the International Day of Persons with Disabilities programme.",
      },
      {
        id: "photo-idpd-2",
        url: img("disability-day-2025-participants.webp"),
        altEn: "Participants sit at long tables in a hall, listening to the programme.",
        captionEn: "Participants at the interaction programme.",
      },
    ],
  },
];

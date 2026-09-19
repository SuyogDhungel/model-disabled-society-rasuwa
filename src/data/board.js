// Executive Committee (कार्य समिति) roster.
//
// SUPERSEDED for day-to-day editing: once Supabase is set up, the About
// page reads the live "board_members" table instead of this file (see
// src/hooks/useBoardMembers.js), and you add/edit/remove members through
// the admin panel at /admin/board — not by editing this file. See
// EDITING_GUIDE.md.
//
// This file still serves two real purposes, so please don't delete it:
//   1. supabase/schema.sql seeds the database with exactly this data the
//      first time you set the project up.
//   2. useBoardMembers.js falls back to this array if Supabase isn't
//      configured yet, so the About page never shows an empty board
//      section during setup.
//
// HOW TO EDIT THIS FILE (only matters before Supabase is set up, or if
// you're updating the seed data itself):
//   - Each person is one object in the `boardMembers` array below.
//   - To add a photo: put an image file in src/assets/board/ (any name,
//     e.g. "kishor-thing-tamang.jpg") and set that member's `photo` field to
//     an import of it — see the commented example at the top of the array.
//     Leaving `photo: null` shows a neutral placeholder silhouette instead,
//     so the page never looks broken while photos are still being collected.
//   - To add or remove a committee member, add or delete an object from the
//     array. `id` just needs to be unique — it isn't shown anywhere.
//   - Every name below should be double-checked against the original बिधान
//     (bylaws) document / registration paperwork before this goes live —
//     see the CONTENT STATUS note.
//
// CONTENT STATUS:
//   The 7-seat structure (Chairperson, Vice-Chairperson, Secretary,
//   Treasurer, 3 Members) is REAL and comes directly from दफा १३ (Section 13)
//   of "नमुना अपाङ्ग समाज रसुवाको विधान, २०८२" (the org's bylaws), which fixes
//   the Executive Committee at exactly this composition with a 4-year term.
//
//   The Chairperson's name (Kishor Thing Tamang) is independently verified —
//   it also appears on the registration certificate and renewal record
//   reviewed earlier, and again in the bylaws' own founders' signature page
//   (दफा ३४).
//
//   The other six names below were transcribed from that same founders'
//   signature page (दफा ३४, the ad-hoc/तदर्थ समिति that registered the
//   org) via OCR of a scanned, hand-filled table. OCR on handwritten Nepali
//   names is genuinely error-prone, so treat these six spellings as a
//   best-effort first draft, not a confirmed source — please check them
//   against the original बिधान PDF (or with the client) before publishing.
//   The one titled "Joint Secretary" is not one of the bylaws' seven
//   permanent seats; it only shows up on the founding/ad-hoc committee list,
//   which by दफा ३३ is meant to be replaced by an elected committee at the
//   first Annual General Meeting.
//
//   Deliberately NOT included: home addresses, phone numbers or citizenship
//   numbers, even though the source document lists them for registration
//   purposes — that level of personal detail about individual committee
//   members doesn't belong on a public website.

// Example of adding a real photo once one is available:
// import kishorPhoto from "../assets/board/kishor-thing-tamang.jpg";

export const boardMembers = [
  {
    id: "chairperson",
    positionEn: "Chairperson",
    positionNe: "अध्यक्ष",
    nameEn: "Kishor Thing Tamang",
    nameNe: "किशोर थिङ तामाङ",
    photo: null, // e.g. photo: kishorPhoto,
    verified: true,
  },
  {
    id: "vice-chairperson",
    positionEn: "Vice-Chairperson",
    positionNe: "उपाध्यक्ष",
    nameEn: "Prasai Rumba",
    nameNe: "प्रसाई रुम्बा",
    photo: null,
    verified: false,
  },
  {
    id: "secretary",
    positionEn: "Secretary",
    positionNe: "सचिव",
    nameEn: "Kamisya Lama",
    nameNe: "कमिस्या लामा",
    photo: null,
    verified: false,
  },
  {
    id: "joint-secretary",
    positionEn: "Joint Secretary",
    positionNe: "सह-सचिव",
    nameEn: "Rajani Negi",
    nameNe: "रजनी नेगी",
    photo: null,
    verified: false,
  },
  {
    id: "treasurer",
    positionEn: "Treasurer",
    positionNe: "कोषाध्यक्ष",
    nameEn: "Manisha Tamang",
    nameNe: "मनिषा तामाङ",
    photo: null,
    verified: false,
  },
  {
    id: "member-1",
    positionEn: "Member",
    positionNe: "सदस्य",
    nameEn: "Gauri Sherpa",
    nameNe: "गौरी शेर्पा",
    photo: null,
    verified: false,
  },
  {
    id: "member-2",
    positionEn: "Member",
    positionNe: "सदस्य",
    nameEn: "Seti Maya Lopchan",
    nameNe: "सेती माया लोप्चन",
    photo: null,
    verified: false,
  },
];

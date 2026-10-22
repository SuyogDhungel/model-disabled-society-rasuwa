// Bikram Sambat (B.S.) -> A.D. date conversion, used only by the admin
// panel so editors can type the Nepali date printed on a report and get the
// matching Gregorian date. The public site always shows A.D. dates.
//
// Month lengths for B.S. 2075-2095 (A.D. ~2018-2039) were generated from
// the official calendar data in the "nepali-datetime" Python package and
// verified month-by-month against it. To extend the range later, append rows.
const BS_START_YEAR = 2075;
const BS_START_AD = "2018-04-14"; // = B.S. 2075 Baisakh 1
const BS_MONTH_DAYS = [
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30],
  [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30]
];

export const BS_MONTHS = [
  "Baisakh (बैशाख)", "Jestha (जेठ)", "Asar (असार)", "Shrawan (साउन)",
  "Bhadra (भदौ)", "Ashwin (असोज)", "Kartik (कात्तिक)", "Mangsir (मंसिर)",
  "Poush (पुस)", "Magh (माघ)", "Falgun (फागुन)", "Chaitra (चैत)",
];

export const BS_YEARS = BS_MONTH_DAYS.map((_, i) => BS_START_YEAR + i);

export function bsMonthLength(year, month) {
  return BS_MONTH_DAYS[year - BS_START_YEAR]?.[month - 1] || 0;
}

// Returns "YYYY-MM-DD" (A.D.), or "" if the B.S. date is out of range/invalid.
export function bsToAd(year, month, day) {
  const y = Number(year), m = Number(month), d = Number(day);
  if (!bsMonthLength(y, m) || d < 1 || d > bsMonthLength(y, m)) return "";
  let days = d - 1;
  for (let yy = BS_START_YEAR; yy < y; yy++) {
    days += BS_MONTH_DAYS[yy - BS_START_YEAR].reduce((a, b) => a + b, 0);
  }
  for (let mm = 1; mm < m; mm++) days += bsMonthLength(y, mm);
  const base = new Date(BS_START_AD + "T00:00:00Z");
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

// Approximate current B.S. year, for defaulting the converter's year picker.
export function currentBsYear() {
  const now = new Date();
  // Baisakh 1 falls on Apr 13/14, so B.S. = A.D. + 57 from mid-April onward.
  const afterNewYear = now.getMonth() > 3 || (now.getMonth() === 3 && now.getDate() >= 14);
  return now.getFullYear() + (afterNewYear ? 57 : 56);
}

/**
 * Trilyt AI for the demo console. A scripted agent: it reads the operator's
 * message (English, Hindi or both) with pattern matching and answers from the
 * sample data. Nothing is sent to a model or anywhere else.
 *
 * reply() is pure. It returns text and, where the answer is something to act
 * on, a card; the actions on a card (publish, remind, close) run through the
 * same store calls as the buttons elsewhere in the console, and only on a tap.
 */
import {
  ROLE_LABEL, TODAY, TODAY_S, TZ, byId, can, d, daysUntil, departures, dstr, dueItems, fee, fmt, fmtDay, orderDue, orderPaid, packages, team,
  type Order, type Pkg, type PolicyKey, type PriceOption, type Role, type Traveller,
} from "./data";

export const TRIP_PROMPT = "Manali se 7 din ki Spiti trip banao. 12 seats, ₹24,999 triple sharing, June ke har Saturday.";
export const SUGGESTIONS = [
  { label: "Build a Spiti trip", prompt: TRIP_PROMPT },
  { label: "Who still owes us?", prompt: "Kis kis ka balance baaki hai?" },
  { label: "Close the rafting batch", prompt: "Rishikesh rafting 25 Oct cancel karo, river band hai." },
  { label: "What needs me today?", prompt: "Aaj kya pending hai?" },
];

export interface TripDraft {
  tpl: string; name: string; slug: string; tagline: string; type: Pkg["type"]; region: string; image: string; meet: string;
  from: string; nights: number; days: number; seats: number; booking: number; policy: PolicyKey;
  options: PriceOption[]; inferred: string[]; dates: string[]; itinerary: string[]; inclusions: string[]; exclusions: string[];
}
export interface DueRow { id: string; name: string; pkg: string; amt: number; due: string; overdue: boolean }
export interface SeatRow { id: string; name: string; start: string; booked: number; seats: number }
export type Card =
  | { kind: "trip"; draft: TripDraft; state: "draft" | "old" | "sent" | "published"; pkgId?: string }
  | { kind: "dues"; rows: DueRow[]; state: "open" | "sent"; canSend: boolean }
  | { kind: "close"; depId: string; name: string; start: string; bookings: number; travellers: number; refund: number; next?: string; canClose: boolean; state: "ask" | "kept" | "done"; refunded?: number }
  | { kind: "seats"; rows: SeatRow[] }
  | { kind: "links"; links: { href: string; label: string }[] }
  | { kind: "help" };
export interface Turn { text: string; card?: Card; publish?: boolean }
export interface Ctx { role: Role; orders: Order[]; people: Traveller[]; closed: string[]; draft: TripDraft | null }

const OWNER = team.find((m) => m.role === "owner")!.name.split(" ")[0];

// ---------- dates ----------
const [TY, TM, TD] = TODAY_S.split("-").map(Number);
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_RE = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/g;
const WEEKDAYS: [RegExp, string][] = [
  [/\b(sun(day)?s?|ravivar|raviwar|itwar)\b/, "Sunday"], [/\b(mon(day)?s?|somvar|somwar)\b/, "Monday"],
  [/\b(tue(s(day)?)?s?|mangalvar|mangalwar)\b/, "Tuesday"], [/\b(wed(nesday)?s?|budhvar|budhwar)\b/, "Wednesday"],
  [/\b(thu(rs(day)?)?s?|guruvar|guruwar)\b/, "Thursday"], [/\b(fri(day)?s?|shukravar|shukrawar)\b/, "Friday"],
  [/\b(sat(urday)?s?|shanivar|shaniwar|weekends?)\b/, "Saturday"],
];

const iso = (y: number, m: number, day: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const utc = (s: string) => { const [y, m, dd] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, dd)); };
const fromUtc = (x: Date) => iso(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
export const addDays = (s: string, n: number) => fromUtc(new Date(utc(s).getTime() + n * 86400000));
const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
/** The next time this month comes round: this year if it is still ahead, next year if it has passed. */
const yearFor = (m: number, day = 31) => (m > TM - 1 || (m === TM - 1 && day >= TD) ? TY : TY + 1);
const weekdayIn = (y: number, m: number, wd: number) => Array.from({ length: daysIn(y, m) }, (_, i) => iso(y, m, i + 1)).filter((s) => utc(s).getUTCDay() === wd);
const nextWeekday = (from: string, wd: number) => { let s = from; while (utc(s).getUTCDay() !== wd) s = addDays(s, 1); return s; };
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

interface MonthHit { m: number; at: number; len: number }
function monthsIn(t: string): MonthHit[] {
  const out: MonthHit[] = [];
  for (const x of t.matchAll(MONTH_RE)) {
    const at = x.index ?? 0;
    // "may" is usually the verb: only a month next to a date, a year or "ke/mein".
    if (x[1] === "may" && !/(\d\s*|\bin |\bof )$/.test(t.slice(0, at)) && !/^\s*(ke|ki|mein|me|month|20\d\d)\b/.test(t.slice(at + 3))) continue;
    out.push({ m: MONTHS.indexOf(x[1].slice(0, 3)), at, len: x[0].length });
  }
  return out;
}

/**
 * Dates in a message: "6, 13 and 20 June", "June 6", "June ke har Saturday",
 * "every Saturday in June and July", or a bare month (its Saturdays).
 */
export function parseDates(t: string): { dates: string[]; rule: string } {
  const out = new Set<string>();
  const year = Number(/\b(202[5-9]|203\d)\b/.exec(t)?.[1]) || 0;
  const months = monthsIn(t);
  const explicit = new Set<number>();
  for (const { m, at, len } of months) {
    const before = /(?<![\d,.₹])((?:\d{1,2}(?!\d)(?:st|nd|rd|th)?\s*(?:,|&|and|aur|or)?\s*)+)$/.exec(t.slice(0, at));
    const after = /^\s*(\d{1,2})(?:st|nd|rd|th)?\b(?!\s*(?:seats?|din|days?|nights?|log|pax|people|k\b))/.exec(t.slice(at + len));
    const days = (before ? (before[1].match(/\d{1,2}/g) ?? []).map(Number) : after ? [Number(after[1])] : []).filter((x) => x >= 1 && x <= 31);
    if (!days.length) continue;
    explicit.add(m);
    for (const dd of days) { const y = year || yearFor(m, dd); if (dd <= daysIn(y, m)) out.add(iso(y, m, dd)); }
  }
  let rule = out.size ? "the dates you gave" : "";
  const wd = WEEKDAYS.findIndex(([re]) => re.test(t));
  const rest = months.filter((x) => !explicit.has(x.m)).map((x) => x.m).filter((m, i, a) => a.indexOf(m) === i);
  if (rest.length) {
    const day = wd >= 0 ? wd : 6;
    for (const m of rest) for (const s of weekdayIn(year || yearFor(m), m, day)) if (s > TODAY_S) out.add(s);
    const y = year || yearFor(rest[0]);
    rule = `every ${WEEKDAYS[day][1]} in ${list(rest.map((m) => MONTH_NAMES[m]))}${y !== TY ? ` ${y}` : ""}`;
  } else if (wd >= 0 && !out.size) {
    let s = nextWeekday(addDays(TODAY_S, 14), wd);
    for (let i = 0; i < 4; i++, s = addDays(s, 7)) out.add(s);
    rule = `the next four ${WEEKDAYS[wd][1]}s, starting two weeks out`;
  }
  return { dates: [...out].sort().slice(0, 12), rule };
}

/** Days a message points at for something already on the calendar: "25 Oct", "Saturday", "kal", "this weekend". */
function whenIn(t: string): string[] {
  if (/\b(kal|tomorrow)\b/.test(t)) return [addDays(TODAY_S, 1)];
  if (/\b(aaj|today)\b/.test(t)) return [TODAY_S];
  if (/\b(this|is|iss) weekend\b/.test(t)) { const sat = nextWeekday(TODAY_S, 6); return [sat, addDays(sat, 1)]; }
  const { dates } = parseDates(t.replace(/\b(every|har|all)\b/g, ""));
  if (dates.length && monthsIn(t).length) return dates;
  const wd = WEEKDAYS.findIndex(([re]) => re.test(t));
  return wd >= 0 ? [nextWeekday(TODAY_S, wd)] : [];
}

// ---------- numbers ----------
const OPT: Record<string, [string, string]> = {
  triple: ["tr", "Triple sharing"], double: ["db", "Double sharing"], twin: ["db", "Double sharing"], quad: ["qd", "Quad sharing"],
  single: ["sg", "Single room"], solo: ["sg", "Single room"], pillion: ["pil", "Pillion"], "own bike": ["own", "Own bike"], rental: ["rent", "Bike rental"],
};
const OPT_WORD = "(triple|double|twin|quad|single|solo|pillion|own bike|rental)";

interface Scan { prices: { opt?: string; amt: number }[]; seats?: number; days?: number; nights?: number; booking?: number }
/** Every number in the message, sorted into prices, seats, days, nights and the booking amount by the words around it. */
export function scan(t: string): Scan {
  const s: Scan = { prices: [] };
  for (const x of t.matchAll(/(₹|\brs\.?|\binr)?\s?(\d{1,3}(?:,\d{2,3})+|\d+(?:\.\d+)?)(\s?(?:k\b|thousand|hazaa?r))?/g)) {
    const at = x.index ?? 0, end = at + x[0].length;
    const cur = !!x[1], k = !!x[3], raw = x[2];
    const v = Math.round(parseFloat(raw.replace(/,/g, "")) * (k ? 1000 : 1));
    const after = t.slice(end, end + 32), before = t.slice(Math.max(0, at - 32), at);
    if (!cur && /^\s*(st|nd|rd|th)?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(after)) continue;
    if (!cur && v <= 31 && /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*$/.test(before)) continue;
    if (!cur && !k && /^\d{4}$/.test(raw) && v >= 2024 && v <= 2035) continue;
    const compact = /^\s*n\s*\/?\s*(\d+)\s*d\b/.exec(after);
    if (compact) { s.nights = v; s.days = Number(compact[1]); continue; }
    if (/^\s*(seats?|log\b|logon|logo\b|people|pax|travell?ers?|slots?|spots?|beds?|bande|members)/.test(after) || /(batch|group)\s*(of|size|ka|ki|:)?\s*$|seats?\s*(:|=|to|ko)?\s*$/.test(before)) { s.seats = v; continue; }
    if (/^\s*-?\s*(din|days?|d\b)/.test(after)) { s.days = v; continue; }
    if (/^\s*-?\s*(nights?|raat|raatein|n\b)/.test(after)) { s.nights = v; continue; }
    if (/(booking amount|booking|advance|token|deposit)\s*(amount|of|:|=|ko)?\s*$/.test(before) || /^\s*(advance|token|deposit|booking amount|to book)/.test(after)) { s.booking = v; continue; }
    if (!cur && !k && v < 1000) continue;
    const opt = new RegExp(`^\\s*(/-|rs\\.?|rupees|per head|per person|pp|each)?\\s*([-–:]|for|in|on)?\\s*${OPT_WORD}`).exec(after)?.[3]
      ?? new RegExp(`${OPT_WORD}\\s*(sharing|room|occupancy)?\\s*([-–:@=]|at|for|ka|ki|ke|is|price)?\\s*$`).exec(before)?.[1];
    s.prices.push({ opt, amt: v });
  }
  return s;
}

// ---------- places and trip templates ----------
const CITIES: Record<string, string> = {
  delhi: "Delhi", bangalore: "Bengaluru", bengaluru: "Bengaluru", mumbai: "Mumbai", bombay: "Mumbai", pune: "Pune", chandigarh: "Chandigarh",
  shimla: "Shimla", manali: "Manali", dehradun: "Dehradun", rishikesh: "Rishikesh", haridwar: "Haridwar", guwahati: "Guwahati", kochi: "Kochi",
  cochin: "Kochi", srinagar: "Srinagar", leh: "Leh", bagdogra: "Bagdogra", siliguri: "Siliguri", kolkata: "Kolkata", hyderabad: "Hyderabad",
  chennai: "Chennai", jaipur: "Jaipur", ahmedabad: "Ahmedabad", shillong: "Shillong", gangtok: "Gangtok", goa: "Goa", kasol: "Kasol",
};

interface Tpl {
  key: string; name: string; aliases: string[]; region: string; type: Pkg["type"]; from: string; image: string; price: number;
  tagline: string; meet: string; days: string[]; extra: string[]; end: string;
}
const TEMPLATES: Tpl[] = [
  { key: "spiti", name: "Spiti Valley Circuit", aliases: ["spiti", "kaza", "chandratal"], region: "Himachal", type: "Road trip", from: "Manali", image: "/images/demo/spiti.jpg", price: 24999,
    tagline: "The cold desert loop: Kunzum Pass, Kaza's high villages and a night at Chandratal.", meet: "Manali Mall Road, 6:30 am",
    days: ["Manali → Kaza via Kunzum Pass", "Key Monastery, Kibber, Chicham", "Langza, Hikkim, Komic", "Kaza → Chandratal camp", "Chandratal → Manali via Atal Tunnel"],
    extra: ["Manali local: Hadimba temple, Old Manali", "Solang Valley and Sissu", "Dhankar and Tabo"], end: "Depart Manali" },
  { key: "ladakh", name: "Ladakh Circuit", aliases: ["ladakh", "leh", "nubra", "pangong", "khardung"], region: "Ladakh", type: "Road trip", from: "Leh", image: "/images/demo/ladakh.jpg", price: 32999,
    tagline: "Khardung La, Nubra's dunes and a night on Pangong's shore.", meet: "Leh airport, arrivals",
    days: ["Arrive Leh, rest and acclimatise", "Leh local: Shanti Stupa, Leh Palace, Hall of Fame", "Leh → Nubra via Khardung La", "Nubra → Pangong via Shyok", "Pangong → Leh via Chang La"],
    extra: ["Hanle dark-sky night", "Tso Moriri", "Sham valley and Magnetic Hill"], end: "Depart Leh" },
  { key: "kedarkantha", name: "Kedarkantha Winter Trek", aliases: ["kedarkantha"], region: "Uttarakhand", type: "Trek", from: "Dehradun", image: "/images/demo/kedarkantha.jpg", price: 9499,
    tagline: "Snow forests, a summit at sunrise, campfires at night.", meet: "Dehradun ISBT, 6:00 am",
    days: ["Dehradun → Sankri", "Sankri → Juda ka Talab", "Juda ka Talab → Kedarkantha base", "Summit at sunrise, down to Hargaon", "Hargaon → Sankri"],
    extra: ["Buffer day for snow"], end: "Sankri → Dehradun" },
  { key: "hampta", name: "Hampta Pass Trek", aliases: ["hampta"], region: "Himachal", type: "Trek", from: "Manali", image: "/images/demo/camp.jpg", price: 11999,
    tagline: "Green Kullu to stark Lahaul in one crossing, with Chandratal at the end.", meet: "Manali Mall Road, 8:00 am",
    days: ["Manali → Jobra → Chika", "Chika → Balu ka Ghera", "Balu ka Ghera → Hampta Pass → Shea Goru", "Shea Goru → Chatru, drive to Chandratal"],
    extra: ["Buffer day for weather"], end: "Chandratal → Manali" },
  { key: "kheerganga", name: "Kasol and Kheerganga", aliases: ["kheerganga", "kasol", "parvati", "tosh"], region: "Himachal", type: "Backpacking", from: "Delhi", image: "/images/demo/camp.jpg", price: 7999,
    tagline: "Parvati valley cafés, a forest trail and hot springs at the top.", meet: "Delhi, Majnu ka Tilla, 7:00 pm",
    days: ["Delhi → Bhuntar overnight", "Kasol, Chalal walk, Manikaran", "Barshaini → Kheerganga, hot-spring camp", "Kheerganga → Barshaini, Tosh village"],
    extra: ["Malana viewpoint hike"], end: "Kasol → Delhi overnight" },
  { key: "rafting", name: "Rishikesh Rafting Weekend", aliases: ["rafting", "rishikesh", "shivpuri"], region: "Uttarakhand", type: "Water", from: "Rishikesh", image: "/images/demo/rishikesh.jpg", price: 3499,
    tagline: "16 km of rapids and a night by the river.", meet: "Shivpuri camp gate, 2:00 pm",
    days: ["Arrive Shivpuri camp, bonfire by the river"], extra: ["Cliff jump and kayaking basics", "Neer Garh waterfall and the Beatles Ashram"], end: "Raft Shivpuri → Rishikesh, depart" },
  { key: "meghalaya", name: "Meghalaya Root Bridges", aliases: ["meghalaya", "shillong", "cherrapunji", "root bridge", "dawki"], region: "Meghalaya", type: "Backpacking", from: "Guwahati", image: "/images/demo/meghalaya.jpg", price: 15999,
    tagline: "Living bridges, blue pools and the wettest place on earth.", meet: "Guwahati airport, 11:00 am",
    days: ["Guwahati → Shillong", "Cherrapunji: Nohkalikai and Arwah caves", "Nongriat double-decker root bridge", "Dawki and Shnongpdeng"],
    extra: ["Mawlynnong village"], end: "Shillong → Guwahati" },
  { key: "valley", name: "Valley of Flowers Trek", aliases: ["valley of flowers", "hemkund"], region: "Uttarakhand", type: "Trek", from: "Haridwar", image: "/images/demo/camp.jpg", price: 12999,
    tagline: "A valley in full bloom, and Hemkund Sahib above the clouds.", meet: "Haridwar railway station, 6:00 am",
    days: ["Haridwar → Govindghat", "Govindghat → Ghangaria", "Valley of Flowers", "Hemkund Sahib", "Ghangaria → Govindghat → Joshimath"],
    extra: ["Buffer day for weather"], end: "Joshimath → Haridwar" },
  { key: "chopta", name: "Chopta, Tungnath and Chandrashila", aliases: ["chopta", "tungnath", "chandrashila"], region: "Uttarakhand", type: "Trek", from: "Delhi", image: "/images/demo/kedarkantha.jpg", price: 8999,
    tagline: "The highest Shiva temple and a summit view of Chaukhamba.", meet: "Delhi, Kashmere Gate ISBT, 10:00 pm",
    days: ["Delhi → Rishikesh overnight", "Rishikesh → Chopta", "Tungnath and Chandrashila summit", "Deoria Tal"], extra: ["Sari village walk"], end: "Return to Delhi" },
  { key: "coorg", name: "Coorg Coffee Trail", aliases: ["coorg", "kodagu", "tadiandamol"], region: "Karnataka", type: "Backpacking", from: "Bengaluru", image: "/images/demo/munnar.jpg", price: 7999,
    tagline: "Estate stays, misty trails and Karnataka's highest peak.", meet: "Bengaluru, Majestic, 6:00 am",
    days: ["Bengaluru → Coorg, coffee estate stay", "Tadiandamol trek", "Abbey Falls and Raja's Seat"], extra: ["Dubare elephant camp"], end: "Return to Bengaluru" },
  { key: "sikkim", name: "North Sikkim Road Trip", aliases: ["sikkim", "gangtok", "lachung", "yumthang"], region: "Sikkim", type: "Road trip", from: "Bagdogra", image: "/images/demo/ladakh.jpg", price: 21999,
    tagline: "Tsomgo Lake, Lachung's apple orchards and Yumthang in bloom.", meet: "Bagdogra airport, 11:00 am",
    days: ["Bagdogra → Gangtok", "Tsomgo Lake and Nathu La", "Gangtok → Lachung", "Yumthang Valley and Zero Point", "Lachung → Gangtok"], extra: ["Rumtek monastery"], end: "Gangtok → Bagdogra" },
];

const BY_TYPE: Record<Pkg["type"], { inc: string[]; exc: string[]; image: string }> = {
  "Road trip": { inc: ["Tempo traveller for the whole route", "Stays on twin or triple sharing", "Breakfast and dinner", "Permits where needed", "Trip captain and first aid"], exc: ["Lunches", "Entry fees", "Anything not listed"], image: "/images/demo/spiti.jpg" },
  Trek: { inc: ["Trek leader and support staff", "Tents on sharing", "All meals on the trek", "Forest permits", "First aid and oxygen"], exc: ["Transport to the base village", "Personal gear", "Anything not listed"], image: "/images/demo/camp.jpg" },
  "Bike trip": { inc: ["Backup vehicle and mechanic", "Stays on sharing", "Breakfast and dinner", "Permits", "Road captain"], exc: ["Fuel", "Bike damage deposit", "Anything not listed"], image: "/images/demo/ladakh.jpg" },
  Backpacking: { inc: ["Local transport", "Homestays on sharing", "Breakfast", "Local guides"], exc: ["Travel to the start city", "Lunches and dinners", "Anything not listed"], image: "/images/demo/meghalaya.jpg" },
  Water: { inc: ["Riverside camp", "Dinner and breakfast", "Rafting with certified guides and gear"], exc: ["Transport to the camp", "Anything not listed"], image: "/images/demo/rishikesh.jpg" },
};

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const NOT_A_PLACE = new Set(["din", "day", "days", "ek", "new", "nayi", "naya", "weekend", "road", "bike", "group", "family", "short", "long", "the", "a", "ki", "ka", "ke", "this", "next", "college", "office", "corporate", "school"]);

function originIn(t: string): string | undefined {
  for (const re of [/\b([a-z]+)\s+se\b/g, /\bfrom\s+([a-z]+)/g, /\b([a-z]+)\s+(?:to|→)\s+[a-z]+/g]) for (const x of t.matchAll(re)) if (CITIES[x[1]]) return CITIES[x[1]];
  return undefined;
}

/** The trip a message asks for: a known route, or a place we have no itinerary for. */
function placeIn(t: string, raw: string, origin?: string): { tpl: Tpl; custom?: string } | null {
  const o = origin?.toLowerCase();
  let best: { tpl: Tpl; at: number } | null = null;
  for (const tpl of TEMPLATES) for (const a of tpl.aliases) {
    if (a === o) continue;
    const at = t.search(new RegExp(`\\b${a}\\b`));
    if (at >= 0 && (!best || at < best.at)) best = { tpl, at };
  }
  if (best) return { tpl: best.tpl };
  const fromOrigin = TEMPLATES.find((x) => o && x.aliases.includes(o));
  if (fromOrigin) return { tpl: fromOrigin };
  const m = /\b([A-Za-z]+)(?:\s+(?:ki|ka|ke))?\s+(?:trip|trek|tour|ride|getaway|expedition)\b/.exec(raw);
  const w = m?.[1].toLowerCase();
  if (!w || NOT_A_PLACE.has(w) || w === o || /^\d/.test(w)) return null;
  const place = CITIES[w] ?? cap(w);
  return { tpl: customTpl(place, /\btrek\b/.test(t) ? "Trek" : "Road trip"), custom: place };
}

function customTpl(place: string, type: Pkg["type"]): Tpl {
  return {
    key: `custom:${place}`, name: `${place} ${type === "Trek" ? "Trek" : "Trip"}`, aliases: [], region: place, type, from: place, image: "/images/demo/topo.jpg", price: 9999,
    tagline: `${place}, planned and run by your own team.`, meet: `${place}, pickup point shared on WhatsApp`,
    days: [`Arrive ${place}, check in and trip briefing`, `Explore ${place} with your trip captain`], extra: [`Day out around ${place}`, "Free morning, evening activity", "Buffer day for weather"], end: `Depart ${place}`,
  };
}
const tplOf = (key: string) => TEMPLATES.find((x) => x.key === key) ?? customTpl(key.replace(/^custom:/, ""), "Road trip");

function itinerary(tpl: Tpl, origin: string, days: number) {
  let core = tpl.days, end = tpl.end;
  if (origin !== tpl.from) { core = [`${origin} → ${tpl.from}, overnight`, ...core]; end = `${tpl.from} → ${origin}, arrive next morning`; }
  const out = core.slice(0, Math.max(0, days - 1));
  for (let i = 0; out.length < days - 1; i++) out.push(tpl.extra[i] ?? "Buffer day for weather");
  return [...out, end];
}
const defaultDays = (tpl: Tpl, origin: string) => tpl.days.length + 1 + (origin !== tpl.from ? 1 : 0);
const bookingFor = (price: number) => Math.max(500, Math.round((price * 0.2) / 500) * 500);
/** Double sharing usually sells about 12% over triple, rounded to a thousand. */
const doubleFrom = (triple: number) => triple + Math.max(1000, Math.round((triple * 0.12) / 1000) * 1000);
const shortOpt = (name: string) => name.replace(/ sharing| room/, "");

function uniqueName(base: string, from: string) {
  const taken = (n: string) => packages.some((p) => p.name.toLowerCase() === n.toLowerCase() || p.slug === slugify(n));
  if (!taken(base)) return base;
  const alt = `${base} from ${from}`;
  if (!taken(alt)) return alt;
  for (let i = 2; ; i++) if (!taken(`${alt} ${i}`)) return `${alt} ${i}`;
}

// ---------- intents ----------
const CREATE = /\b(bana|banao|bana do|banado|banaye|create|make|new|naya|nayi|plan|design|draft|set up|setup|launch|chahiye|start)\b/;
const CLOSE = /\b(close|cancel|radd|postpone|call off)\b|\bband (kar|karo|hai|ho)|nahi (jayega|jaega|chalega|hoga)/;
const DUES = /\b(owe|owes|owing|due|dues|balance|balances|baaki|baki|bakaya|unpaid|overdue|outstanding|remind|reminders?|chase|paise|paisa)\b|payments? (pending|nahi|baaki)|pending payments?/;
const SEATS = /\b(seats?|availability|available|jagah|spots?|kitne log|full|filling|manifest)\b/;
const SUMMARY = /\b(today|aaj|summary|pending|needs me|kya chal|overview|collect(ed|ion)?|kitna aaya|revenue|this month|is mahine|kaisa chal|update|status)\b/;
const HELP = /^(hi+|hello|hey|namaste|namaskar|help|what can you do|kya kar sakte)\b/;

export function reply(raw: string, ctx: Ctx): Turn {
  const t = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (HELP.test(t) && t.length < 40) return help(ctx.role);
  if (ctx.draft && /\b(publish|go live|live kar|live karo|make it live|website (pe|par) (daal|dal|laga))/.test(t)) return { text: "", publish: true };

  const origin = originIn(t);
  const place = placeIn(t, raw, origin);
  const s = scan(t);
  const numbers = s.prices.length > 0 || !!s.seats || !!s.days || !!s.nights;
  if (place && (CREATE.test(t) || numbers) && !CLOSE.test(t)) {
    // "Spiti mein seats 14 kar do" while a Spiti draft is open changes that draft rather than starting another.
    if (ctx.draft && place.tpl.key === ctx.draft.tpl && !CREATE.test(t)) { const r = revise(ctx.draft, t, s); if (r) return r; }
    return trip(t, place, origin, s, ctx);
  }
  if (!place && /\b(trip|trek|package|tour|itinerary)\b/.test(t) && CREATE.test(t) && !ctx.draft)
    return { text: "Where to? Tell me the place, the days, seats, price and dates in one line, the way you'd tell your team. For example:\n“" + TRIP_PROMPT + "”" };

  if (CLOSE.test(t)) { const r = close(t, ctx); if (r) return r; }
  if (ctx.draft) { const r = revise(ctx.draft, t, s); if (r) return r; }
  if (DUES.test(t)) return dues(ctx);
  if (SEATS.test(t)) return seats(t, ctx);
  if (SUMMARY.test(t)) return summary(ctx);
  return { text: "I didn't follow that one. In this demo I can build a trip from one line, chase balances, close a departure and answer from your numbers. Try one of these:", card: { kind: "help" } };
}

function help(role: Role): Turn {
  return { text: `Namaste. I work on ${role === "owner" ? "your" : `${OWNER}'s`} bookings, departures and payments, and I ask before anything goes out. Try one of these, or type it your way:`, card: { kind: "help" } };
}

function trip(t: string, place: { tpl: Tpl; custom?: string }, origin: string | undefined, s: Scan, ctx: Ctx): Turn {
  if (!can(ctx.role, "Create and edit packages"))
    return { text: ctx.role === "agent" ? "Agents sell trips at your net rate; creating a package is the operator's job. Switch the viewer to Owner to try this." : `The ${ROLE_LABEL[ctx.role].toLowerCase()} role can't create packages. Switch the viewer to Owner or Ops manager to try this.` };
  const tpl = place.tpl;
  const from = origin ?? tpl.from;
  const notes: string[] = [];
  let type = tpl.type;
  if (/\b(bike|ride|riding|motorcycle|motorbike)\b/.test(t)) type = "Bike trip";
  else if (/\btrek\b/.test(t)) type = "Trek";
  else if (/\b(rafting|kayak)/.test(t)) type = "Water";
  const days = s.days ?? (s.nights ? s.nights + 1 : defaultDays(tpl, from));

  const options: PriceOption[] = [];
  const inferred: string[] = [];
  for (const p of s.prices) {
    const [id, name] = p.opt ? OPT[p.opt] : ["std", "Standard"];
    if (!options.some((o) => o.id === id)) options.push({ id, name, price: p.amt });
  }
  if (!options.length) { options.push({ id: "std", name: "Standard", price: tpl.price }); notes.push(`There was no price in your message, so I used ${fmt(tpl.price)}; reply with yours`); }
  if (options.length === 1 && options[0].id === "tr") {
    options.push({ id: "db", name: "Double sharing", price: doubleFrom(options[0].price) }); inferred.push("db");
    notes.push(`I added Double sharing at ${fmt(options[1].price)}`);
  }
  options.sort((a, b) => a.price - b.price);

  const when = parseDates(t);
  let dates = when.dates.filter((x) => x > TODAY_S);
  if (!dates.length) {
    let x = nextWeekday(addDays(TODAY_S, 14), 6); dates = [];
    for (let i = 0; i < 4; i++, x = addDays(x, 7)) dates.push(x);
    notes.push("there were no dates, so I pencilled in the next four Saturdays");
  }
  const seats = s.seats ?? 12;
  if (!s.seats) notes.push("12 seats a batch until you tell me otherwise");

  const name = uniqueName(type === "Bike trip" && tpl.type !== type ? `${tpl.name.split(" ")[0]} Bike Expedition` : tpl.name, from);
  const base = name.replace(/ from .*$/, "");
  if (name !== base && !place.custom) notes.unshift(`you already sell ${base}, so this one is ${name}`);
  if (place.custom) notes.push(`I don't have a ${place.custom} route yet, so the days and the photo are placeholders to fill in`);
  else if (days < defaultDays(tpl, from)) notes.push(`this route usually takes ${defaultDays(tpl, from)} days from ${from}, so I cut the last ones; check the days`);
  const booking = s.booking ?? bookingFor(options[0].price);

  const draft: TripDraft = {
    tpl: tpl.key, name, slug: slugify(name), tagline: tpl.tagline, type, region: tpl.region, image: type !== tpl.type && !place.custom ? BY_TYPE[type].image : tpl.image,
    meet: from === tpl.from ? tpl.meet : `${from}, pickup point shared on WhatsApp`, from, nights: days - 1, days, seats, booking,
    policy: /\bflexible\b/.test(t) ? "flexible" : "standard", options, inferred, dates, itinerary: itinerary(tpl, from, days),
    inclusions: BY_TYPE[type].inc, exclusions: BY_TYPE[type].exc,
  };
  const batches = `${dates.length} departure${dates.length > 1 ? "s" : ""}${when.rule && when.dates.length ? `, ${when.rule}` : ""}`;
  const examples = `“price ${(options[0].price + 2000).toLocaleString("en-IN")} kar do”, “${dstr(dates[Math.min(2, dates.length - 1)])} hata do”`;
  const then = ctx.role === "owner" ? "then publish" : `then send it to ${OWNER}, since prices are the owner's call`;
  const text = `Drafted: ${draft.days} days from ${from}, ${batches}. ${notes.length ? cap(list(notes)) + ". " : ""}Reply to change anything (${examples}), ${then}.`;
  return { text, card: { kind: "trip", draft, state: "draft" } };
}

function revise(dr: TripDraft, t: string, s: Scan): Turn | null {
  const next: TripDraft = { ...dr, options: dr.options.map((o) => ({ ...o })), inferred: [...dr.inferred], dates: [...dr.dates] };
  const changes: string[] = [];
  for (const p of s.prices) {
    if (p.opt) {
      const [id, name] = OPT[p.opt];
      const o = next.options.find((x) => x.id === id);
      if (o) o.price = p.amt; else next.options.push({ id, name, price: p.amt });
      next.inferred = next.inferred.filter((x) => x !== id);
      changes.push(`${shortOpt(name)} ${fmt(p.amt)}`);
    } else {
      const base = next.options.find((o) => !next.inferred.includes(o.id)) ?? next.options[0];
      const delta = p.amt - base.price;
      base.price = p.amt;
      for (const o of next.options) if (next.inferred.includes(o.id)) { o.price += delta; changes.push(`${shortOpt(o.name)} moves to ${fmt(o.price)}`); }
      changes.unshift(`${shortOpt(base.name)} ${fmt(p.amt)}`);
      const b = bookingFor(Math.min(...next.options.map((o) => o.price)));
      if (!s.booking && b !== next.booking) { next.booking = b; changes.push(`${fmt(b)} to book`); }
    }
  }
  next.options.sort((a, b) => a.price - b.price);
  if (s.seats && s.seats !== dr.seats) { next.seats = s.seats; changes.push(`${s.seats} seats a batch`); }
  const days = s.days ?? (s.nights ? s.nights + 1 : undefined);
  if (days && days !== dr.days) { next.days = days; next.nights = days - 1; next.itinerary = itinerary(tplOf(dr.tpl), dr.from, days); changes.push(`${days} days`); }
  if (s.booking) { next.booking = s.booking; changes.push(`${fmt(s.booking)} to book`); }
  if (/\bflexible\b/.test(t) && dr.policy !== "flexible") { next.policy = "flexible"; changes.push("Flexible cancellation policy"); }
  if (/\bstandard\b/.test(t) && /polic/.test(t) && dr.policy !== "standard") { next.policy = "standard"; changes.push("Standard cancellation policy"); }
  const when = parseDates(t).dates;
  if (when.length) {
    if (/\b(hata|hatao|remove|drop|delete|nikal|nikalo|cancel)\b/.test(t)) {
      const gone = next.dates.filter((x) => when.includes(x));
      if (!gone.length) return { text: `${list(when.map(dstr))} isn't one of the departures. They are ${list(dr.dates.map(dstr))}.` };
      next.dates = next.dates.filter((x) => !gone.includes(x)); changes.push(`removed ${list(gone.map(dstr))}`);
    }
    else if (/\b(only|sirf|bas|just|instead)\b/.test(t)) { next.dates = when.filter((x) => x > TODAY_S); changes.push(`dates now ${list(next.dates.map(dstr))}`); }
    else { const add = when.filter((x) => x > TODAY_S && !next.dates.includes(x)); next.dates = [...next.dates, ...add].sort(); if (add.length) changes.push(`added ${list(add.map(dstr))}`); }
  }
  if (!changes.length) return null;
  if (!next.dates.length) return { text: "That would leave the trip with no departures. Give me at least one date to keep." };
  return { text: `Updated: ${list(changes)}. Publish when it looks right.`, card: { kind: "trip", draft: next, state: "draft" } };
}

/** Words that name a package in a message: "rafting", "spiti", "kedarkantha". */
function pkgWords(p: Pkg) {
  const stop = new Set(["valley", "circuit", "weekend", "winter", "trek", "trip", "expedition", "bridges", "from", "and", "road"]);
  const w = p.name.toLowerCase().split(/[^a-z]+/).filter((x) => x.length > 3 && !stop.has(x));
  if (p.type === "Water") w.push("rafting", "river");
  if (p.type === "Bike trip") w.push("bike");
  return w;
}

function close(t: string, ctx: Ctx): Turn | null {
  const upcoming = departures.filter((x) => x.start >= TODAY_S && !ctx.closed.includes(x.id) && ctx.orders.some((o) => o.dep === x.id && o.status !== "cancelled"))
    .sort((a, b) => a.start.localeCompare(b.start));
  const named = packages.filter((p) => pkgWords(p).some((w) => new RegExp(`\\b${w}\\b`).test(t))).map((p) => p.id);
  const when = whenIn(t);
  let hits = upcoming.filter((x) => (!named.length || named.includes(x.pkg)) && (!when.length || when.includes(x.start)));
  if (!hits.length && named.length && !when.length) hits = upcoming.filter((x) => named.includes(x.pkg));
  if (!named.length && !when.length) return null;
  if (!hits.length) {
    const rows = upcoming.slice(0, 5).map(seatRow);
    return { text: "I couldn't find a departure with bookings that matches. These are your next ones; tell me which to close:", card: { kind: "seats", rows } };
  }
  const dep = hits[0];
  const p = byId(packages, dep.pkg)!;
  const live = ctx.orders.filter((o) => o.dep === dep.id && o.status !== "cancelled");
  const travellers = live.reduce((n, o) => n + o.lines.length, 0);
  const refund = live.reduce((n, o) => n + orderPaid(o), 0);
  const next = departures.filter((x) => x.pkg === dep.pkg && x.start > dep.start && !ctx.closed.includes(x.id)).sort((a, b) => a.start.localeCompare(b.start))[0];
  const canClose = can(ctx.role, "Close a departure and refund everyone") === true;
  const card: Card = { kind: "close", depId: dep.id, name: p.name, start: dep.start, bookings: live.length, travellers, refund, next: next?.start, canClose, state: "ask" };
  const others = hits.length > 1 ? ` (I picked the first of ${hits.length} that match.)` : "";
  const text = canClose
    ? `${p.name} on ${dstr(dep.start)} has ${live.length} booking${live.length === 1 ? "" : "s"}, ${travellers} travellers.${others} Closing it refunds ${fmt(refund)} in full to how each one paid${next ? ` and offers everyone the ${dstr(next.start)} batch` : ""} on WhatsApp. Go ahead?`
    : `${p.name} on ${dstr(dep.start)} has ${live.length} bookings and ${fmt(refund)} paid in. Only the owner can close a departure and refund everyone, so I can't do this as ${ROLE_LABEL[ctx.role]}. Switch the viewer to Owner to try it.`;
  return { text, card };
}

function seatRow(x: (typeof departures)[number]): SeatRow {
  return { id: x.id, name: byId(packages, x.pkg)!.name, start: x.start, booked: x.booked, seats: x.seats };
}

function dues(ctx: Ctx): Turn {
  if (ctx.role === "guide" || ctx.role === "agent")
    return { text: `The ${ROLE_LABEL[ctx.role].toLowerCase()} role doesn't see who paid what. I can show seats on your departures instead: ask “seats kitni bachi hain?”` };
  const rows: DueRow[] = dueItems(ctx.orders).filter(({ o }) => o.status === "part").map(({ o, amt, due, overdue }) => ({
    id: o.id, name: byId(ctx.people, o.lines[0].t)?.name ?? o.id, pkg: byId(packages, byId(departures, o.dep)!.pkg)!.name, amt, due: fromUtc(new Date(due.getTime() + 330 * 60000)), overdue,
  }));
  if (!rows.length) return { text: "Nobody owes you anything right now. Every live booking is paid up." };
  const total = rows.reduce((n, r) => n + r.amt, 0), late = rows.filter((r) => r.overdue).length;
  const canSend = can(ctx.role, "Send payment link or reminder") === true;
  const pending = ctx.orders.filter((o) => o.status === "pending");
  const held = pending.reduce((n, o) => n + orderDue(o), 0);
  return {
    text: `Travellers still owe ${fmt(total)} across ${rows.length} bookings${late ? `, ${late} of them overdue` : ""}.${pending.length ? ` ${pending.length > 1 ? `${pending.length} agent orders` : "An agent order"} for ${fmt(held)} ${pending.length > 1 ? "are" : "is"} waiting for your confirmation, so ${pending.length > 1 ? "they aren't" : "it isn't"} on this list.` : ""}${canSend ? " I can send each traveller a WhatsApp reminder with a payment link for exactly what they owe." : ""}`,
    card: { kind: "dues", rows, state: "open", canSend },
  };
}

function seats(t: string, ctx: Ctx): Turn {
  const named = packages.filter((p) => pkgWords(p).some((w) => new RegExp(`\\b${w}\\b`).test(t))).map((p) => p.id);
  const mine = ctx.role === "guide" ? departures.filter((x) => x.guide === "Tenzin Norbu") : departures;
  const rows = mine.filter((x) => x.start >= TODAY_S && !ctx.closed.includes(x.id) && (!named.length || named.includes(x.pkg)))
    .sort((a, b) => a.start.localeCompare(b.start)).slice(0, 6).map(seatRow);
  if (!rows.length) return { text: "No upcoming departures match that." };
  const open = rows.reduce((n, r) => n + Math.max(0, r.seats - r.booked), 0);
  const hot = rows.filter((r) => r.seats - r.booked > 0 && r.seats - r.booked <= 3);
  const one = hot.every((r) => r.name === hot[0]?.name);
  const full = !hot.length ? "" : one ? ` The ${list(hot.map((r) => dstr(r.start)))} batch${hot.length > 1 ? "es are" : " is"} nearly full.` : ` ${list(hot.map((r) => `${r.name} on ${dstr(r.start)}`))} are nearly full.`;
  return { text: `${open} seats open across the next ${rows.length} departure${rows.length > 1 ? "s" : ""}.${full}`, card: { kind: "seats", rows } };
}

function summary(ctx: Ctx): Turn {
  if (ctx.role === "guide" || ctx.role === "agent") return seats("", ctx);
  const month = TODAY_S.slice(0, 7);
  const live = ctx.orders.filter((o) => o.status !== "cancelled");
  const collected = ctx.orders.flatMap((o) => o.payments).filter((p) => p.d.startsWith(month)).reduce((n, p) => n + p.amt, 0);
  const owed = live.reduce((n, o) => n + orderDue(o), 0);
  const overdue = dueItems(ctx.orders).filter((x) => x.overdue).length;
  const pending = live.filter((o) => o.status === "pending");
  const week = departures.filter((x) => !ctx.closed.includes(x.id) && daysUntil(x.start) >= 0 && daysUntil(x.start) <= 7);
  const docs = live.filter((o) => o.docs.some((x) => x.status === "missing") && daysUntil(byId(departures, o.dep)!.start) <= 14).length;
  const fees = ctx.orders.filter((o) => o.payments.some((p) => p.d.startsWith(month))).reduce((n, o) => n + fee(o), 0);
  const lines = [
    `• ${fmt(collected)} collected this month; ${fmt(owed)} balance due${overdue ? `, ${overdue} overdue` : ""}.`,
    pending.length ? `• ${pending.length} agent order${pending.length > 1 ? "s" : ""} waiting for you to confirm.` : "",
    week.length ? `• ${week.length} departure${week.length > 1 ? "s" : ""} in the next 7 days: ${list(week.map((x) => `${byId(packages, x.pkg)!.name} ${dstr(x.start)} (${x.booked}/${x.seats})`))}.` : "",
    docs ? `• ${docs} traveller${docs > 1 ? "s" : ""} leaving within two weeks still owe${docs > 1 ? "" : "s"} documents.` : "",
    ctx.role !== "ops" ? `• Trilyt fee for ${d(TODAY_S).toLocaleDateString("en-IN", { month: "long", timeZone: TZ })} so far: ${fmt(fees)}, invoiced on the 1st.` : "",
  ].filter(Boolean);
  const links = [{ href: "/demo/app/payments", label: "Due and overdue" }, { href: "/demo/app/orders", label: "Bookings" }, { href: "/demo/app/departures", label: "Departures" }];
  return { text: `Here's today, ${fmtDay(TODAY)}:\n${lines.join("\n")}`, card: { kind: "links", links: ctx.role === "accounts" ? links.slice(0, 2) : links } };
}

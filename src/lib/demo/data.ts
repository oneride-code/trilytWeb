/**
 * Mock data for the operator-console demo at /demo.
 * Everything here is invented for a fictional operator, Himalayan Trails Co.
 * Nothing is fetched or sent anywhere.
 */

export const TODAY = new Date("2026-10-21T09:00:00+05:30");
export const TODAY_S = "2026-10-21";

export type PolicyKey = "standard" | "flexible";
export type OrderStatus = "pending" | "part" | "paid" | "cancelled";
export type Source = "Website" | "WhatsApp" | "Instagram" | "Trilyt" | "Agent" | "Walk-in";
export type Role = "owner" | "ops" | "guide" | "accounts" | "agent";
export type CheckState = "in" | "noshow";

export interface PriceOption { id: string; name: string; price: number }
export interface AddOn { name: string; price: number; per: "traveller" | "order" }
export interface Pkg {
  id: string; slug: string; name: string; tagline: string; days: string; region: string;
  type: "Road trip" | "Trek" | "Bike trip" | "Backpacking" | "Water";
  policy: PolicyKey; booking: number; image: string;
  options: PriceOption[]; addons: AddOn[];
  inclusions: string[]; exclusions: string[]; itinerary: string[]; rating: number; reviews: number;
  meet: string;
}
export interface Departure { id: string; pkg: string; start: string; end: string; seats: number; booked: number; guide: string; cutoff: string }
export interface Traveller { id: string; name: string; city: string; phone: string; email: string; trips: number; spent: number; medical?: string; emergency?: string }
export interface Payment { d: string; amt: number; how: string; ref: string }
export interface Refund { amt: number; status: "processed" | "waiting"; d: string }
export interface LogEntry { at: string; who: string; what: string }
export interface Doc { name: string; status: "signed" | "uploaded" | "missing" }
export interface Order {
  id: string; dep: string; source: Source; sourceNote?: string; agent?: string; created: string; status: OrderStatus;
  lines: { t: string; opt: string }[]; addons: string[]; payments: Payment[]; refund?: Refund;
  log: LogEntry[]; docs: Doc[]; checkin: Record<string, CheckState>; pickup?: string; note?: string; reminders: number;
}
export interface TeamMember { id: string; name: string; role: Role; note: string; last: string }
export interface Agent { id: string; name: string; city: string; commission: number; credit: number; used: number; orders: number; contact: string }

export const policies: Record<PolicyKey, { name: string; rules: [number, number][] }> = {
  // [daysBeforeStart, percentCharged] — first matching rule from the top wins
  standard: { name: "Standard", rules: [[30, 10], [15, 50], [0, 100]] },
  flexible: { name: "Flexible", rules: [[7, 0], [3, 50], [0, 100]] },
};

export const packages: Pkg[] = [
  {
    id: "pk1", slug: "spiti-valley-circuit", name: "Spiti Valley Circuit", tagline: "Eight days through the cold desert, Shimla to Manali.",
    days: "7N / 8D", region: "Himachal", type: "Road trip", policy: "standard", booking: 5000, image: "/images/demo/spiti.jpg", rating: 4.9, reviews: 212,
    meet: "Shimla old bus stand, 6:30 am",
    options: [{ id: "tr", name: "Triple sharing", price: 24999 }, { id: "db", name: "Double sharing", price: 27999 }, { id: "sg", name: "Single room", price: 33999 }],
    addons: [{ name: "Chandratal camp night", price: 2500, per: "traveller" }, { name: "Delhi pick-up", price: 1800, per: "traveller" }],
    inclusions: ["Tempo traveller from Shimla", "Stays on twin or triple sharing", "Breakfast and dinner", "Inner-line permits", "Oxygen cylinder and first aid"],
    exclusions: ["Lunches", "Entry fees", "Anything not listed"],
    itinerary: ["Shimla to Sangla", "Sangla to Kalpa", "Kalpa to Tabo", "Tabo to Kaza", "Kaza local: Langza, Hikkim, Komic", "Kaza to Chandratal", "Chandratal to Manali", "Depart Manali"],
  },
  {
    id: "pk2", slug: "kedarkantha-winter-trek", name: "Kedarkantha Winter Trek", tagline: "Snow forests, a summit at sunrise, campfires at night.",
    days: "5N / 6D", region: "Uttarakhand", type: "Trek", policy: "standard", booking: 3000, image: "/images/demo/kedarkantha.jpg", rating: 4.8, reviews: 540,
    meet: "Dehradun ISBT, 6:00 am",
    options: [{ id: "std", name: "Standard", price: 9499 }],
    addons: [{ name: "Rental: jacket and shoes", price: 1200, per: "traveller" }, { name: "Dehradun transport", price: 1500, per: "traveller" }],
    inclusions: ["Guide and support staff", "Tents on sharing", "All meals on trek", "Forest permits"],
    exclusions: ["Transport to Sankri", "Personal gear"],
    itinerary: ["Dehradun to Sankri", "Sankri to Juda ka Talab", "Base camp", "Summit and back to base", "Back to Sankri", "Depart"],
  },
  {
    id: "pk3", slug: "leh-ladakh-bike-expedition", name: "Leh–Ladakh Bike Expedition", tagline: "Ten days on the highest roads in the world.",
    days: "9N / 10D", region: "Ladakh", type: "Bike trip", policy: "flexible", booking: 10000, image: "/images/demo/ladakh.jpg", rating: 4.9, reviews: 98,
    meet: "Manali mall road, 7:00 am",
    options: [{ id: "own", name: "Own bike", price: 34999 }, { id: "rent", name: "RE Himalayan rental, solo", price: 49999 }, { id: "pil", name: "Pillion", price: 29999 }],
    addons: [{ name: "Bike insurance cover", price: 3500, per: "traveller" }],
    inclusions: ["Backup vehicle and mechanic", "Stays", "Breakfast and dinner", "Permits"],
    exclusions: ["Fuel", "Bike damage deposit"],
    itinerary: ["Manali", "Jispa", "Sarchu", "Leh", "Nubra", "Pangong", "Hanle", "Leh", "Kargil", "Srinagar"],
  },
  {
    id: "pk4", slug: "meghalaya-root-bridges", name: "Meghalaya Root Bridges", tagline: "Living bridges, blue pools and the wettest place on earth.",
    days: "4N / 5D", region: "Meghalaya", type: "Backpacking", policy: "flexible", booking: 4000, image: "/images/demo/meghalaya.jpg", rating: 4.7, reviews: 131,
    meet: "Guwahati airport, 11:00 am",
    options: [{ id: "std", name: "Standard", price: 15999 }, { id: "pvt", name: "Private room", price: 19999 }],
    addons: [{ name: "Shnongpdeng kayaking", price: 900, per: "traveller" }],
    inclusions: ["Shillong pick-up", "Homestays", "Breakfast", "Local guides"], exclusions: ["Flights to Guwahati", "Lunches and dinners"],
    itinerary: ["Guwahati to Shillong", "Cherrapunji", "Nongriat double-decker bridge", "Dawki and Shnongpdeng", "Depart"],
  },
  {
    id: "pk5", slug: "rishikesh-rafting-weekend", name: "Rishikesh Rafting Weekend", tagline: "16 km of rapids and a night by the river.",
    days: "1N / 2D", region: "Uttarakhand", type: "Water", policy: "flexible", booking: 1000, image: "/images/demo/rishikesh.jpg", rating: 4.6, reviews: 884,
    meet: "Shivpuri camp gate, 2:00 pm",
    options: [{ id: "std", name: "Standard", price: 3499 }],
    addons: [{ name: "Bungee jump", price: 4600, per: "traveller" }],
    inclusions: ["Riverside camp", "Dinner and breakfast", "Rafting with gear"], exclusions: ["Transport to Rishikesh"],
    itinerary: ["Arrive, camp, bonfire", "Raft Shivpuri to Rishikesh, depart"],
  },
  {
    id: "pk6", slug: "munnar-meesapulimala", name: "Munnar and Meesapulimala", tagline: "Tea gardens, cloud forest and the Western Ghats' second peak.",
    days: "2N / 3D", region: "Kerala", type: "Trek", policy: "standard", booking: 2500, image: "/images/demo/munnar.jpg", rating: 4.8, reviews: 76,
    meet: "Kochi airport, 8:00 am",
    options: [{ id: "std", name: "Standard", price: 8499 }],
    addons: [{ name: "Kochi pick-up", price: 1200, per: "traveller" }],
    inclusions: ["Forest permits", "Tents and meals on trek", "Guide"], exclusions: ["Flights", "Personal gear"],
    itinerary: ["Kochi to Munnar", "Base camp to Meesapulimala summit", "Back to Kochi"],
  },
];

export const departures: Departure[] = [
  // `booked` is recomputed from the orders below, so the manifest always matches the seat count.
  { id: "dp1", pkg: "pk1", start: "2026-10-24", end: "2026-10-31", seats: 12, booked: 0, guide: "Tenzin Norbu", cutoff: "2026-10-20" },
  { id: "dp8", pkg: "pk5", start: "2026-10-25", end: "2026-10-26", seats: 24, booked: 0, guide: "Rahul Bisht", cutoff: "2026-10-23" },
  { id: "dp9", pkg: "pk5", start: "2026-11-01", end: "2026-11-02", seats: 24, booked: 0, guide: "Rahul Bisht", cutoff: "2026-10-30" },
  { id: "dp2", pkg: "pk1", start: "2026-11-07", end: "2026-11-14", seats: 8, booked: 0, guide: "Tenzin Norbu", cutoff: "2026-11-03" },
  { id: "dp7", pkg: "pk4", start: "2026-11-13", end: "2026-11-17", seats: 10, booked: 0, guide: "Bah Kong", cutoff: "2026-11-09" },
  { id: "dp6", pkg: "pk1", start: "2026-11-21", end: "2026-11-28", seats: 14, booked: 0, guide: "Dorje Angchuk", cutoff: "2026-11-17" },
  { id: "dp10", pkg: "pk6", start: "2026-11-28", end: "2026-11-30", seats: 12, booked: 0, guide: "Anoop Menon", cutoff: "2026-11-24" },
  { id: "dp3", pkg: "pk2", start: "2026-12-19", end: "2026-12-24", seats: 20, booked: 0, guide: "Pooja Rawat", cutoff: "2026-12-14" },
  { id: "dp4", pkg: "pk2", start: "2026-12-26", end: "2026-12-31", seats: 20, booked: 0, guide: "Pooja Rawat", cutoff: "2026-12-21" },
  { id: "dp5", pkg: "pk3", start: "2027-06-12", end: "2027-06-22", seats: 12, booked: 0, guide: "Sonam Wangchuk", cutoff: "2027-06-01" },
];

export const travellers: Traveller[] = [
  { id: "t1", name: "Aarav Mehta", city: "Bengaluru", phone: "+91 98xxx 11234", email: "aarav@example.com", trips: 3, spent: 71497, emergency: "Nisha Mehta · +91 98xxx 11235" },
  { id: "t2", name: "Priya Nair", city: "Kochi", phone: "+91 97xxx 55678", email: "priya.n@example.com", trips: 1, spent: 27999, medical: "Asthma, carries inhaler" },
  { id: "t3", name: "Rohan Verma", city: "Delhi", phone: "+91 99xxx 22001", email: "rohanv@example.com", trips: 2, spent: 34998 },
  { id: "t4", name: "Sneha Kulkarni", city: "Pune", phone: "+91 96xxx 44120", email: "sneha.k@example.com", trips: 1, spent: 9499, medical: "Vegetarian, no nuts" },
  { id: "t5", name: "Ishaan Bose", city: "Kolkata", phone: "+91 90xxx 77812", email: "ishaan@example.com", trips: 1, spent: 10000 },
  { id: "t6", name: "Meera Iyer", city: "Chennai", phone: "+91 95xxx 30909", email: "meera.iyer@example.com", trips: 2, spent: 52998 },
  { id: "t7", name: "Kabir Singh", city: "Chandigarh", phone: "+91 98xxx 66010", email: "kabir.s@example.com", trips: 1, spent: 5000 },
  { id: "t8", name: "Ananya Das", city: "Guwahati", phone: "+91 94xxx 12910", email: "ananya.d@example.com", trips: 1, spent: 15999 },
  { id: "t9", name: "Vikram Rao", city: "Hyderabad", phone: "+91 91xxx 80077", email: "vikram.r@example.com", trips: 2, spent: 6998 },
  { id: "t10", name: "Zoya Khan", city: "Mumbai", phone: "+91 98xxx 45321", email: "zoya.k@example.com", trips: 1, spent: 3499 },
  { id: "t11", name: "Dev Malhotra", city: "Gurugram", phone: "+91 98xxx 90210", email: "dev.m@example.com", trips: 1, spent: 27999 },
  { id: "t12", name: "Farah Sheikh", city: "Lucknow", phone: "+91 97xxx 31144", email: "farah.s@example.com", trips: 1, spent: 24999 },
  { id: "t13", name: "Nikhil Rao", city: "Bengaluru", phone: "+91 98xxx 00412", email: "nikhil.r@example.com", trips: 2, spent: 55998, emergency: "Sudha Rao · +91 98xxx 00413" },
  { id: "t14", name: "Tanvi Rao", city: "Bengaluru", phone: "+91 98xxx 00414", email: "tanvi.r@example.com", trips: 2, spent: 0, medical: "Knee brace, slow on descents" },
  { id: "t15", name: "Arjun Pillai", city: "Thiruvananthapuram", phone: "+91 94xxx 21780", email: "arjun.p@example.com", trips: 1, spent: 24999 },
  { id: "t16", name: "Harpreet Gill", city: "Ludhiana", phone: "+91 98xxx 70090", email: "harpreet.g@example.com", trips: 1, spent: 74997 },
  { id: "t17", name: "Simran Gill", city: "Ludhiana", phone: "+91 98xxx 70091", email: "simran.g@example.com", trips: 1, spent: 0 },
  { id: "t18", name: "Jaspreet Gill", city: "Ludhiana", phone: "+91 98xxx 70092", email: "jas.g@example.com", trips: 1, spent: 0, medical: "Diabetic, carries insulin" },
  { id: "t19", name: "Ritika Jain", city: "Jaipur", phone: "+91 99xxx 34210", email: "ritika.j@example.com", trips: 1, spent: 10000 },
  { id: "t20", name: "Manav Jain", city: "Jaipur", phone: "+91 99xxx 34211", email: "manav.j@example.com", trips: 1, spent: 0 },
  { id: "t21", name: "Pooja Hegde", city: "Mangaluru", phone: "+91 97xxx 80120", email: "pooja.h@example.com", trips: 1, spent: 10497 },
  { id: "t22", name: "Sahil Shetty", city: "Mangaluru", phone: "+91 97xxx 80121", email: "sahil.s@example.com", trips: 1, spent: 0 },
  { id: "t23", name: "Neha Shetty", city: "Mangaluru", phone: "+91 97xxx 80122", email: "neha.s@example.com", trips: 1, spent: 0 },
  { id: "t24", name: "Yash Agarwal", city: "Delhi", phone: "+91 98xxx 45660", email: "yash.a@example.com", trips: 1, spent: 6998 },
  { id: "t25", name: "Divya Agarwal", city: "Delhi", phone: "+91 98xxx 45661", email: "divya.a@example.com", trips: 1, spent: 0 },
];

const L = (at: string, who: string, what: string): LogEntry => ({ at, who, what });
const DOCS_OK: Doc[] = [{ name: "Consent and indemnity form", status: "signed" }, { name: "Government ID", status: "uploaded" }];
const DOCS_WAIT: Doc[] = [{ name: "Consent and indemnity form", status: "missing" }, { name: "Government ID", status: "uploaded" }];

export const initialOrders: Order[] = [
  { id: "TR-1041", dep: "dp2", source: "Website", created: "2026-10-02", status: "paid", lines: [{ t: "t1", opt: "db" }, { t: "t6", opt: "db" }], addons: ["Chandratal camp night"],
    payments: [{ d: "2026-10-02", amt: 10000, how: "Payment link · UPI", ref: "pay_Q1x9" }, { d: "2026-10-16", amt: 50998, how: "Payment link · Card", ref: "pay_Q2m4" }],
    docs: DOCS_OK, checkin: {}, reminders: 1, pickup: "Delhi, Majnu ka Tilla",
    log: [L("2026-10-02 11:20", "Website", "Booked 2 × double sharing, paid ₹10,000 booking amount"), L("2026-10-09 09:00", "Trilyt", "Balance reminder sent on WhatsApp"), L("2026-10-16 18:42", "Aarav Mehta", "Paid balance ₹50,998 by card"), L("2026-10-17 10:05", "Kavita Shah", "Consent forms received for both travellers")] },
  { id: "TR-1042", dep: "dp2", source: "WhatsApp", created: "2026-10-05", status: "part", lines: [{ t: "t2", opt: "db" }], addons: [],
    payments: [{ d: "2026-10-05", amt: 5000, how: "Payment link · UPI", ref: "pay_Q3a8" }], docs: DOCS_WAIT, checkin: {}, reminders: 1,
    log: [L("2026-10-05 14:10", "Kavita Shah", "Created from WhatsApp enquiry, link sent"), L("2026-10-05 14:31", "Priya Nair", "Paid ₹5,000 booking amount by UPI"), L("2026-10-17 09:00", "Trilyt", "Balance reminder sent on WhatsApp")] },
  { id: "TR-1043", dep: "dp3", source: "Instagram", created: "2026-10-09", status: "paid", lines: [{ t: "t4", opt: "std" }], addons: ["Rental: jacket and shoes"],
    payments: [{ d: "2026-10-09", amt: 10699, how: "Received offline · bank transfer", ref: "UTR 6230…" }], docs: DOCS_OK, checkin: {}, reminders: 0,
    log: [L("2026-10-09 16:00", "Kavita Shah", "Created from Instagram DM"), L("2026-10-09 16:40", "Kavita Shah", "Marked ₹10,699 received by bank transfer")] },
  { id: "TR-1044", dep: "dp5", source: "Trilyt", created: "2026-10-12", status: "part", lines: [{ t: "t5", opt: "rent" }], addons: [],
    payments: [{ d: "2026-10-12", amt: 10000, how: "Payment link · UPI", ref: "pay_Q5c1" }], docs: DOCS_WAIT, checkin: {}, reminders: 0,
    log: [L("2026-10-12 20:15", "Trilyt", "Booked via Trilyt app, paid ₹10,000 booking amount")] },
  { id: "TR-1045", dep: "dp2", source: "Agent", sourceNote: "Hilltop Travels", agent: "ag1", created: "2026-10-14", status: "pending", lines: [{ t: "t3", opt: "tr" }, { t: "t7", opt: "tr" }], addons: [], payments: [],
    docs: [{ name: "Consent and indemnity form", status: "missing" }, { name: "Government ID", status: "missing" }], checkin: {}, reminders: 0,
    log: [L("2026-10-14 12:00", "Hilltop Travels", "Agent order placed at net rate, awaiting operator confirmation")] },
  { id: "TR-1046", dep: "dp1", source: "Website", created: "2026-09-20", status: "cancelled", lines: [{ t: "t3", opt: "db" }], addons: [],
    payments: [{ d: "2026-09-20", amt: 27999, how: "Payment link · Card", ref: "pay_P8k2" }], refund: { amt: 13999, status: "processed", d: "2026-10-05" }, docs: DOCS_OK, checkin: {}, reminders: 0,
    log: [L("2026-09-20 10:12", "Website", "Booked 1 × double sharing, paid in full"), L("2026-10-05 08:30", "Rohan Verma", "Cancelled from Manage my booking, 19 days before departure"), L("2026-10-05 08:30", "Trilyt", "Policy Standard: 50% charged. Refund ₹13,999 sent to original card")] },
  { id: "TR-1047", dep: "dp4", source: "Website", created: "2026-10-18", status: "paid", lines: [{ t: "t6", opt: "std" }], addons: ["Dehradun transport"],
    payments: [{ d: "2026-10-18", amt: 10999, how: "Payment link · UPI", ref: "pay_Q7r7" }], docs: DOCS_OK, checkin: {}, reminders: 0,
    log: [L("2026-10-18 21:02", "Website", "Booked and paid in full")] },
  { id: "TR-1048", dep: "dp7", source: "Instagram", created: "2026-10-15", status: "paid", lines: [{ t: "t8", opt: "std" }], addons: ["Shnongpdeng kayaking"],
    payments: [{ d: "2026-10-15", amt: 4000, how: "Payment link · UPI", ref: "pay_Q6b2" }, { d: "2026-10-19", amt: 12899, how: "Payment link · UPI", ref: "pay_Q6b9" }], docs: DOCS_OK, checkin: {}, reminders: 0,
    log: [L("2026-10-15 13:00", "Kavita Shah", "Created from Instagram DM, link sent"), L("2026-10-19 19:20", "Ananya Das", "Paid balance ₹12,899 by UPI")] },
  { id: "TR-1049", dep: "dp8", source: "Website", created: "2026-10-19", status: "paid", lines: [{ t: "t9", opt: "std" }, { t: "t10", opt: "std" }], addons: [],
    payments: [{ d: "2026-10-19", amt: 6998, how: "Payment link · UPI", ref: "pay_Q8d4" }], docs: DOCS_OK, checkin: {}, reminders: 0, pickup: "Rishikesh, Tapovan",
    log: [L("2026-10-19 08:44", "Website", "Booked 2 × standard, paid in full")] },
  { id: "TR-1050", dep: "dp10", source: "Walk-in", created: "2026-10-20", status: "part", lines: [{ t: "t9", opt: "std" }], addons: ["Kochi pick-up"],
    payments: [{ d: "2026-10-20", amt: 2500, how: "Received offline · cash", ref: "—" }], docs: DOCS_WAIT, checkin: {}, reminders: 0,
    log: [L("2026-10-20 17:30", "Ramesh Lotey", "Walk-in at the office, ₹2,500 cash")] },
  { id: "TR-1038", dep: "dp1", source: "Website", created: "2026-09-12", status: "paid", lines: [{ t: "t11", opt: "db" }], addons: [],
    payments: [{ d: "2026-09-12", amt: 27999, how: "Payment link · Card", ref: "pay_P4n1" }], docs: DOCS_OK, checkin: {}, reminders: 0, pickup: "Shimla",
    log: [L("2026-09-12 09:10", "Website", "Booked and paid in full")] },
  { id: "TR-1039", dep: "dp1", source: "Agent", sourceNote: "Hilltop Travels", agent: "ag1", created: "2026-09-15", status: "paid", lines: [{ t: "t12", opt: "tr" }], addons: [],
    payments: [{ d: "2026-09-15", amt: 24999, how: "Agent settlement · bank transfer", ref: "UTR 1509…" }], docs: DOCS_OK, checkin: {}, reminders: 0, pickup: "Chandigarh",
    log: [L("2026-09-15 11:00", "Hilltop Travels", "Agent order, confirmed by Kavita Shah"), L("2026-09-15 11:05", "Trilyt", "Net-rate invoice issued to Hilltop Travels")] },
  { id: "TR-1035", dep: "dp1", source: "Website", created: "2026-09-02", status: "paid", lines: [{ t: "t13", opt: "db" }, { t: "t14", opt: "db" }], addons: ["Delhi pick-up"],
    payments: [{ d: "2026-09-02", amt: 10000, how: "Payment link · UPI", ref: "pay_P1a0" }, { d: "2026-10-08", amt: 49598, how: "Payment link · UPI", ref: "pay_P9c3" }], docs: DOCS_OK, checkin: {}, reminders: 1, pickup: "Delhi, Majnu ka Tilla",
    log: [L("2026-09-02 19:40", "Website", "Booked 2 × double sharing, paid ₹10,000 booking amount"), L("2026-10-08 10:12", "Nikhil Rao", "Paid balance ₹49,598 by UPI")] },
  { id: "TR-1036", dep: "dp1", source: "WhatsApp", created: "2026-09-18", status: "paid", lines: [{ t: "t15", opt: "tr" }], addons: [],
    payments: [{ d: "2026-09-18", amt: 24999, how: "Payment link · Card", ref: "pay_P5m8" }], docs: DOCS_WAIT, checkin: {}, reminders: 0, pickup: "Shimla",
    log: [L("2026-09-18 12:05", "Kavita Shah", "Created from WhatsApp enquiry, link sent"), L("2026-09-18 12:30", "Arjun Pillai", "Paid in full by card")] },
  { id: "TR-1037", dep: "dp1", source: "Instagram", created: "2026-09-25", status: "paid", lines: [{ t: "t16", opt: "tr" }, { t: "t17", opt: "tr" }, { t: "t18", opt: "tr" }], addons: [],
    payments: [{ d: "2026-09-25", amt: 15000, how: "Payment link · UPI", ref: "pay_P7q1" }, { d: "2026-10-10", amt: 59997, how: "Received offline · bank transfer", ref: "UTR 1010…" }], docs: DOCS_OK, checkin: {}, reminders: 0, pickup: "Chandigarh",
    log: [L("2026-09-25 17:22", "Kavita Shah", "Created from Instagram DM, link sent"), L("2026-10-10 09:48", "Suresh Pillai", "Marked ₹59,997 received by bank transfer")] },
  { id: "TR-1040", dep: "dp1", source: "Website", created: "2026-09-28", status: "part", lines: [{ t: "t19", opt: "sg" }, { t: "t20", opt: "sg" }], addons: [],
    payments: [{ d: "2026-09-28", amt: 10000, how: "Payment link · UPI", ref: "pay_P8t4" }], docs: DOCS_OK, checkin: {}, reminders: 2, pickup: "Shimla",
    log: [L("2026-09-28 21:15", "Website", "Booked 2 × single room, paid ₹10,000 booking amount"), L("2026-10-03 09:00", "Trilyt", "Balance reminder sent on WhatsApp"), L("2026-10-08 09:00", "Trilyt", "Balance reminder sent on WhatsApp")] },
  { id: "TR-1033", dep: "dp8", source: "Website", created: "2026-10-11", status: "paid", lines: [{ t: "t21", opt: "std" }, { t: "t22", opt: "std" }, { t: "t23", opt: "std" }], addons: [],
    payments: [{ d: "2026-10-11", amt: 10497, how: "Payment link · UPI", ref: "pay_Q2w2" }], docs: DOCS_OK, checkin: {}, reminders: 0, pickup: "Rishikesh, Tapovan",
    log: [L("2026-10-11 13:20", "Website", "Booked 3 × standard, paid in full")] },
  { id: "TR-1034", dep: "dp8", source: "Trilyt", created: "2026-10-14", status: "paid", lines: [{ t: "t24", opt: "std" }, { t: "t25", opt: "std" }], addons: ["Bungee jump"],
    payments: [{ d: "2026-10-14", amt: 16198, how: "Payment link · UPI", ref: "pay_Q4e6" }], docs: DOCS_OK, checkin: {}, reminders: 0, pickup: "Haridwar station",
    log: [L("2026-10-14 20:02", "Trilyt", "Booked via Trilyt app, paid in full")] },
];

// Seats booked per departure come from the orders, so manifests and seat counts always agree.
for (const dp of departures) dp.booked = initialOrders.filter((o) => o.dep === dp.id && o.status !== "cancelled").reduce((s, o) => s + o.lines.length, 0);

export const team: TeamMember[] = [
  { id: "u1", name: "Ramesh Lotey", role: "owner", note: "Founder. Everything, including prices, refunds above policy and payouts.", last: "Now" },
  { id: "u2", name: "Kavita Shah", role: "ops", note: "Runs bookings and departures. Cannot change prices or see settlements.", last: "12 min ago" },
  { id: "u3", name: "Tenzin Norbu", role: "guide", note: "Sees the manifest for his own departures. Checks people in on his phone.", last: "Yesterday" },
  { id: "u4", name: "Pooja Rawat", role: "guide", note: "Kedarkantha batches only.", last: "3 days ago" },
  { id: "u5", name: "Suresh Pillai", role: "accounts", note: "External CA. Settlements, GST invoices, exports. Read-only on bookings.", last: "Mon" },
  { id: "u6", name: "Hilltop Travels", role: "agent", note: "Agent login. Places orders at net rate inside a credit limit.", last: "14 Oct" },
];

export const ROLE_LABEL: Record<Role, string> = { owner: "Owner", ops: "Ops manager", guide: "Guide", accounts: "Accounts", agent: "Agent" };
export const ROLE_ORDER: Role[] = ["owner", "ops", "guide", "accounts", "agent"];

/** Permission matrix: true = full, "own" = only their own departures or orders, false = no access. */
export type Perm = boolean | "own";
export interface PermRow { action: string; owner: Perm; ops: Perm; guide: Perm; accounts: Perm; agent: Perm }
export const PERMS: { area: string; rows: PermRow[] }[] = [
  { area: "Bookings", rows: [
    { action: "See bookings", owner: true, ops: true, guide: "own", accounts: true, agent: "own" },
    { action: "Create a booking", owner: true, ops: true, guide: false, accounts: false, agent: "own" },
    { action: "Send payment link or reminder", owner: true, ops: true, guide: false, accounts: false, agent: false },
    { action: "Mark payment received offline", owner: true, ops: true, guide: false, accounts: true, agent: false },
    { action: "Move date, add or remove a traveller", owner: true, ops: true, guide: false, accounts: false, agent: "own" },
    { action: "Cancel and refund within policy", owner: true, ops: true, guide: false, accounts: false, agent: false },
    { action: "Refund more than the policy", owner: true, ops: false, guide: false, accounts: false, agent: false },
  ] },
  { area: "Departures", rows: [
    { action: "Create or edit departures", owner: true, ops: true, guide: false, accounts: false, agent: false },
    { action: "Manifest and check-in", owner: true, ops: true, guide: "own", accounts: false, agent: false },
    { action: "Close a departure and refund everyone", owner: true, ops: false, guide: false, accounts: false, agent: false },
  ] },
  { area: "Packages and prices", rows: [
    { action: "Create and edit packages", owner: true, ops: true, guide: false, accounts: false, agent: false },
    { action: "Change prices and cancellation policy", owner: true, ops: false, guide: false, accounts: false, agent: false },
    { action: "See net rates", owner: true, ops: true, guide: false, accounts: true, agent: "own" },
    { action: "See who paid what", owner: true, ops: true, guide: false, accounts: true, agent: "own" },
  ] },
  { area: "Money", rows: [
    { action: "Settlements and refunds", owner: true, ops: false, guide: false, accounts: true, agent: false },
    { action: "GST invoices and exports", owner: true, ops: false, guide: false, accounts: true, agent: false },
    { action: "Trilyt fee invoice", owner: true, ops: false, guide: false, accounts: true, agent: false },
  ] },
  { area: "Team and agents", rows: [
    { action: "Invite or remove people", owner: true, ops: false, guide: false, accounts: false, agent: false },
    { action: "Set agent commission and credit limit", owner: true, ops: false, guide: false, accounts: false, agent: false },
  ] },
];

/** Which console sections each role can open. */
export const ROLE_NAV: Record<Role, string[]> = {
  owner: ["overview", "bookings", "departures", "travellers", "packages", "agents", "payments", "team", "settings"],
  ops: ["overview", "bookings", "departures", "travellers", "packages", "agents", "settings"],
  guide: ["departures", "travellers"],
  accounts: ["overview", "bookings", "payments"],
  agent: ["bookings", "agents"],
};

export const agents: Agent[] = [
  { id: "ag1", name: "Hilltop Travels", city: "Chandigarh", commission: 10, credit: 100000, used: 49998, orders: 6, contact: "Manpreet · +91 98xxx 20011" },
  { id: "ag2", name: "Wanderlust Holidays", city: "Pune", commission: 8, credit: 50000, used: 0, orders: 2, contact: "Rutuja · +91 97xxx 55001" },
];

export const settlements = [
  { d: "2026-10-22", amt: 10999 + 6998, utr: "", items: 2, status: "scheduled" as const },
  { d: "2026-10-20", amt: 60998, utr: "UTR 23102026…311", items: 2, status: "settled" as const },
  { d: "2026-10-17", amt: 5000 + 12899, utr: "UTR 17102026…902", items: 2, status: "settled" as const },
  { d: "2026-10-14", amt: 10000 + 4000, utr: "UTR 14102026…118", items: 2, status: "settled" as const },
  { d: "2026-10-04", amt: 10000, utr: "UTR 04102026…560", items: 1, status: "settled" as const },
];

/** Bookings per week for the last 12 weeks, for the overview chart. */
export const weeklyBookings = [6, 8, 5, 9, 11, 7, 10, 12, 8, 13, 15, 11];

/**
 * What incumbents charge, from their public pricing pages (read 21 Oct 2026).
 * monthly is in USD; pct applies to online bookings unless noted.
 */
export const USD_INR = 85;
export interface Plan { id: string; name: string; monthly: number; pct: number; perOffline?: number; cap?: number; onOffline: boolean; offlineCap?: number; guestPays?: boolean; note: string; source: string }
/** Trilyt's rate card. */
export const TRILYT = { pct: 1.75, cap: 999, offlineCap: 99 };
export const plans: Plan[] = [
  { id: "trilyt", name: "Trilyt", monthly: 0, pct: TRILYT.pct, cap: TRILYT.cap, onOffline: true, offlineCap: TRILYT.offlineCap, note: "1.75% of each online order, never more than ₹999. Offline orders: 1.75% or ₹99, whichever is less. No monthly fee. GST invoice, WhatsApp reminders, agents included.", source: "" },
  { id: "rezdy", name: "Rezdy Foundation", monthly: 49, pct: 3, perOffline: 1, onOffline: false, note: "$49/month plus 3% of each online booking; $1 per offline or agent booking. No GST, no WhatsApp.", source: "https://www.rezdy.com/pricing/" },
  { id: "bokun", name: "Bókun Start", monthly: 49, pct: 1.5, onOffline: false, note: "$49/month plus 1.5% of online bookings. Offline free. No GST, TCS or INR ledger; no WhatsApp.", source: "https://www.bokun.io/pricing" },
  { id: "fareharbor", name: "FareHarbor", monthly: 0, pct: 6, onOffline: false, guestPays: true, note: "No subscription; about 6% booking fee added to what the traveller pays. Your price looks 6% higher than it is.", source: "https://captainbook.io/blog/fareharbor-pricing-fees-explained" },
  { id: "marketplace", name: "Marketplace listing", monthly: 0, pct: 22, onOffline: false, note: "Viator-style commission, typically 20–30% of the booking. Thrillophilia does not publish its rate: ask on the call.", source: "https://www.rapidevelopers.com/md/clone/viator" },
];
export function planCost(p: Plan, bookings: number, avg: number, offlineShare: number) {
  const online = bookings * (1 - offlineShare), offline = bookings * offlineShare;
  const perOrder = (n: number, cap?: number) => { const f = (avg * p.pct) / 100; return n * (cap ? Math.min(cap, f) : f); };
  const fees = perOrder(online, p.cap) + (p.onOffline ? perOrder(offline, p.offlineCap ?? p.cap) : 0) + (p.perOffline ? offline * p.perOffline * USD_INR : 0);
  return Math.round(p.monthly * USD_INR + fees);
}

/** Extra detail for the public booking page, derived from the package type so every package has it. */
export function pkgExtras(p: Pkg) {
  const byType: Record<Pkg["type"], { difficulty: string; carry: string[]; facts: [string, string][] }> = {
    Trek: { difficulty: "Moderate", carry: ["Trekking shoes with grip", "Two warm layers and a rain shell", "Headlamp", "2 L water", "Original ID"], facts: [["Altitude", "up to 3,800 m"], ["Walking", "5–7 km a day"], ["Min age", "12"]] },
    "Road trip": { difficulty: "Easy, long days", carry: ["Warm jacket", "Sunscreen and lip balm", "Original ID for permits", "Power bank", "Motion-sickness tablets"], facts: [["Altitude", "up to 4,500 m"], ["On the road", "6–8 hours a day"], ["Min age", "8"]] },
    "Bike trip": { difficulty: "Experienced riders", carry: ["Riding jacket, gloves, knee guards", "Licence and bike papers", "Thermals", "Balaclava", "Original ID"], facts: [["Altitude", "up to 5,300 m"], ["Riding", "150–250 km a day"], ["Licence", "2+ years"]] },
    Backpacking: { difficulty: "Easy", carry: ["Light rain jacket", "Comfortable walking shoes", "Swimwear", "Original ID"], facts: [["Walking", "3,500 steps at Nongriat"], ["Stays", "Homestays"], ["Min age", "6"]] },
    Water: { difficulty: "Beginner friendly", carry: ["Quick-dry clothes", "Sandals with straps", "Change of clothes", "Original ID"], facts: [["Rapids", "Grade II–III"], ["Swimming", "Not required"], ["Min age", "14"]] },
  };
  const t = byType[p.type];
  return {
    difficulty: t.difficulty, carry: t.carry, facts: t.facts,
    faq: [
      { q: "How do I pay?", a: `Pay ${fmt(p.booking)} per person now to hold your seat, by UPI, card, netbanking or EMI. The balance is due 14 days before departure; we send a payment link on WhatsApp.` },
      { q: "What if I cancel?", a: `The ${policies[p.policy].name.toLowerCase()} policy applies: ${policies[p.policy].rules.map((r, i) => `${ruleLabel(policies[p.policy].rules, i).toLowerCase()} we keep ${r[1]}%`).join(", ")}. Refunds go back to the method you paid with within 5–7 working days, automatically.` },
      { q: "Can I move to another date?", a: "Yes, from Manage my booking, until 7 days before departure, at no cost if seats are open." },
      { q: "Who is the guide?", a: "A certified Himalayan Trails Co. guide leads every batch; their name is on your booking page once the batch is confirmed." },
    ],
    reviews: [
      { name: "Meera I.", city: "Chennai", text: "Everything was on WhatsApp before we asked: pickup, what to carry, who the guide was. Paid the balance from the link in two minutes." },
      { name: "Nikhil R.", city: "Bengaluru", text: "Had to move our dates a week before. Did it from the booking page, no calls, new seats confirmed in a minute." },
    ],
  };
}

// ---------- helpers ----------
export const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const d = (s: string) => new Date(s + "T00:00:00+05:30");
export const dstr = (s: string) => d(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
export const dlong = (s: string) => d(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const byId = <T extends { id: string }>(arr: T[], id: string) => arr.find((x) => x.id === id);
export const pkgOfDep = (dep: Departure) => byId(packages, dep.pkg)!;
export const depOf = (o: Order) => byId(departures, o.dep)!;
export const pkgOf = (o: Order) => pkgOfDep(depOf(o));

export function orderTotal(o: Order) {
  const p = pkgOf(o);
  let t = 0;
  for (const l of o.lines) t += byId(p.options, l.opt)!.price;
  for (const a of o.addons) { const ad = p.addons.find((x) => x.name === a); if (ad) t += ad.price * (ad.per === "traveller" ? o.lines.length : 1); }
  return t;
}
export const orderPaid = (o: Order) => o.payments.reduce((s, p) => s + p.amt, 0);
export const orderDue = (o: Order) => Math.max(0, orderTotal(o) - orderPaid(o));
export const bookingAmt = (o: Order) => pkgOf(o).booking * o.lines.length;
/** A payment that never touched the gateway: cash, bank transfer, agent settlement. */
export const isOffline = (p: Payment) => p.how.startsWith("Received offline") || p.how.startsWith("Agent settlement");
/**
 * Trilyt's fee on an order: 1.75% of what came in online, capped at ₹999;
 * 1.75% of what came in offline, capped at ₹99. Refunds come off the online part first.
 */
export function feeParts(o: Order) {
  const online = Math.max(0, o.payments.filter((p) => !isOffline(p)).reduce((s, p) => s + p.amt, 0) - (o.refund?.amt ?? 0));
  const offline = o.payments.filter(isOffline).reduce((s, p) => s + p.amt, 0);
  const onlineFee = Math.min(TRILYT.cap, Math.round((online * TRILYT.pct) / 100));
  const offlineFee = Math.min(TRILYT.offlineCap, Math.round((offline * TRILYT.pct) / 100));
  return { online, offline, onlineFee, offlineFee, total: onlineFee + offlineFee, capped: online > 0 && onlineFee === TRILYT.cap, offlineCapped: offline > 0 && offlineFee === TRILYT.offlineCap };
}
export const fee = (o: Order) => feeParts(o).total;
/** GST on tour operator services: 5% without input credit, shown on every invoice. */
export const GST_PCT = 5;
export const gstOf = (amt: number) => Math.round((amt * GST_PCT) / (100 + GST_PCT));

export function refundFor(o: Order, cancelDate: Date = TODAY) {
  const dep = depOf(o);
  const days = Math.round((d(dep.start).getTime() - cancelDate.getTime()) / 86400000);
  const pol = policies[pkgOf(o).policy];
  let pct = 100;
  for (const [minDays, charge] of pol.rules) { if (days >= minDays) { pct = charge; break; } }
  const paid = orderPaid(o);
  const charge = Math.round(orderTotal(o) * pct / 100);
  return { days, pct, charge, refund: Math.max(0, paid - charge) };
}

export function ruleLabel(rules: [number, number][], i: number) {
  const [m] = rules[i];
  if (i === 0) return `${m}+ days before`;
  if (m === 0) return `Under ${rules[i - 1][0]} days`;
  return `${m}–${rules[i - 1][0] - 1} days before`;
}

export const seatsLeft = (dp: Departure) => dp.seats - dp.booked;
export const balanceDue = (dep: Departure) => new Date(d(dep.start).getTime() - 14 * 86400000);
export const fmtDate = (x: Date) => x.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
export const daysUntil = (s: string) => Math.round((d(s).getTime() - TODAY.getTime()) / 86400000);

/** Payment schedule: booking amount at order, balance 14 days before departure. */
export function schedule(o: Order) {
  const total = orderTotal(o), paid = orderPaid(o), ba = Math.min(total, bookingAmt(o));
  const due = balanceDue(depOf(o));
  return [
    { label: "Booking amount", amt: ba, due: d(o.created), paid: paid >= ba, overdue: false },
    { label: "Balance", amt: total - ba, due, paid: paid >= total, overdue: paid < total && due < TODAY },
  ].filter((x) => x.amt > 0);
}
/** Everything still owed across live orders, soonest first. */
export function dueItems(orders: Order[]) {
  return orders
    .filter((o) => o.status === "part" || o.status === "pending")
    .map((o) => { const s = schedule(o); const next = s.find((x) => !x.paid) ?? s[s.length - 1]; return { o, amt: orderDue(o), due: next.due, overdue: next.overdue, label: next.label }; })
    .sort((a, b) => a.due.getTime() - b.due.getTime());
}

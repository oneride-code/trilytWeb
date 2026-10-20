/**
 * The operator enquiry: field names, the options the selects offer, and the
 * email the form composes. Shared by the page (mailto fallback) and the
 * /api/enquiry route (server send), so both produce the same message.
 */
export const ENQUIRY_TO = "contact@accelryde.com";

export const SELLS = ["Treks and expeditions", "Road trips and bike tours", "Weekend getaways and camps", "City, food and heritage walks", "Water sports and adventure", "Group tours and yatras", "Something else"] as const;
export const VOLUME = ["Under 10 a month", "10–30 a month", "30–100 a month", "More than 100 a month"] as const;

export type EnquiryForm = { operator: string; name: string; phone: string; email: string; city: string; sells: string; volume: string; tools: string; message: string };

export const EMPTY_ENQUIRY: EnquiryForm = { operator: "", name: "", phone: "", email: "", city: "", sells: SELLS[0], volume: VOLUME[1], tools: "", message: "" };

export function draftEnquiry(f: EnquiryForm) {
  const subject = `Trilyt enquiry: ${f.operator || "travel operator"}${f.city ? `, ${f.city}` : ""}`;
  const body = [
    `Hi Trilyt team,`, ``,
    `We run ${f.operator || "a travel business"}${f.city ? ` in ${f.city}` : ""} and would like to see Trilyt for our bookings and payments.`, ``,
    `Operator: ${f.operator}`, `Contact: ${f.name}`, `Phone / WhatsApp: ${f.phone}`, `Email: ${f.email}`, `City: ${f.city}`,
    `What we sell: ${f.sells}`, `Bookings: ${f.volume}`, `How we take bookings today: ${f.tools || "—"}`, ``,
    f.message ? `Notes: ${f.message}` : ``, ``, `Please call or WhatsApp to set up a walkthrough.`, ``, f.name,
  ].join("\n");
  return { subject, body };
}

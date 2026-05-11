/**
 * Zentraler Ort für alle Betreiberangaben.
 * Trage hier nach und nach deine echten Daten ein.
 * Felder, die `null` sind, werden auf der Seite als "noch nicht hinterlegt"
 * angezeigt — bitte vor Launch ausfüllen!
 */
export const siteConfig = {
  productName: "EinfachAmt",
  domain: "einfachamt.com",
  siteUrl: "https://einfachamt.com",
  contactEmail: "support@einfachamt.com",
  operator: {
    // TODO: vor Launch ausfüllen — gesetzliche Pflicht laut §5 TMG
    name: null as string | null,
    street: null as string | null,
    zip: null as string | null,
    city: null as string | null,
    country: "Deutschland",
    // Optional:
    phone: null as string | null,
    // Falls Firma:
    legalForm: null as string | null, // z.B. "UG (haftungsbeschränkt)" oder "GbR"
    registerCourt: null as string | null, // z.B. "Amtsgericht Frankfurt am Main"
    registerNumber: null as string | null, // z.B. "HRB 123456"
    vatId: null as string | null, // USt-IdNr. z.B. "DE 123 456 789"
  },
  // Stand der Datenschutzerklärung — beim Aktualisieren neu setzen
  privacyLastUpdated: "2026-05-11",
};

export function formatOperatorAddress(): string | null {
  const op = siteConfig.operator;
  if (!op.name || !op.street || !op.zip || !op.city) return null;
  return `${op.name}\n${op.street}\n${op.zip} ${op.city}\n${op.country}`;
}

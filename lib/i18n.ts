export type Language = "de" | "en";

export const copy = {
  de: {
    languageLabel: "Sprache auswählen",
    chooseLanguage: "Welche Sprache möchtest du nutzen?",
    chooseSubtitle: "Du kannst die Sprache später jederzeit oben ändern.",
    german: "Deutsch",
    english: "English",
    heroEyebrow: "Hilfe für Jobcenter und Bürgergeld",
    heroTitle: "Verstehe Behördenbriefe in 30 Sekunden.",
    heroSubtitle:
      "Lade deinen Brief hoch. EinfachAmt erklärt dir verständlich, was das Amt von dir möchte, welche Fristen wichtig sind und wie du antworten kannst.",
    uploadCta: "Brief hochladen",
    exampleCta: "Beispiel ansehen",
    howItWorks: "So funktioniert es",
    steps: [
      ["Brief hochladen", "Foto oder PDF auswählen."],
      ["Erklärung erhalten", "EinfachAmt zeigt dir die wichtigsten Punkte."],
      ["Antwort vorbereiten", "Du bekommst einen höflichen Entwurf."],
    ],
    helpsTitle: "Wobei EinfachAmt hilft",
    helpAreas: [
      "Jobcenter-Briefe verstehen",
      "Fristen erkennen",
      "To-dos sortieren",
      "Antwortentwürfe erstellen",
    ],
    trustTitle: "Vertrauen",
    trustItems: [
      "Privater Dienst",
      "Keine Rechtsberatung",
      "DSGVO-orientiert",
      "Daten geschützt",
    ],
    pricingTitle: "3 Briefe kostenlos",
    pricingText:
      "Danach einfacher Monatsplan mit Stripe Checkout.",
    pricingLink: "Preise ansehen",
    uploadTitle: "Lade deinen Brief hoch",
    uploadIntro:
      "Fotografiere deinen Brief gut lesbar. Achte darauf, dass alle Seiten sichtbar sind.",
    uploadCardTitle: "Brief hochladen",
    uploadCardText: "Fotografiere deinen Brief gut lesbar.",
    uploadButton: "Brief auswählen",
    uploadIdle: "Achte darauf, dass alle Seiten sichtbar sind.",
    uploadUploading: "Dein Brief wird hochgeladen...",
    uploadReading: "Dein Brief wird gelesen...",
    safeUploadTitle: "Sicher hochladen",
    safeUploadText:
      "Mock-Version: Noch keine echte Speicherung. Später mit Supabase Storage, EU-Standort und geschützten Uploads.",
    disclaimer:
      "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung.",
    legalHelp:
      "Bei ernsten rechtlichen Problemen bitte Sozialberatung oder Anwalt kontaktieren.",
    privacy: "Datenschutz",
    impressum: "Impressum",
    pricing: "Preise",
    back: "Zurück",
  },
  en: {
    languageLabel: "Choose language",
    chooseLanguage: "Which language would you like to use?",
    chooseSubtitle: "You can change the language at the top later.",
    german: "Deutsch",
    english: "English",
    heroEyebrow: "Help for Jobcenter and Bürgergeld letters",
    heroTitle: "Understand official letters in 30 seconds.",
    heroSubtitle:
      "Upload your letter. EinfachAmt explains in simple words what the office wants from you, which deadlines matter, and how you can reply.",
    uploadCta: "Upload letter",
    exampleCta: "View example",
    howItWorks: "How it works",
    steps: [
      ["Upload letter", "Choose a photo or PDF."],
      ["Get explanation", "EinfachAmt shows the most important points."],
      ["Prepare reply", "You get a polite draft you can edit."],
    ],
    helpsTitle: "What EinfachAmt helps with",
    helpAreas: [
      "Understand Jobcenter letters",
      "Find deadlines",
      "Sort to-dos",
      "Create reply drafts",
    ],
    trustTitle: "Trust",
    trustItems: [
      "Private service",
      "No legal advice",
      "GDPR-oriented",
      "Data protected",
    ],
    pricingTitle: "3 letters free",
    pricingText:
      "After that, a simple monthly plan with Stripe Checkout.",
    pricingLink: "View pricing",
    uploadTitle: "Upload your letter",
    uploadIntro:
      "Take a clear photo of your letter. Make sure all pages are visible.",
    uploadCardTitle: "Upload letter",
    uploadCardText: "Take a clear photo of your letter.",
    uploadButton: "Choose letter",
    uploadIdle: "Make sure all pages are visible.",
    uploadUploading: "Your letter is uploading...",
    uploadReading: "Your letter is being read...",
    safeUploadTitle: "Secure upload",
    safeUploadText:
      "Mock version: No real storage yet. Later with Supabase Storage, EU location, and protected uploads.",
    disclaimer:
      "EinfachAmt is not an official government service and does not provide legal advice.",
    legalHelp:
      "For serious legal issues, please contact social counseling or a lawyer.",
    privacy: "Privacy",
    impressum: "Imprint",
    pricing: "Pricing",
    back: "Back",
  },
} as const;

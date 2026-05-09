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
    trustText:
      "EinfachAmt ist ein privater Dienst. Wir erklären klar, was mit deinem Brief passiert.",
    trustItems: [
      "Privater Dienst",
      "Keine Rechtsberatung",
      "DSGVO-orientiert",
      "Daten geschützt",
    ],
    pricingTitle: "Einmal kostenlos testen",
    pricingText:
      "Ein Brief als Probe – kostenlos, kein Konto nötig. Für weitere Briefe und PDFs gibt es eine einfache Mitgliedschaft.",
    pricingLink: "Mitgliedschaft ansehen",
    uploadTitle: "Lade deinen Brief hoch",
    uploadIntro:
      "Fotografiere deinen Brief gut lesbar. Achte darauf, dass alle Seiten sichtbar sind.",
    uploadCardTitle: "Brief hochladen",
    uploadCardText: "Fotografiere deinen Brief gut lesbar.",
    uploadButton: "Brief auswählen",
    uploadIdle: "Achte darauf, dass alle Seiten sichtbar sind.",
    uploadUploading: "Dein Brief wird hochgeladen...",
    uploadReading: "Dein Brief wird gelesen...",
    uploadError: "Upload fehlgeschlagen. Bitte versuche es erneut.",
    uploadPdfBlocked:
      "PDFs brauchen eine Mitgliedschaft. Teste erst kostenlos mit einem Foto.",
    uploadTrialUsed:
      "Du hast deine kostenlose Probe genutzt. Für weitere Briefe brauchst du eine Mitgliedschaft.",
    safeUploadTitle: "Sicher hochladen",
    safeUploadText:
      "Mock-Version: Noch keine echte Speicherung. Später mit Supabase Storage, EU-Standort und geschützten Uploads.",
    disclaimer:
      "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung.",
    legalHelp:
      "Bei ernsten rechtlichen Problemen bitte Sozialberatung oder Anwalt kontaktieren.",
    security: "Sicherheit",
    privacy: "Datenschutz",
    impressum: "Impressum",
    pricing: "Mitglied",
    back: "Zurück",
    account: "Konto",
    login: "Login",
    dashboardCta: "Meine Briefe",
    dashboardTitle: "Deine Briefe",
    dashboardIntro: "Hier findest du deine hochgeladenen Briefe wieder.",
    dashboardSavePrompt: "Möchtest du deine Briefe speichern?",
    dashboardSaveText:
      "Mit einem kostenlosen Konto findest du deine Uploads später auf jedem Gerät wieder.",
    useEverywhereTitle: "Auf allen Geräten nutzen",
    useEverywhereText:
      "Logge dich mit E-Mail ein, damit deine Briefe und dein Plus-Zugang auch auf einem anderen Handy oder Browser verfügbar sind.",
    emailLogin: "Mit E-Mail einloggen",
    noLettersTitle: "Noch keine Briefe",
    noLettersText:
      "Hier findest du später deine hochgeladenen Briefe. Starte mit einem Foto oder PDF.",
    firstUpload: "Ersten Brief hochladen",
    openAnalysis: "Analyse öffnen",
    deleteLetter: "Brief löschen",
    deletingLetter: "Wird gelöscht...",
    deleteLetterConfirm:
      "Diesen Brief wirklich löschen? Die gespeicherten Daten werden entfernt.",
    deleteLetterError: "Der Brief konnte nicht gelöscht werden.",
    newUpload: "Neuen Brief hochladen",
    statusAnalyzed: "Analysiert",
    statusReading: "Wird gelesen",
    statusUploaded: "Hochgeladen",
    analysisHeader: "Ergebnis",
    analysisSourceLabels: {
      supabase: "Analyse gespeichert",
      pending: "Analyse vorbereitet",
      mock: "Demo-Analyse",
    },
    analysisTitle: "Das ist wichtig",
    analysisIntro:
      "Kurz und einfach. Danach kannst du direkt eine Antwort erstellen.",
    mainActionTitle: "Das musst du jetzt tun",
    mainActionText:
      "Prüfe die Frist, sammle die Unterlagen und bereite heute eine kurze Antwort vor.",
    deadlineFound: "Gefundene Frist",
    deadlineUnclear: "Keine klare Frist erkannt",
    deadlineUnclearHint:
      "Bitte prüfe den Brief. Wenn du unsicher bist, antworte lieber kurz.",
    shortSaid: "Kurz gesagt",
    authorityWants: "Was möchte das Amt?",
    importantDeadline: "Wichtige Frist",
    deadlineHint: "Am besten heute eine kurze Antwort vorbereiten.",
    todosTitle: "Was du tun solltest",
    riskTitle: "Risiko, wenn du nicht reagierst",
    important: "Wichtig",
    createResponse: "Antwort erstellen",
    responseHeader: "Antwort",
    responseTitle: "Was möchtest du sagen?",
    responseIntro: "Wähle eine Vorlage. Du kannst alles ändern.",
    toneTitle: "Ton",
    toneShort: "Kurz",
    tonePolite: "Sehr höflich",
    toneUrgent: "Dringend",
    ownSituation: "Eigene Situation hinzufügen",
    ownSituationPlaceholder:
      "Zum Beispiel: Ich war krank oder warte noch auf Unterlagen.",
    draftTitle: "Dein Entwurf",
    copied: "Kopiert",
    copyText: "Text kopieren",
    savePdfSoon: "PDF speichern (bald)",
    responseTypes: {
      extension: "Ich brauche mehr Zeit",
      submitted: "Ich habe Unterlagen nachgereicht",
      objection: "Ich widerspreche",
      sick: "Ich bin krank",
      explain: "Bitte erklären Sie die Entscheidung",
    },
    responseDrafts: {
      extension:
        "Sehr geehrte Damen und Herren,\n\nhiermit bitte ich um eine Fristverlängerung, da ich die angeforderten Unterlagen noch zusammenstelle.\n\nIch werde diese schnellstmöglich nachreichen.\n\nMit freundlichen Grüßen",
      submitted:
        "Sehr geehrte Damen und Herren,\n\nhiermit teile ich mit, dass ich die angeforderten Unterlagen nachgereicht habe.\n\nBitte bestätigen Sie mir den Eingang der Unterlagen schriftlich.\n\nMit freundlichen Grüßen",
      objection:
        "Sehr geehrte Damen und Herren,\n\nhiermit widerspreche ich Ihrer Entscheidung fristwahrend. Bitte senden Sie mir eine nachvollziehbare Begründung und prüfen Sie den Bescheid erneut.\n\nMit freundlichen Grüßen",
      sick:
        "Sehr geehrte Damen und Herren,\n\nich bin derzeit krank und kann die angeforderten Unterlagen nicht sofort vollständig einreichen. Ich bitte um Verständnis und werde mich schnellstmöglich melden.\n\nMit freundlichen Grüßen",
      explain:
        "Sehr geehrte Damen und Herren,\n\nbitte erklären Sie mir die Entscheidung in einfachen Worten. Ich möchte verstehen, welche Unterlagen oder Schritte von mir erwartet werden.\n\nMit freundlichen Grüßen",
    },
    loadingHeader: "Brief wird gelesen",
    loadingTitle: "Dein Brief wird gelesen...",
    loadingSteps: [
      "Brief wird gelesen",
      "Frist wird gesucht",
      "Antwort wird vorbereitet",
    ],
    readError: "Der Brief konnte nicht gelesen werden.",
    pricingPageTitle: "Mitgliedschaft",
    pricingPageIntro:
      "Starte kostenlos. Wenn du mehr Briefe und echte Texterkennung brauchst, kannst du später Plus freischalten.",
    checkoutSuccess: "Danke. Dein Plus-Zugang wird gerade aktiviert.",
    checkoutCancelled:
      "Checkout wurde abgebrochen. Du kannst jederzeit neu starten.",
    plans: {
      free: {
        name: "Free",
        price: "0 EUR",
        description: "Zum Ausprobieren.",
        features: ["1 Brief kostenlos", "einfache Erklärung", "Antwortentwurf"],
      },
      plus: {
        name: "Plus",
        price: "9 EUR/Monat",
        description: "Für echte OCR-Lesung und mehr Nutzung.",
        features: [
          "Google Document AI OCR",
          "mehr Briefanalysen",
          "gespeicherte Briefe",
          "Antwortentwürfe",
        ],
      },
    },
    startFree: "Erst kostenlos testen",
    checkoutContinue: "Weiter...",
    unlockPlus: "Plus freischalten",
    checkoutError: "Stripe Checkout konnte nicht gestartet werden.",
    loginTitle: "Plus-Zugang sichern",
    loginIntro:
      "Melde dich mit deiner E-Mail an, damit dein Abo auch auf einem neuen Handy oder Browser erhalten bleibt.",
    plusNeedsAccount:
      "Für Plus brauchst du ein Konto. Danach geht es direkt weiter zu Stripe.",
    emailAddress: "E-Mail-Adresse",
    sendingLink: "Link wird gesendet...",
    sendLoginLink: "Login-Link senden",
    loginLinkSent:
      "Wir haben dir einen Login-Link geschickt. Bitte prüfe dein E-Mail-Postfach.",
    loginCheckInbox: "Schau in dein Postfach",
    loginLinkSentTo: "Wir haben dir einen Login-Link geschickt an",
    loginClickLink: "Klicke auf den Link in der E-Mail – du wirst automatisch eingeloggt.",
    loginCheckSpam: "Nichts angekommen? Schau auch im Spam-Ordner nach.",
    loginTryOtherEmail: "Andere E-Mail-Adresse verwenden",
    loginNoPassword: "Kein Passwort",
    loginSecure: "Sicherer Link",
    loginEuData: "EU-Daten",
    accountTitle: "Profil",
    accountSectionLabel: "Konto",
    accountAppSection: "App",
    email: "E-Mail",
    subscription: "Abo",
    plusActive: "Plus aktiv",
    notLoggedIn: "Du bist noch nicht mit E-Mail eingeloggt.",
    signIn: "Einloggen",
    signOut: "Ausloggen",
    notFoundTitle: "Diese Seite gibt es nicht.",
    notFoundText:
      "Du bist wahrscheinlich auf einer technischen Platzhalter-Adresse gelandet.",
    home: "Zur Startseite",
    privacyTitle: "Datenschutz",
    privacyCards: [
      [
        "Kurz gesagt",
        "EinfachAmt speichert hochgeladene Dokumente geschützt in Supabase. Die Analyse dient nur als Verständnishilfe.",
      ],
      [
        "Uploads",
        "Dokumente werden deinem Konto zugeordnet. Du solltest nur Briefe hochladen, die du wirklich analysieren möchtest.",
      ],
      [
        "Wichtig",
        "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung.",
      ],
    ],
    impressumTitle: "Impressum",
    impressumCards: [
      [
        "Angaben folgen",
        "Platzhalter für Betreiberangaben, Adresse, Kontakt und verantwortliche Person.",
      ],
      [
        "Hinweis",
        "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung.",
      ],
    ],
    securityTitle: "Sicherheit",
    securityIntro:
      "Kurz und klar: Du sollst verstehen, was mit deinen Daten passiert.",
    securityCards: [
      [
        "Wo werden meine Daten gespeichert?",
        "Uploads und Analysen werden in Supabase gespeichert. Für den Betrieb nutzen wir Anbieter, die moderne Sicherheitsstandards unterstützen.",
      ],
      [
        "Wer kann meine Briefe sehen?",
        "Deine Briefe sind deinem Konto zugeordnet. Wir bauen die App so, dass nur dein Konto Zugriff auf deine gespeicherten Uploads hat.",
      ],
      [
        "Kann ich alles löschen?",
        "Ja. Im Bereich Meine Briefe kannst du einzelne Uploads löschen. Weitere Löschoptionen bauen wir aus.",
      ],
      [
        "Wichtig",
        "EinfachAmt ist kein offizieller Behördendienst und bietet keine Rechtsberatung.",
      ],
    ],
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
    trustText:
      "EinfachAmt is a private service. We explain clearly what happens with your letter.",
    trustItems: [
      "Private service",
      "No legal advice",
      "GDPR-oriented",
      "Data protected",
    ],
    pricingTitle: "Try once for free",
    pricingText:
      "One letter as a trial – free, no account needed. For more letters and PDFs there is a simple membership.",
    pricingLink: "View membership",
    uploadTitle: "Upload your letter",
    uploadIntro:
      "Take a clear photo of your letter. Make sure all pages are visible.",
    uploadCardTitle: "Upload letter",
    uploadCardText: "Take a clear photo of your letter.",
    uploadButton: "Choose letter",
    uploadIdle: "Make sure all pages are visible.",
    uploadUploading: "Your letter is uploading...",
    uploadReading: "Your letter is being read...",
    uploadError: "Upload failed. Please try again.",
    uploadPdfBlocked:
      "PDFs require a membership. Try for free with a photo first.",
    uploadTrialUsed:
      "You've used your free trial. For more letters you need a membership.",
    safeUploadTitle: "Secure upload",
    safeUploadText:
      "Mock version: No real storage yet. Later with Supabase Storage, EU location, and protected uploads.",
    disclaimer:
      "EinfachAmt is not an official government service and does not provide legal advice.",
    legalHelp:
      "For serious legal issues, please contact social counseling or a lawyer.",
    security: "Security",
    privacy: "Privacy",
    impressum: "Imprint",
    pricing: "Member",
    back: "Back",
    account: "Account",
    login: "Login",
    dashboardCta: "My letters",
    dashboardTitle: "Your letters",
    dashboardIntro: "Here you can find your uploaded letters again.",
    dashboardSavePrompt: "Do you want to save your letters?",
    dashboardSaveText:
      "With a free account, you can find your uploads again on any device.",
    useEverywhereTitle: "Use it on all devices",
    useEverywhereText:
      "Log in with email so your letters and Plus access are available on another phone or browser too.",
    emailLogin: "Log in with email",
    noLettersTitle: "No letters yet",
    noLettersText:
      "Your uploaded letters will appear here later. Start with a photo or PDF.",
    firstUpload: "Upload first letter",
    openAnalysis: "Open analysis",
    deleteLetter: "Delete letter",
    deletingLetter: "Deleting...",
    deleteLetterConfirm:
      "Really delete this letter? The saved data will be removed.",
    deleteLetterError: "The letter could not be deleted.",
    newUpload: "Upload new letter",
    statusAnalyzed: "Analyzed",
    statusReading: "Being read",
    statusUploaded: "Uploaded",
    analysisHeader: "Result",
    analysisSourceLabels: {
      supabase: "Analysis saved",
      pending: "Analysis prepared",
      mock: "Demo analysis",
    },
    analysisTitle: "This is important",
    analysisIntro:
      "Short and simple. After this you can create a reply right away.",
    mainActionTitle: "What you should do now",
    mainActionText:
      "Check the deadline, collect the documents and prepare a short reply today.",
    deadlineFound: "Detected deadline",
    deadlineUnclear: "No clear deadline detected",
    deadlineUnclearHint: "Please check the letter. If unsure, send a short reply.",
    shortSaid: "In short",
    authorityWants: "What does the office want?",
    importantDeadline: "Important deadline",
    deadlineHint: "It is best to prepare a short reply today.",
    todosTitle: "What you should do now",
    riskTitle: "Risk if you do not respond",
    important: "Important",
    createResponse: "Create reply",
    responseHeader: "Reply",
    responseTitle: "What do you want to say?",
    responseIntro: "Choose a template. You can edit everything.",
    toneTitle: "Tone",
    toneShort: "Short",
    tonePolite: "Very polite",
    toneUrgent: "Urgent",
    ownSituation: "Add your own situation",
    ownSituationPlaceholder:
      "For example: I was sick or I am still waiting for documents.",
    draftTitle: "Your draft",
    copied: "Copied",
    copyText: "Copy text",
    savePdfSoon: "Save PDF (soon)",
    responseTypes: {
      extension: "I need more time",
      submitted: "I submitted documents",
      objection: "I object",
      sick: "I am sick",
      explain: "Please explain the decision",
    },
    responseDrafts: {
      extension:
        "Dear Sir or Madam,\n\nI hereby request an extension of the deadline because I am still collecting the requested documents.\n\nI will submit them as soon as possible.\n\nKind regards",
      submitted:
        "Dear Sir or Madam,\n\nI would like to inform you that I have submitted the requested documents.\n\nPlease confirm receipt of the documents in writing.\n\nKind regards",
      objection:
        "Dear Sir or Madam,\n\nI hereby object to your decision within the deadline. Please send me a clear explanation and review the decision again.\n\nKind regards",
      sick:
        "Dear Sir or Madam,\n\nI am currently sick and cannot submit the requested documents in full immediately. I ask for your understanding and will contact you as soon as possible.\n\nKind regards",
      explain:
        "Dear Sir or Madam,\n\nPlease explain the decision to me in simple words. I would like to understand which documents or steps are expected from me.\n\nKind regards",
    },
    loadingHeader: "Letter is being read",
    loadingTitle: "Your letter is being read...",
    loadingSteps: [
      "Letter is being read",
      "Deadline is being searched",
      "Reply is being prepared",
    ],
    readError: "The letter could not be read.",
    pricingPageTitle: "Membership",
    pricingPageIntro:
      "Start for free. If you need more letters and real text recognition, you can unlock Plus later.",
    checkoutSuccess: "Thank you. Your Plus access is being activated.",
    checkoutCancelled: "Checkout was cancelled. You can start again anytime.",
    plans: {
      free: {
        name: "Free",
        price: "0 EUR",
        description: "For trying it out.",
        features: ["1 letter free", "simple explanation", "reply draft"],
      },
      plus: {
        name: "Plus",
        price: "9 EUR/month",
        description: "For real OCR reading and more usage.",
        features: [
          "Google Document AI OCR",
          "more letter analyses",
          "saved letters",
          "reply drafts",
        ],
      },
    },
    startFree: "Try for free first",
    checkoutContinue: "Continue...",
    unlockPlus: "Unlock Plus",
    checkoutError: "Stripe Checkout could not be started.",
    loginTitle: "Secure Plus access",
    loginIntro:
      "Log in with your email so your subscription stays available on a new phone or browser.",
    plusNeedsAccount:
      "You need an account for Plus. After that you will continue directly to Stripe.",
    emailAddress: "Email address",
    sendingLink: "Sending link...",
    sendLoginLink: "Send login link",
    loginLinkSent: "We sent you a login link. Please check your email inbox.",
    loginCheckInbox: "Check your inbox",
    loginLinkSentTo: "We sent a login link to",
    loginClickLink: "Click the link in the email – you will be logged in automatically.",
    loginCheckSpam: "Nothing arrived? Check your spam folder too.",
    loginTryOtherEmail: "Use a different email address",
    loginNoPassword: "No password",
    loginSecure: "Secure link",
    loginEuData: "EU data",
    accountTitle: "Profile",
    accountSectionLabel: "Account",
    accountAppSection: "App",
    email: "Email",
    subscription: "Subscription",
    plusActive: "Plus active",
    notLoggedIn: "You are not logged in with email yet.",
    signIn: "Log in",
    signOut: "Log out",
    notFoundTitle: "This page does not exist.",
    notFoundText: "You probably landed on a technical placeholder address.",
    home: "Back to home",
    privacyTitle: "Privacy",
    privacyCards: [
      [
        "In short",
        "EinfachAmt stores uploaded documents securely in Supabase. The analysis is only a comprehension aid.",
      ],
      [
        "Uploads",
        "Documents are linked to your account. Only upload letters you really want to analyze.",
      ],
      [
        "Important",
        "EinfachAmt is not an official government service and does not provide legal advice.",
      ],
    ],
    impressumTitle: "Imprint",
    impressumCards: [
      [
        "Details coming soon",
        "Placeholder for operator details, address, contact and responsible person.",
      ],
      [
        "Notice",
        "EinfachAmt is not an official government service and does not provide legal advice.",
      ],
    ],
    securityTitle: "Security",
    securityIntro:
      "Short and clear: you should understand what happens with your data.",
    securityCards: [
      [
        "Where is my data stored?",
        "Uploads and analyses are stored in Supabase. For operations we use providers that support modern security standards.",
      ],
      [
        "Who can see my letters?",
        "Your letters are linked to your account. We build the app so only your account can access your saved uploads.",
      ],
      [
        "Can I delete everything?",
        "Yes. In My letters you can delete individual uploads. More deletion options will be added.",
      ],
      [
        "Important",
        "EinfachAmt is not an official government service and does not provide legal advice.",
      ],
    ],
  },
} as const;

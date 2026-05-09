export type KnowledgeAnalysis = {
  letterType: string;
  summary: string;
  authorityRequest: string;
  deadlines: string[];
  todos: string[];
  risks: string;
  responseHint: string;
  references: string[];
};

type ExtractedSignal = {
  label: string;
  value: string;
};

type KnowledgeRule = {
  id: string;
  letterType: string;
  keywords: string[];
  strongKeywords?: string[];
  summary: (signals: ExtractedSignal[]) => string;
  authorityRequest: (signals: ExtractedSignal[]) => string;
  todos: (signals: ExtractedSignal[]) => string[];
  risks: string;
  responseHint: string;
  references: string[];
};

const sharedReferences = [
  "Bundesagentur fuer Arbeit: Buergergeld Informationen und Merkblaetter",
  "Bundesagentur fuer Arbeit: Fachliche Weisungen SGB II",
  "Gesetze im Internet: SGB I, SGB II und SGB X",
];

const datePattern =
  /\b(?:0?[1-9]|[12][0-9]|3[01])[\s./-](?:0?[1-9]|1[0-2])[\s./-](?:20\d{2}|\d{2})\b/g;
const timePattern = /\b(?:[01]?\d|2[0-3]):[0-5]\d\s*(?:uhr)?\b/gi;
const dayWindowPattern =
  /\binnerhalb\s+von\s+(\d{1,2})\s+tagen?\b|\bfrist\s+von\s+(\d{1,2})\s+tagen?\b/gi;
const deadlineContextPattern =
  /\b(?:bis\s+zum|spätestens\s+am|spaetestens\s+am|frist\s+bis|antwort\s+bis|reichen\s+sie.*?bis\s+zum)\s+((?:0?[1-9]|[12][0-9]|3[01])[\s./-](?:0?[1-9]|1[0-2])[\s./-](?:20\d{2}|\d{2}))/gi;

function getSignal(signals: ExtractedSignal[], label: string) {
  return signals.find((signal) => signal.label === label)?.value;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeDate(value: string) {
  const parts = value.split(/[./\-\s]+/).filter(Boolean);
  if (parts.length !== 3) {
    return value;
  }

  const [day, month, year] = parts;
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${fullYear}`;
}

function extractSignals(rawText: string): ExtractedSignal[] {
  const signals: ExtractedSignal[] = [];
  const text = rawText.replace(/\s+/g, " ");
  const normalized = normalize(text);
  const allDates = unique((text.match(datePattern) ?? []).map(normalizeDate));
  const times = unique(text.match(timePattern) ?? []);
  const deadlineDates = unique(
    [...text.matchAll(deadlineContextPattern)].map((match) =>
      normalizeDate(match[1]),
    ),
  );
  const dayWindows = unique(
    [...normalized.matchAll(dayWindowPattern)].map(
      (match) => `${match[1] ?? match[2]} Tage`,
    ),
  );

  const letterDate = allDates[0];

  if (letterDate) {
    signals.push({ label: "briefdatum", value: letterDate });
  }

  deadlineDates.forEach((date) =>
    signals.push({ label: "fristdatum", value: date }),
  );
  dayWindows.forEach((window) =>
    signals.push({ label: "fristfenster", value: window }),
  );

  if (times[0]) {
    signals.push({ label: "uhrzeit", value: times[0] });
  }

  return signals;
}

function buildDeadlineList(signals: ExtractedSignal[], fallback: string) {
  const dateDeadlines = signals
    .filter((signal) => signal.label === "fristdatum")
    .map((signal) => `Frist erkannt: bis ${signal.value}.`);
  const windowDeadlines = signals
    .filter((signal) => signal.label === "fristfenster")
    .map((signal) => `Frist erkannt: ${signal.value}.`);

  return unique([...dateDeadlines, ...windowDeadlines, fallback]);
}

function appendDateTodo(signals: ExtractedSignal[], todos: string[]) {
  const deadlineDate = getSignal(signals, "fristdatum");
  const deadlineWindow = getSignal(signals, "fristfenster");

  if (deadlineDate) {
    return [`Frist ${deadlineDate} im Kalender speichern`, ...todos];
  }

  if (deadlineWindow) {
    return [`Frist (${deadlineWindow}) im Kalender speichern`, ...todos];
  }

  return todos;
}

export const knowledgeRules: KnowledgeRule[] = [
  {
    id: "missing-documents",
    letterType: "Unterlagen nachreichen",
    keywords: [
      "unterlagen",
      "nachweis",
      "nachweise",
      "einreichen",
      "nachreichen",
      "mitwirkung",
      "kontoauszug",
      "kontoauszuege",
      "mietvertrag",
      "lohnabrechnung",
      "verdienstbescheinigung",
    ],
    strongKeywords: ["mitwirkung", "unterlagen", "nachreichen"],
    summary: (signals) => {
      const deadline = getSignal(signals, "fristdatum") ?? getSignal(signals, "fristfenster");
      return deadline
        ? `Das Jobcenter moechte Unterlagen oder Nachweise von dir. Wichtig: Es wurde eine Frist erkannt (${deadline}).`
        : "Das Jobcenter moechte Unterlagen oder Nachweise von dir. Reagiere moeglichst schnell und speichere einen Nachweis ueber deine Antwort.";
    },
    authorityRequest: () =>
      "Das Amt braucht Informationen, damit dein Antrag oder deine laufenden Leistungen weiter geprueft werden koennen.",
    todos: (signals) =>
      appendDateTodo(signals, [
        "Geforderte Unterlagen im Brief markieren",
        "Fehlende Nachweise sammeln",
        "Bei Bedarf kurz um Fristverlaengerung bitten",
        "Antwort mit Nachweis absenden",
      ]),
    risks:
      "Wenn du nicht reagierst, kann die Bearbeitung stocken. In manchen Faellen koennen Leistungen vorlaeufig gestoppt oder gekuerzt werden.",
    responseHint: "Fristverlaengerung oder Unterlagen nachreichen",
    references: sharedReferences,
  },
  {
    id: "hearing",
    letterType: "Anhoerung",
    keywords: [
      "anhoerung",
      "aeussern",
      "aussern",
      "stellungnahme",
      "sachverhalt",
      "bevor wir entscheiden",
      "gelegenheit",
    ],
    strongKeywords: ["anhoerung", "stellungnahme", "sachverhalt"],
    summary: (signals) => {
      const deadline = getSignal(signals, "fristdatum") ?? getSignal(signals, "fristfenster");
      return deadline
        ? `Das ist wahrscheinlich eine Anhoerung. Du sollst deine Sicht erklaeren, bevor entschieden wird. Frist erkannt: ${deadline}.`
        : "Das ist wahrscheinlich eine Anhoerung. Du sollst deine Sicht erklaeren, bevor das Jobcenter entscheidet.";
    },
    authorityRequest: () =>
      "Das Amt prueft einen Sachverhalt und gibt dir Gelegenheit, dich dazu zu aeussern.",
    todos: (signals) =>
      appendDateTodo(signals, [
        "Grund der Anhoerung lesen",
        "Eigene Erklaerung kurz und sachlich notieren",
        "Passende Nachweise anhaengen",
        "Antwort fristgerecht senden",
      ]),
    risks:
      "Wenn du nicht antwortest, entscheidet das Jobcenter moeglicherweise ohne deine Erklaerung.",
    responseHint: "Stellungnahme abgeben",
    references: sharedReferences,
  },
  {
    id: "phone-appointment",
    letterType: "Telefonischer Beratungstermin",
    keywords: [
      "telefonisch",
      "telefonischen",
      "telefonischer",
      "beratungstermin",
      "anrufen",
      "werde sie anrufen",
      "rufe ich sie an",
    ],
    strongKeywords: ["telefonisch", "beratungstermin", "werde sie anrufen"],
    summary: (signals) => {
      const date = getSignal(signals, "fristdatum") ?? getSignal(signals, "briefdatum");
      const time = getSignal(signals, "uhrzeit");
      if (date && time) {
        return `Das Jobcenter hat einen telefonischen Beratungstermin fuer dich eingetragen. Am ${date} um ${time} wirst du angerufen. Sei zu diesem Zeitpunkt erreichbar.`;
      }
      if (date) {
        return `Das Jobcenter hat einen telefonischen Beratungstermin fuer dich eingetragen am ${date}. Pruefe die genaue Uhrzeit im Brief und sei erreichbar.`;
      }
      return "Das Jobcenter moechte dich telefonisch beraten. Pruefe Datum und Uhrzeit im Brief und stelle sicher, dass du erreichbar bist.";
    },
    authorityRequest: () =>
      "Das Amt moechte deine aktuelle Situation telefonisch besprechen. Du wirst angerufen – du musst selbst nichts veranlassen.",
    todos: (signals) => {
      const date = getSignal(signals, "fristdatum") ?? getSignal(signals, "briefdatum");
      const time = getSignal(signals, "uhrzeit");
      const calendarEntry = date
        ? `Telefontermin ${date}${time ? ` um ${time}` : ""} in Kalender eintragen`
        : "Datum und Uhrzeit des Termins im Brief notieren";
      return [
        calendarEntry,
        "Handy aufladen und erreichbar sein",
        "Renten- oder Sozialversicherungsnummer bereitlegen",
        "Einladungsschreiben mit Kundennummer griffbereit haben",
        "Bei Verhinderung rechtzeitig beim Jobcenter absagen",
      ];
    },
    risks:
      "Wenn du beim Anruf nicht erreichbar bist, kann das Jobcenter ein Meldeversaeumnis vermerken. Melde dich im Voraus, falls du verhindert bist.",
    responseHint: "Termin absagen oder verschieben",
    references: sharedReferences,
  },
  {
    id: "appointment",
    letterType: "Termin oder Einladung",
    keywords: [
      "einladung",
      "termin",
      "vorsprechen",
      "erscheinen",
      "meldeversaeumnis",
      "persoenlich",
      "gespraech",
    ],
    strongKeywords: ["einladung", "termin", "erscheinen"],
    summary: (signals) => {
      const date = getSignal(signals, "fristdatum") ?? getSignal(signals, "briefdatum");
      const time = getSignal(signals, "uhrzeit");
      return date
        ? `Das Jobcenter nennt einen Termin oder eine Einladung. Erkanntes Datum: ${date}${time ? ` um ${time}` : ""}.`
        : "Das Jobcenter laedt dich wahrscheinlich zu einem Termin ein. Pruefe Datum, Uhrzeit und ob du persoenlich erscheinen musst.";
    },
    authorityRequest: () =>
      "Das Amt moechte mit dir sprechen oder Unterlagen persoenlich klaeren.",
    todos: (signals) =>
      appendDateTodo(signals, [
        "Termin in den Kalender eintragen",
        "Benoetigte Unterlagen vorbereiten",
        "Bei Krankheit sofort schriftlich Bescheid geben",
        "Absage oder Verschiebung bestaetigen lassen",
      ]),
    risks:
      "Wenn du ohne wichtigen Grund nicht erscheinst, kann das Folgen fuer deine Leistungen haben.",
    responseHint: "Termin verschieben oder Krankheit mitteilen",
    references: sharedReferences,
  },
  {
    id: "decision",
    letterType: "Bescheid pruefen",
    keywords: [
      "bescheid",
      "bewilligungsbescheid",
      "aenderungsbescheid",
      "aufhebungsbescheid",
      "erstattung",
      "rueckforderung",
      "widerspruch",
      "rechtsbehelfsbelehrung",
    ],
    strongKeywords: ["bescheid", "widerspruch", "rechtsbehelfsbelehrung"],
    summary: () =>
      "Das ist wahrscheinlich ein Bescheid. Pruefe genau, was entschieden wurde und ob eine Widerspruchsfrist genannt wird.",
    authorityRequest: () =>
      "Das Amt teilt dir eine Entscheidung mit, zum Beispiel zur Hoehe deiner Leistung oder zu einer Rueckforderung.",
    todos: (signals) =>
      appendDateTodo(signals, [
        "Entscheidung und Zeitraum pruefen",
        "Betraege mit eigenen Unterlagen vergleichen",
        "Bei Unklarheit Erklaerung verlangen",
        "Frist fuer Widerspruch notieren",
      ]),
    risks:
      "Wenn du eine Widerspruchsfrist verpasst, kann es schwieriger werden, die Entscheidung spaeter aendern zu lassen.",
    responseHint: "Entscheidung erklaeren lassen oder Widerspruch vorbereiten",
    references: sharedReferences,
  },
  {
    id: "income-assets",
    letterType: "Einkommen oder Vermoegen",
    keywords: [
      "einkommen",
      "vermoegen",
      "kontoauszuege",
      "lohn",
      "gehalt",
      "arbeitgeber",
      "bedarfsgemeinschaft",
      "verdienst",
    ],
    strongKeywords: ["einkommen", "vermoegen", "kontoauszuege"],
    summary: () =>
      "Das Jobcenter prueft Einkommen, Vermoegen oder Kontoauszuege. Sammle die verlangten Nachweise vollstaendig.",
    authorityRequest: () =>
      "Das Amt moechte pruefen, welche Einnahmen oder finanziellen Mittel bei der Berechnung beruecksichtigt werden muessen.",
    todos: (signals) =>
      appendDateTodo(signals, [
        "Geforderten Zeitraum pruefen",
        "Kontoauszuege oder Lohnnachweise sammeln",
        "Private, irrelevante Angaben soweit erlaubt schwaerzen",
        "Unterlagen mit Nachweis senden",
      ]),
    risks:
      "Unvollstaendige Angaben koennen zu Rueckfragen, Verzoegerungen oder falscher Berechnung fuehren.",
    responseHint: "Unterlagen nachreichen",
    references: sharedReferences,
  },
  {
    id: "sickness",
    letterType: "Krankheit oder Arbeitsunfaehigkeit",
    keywords: [
      "krank",
      "arbeitsunfaehig",
      "krankmeldung",
      "bescheinigung",
      "attest",
      "unfaehigkeit",
    ],
    strongKeywords: ["krank", "arbeitsunfaehig", "krankmeldung", "attest"],
    summary: () =>
      "Es geht wahrscheinlich um Krankheit oder Arbeitsunfaehigkeit. Informiere das Jobcenter frueh und reiche Nachweise ein.",
    authorityRequest: () =>
      "Das Amt moechte wissen, warum du etwas nicht erledigen oder einen Termin nicht wahrnehmen konntest.",
    todos: (signals) =>
      appendDateTodo(signals, [
        "Krankmeldung oder Attest sichern",
        "Jobcenter kurz informieren",
        "Terminverschiebung schriftlich bitten",
        "Nachweis speichern",
      ]),
    risks:
      "Ohne rechtzeitige Information kann das Jobcenter dein Fehlen als unentschuldigt werten.",
    responseHint: "Krankheit mitteilen",
    references: sharedReferences,
  },
];

const fallbackAnalysis: KnowledgeAnalysis = {
  letterType: "Allgemeiner Jobcenter-Brief",
  summary:
    "Der Brief enthaelt eine Aufforderung oder Information vom Jobcenter. Pruefe Fristen und antworte, wenn etwas von dir verlangt wird.",
  authorityRequest:
    "Das Amt moechte wahrscheinlich Informationen, Unterlagen oder eine Reaktion von dir.",
  deadlines: ["Pruefe, ob im Brief ein Datum oder eine Frist genannt wird."],
  todos: [
    "Briefdatum pruefen",
    "Wichtige Frist markieren",
    "Geforderte Unterlagen sammeln",
    "Bei Unsicherheit Beratung kontaktieren",
  ],
  risks:
    "Wenn du nicht reagierst, kann es zu Verzoegerungen oder Problemen mit deinen Leistungen kommen.",
  responseHint: "Erklaerung verlangen oder Fristverlaengerung bitten",
  references: sharedReferences,
};

function scoreRule(text: string, rule: KnowledgeRule) {
  const normalized = normalize(text);
  const keywordScore = rule.keywords.reduce(
    (score, keyword) => score + (normalized.includes(normalize(keyword)) ? 1 : 0),
    0,
  );
  const strongScore = (rule.strongKeywords ?? []).reduce(
    (score, keyword) => score + (normalized.includes(normalize(keyword)) ? 3 : 0),
    0,
  );

  return keywordScore + strongScore;
}

export function buildAnalysisFromText(text: string): KnowledgeAnalysis {
  const signals = extractSignals(text);

  if (!text.trim()) {
    return {
      ...fallbackAnalysis,
      deadlines: buildDeadlineList(signals, fallbackAnalysis.deadlines[0]),
    };
  }

  const bestMatch = knowledgeRules
    .map((rule) => ({ rule, score: scoreRule(text, rule) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!bestMatch || bestMatch.score < 2) {
    return {
      ...fallbackAnalysis,
      deadlines: buildDeadlineList(signals, fallbackAnalysis.deadlines[0]),
      todos: appendDateTodo(signals, fallbackAnalysis.todos),
    };
  }

  return {
    letterType: bestMatch.rule.letterType,
    summary: bestMatch.rule.summary(signals),
    authorityRequest: bestMatch.rule.authorityRequest(signals),
    deadlines: buildDeadlineList(
      signals,
      "Pruefe die Frist im Brief. Wenn du unsicher bist: heute kurz antworten.",
    ),
    todos: bestMatch.rule.todos(signals),
    risks: bestMatch.rule.risks,
    responseHint: bestMatch.rule.responseHint,
    references: bestMatch.rule.references,
  };
}

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

type KnowledgeRule = KnowledgeAnalysis & {
  id: string;
  keywords: string[];
  strongKeywords?: string[];
};

const sharedReferences = [
  "Bundesagentur fuer Arbeit: Buergergeld Informationen und Merkblaetter",
  "Bundesagentur fuer Arbeit: Fachliche Weisungen SGB II",
  "Gesetze im Internet: SGB I, SGB II und SGB X",
];

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
      "mietvertrag",
      "lohnabrechnung",
    ],
    strongKeywords: ["mitwirkung", "unterlagen", "nachreichen"],
    summary:
      "Das Jobcenter möchte Unterlagen oder Nachweise von dir. Reagiere möglichst schnell und speichere einen Nachweis über deine Antwort.",
    authorityRequest:
      "Das Amt braucht Informationen, damit dein Antrag oder deine laufenden Leistungen weiter geprüft werden können.",
    deadlines: ["Oft steht eine konkrete Frist im Brief. Wenn du unsicher bist: heute kurz antworten."],
    todos: [
      "Geforderte Unterlagen markieren",
      "Fehlende Nachweise sammeln",
      "Bei Bedarf Fristverlängerung bitten",
      "Antwort mit Nachweis absenden",
    ],
    risks:
      "Wenn du nicht reagierst, kann die Bearbeitung stocken. In manchen Fällen können Leistungen vorläufig gestoppt oder gekürzt werden.",
    responseHint: "Fristverlängerung oder Unterlagen nachreichen",
    references: sharedReferences,
  },
  {
    id: "hearing",
    letterType: "Anhörung",
    keywords: [
      "anhörung",
      "anhoerung",
      "äußern",
      "aeussern",
      "stellungnahme",
      "sachverhalt",
      "bevor wir entscheiden",
    ],
    strongKeywords: ["anhörung", "anhoerung", "stellungnahme"],
    summary:
      "Das Jobcenter möchte deine Sicht hören, bevor es eine Entscheidung trifft. Du solltest kurz und sachlich antworten.",
    authorityRequest:
      "Das Amt prüft einen Sachverhalt und gibt dir Gelegenheit, dich dazu zu äußern.",
    deadlines: ["Die Frist steht meist im Anhörungsschreiben. Antworte vor Ablauf dieser Frist."],
    todos: [
      "Grund der Anhörung lesen",
      "Eigene Erklärung kurz notieren",
      "Passende Nachweise anhängen",
      "Antwort fristgerecht senden",
    ],
    risks:
      "Wenn du nicht antwortest, entscheidet das Jobcenter möglicherweise ohne deine Erklärung.",
    responseHint: "Stellungnahme abgeben",
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
      "meldeversäumnis",
      "meldeversaeumnis",
      "persönlich",
      "persoenlich",
    ],
    strongKeywords: ["einladung", "termin", "erscheinen"],
    summary:
      "Das Jobcenter lädt dich zu einem Termin ein. Prüfe Datum, Uhrzeit und ob du persönlich erscheinen musst.",
    authorityRequest:
      "Das Amt möchte mit dir sprechen oder Unterlagen persönlich klären.",
    deadlines: ["Wichtig ist der Termin im Brief. Wenn du nicht kannst, melde dich vorher."],
    todos: [
      "Termin in den Kalender eintragen",
      "Benötigte Unterlagen vorbereiten",
      "Bei Krankheit sofort Bescheid geben",
      "Absage oder Verschiebung schriftlich bestätigen lassen",
    ],
    risks:
      "Wenn du ohne wichtigen Grund nicht erscheinst, kann das Folgen für deine Leistungen haben.",
    responseHint: "Termin verschieben oder Krankheit mitteilen",
    references: sharedReferences,
  },
  {
    id: "decision",
    letterType: "Bescheid prüfen",
    keywords: [
      "bescheid",
      "bewilligungsbescheid",
      "änderungsbescheid",
      "aenderungsbescheid",
      "aufhebungsbescheid",
      "erstattung",
      "rückforderung",
      "rueckforderung",
      "widerspruch",
    ],
    strongKeywords: ["bescheid", "widerspruch"],
    summary:
      "Das ist wahrscheinlich ein Bescheid. Prüfe genau, was entschieden wurde und ob eine Widerspruchsfrist genannt wird.",
    authorityRequest:
      "Das Amt teilt dir eine Entscheidung mit, zum Beispiel zur Höhe deiner Leistung oder zu einer Rückforderung.",
    deadlines: ["Bei Bescheiden gibt es oft eine Widerspruchsfrist. Das Datum im Brief ist wichtig."],
    todos: [
      "Entscheidung und Zeitraum prüfen",
      "Beträge mit eigenen Unterlagen vergleichen",
      "Bei Unklarheit Erklärung verlangen",
      "Frist für Widerspruch notieren",
    ],
    risks:
      "Wenn du eine Frist verpasst, kann es schwieriger werden, die Entscheidung später ändern zu lassen.",
    responseHint: "Entscheidung erklären lassen oder Widerspruch vorbereiten",
    references: sharedReferences,
  },
  {
    id: "income-assets",
    letterType: "Einkommen oder Vermögen",
    keywords: [
      "einkommen",
      "vermögen",
      "vermoegen",
      "kontoauszüge",
      "kontoauszuege",
      "lohn",
      "gehalt",
      "arbeitgeber",
      "bedarfsgemeinschaft",
    ],
    strongKeywords: ["einkommen", "vermögen", "vermoegen", "kontoauszüge"],
    summary:
      "Das Jobcenter prüft Einkommen, Vermögen oder Kontoauszüge. Sammle die verlangten Nachweise vollständig.",
    authorityRequest:
      "Das Amt möchte prüfen, welche Einnahmen oder finanziellen Mittel bei der Berechnung berücksichtigt werden müssen.",
    deadlines: ["Prüfe die Frist im Brief. Wenn Unterlagen fehlen, bitte kurz um mehr Zeit."],
    todos: [
      "Geforderten Zeitraum prüfen",
      "Kontoauszüge oder Lohnnachweise sammeln",
      "Private, irrelevante Angaben nur soweit erlaubt schwärzen",
      "Unterlagen mit Nachweis senden",
    ],
    risks:
      "Unvollständige Angaben können zu Rückfragen, Verzögerungen oder falscher Berechnung führen.",
    responseHint: "Unterlagen nachreichen",
    references: sharedReferences,
  },
  {
    id: "sickness",
    letterType: "Krankheit oder Arbeitsunfähigkeit",
    keywords: [
      "krank",
      "arbeitsunfähig",
      "arbeitsunfaehig",
      "krankmeldung",
      "bescheinigung",
      "attest",
      "unfähigkeit",
      "unfaehigkeit",
    ],
    strongKeywords: ["krank", "arbeitsunfähig", "krankmeldung", "attest"],
    summary:
      "Es geht wahrscheinlich um Krankheit oder Arbeitsunfähigkeit. Informiere das Jobcenter früh und reiche Nachweise ein.",
    authorityRequest:
      "Das Amt möchte wissen, warum du etwas nicht erledigen oder einen Termin nicht wahrnehmen konntest.",
    deadlines: ["Melde dich möglichst sofort, besonders wenn ein Termin betroffen ist."],
    todos: [
      "Krankmeldung oder Attest sichern",
      "Jobcenter kurz informieren",
      "Terminverschiebung schriftlich bitten",
      "Nachweis speichern",
    ],
    risks:
      "Ohne rechtzeitige Information kann das Jobcenter dein Fehlen als unentschuldigt werten.",
    responseHint: "Krankheit mitteilen",
    references: sharedReferences,
  },
];

const fallbackAnalysis: KnowledgeAnalysis = {
  letterType: "Allgemeiner Jobcenter-Brief",
  summary:
    "Der Brief enthält eine Aufforderung oder Information vom Jobcenter. Prüfe Fristen und antworte, wenn etwas von dir verlangt wird.",
  authorityRequest:
    "Das Amt möchte wahrscheinlich Informationen, Unterlagen oder eine Reaktion von dir.",
  deadlines: ["Prüfe, ob im Brief ein Datum oder eine Frist genannt wird."],
  todos: [
    "Briefdatum prüfen",
    "Wichtige Frist markieren",
    "Geforderte Unterlagen sammeln",
    "Bei Unsicherheit Beratung kontaktieren",
  ],
  risks:
    "Wenn du nicht reagierst, kann es zu Verzögerungen oder Problemen mit deinen Leistungen kommen.",
  responseHint: "Erklärung verlangen oder Fristverlängerung bitten",
  references: sharedReferences,
};

function normalize(value: string) {
  return value.toLowerCase();
}

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
  if (!text.trim()) {
    return fallbackAnalysis;
  }

  const bestMatch = knowledgeRules
    .map((rule) => ({ rule, score: scoreRule(text, rule) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!bestMatch || bestMatch.score < 2) {
    return fallbackAnalysis;
  }

  return bestMatch.rule;
}

export type DocumentStatus = "Brief analysiert" | "Frist erkannt" | "Antwort offen";

export type MockDocument = {
  id: string;
  fileName: string;
  createdAt: string;
  status: DocumentStatus;
  deadline: string;
};

export const mockDocuments: MockDocument[] = [
  {
    id: "demo-brief-1",
    fileName: "Jobcenter_Aufforderung_Unterlagen.pdf",
    createdAt: "Heute",
    status: "Brief analysiert",
    deadline: "14 Tage nach Erhalt",
  },
  {
    id: "demo-brief-2",
    fileName: "Buergergeld_Bescheid_Foto.jpg",
    createdAt: "Gestern",
    status: "Frist erkannt",
    deadline: "Antwort offen",
  },
  {
    id: "demo-brief-3",
    fileName: "Anhoerung_Jobcenter.png",
    createdAt: "Vor 3 Tagen",
    status: "Antwort offen",
    deadline: "Bitte pruefen",
  },
];

export const mockAnalysis = {
  summary:
    "Das Jobcenter möchte Unterlagen von dir. Du solltest rechtzeitig antworten.",
  authorityRequest:
    "Es werden Nachweise oder Informationen benötigt, damit dein Antrag weiter bearbeitet werden kann.",
  deadlines: ["14 Tage nach Erhalt des Briefes."],
  todos: [
    "Briefdatum prüfen",
    "Unterlagen sammeln",
    "Antwort absenden",
    "Nachweis speichern",
  ],
  risks:
    "Wenn du nicht reagierst, kann es zu Verzögerungen oder Problemen mit deinen Leistungen kommen.",
};

export const responseDrafts: Record<string, string> = {
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
};

export const responseTypes = [
  { id: "extension", label: "Ich brauche mehr Zeit" },
  { id: "submitted", label: "Ich habe Unterlagen nachgereicht" },
  { id: "objection", label: "Ich widerspreche" },
  { id: "sick", label: "Ich bin krank" },
  { id: "explain", label: "Bitte erklären Sie die Entscheidung" },
] as const;

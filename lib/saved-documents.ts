import { createClient } from "@/lib/supabase/server";
import { getSafeUser } from "@/lib/supabase/safe-auth";

export type SavedDocument = {
  id: string;
  fileName: string;
  status: string;
  fileUrl: string;
  createdAt: string;
  summary: string | null;
  deadline: string | null;
};

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export async function getMonthlyUploadCount(): Promise<number> {
  const supabase = await createClient();
  const user = await getSafeUser();

  if (!user) return 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  return count ?? 0;
}

export async function getSavedDocuments(locale = "de-DE") {
  const supabase = await createClient();
  const user = await getSafeUser();

  if (!user) {
    return {
      user: null,
      documents: [] as SavedDocument[],
    };
  }

  const { data } = await supabase
    .from("documents")
    .select("id, file_name, file_url, status, created_at, analyses(summary, deadlines)")
    .order("created_at", { ascending: false })
    .limit(25);

  return {
    user,
    documents: (data ?? []).map((document) => {
      const analysis = Array.isArray(document.analyses)
        ? document.analyses[0]
        : (document.analyses as { summary?: string; deadlines?: string[] } | null);
      const deadlines: string[] = Array.isArray(analysis?.deadlines)
        ? (analysis.deadlines as string[])
        : [];
      const deadline = deadlines.find((d) =>
        /(\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?|\d+\s+tage|bis\s+zum)/i.test(d),
      ) ?? null;

      return {
        id: document.id,
        fileName: document.file_name,
        fileUrl: document.file_url,
        status: document.status,
        createdAt: formatDate(document.created_at, locale),
        summary: analysis?.summary ?? null,
        deadline,
      };
    }),
  };
}

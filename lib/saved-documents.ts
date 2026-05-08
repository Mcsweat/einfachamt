import { createClient } from "@/lib/supabase/server";

export type SavedDocument = {
  id: string;
  fileName: string;
  status: string;
  createdAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export async function getSavedDocuments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      documents: [] as SavedDocument[],
    };
  }

  const { data } = await supabase
    .from("documents")
    .select("id, file_name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  return {
    user,
    documents: (data ?? []).map((document) => ({
      id: document.id,
      fileName: document.file_name,
      status: document.status,
      createdAt: formatDate(document.created_at),
    })),
  };
}

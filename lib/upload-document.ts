import { createClient } from "@/lib/supabase/client";

const DOCUMENT_BUCKET = "documents";
const acceptedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

export type UploadResult =
  | {
      mode: "supabase";
      documentId: string;
      fileName: string;
    }
  | {
      mode: "mock";
      documentId: string;
      fileName: string;
      reason: string;
    };

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function safeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function validateFile(file: File) {
  if (!acceptedTypes.has(file.type)) {
    throw new Error("Bitte lade eine PDF-, JPG- oder PNG-Datei hoch.");
  }

  const maxSizeInBytes = 12 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error("Die Datei ist zu groß. Bitte lade maximal 12 MB hoch.");
  }
}

async function getOrCreateSession() {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (sessionData.session) {
    return { supabase, userId: sessionData.session.user.id };
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    throw new Error(
      "Anonymer Login ist in Supabase noch nicht aktiviert.",
    );
  }

  return { supabase, userId: data.user.id };
}

export async function uploadDocument(file: File): Promise<UploadResult> {
  validateFile(file);

  if (!hasSupabaseConfig()) {
    return {
      mode: "mock",
      documentId: "mock-upload",
      fileName: file.name,
      reason: "Supabase-Umgebung ist noch nicht konfiguriert.",
    };
  }

  let session: Awaited<ReturnType<typeof getOrCreateSession>>;
  try {
    session = await getOrCreateSession();
  } catch (authError) {
    return {
      mode: "mock",
      documentId: "mock-upload",
      fileName: file.name,
      reason:
        authError instanceof Error
          ? `${authError.message} Wir zeigen dir die Demo-Analyse.`
          : "Supabase Auth ist noch nicht bereit. Wir zeigen dir die Demo-Analyse.",
    };
  }

  const { supabase, userId } = session;
  const documentId = crypto.randomUUID();
  const storagePath = `${userId}/${documentId}/${safeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload fehlgeschlagen: ${uploadError.message}`);
  }

  const { error: insertError } = await supabase.from("documents").insert({
    id: documentId,
    user_id: userId,
    file_url: storagePath,
    file_name: file.name,
    file_type: file.type,
    status: "uploaded",
  });

  if (insertError) {
    throw new Error(`Dokument konnte nicht gespeichert werden: ${insertError.message}`);
  }

  return {
    mode: "supabase",
    documentId,
    fileName: file.name,
  };
}

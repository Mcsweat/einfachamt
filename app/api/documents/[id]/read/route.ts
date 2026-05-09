import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAnalysisFromText } from "@/lib/knowledge-base";
import { analyzeLetterWithAi } from "@/lib/ai-analysis";
import { getOcrAccess } from "@/lib/ocr-access";
import { extractTextWithOcr } from "@/lib/ocr";
import { getCurrentUserSubscription } from "@/lib/subscription";

export const maxDuration = 60;

type ReadRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const fallbackOcrText =
  "Mock OCR: Das Jobcenter möchte Unterlagen. Bitte rechtzeitig antworten.";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }

  return "Unbekannter OCR-Fehler.";
}

function textForStorage(ocrResult: {
  provider: "google" | "tesseract" | "mock";
  text: string;
  note?: string;
}) {
  if (ocrResult.provider === "google" || ocrResult.provider === "tesseract") {
    return ocrResult.text;
  }

  return [
    ocrResult.note ? `OCR Hinweis: ${ocrResult.note}` : "OCR Hinweis: Mock-Fallback.",
    ocrResult.text,
  ].join("\n\n");
}

export async function POST(_request: Request, { params }: ReadRouteProps) {
  const { id } = await params;

  if (id === "mock-upload" || id.startsWith("demo-")) {
    return NextResponse.json({
      ok: true,
      mode: "mock",
      documentId: id,
      status: "analyzed",
    });
  }

  const supabase = await createClient();

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("id, status, file_url, file_type")
    .eq("id", id)
    .maybeSingle();

  if (documentError || !document) {
    return NextResponse.json(
      {
        ok: false,
        error: documentError?.message ?? "Dokument wurde nicht gefunden.",
      },
      { status: 404 },
    );
  }

  await supabase.from("documents").update({ status: "reading" }).eq("id", id);

  const { data: file, error: fileError } = await supabase.storage
    .from("documents")
    .download(document.file_url);

  if (fileError || !file) {
    return NextResponse.json(
      {
        ok: false,
        error: fileError?.message ?? "Datei konnte nicht gelesen werden.",
      },
      { status: 500 },
    );
  }

  let ocrResult;
  try {
    const subscription = await getCurrentUserSubscription();
    const ocrAccess = getOcrAccess({
      hasActiveSubscription: subscription.isPaid,
    });
    ocrResult = await extractTextWithOcr(file, document.file_type, {
      allowGoogleDocumentAi: ocrAccess.allowGoogleDocumentAi,
    });
  } catch (ocrError) {
    console.error(ocrError);
    ocrResult = {
      provider: "mock" as const,
      text: fallbackOcrText,
      note: `OCR ist fehlgeschlagen: ${getErrorMessage(ocrError)}`,
    };
  }

  const { data: existingAnalysis } = await supabase
    .from("analyses")
    .select("id")
    .eq("document_id", id)
    .maybeSingle();
  const aiAnalysis = await analyzeLetterWithAi(ocrResult.text);
  const matchedAnalysis = aiAnalysis ?? buildAnalysisFromText(ocrResult.text);

  if (!existingAnalysis) {
    const { error: analysisError } = await supabase.from("analyses").insert({
      document_id: id,
      summary: matchedAnalysis.summary,
      authority_request: matchedAnalysis.authorityRequest,
      deadlines: matchedAnalysis.deadlines,
      todos: matchedAnalysis.todos,
      risks: matchedAnalysis.risks,
      language: "de",
    });

    if (analysisError) {
      return NextResponse.json(
        { ok: false, error: analysisError.message },
        { status: 500 },
      );
    }
  }

  const { error: updateError } = await supabase
    .from("documents")
    .update({
      status: "analyzed",
      extracted_text: textForStorage(ocrResult),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode:
      ocrResult.provider === "google"
        ? "google_document_ai_ocr"
        : ocrResult.provider === "tesseract"
          ? "tesseract_ocr"
          : "mock_ocr",
    documentId: id,
    analysisSaved: true,
    ocrNote: ocrResult.note ?? null,
    status: "analyzed",
  });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mockAnalysis } from "@/lib/mock-data";

type ReadRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

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
    .select("id, status")
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

  const { data: existingAnalysis } = await supabase
    .from("analyses")
    .select("id")
    .eq("document_id", id)
    .maybeSingle();

  if (!existingAnalysis) {
    const { error: analysisError } = await supabase.from("analyses").insert({
      document_id: id,
      summary: mockAnalysis.summary,
      authority_request: mockAnalysis.authorityRequest,
      deadlines: mockAnalysis.deadlines,
      todos: mockAnalysis.todos,
      risks: mockAnalysis.risks,
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
      extracted_text:
        "Mock OCR: Das Jobcenter möchte Unterlagen. Bitte rechtzeitig antworten.",
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
    mode: "mock_ocr",
    documentId: id,
    analysisSaved: true,
    status: "analyzed",
  });
}

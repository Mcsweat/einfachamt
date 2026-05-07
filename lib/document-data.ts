import { createClient } from "@/lib/supabase/server";
import { mockAnalysis } from "@/lib/mock-data";

export type AnalysisResult = {
  summary: string;
  authorityRequest: string;
  deadlines: string[];
  todos: string[];
  risks: string;
  source: "supabase" | "mock" | "pending";
};

export async function getAnalysisForDocument(
  documentId: string,
): Promise<AnalysisResult> {
  if (documentId === "mock-upload" || documentId.startsWith("demo-")) {
    return { ...mockAnalysis, source: "mock" };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("analyses")
    .select("summary, authority_request, deadlines, todos, risks")
    .eq("document_id", documentId)
    .maybeSingle();

  if (!data) {
    return { ...mockAnalysis, source: "pending" };
  }

  return {
    summary: data.summary ?? mockAnalysis.summary,
    authorityRequest: data.authority_request ?? mockAnalysis.authorityRequest,
    deadlines: Array.isArray(data.deadlines)
      ? data.deadlines.map(String)
      : mockAnalysis.deadlines,
    todos: Array.isArray(data.todos)
      ? data.todos.map(String)
      : mockAnalysis.todos,
    risks: data.risks ?? mockAnalysis.risks,
    source: "supabase",
  };
}

import { createClient } from "@/lib/supabase/server";
import { mockAnalysis } from "@/lib/mock-data";

export type AnalysisResult = {
  summary: string;
  authorityRequest: string;
  deadlines: string[];
  todos: string[];
  risks: string;
  hasDetectedDeadline: boolean;
  source: "supabase" | "mock" | "pending";
};

function hasUsefulDeadline(deadlines: string[]) {
  return deadlines.some((deadline) =>
    /(\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?|\d+\s+tage|bis\s+zum|frist)/i.test(
      deadline,
    ),
  );
}

export async function getAnalysisForDocument(
  documentId: string,
): Promise<AnalysisResult> {
  if (documentId === "mock-upload" || documentId.startsWith("demo-")) {
    return {
      ...mockAnalysis,
      hasDetectedDeadline: hasUsefulDeadline(mockAnalysis.deadlines),
      source: "mock",
    };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("analyses")
    .select("summary, authority_request, deadlines, todos, risks")
    .eq("document_id", documentId)
    .maybeSingle();

  if (!data) {
    return {
      ...mockAnalysis,
      hasDetectedDeadline: hasUsefulDeadline(mockAnalysis.deadlines),
      source: "pending",
    };
  }

  const deadlines = Array.isArray(data.deadlines)
    ? data.deadlines.map(String)
    : mockAnalysis.deadlines;

  return {
    summary: data.summary ?? mockAnalysis.summary,
    authorityRequest: data.authority_request ?? mockAnalysis.authorityRequest,
    deadlines,
    todos: Array.isArray(data.todos)
      ? data.todos.map(String)
      : mockAnalysis.todos,
    risks: data.risks ?? mockAnalysis.risks,
    hasDetectedDeadline: hasUsefulDeadline(deadlines),
    source: "supabase",
  };
}

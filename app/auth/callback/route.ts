import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextUrl(request: Request, nextPath: string | null) {
  const requestUrl = new URL(request.url);
  const fallback = `${requestUrl.origin}/pricing`;

  if (!nextPath || !nextPath.startsWith("/")) {
    return fallback;
  }

  return `${requestUrl.origin}${nextPath}`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(safeNextUrl(request, next));
}

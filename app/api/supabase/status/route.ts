import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export async function GET() {
  const env = Object.fromEntries(
    requiredEnv.map((key) => [key, Boolean(process.env[key])]),
  );
  const hasEnv = Object.values(env).every(Boolean);

  if (!hasEnv) {
    return NextResponse.json({
      ok: false,
      env,
      checks: {
        anonymousAuth: "not_checked",
        documentsBucket: "not_checked",
      },
      nextStep:
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  );

  const { data: authData, error: authError } =
    await supabase.auth.signInAnonymously();

  let bucketStatus = "not_checked";
  let bucketReady = false;

  if (authData.user) {
    const { error: listError } = await supabase.storage
      .from("documents")
      .list(authData.user.id, { limit: 1 });

    bucketStatus = listError ? listError.message : "ok";
    bucketReady = !listError;
  }

  if (authData.session) {
    await supabase.auth.signOut();
  }

  return NextResponse.json({
    ok: !authError && bucketReady,
    env,
    checks: {
      anonymousAuth: authError ? authError.message : "ok",
      documentsBucket: bucketStatus,
    },
    nextStep:
      !authError && bucketReady
        ? "Supabase is ready. Try uploading a PDF, JPG, or PNG on /upload."
        : "Run supabase/schema.sql and enable Anonymous sign-ins in Supabase Auth.",
  });
}

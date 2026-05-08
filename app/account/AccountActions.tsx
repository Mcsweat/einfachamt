"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-trust-100 px-5 py-4 text-lg font-bold text-trust-700"
    >
      Ausloggen
    </button>
  );
}

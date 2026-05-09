"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  label?: string;
};

export function SignOutButton({ label = "Ausloggen" }: SignOutButtonProps) {
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
      className="flex min-h-[54px] w-full items-center gap-3 px-5 text-left"
    >
      <span className="text-xl">🚪</span>
      <span className="flex-1 text-base font-semibold text-red-500">{label}</span>
    </button>
  );
}

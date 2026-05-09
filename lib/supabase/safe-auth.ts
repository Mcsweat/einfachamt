import { createClient } from "@/lib/supabase/server";

export async function getSafeUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    console.warn("Supabase auth session could not be read", error);
    return null;
  }
}

import { cookies } from "next/headers";
import { type Language } from "@/lib/i18n";

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const language = cookieStore.get("einfachamt-language")?.value;
  return language === "en" ? "en" : "de";
}

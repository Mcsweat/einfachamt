import { cookies } from "next/headers";
import { type Language } from "@/lib/i18n";

const VALID_LANGUAGES: Language[] = ["de", "en", "uk", "ru", "ar", "tr"];

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const language = cookieStore.get("einfachamt-language")?.value;
  return VALID_LANGUAGES.includes(language as Language)
    ? (language as Language)
    : "de";
}

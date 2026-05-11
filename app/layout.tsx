import type { Metadata } from "next";
import { LanguageGate } from "@/components/LanguageGate";
import { getLanguage } from "@/lib/i18n-server";
import { languageMeta } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import "./globals.css";

export const metadata: Metadata = {
  title: "EinfachAmt | Behördenbriefe verstehen",
  description:
    "Verstehe Behördenbriefe in 30 Sekunden. EinfachAmt hilft bei Jobcenter- und Bürgergeld-Briefen – kostenlos testen.",
  metadataBase: new URL("https://einfachamt.com"),
  openGraph: {
    title: "EinfachAmt – Behördenbriefe in 30 Sekunden verstehen",
    description:
      "Brief hochladen, Erklärung bekommen, Antwort vorbereiten. Kostenlos testen – kein Konto nötig.",
    url: "https://einfachamt.com",
    siteName: "EinfachAmt",
    type: "website",
    locale: "de_DE",
    images: ogImage,
  },
  twitter: {
    card: "summary_large_image",
    title: "EinfachAmt – Behördenbriefe verstehen",
    description:
      "Brief hochladen, Erklärung bekommen, Antwort vorbereiten. Kostenlos testen.",
    images: ogImage,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getLanguage();
  const { dir } = languageMeta[language];

  return (
    <html lang={language} dir={dir}>
      <body>
        {children}
        <LanguageGate />
      </body>
    </html>
  );
}

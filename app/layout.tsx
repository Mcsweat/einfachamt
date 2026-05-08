import type { Metadata } from "next";
import { LanguageGate } from "@/components/LanguageGate";
import "./globals.css";

export const metadata: Metadata = {
  title: "EinfachAmt | Behördenbriefe verstehen",
  description:
    "Verstehe Behördenbriefe in 30 Sekunden. EinfachAmt hilft bei Jobcenter- und Bürgergeld-Briefen.",
  icons: {
    icon: "/einfachamt-icon.png",
    apple: "/einfachamt-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        {children}
        <LanguageGate />
      </body>
    </html>
  );
}

import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="border-b border-trust-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" aria-label="EinfachAmt Startseite">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Link
            href="/dashboard"
            className="rounded-full px-3 py-2 hover:bg-trust-50 hover:text-ink"
          >
            Dashboard
          </Link>
          <Link
            href="/upload"
            className="rounded-full bg-trust-700 px-4 py-2 text-white shadow-sm hover:bg-trust-500"
          >
            Hochladen
          </Link>
        </nav>
      </div>
    </header>
  );
}

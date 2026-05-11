import Link from "next/link";
import type { Language } from "@/lib/i18n";

type UsagePillProps = {
  isPaid: boolean;
  isLoggedIn: boolean;
  monthlyCount: number;
  limit: number;
  language: Language;
};

const labels = {
  de: {
    free0: "1 gratis Brief · Kein Konto nötig",
    free1: "Gratis Brief verwendet",
    freeN: (n: number) => `${n}/1 gratis Brief verwendet`,
    upgrade: "Plus holen →",
    plus: (n: number, max: number) => `${n} / ${max} Briefe diesen Monat`,
    plusFull: "Monatslimit erreicht",
  },
  en: {
    free0: "1 free letter · No account needed",
    free1: "Free letter used",
    freeN: (n: number) => `${n}/1 free letter used`,
    upgrade: "Get Plus →",
    plus: (n: number, max: number) => `${n} / ${max} letters this month`,
    plusFull: "Monthly limit reached",
  },
  uk: {
    free0: "1 безкоштовний лист · Без реєстрації",
    free1: "Безкоштовний лист використано",
    freeN: (n: number) => `${n}/1 безкоштовний лист`,
    upgrade: "Отримати Plus →",
    plus: (n: number, max: number) => `${n} / ${max} листів цього місяця`,
    plusFull: "Ліміт вичерпано",
  },
  ru: {
    free0: "1 бесплатное письмо · Без регистрации",
    free1: "Бесплатное письмо использовано",
    freeN: (n: number) => `${n}/1 бесплатное письмо`,
    upgrade: "Получить Plus →",
    plus: (n: number, max: number) => `${n} / ${max} писем в этом месяце`,
    plusFull: "Лимит исчерпан",
  },
  ar: {
    free0: "خطاب مجاني واحد · بدون حساب",
    free1: "تم استخدام الخطاب المجاني",
    freeN: (n: number) => `${n}/1 خطاب مجاني`,
    upgrade: "احصل على Plus →",
    plus: (n: number, max: number) => `${n} / ${max} خطابات هذا الشهر`,
    plusFull: "تم الوصول إلى الحد الشهري",
  },
  tr: {
    free0: "1 ücretsiz mektup · Hesap gerekmez",
    free1: "Ücretsiz mektup kullanıldı",
    freeN: (n: number) => `${n}/1 ücretsiz mektup`,
    upgrade: "Plus al →",
    plus: (n: number, max: number) => `${n} / ${max} mektup bu ay`,
    plusFull: "Aylık limite ulaşıldı",
  },
};

export function UsagePill({
  isPaid,
  isLoggedIn,
  monthlyCount,
  limit,
  language,
}: UsagePillProps) {
  const l = labels[language] ?? labels.de;

  /* ── Plus user ── */
  if (isPaid) {
    const full = monthlyCount >= limit;
    const pct = Math.min((monthlyCount / limit) * 100, 100);
    return (
      <div className="mb-4 overflow-hidden rounded-2xl bg-white/95 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700">
            {full ? l.plusFull : l.plus(monthlyCount, limit)}
          </p>
          <span className="text-xs font-bold text-trust-500">Plus</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${
              full ? "bg-amber-400" : "bg-trust-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  /* ── Free user — trial not yet used ── */
  if (!isLoggedIn || monthlyCount === 0) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
          ✓
        </span>
        <p className="text-sm font-bold text-emerald-800">{l.free0}</p>
      </div>
    );
  }

  /* ── Free user — trial used ── */
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-amber-50 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
          !
        </span>
        <p className="text-sm font-bold text-amber-900">
          {monthlyCount >= 2 ? l.freeN(monthlyCount) : l.free1}
        </p>
      </div>
      <Link
        href="/pricing"
        className="shrink-0 rounded-full bg-trust-500 px-3 py-1.5 text-xs font-bold text-white transition active:scale-[0.97]"
      >
        {l.upgrade}
      </Link>
    </div>
  );
}

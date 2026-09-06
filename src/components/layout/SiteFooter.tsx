import { LogoMark } from "@/components/ui/Logo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="flex items-center justify-between border-t border-hair px-14 py-11 text-[13px] font-light text-faint">
      <div className="flex items-center gap-3">
        <LogoMark size={22} />
        <span className="font-mono text-[11px] tracking-[0.1em]">{t.footer.licence}</span>
      </div>

      <div className="flex items-center gap-7">
        <a
          href="https://www.instagram.com/matiasdip.immo"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-underline transition-colors hover:text-ink"
        >
          {t.footer.instagram}
        </a>
        {/* Estas dos páginas todavía no existen; el cliente debe aportar el texto legal. */}
        <span className="nav-underline cursor-pointer transition-colors hover:text-ink">
          {t.footer.terms}
        </span>
        <span className="nav-underline cursor-pointer transition-colors hover:text-ink">
          {t.footer.privacy}
        </span>
      </div>
    </footer>
  );
}

import { LogoMark } from "@/components/ui/Logo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="flex flex-col items-start justify-between gap-6 border-t border-hair px-6 py-10 text-[13px] font-light text-faint md:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-14 lg:py-11">
      <div className="flex items-center gap-3">
        <LogoMark size={22} />
        <span className="font-mono text-[10px] tracking-[0.1em] sm:text-[11px]">
          {t.footer.licence}
        </span>
      </div>

      {/* `py-2.5 -my-2.5` da altura táctil sin separar visualmente los enlaces:
          el área de toque crece, el ritmo de la línea queda igual. */}
      <div className="flex flex-wrap items-center gap-x-7">
        <a
          href="https://www.instagram.com/matiasdip.immo"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-underline -my-2.5 py-2.5 transition-colors hover:text-ink"
        >
          {t.footer.instagram}
        </a>
        {/* Estas dos páginas todavía no existen; el cliente debe aportar el texto legal. */}
        <span className="nav-underline -my-2.5 cursor-pointer py-2.5 transition-colors hover:text-ink">
          {t.footer.terms}
        </span>
        <span className="nav-underline -my-2.5 cursor-pointer py-2.5 transition-colors hover:text-ink">
          {t.footer.privacy}
        </span>
      </div>
    </footer>
  );
}

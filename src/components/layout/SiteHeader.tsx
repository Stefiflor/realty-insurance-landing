import Link from "next/link";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { intentMessage } from "@/lib/domain/whatsapp";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Barra superior, pegada al tope con fondo translúcido.
 *
 * Las secciones a las que apunta todavía no existen como páginas: por ahora son
 * anclas a las secciones de la home. Cuando estén las rutas propias
 * (`/propiedades`, `/seguros`) se cambian acá.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const anchors = ["#propiedades", "#propiedades", "#propiedades", "#seguros", "#contacto"];

  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-nav backdrop-blur-xl">
      <div className="flex items-center justify-between px-14 py-[18px]">
        <Link
          href={`/${locale}`}
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <Logo size={32} holeClassName="fill-(--nav-solid)" />
        </Link>

        <nav className="flex items-center gap-9 text-[14px]">
          {t.nav.links.map((label, i) => (
            <a
              key={label}
              href={anchors[i]}
              className="nav-underline cursor-pointer text-dim transition-colors duration-300 hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <LocaleSwitcher current={locale} />
          <ThemeToggle />
          <WhatsappButton message={intentMessage("comprar", locale)} size="sm">
            {t.nav.cta}
          </WhatsappButton>
        </div>
      </div>
    </header>
  );
}

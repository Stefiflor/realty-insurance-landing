import Link from "next/link";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogoMark } from "@/components/ui/Logo";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { intentMessage } from "@/lib/domain/whatsapp";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Barra superior, pegada al tope con fondo translúcido.
 *
 * Debajo de `lg` los enlaces y controles se van al menú desplegable: en un
 * celular no entran cinco enlaces más el selector de idioma, el tema y el CTA.
 *
 * Las secciones a las que apunta todavía no existen como páginas: por ahora son
 * anclas a las secciones de la home. Cuando estén las rutas propias
 * (`/propiedades`, `/seguros`) se cambian acá.
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Mismo orden que `nav.links` del diccionario:
  // Propiedades · Alquileres · Terrenos · Seguros · Estudio
  const anchors = [
    `/${locale}/propiedades`,
    `/${locale}/propiedades?operacion=alquiler`,
    `/${locale}/propiedades?operacion=terreno`,
    `/${locale}#seguros`,
    `/${locale}#estudio`,
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-nav backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3.5 md:px-10 lg:px-14 lg:py-[18px]">
        <div className="flex flex-col">
          <Link
            href={`/${locale}`}
            className="-my-2 flex w-fit rounded-sm py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <LogoMark size={38} />
          </Link>
          {/* Bajada del logo: puntos en arena, texto en petróleo, sin negrita. */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-brand sm:text-[11px]">
            {t.nav.tagline.map((word, i) => (
              <span key={word} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-accent">·</span>}
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* navegación de escritorio */}
        <nav className="hidden items-center gap-7 text-[14px] lg:flex xl:gap-9">
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

        {/* controles de escritorio */}
        <div className="hidden items-center gap-3.5 lg:flex">
          <LocaleSwitcher current={locale} />
          <ThemeToggle />
          <WhatsappButton
            message={intentMessage("comprar", locale)}
            size="sm"
            intent="comprar"
            locale={locale}
          >
            {t.nav.cta}
          </WhatsappButton>
        </div>

        {/* menú de móvil */}
        <MobileMenu locale={locale} anchors={anchors} />
      </div>
    </header>
  );
}

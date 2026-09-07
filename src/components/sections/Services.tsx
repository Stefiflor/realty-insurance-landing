import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Los cuatro servicios del estudio, al mismo nivel.
 *
 * Van juntos y con el mismo peso a propósito: MD no tiene un negocio principal,
 * y la home tiene que mostrar todo lo que hace de una.
 */

const SERVICES: Array<{
  key: "venta" | "alquiler" | "terreno" | "seguro";
  icon: IconName;
  /** Ruta relativa al idioma; se completa en el componente. */
  href: (locale: Locale) => string;
}> = [
  { key: "venta", icon: "sale", href: (l) => `/${l}/propiedades?operacion=venta` },
  { key: "alquiler", icon: "key", href: (l) => `/${l}/propiedades?operacion=alquiler` },
  { key: "terreno", icon: "land", href: (l) => `/${l}/propiedades?operacion=terreno` },
  { key: "seguro", icon: "shield", href: () => "#seguros" },
];

export function Services({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="px-6 pt-18 md:px-10 lg:px-14 lg:pt-27.5">
      <div className="mb-11 flex items-end justify-between gap-6">
        <SectionHeading
          kicker={t.services.kicker}
          title={t.services.title}
          className="max-w-[620px]"
        />
        {/* Contador decorativo: en móvil no aporta y roba ancho al título. */}
        <div className="hidden pb-2 font-mono text-[11px] tracking-[0.14em] text-faint md:block">
          04 / {t.services.unit}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-4">
        {SERVICES.map((service, i) => {
          const copy = t.services.items[service.key];
          return (
            <a
              key={service.key}
              href={service.href(locale)}
              className="group animate-rise relative block overflow-hidden rounded-[5px] border border-hair bg-surface px-6.5 pt-7.5 pb-7 shadow-sm transition-transform duration-[600ms] ease-(--ease-brand) hover:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              style={{ animationDelay: `${0.07 * i}s` }}
            >
              {/* baño de color que sube al pasar el cursor */}
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-full bg-[linear-gradient(180deg,var(--brand-soft)_0%,transparent_100%)] transition-transform duration-[700ms] ease-(--ease-brand) group-hover:translate-y-0"
              />
              {/* número fantasma */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 text-[58px] leading-none font-light tracking-[-0.05em] text-ink opacity-[0.055] transition-all duration-[700ms] ease-(--ease-brand) group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:opacity-[0.16]"
              >
                0{i + 1}
              </span>

              <span className="relative block">
                <span className="mb-5.5 flex size-11.5 items-center justify-center rounded-[5px] bg-brand-soft text-brand transition-transform duration-[600ms] ease-(--ease-pop) group-hover:scale-108 group-hover:-rotate-4">
                  <Icon name={service.icon} size={22} />
                </span>
                <span className="mb-2.5 block text-[19px] font-medium tracking-[-0.015em]">
                  {copy.title}
                </span>
                <span className="mb-5.5 block text-[14px] leading-[1.62] font-light text-dim">
                  {copy.desc}
                </span>
                <span className="flex items-center gap-2 text-[13px] font-medium text-brand">
                  {copy.cta}
                  <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

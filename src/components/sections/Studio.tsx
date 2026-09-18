import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * El estudio es una sola persona: no hay equipo que presentar, así que la
 * sección habla en primera persona en vez de la típica bajada institucional
 * de "nosotros".
 *
 * Las credenciales se listan con el mismo patrón de fila que las coberturas
 * en <Insurance>: ícono + nombre + dato en mono, en vez de "chips" sueltos,
 * para que las dos secciones se lean como parte del mismo sitio.
 */
export function Studio({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const credentials = [
    {
      icon: "check" as const,
      name: t.studio.credentials.broker,
      detail: t.studio.credentials.brokerLicence,
    },
    {
      icon: "shield" as const,
      name: t.studio.credentials.insurance,
      detail: t.studio.credentials.insuranceLicence,
    },
    {
      icon: "pin" as const,
      name: t.studio.location,
      detail: null,
    },
  ];

  return (
    <section
      id="estudio"
      className="relative mt-18 scroll-mt-20 overflow-hidden px-6 py-16 md:px-10 lg:mt-27.5 lg:px-14 lg:py-23"
    >
      <div className="relative grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-21">
        <div>
          <SectionHeading kicker={t.studio.kicker} title={t.studio.title}>
            <div className="mt-4.5 mb-8 flex max-w-[560px] flex-col gap-4 text-[15.5px] leading-[1.68] font-light text-dim">
              {t.studio.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </SectionHeading>

          <div className="flex max-w-[520px] flex-col">
            {credentials.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-4 border-b border-hair py-4 first:pt-0 last:border-b-0"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-brand-soft text-brand">
                  <Icon name={item.icon} size={17} />
                </div>
                <div className="text-[14.5px] font-medium">{item.name}</div>
                {item.detail && (
                  <div className="ml-auto font-mono text-[11px] tracking-[0.06em] text-faint">
                    {item.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="animate-rise relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-sm border border-hair shadow-lg lg:mx-0 lg:max-w-none">
          <Image
            src="/team/matias-dip.jpg"
            alt={t.studio.photoAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 360px, 280px"
          />
          {/* franja inferior fina en arena: firma de marca discreta, no un
              efecto sobre la foto. */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

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
      <div
        aria-hidden="true"
        className="animate-mesh-alt absolute -top-40 -left-40 size-140 rounded-full bg-[radial-gradient(circle,var(--mesh-2)_0%,transparent_68%)] blur-[110px]"
      />

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

        <div className="animate-rise relative mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-none">
          {/* Marco desfasado detrás: da profundidad sin depender de que se
              vea la animación (que en pantalla fija no se nota). */}
          <div
            className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-sm border-2 border-brand/50"
            aria-hidden="true"
          />

          <div
            className="card-glow group relative aspect-[3/4] overflow-hidden rounded-sm shadow-[0_45px_90px_-35px_rgba(18,24,27,0.55)] transition-transform duration-500 ease-(--ease-brand) will-change-transform hover:[transform:perspective(1400px)_rotateY(-4deg)_rotateX(1.5deg)_translateZ(0)]"
          >
            <Image
              src="/team/matias-dip.jpg"
              alt={t.studio.photoAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 360px, 280px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(200deg,transparent_60%,rgba(6,10,12,0.4)_100%)]" aria-hidden="true" />

            {/* esquinas técnicas, mismo motivo que el Hero */}
            {[
              "top-3.5 left-3.5 border-t border-l",
              "top-3.5 right-3.5 border-t border-r",
              "bottom-3.5 left-3.5 border-b border-l",
              "bottom-3.5 right-3.5 border-b border-r",
            ].map((position) => (
              <div key={position} className={`absolute size-5 border-white/60 ${position}`} aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

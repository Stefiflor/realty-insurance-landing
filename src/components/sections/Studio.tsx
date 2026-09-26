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
 * Las matrículas quedan visibles junto a la biografía para que la trayectoria
 * y la habilitación profesional se puedan comprobar de un vistazo.
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
      <div className="pointer-events-none absolute top-0 right-0 h-px w-full bg-hair" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(340px,410px)] lg:gap-16 xl:gap-24">
        <div className="max-w-[690px]">
          <SectionHeading kicker={t.studio.kicker} title={t.studio.title}>
            <div className="mt-7 mb-9 flex max-w-[610px] flex-col gap-4 border-l-2 border-brand pl-5 text-[15.5px] leading-[1.75] font-light text-dim sm:pl-7">
              {t.studio.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </SectionHeading>

          <div className="grid max-w-[640px] gap-2.5">
            {credentials.map((item) => (
              <div
                key={item.name}
                className="group flex min-h-17 flex-wrap items-center gap-x-4 gap-y-1 border border-hair bg-surface px-4 py-3 shadow-sm transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-hair-strong hover:shadow-lg sm:flex-nowrap"
              >
                <div className="flex size-10 shrink-0 items-center justify-center bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-surface">
                  <Icon name={item.icon} size={17} />
                </div>
                <div className="min-w-0 flex-1 text-[14px] leading-snug font-medium sm:text-[14.5px]">{item.name}</div>
                {item.detail && (
                  <div className="ml-14 font-mono text-[11px] tracking-[0.04em] text-dim sm:ml-auto sm:text-right">
                    {item.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="animate-rise relative mx-auto w-full max-w-[410px] px-4 pt-4 pb-5 sm:px-6 sm:pt-6 sm:pb-7 lg:mx-0">
          <div className="absolute top-0 right-0 h-[34%] w-[42%] bg-accent" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-[29%] w-[35%] bg-brand" aria-hidden="true" />
          <div className="absolute right-0 bottom-0 h-[29%] w-[44%] border-r border-b border-hair-strong" aria-hidden="true" />
          <div className="group relative aspect-[3/4] overflow-hidden bg-band shadow-xl">
            <Image
              src="/team/matias-dip.jpg"
              alt={t.studio.photoAlt}
              fill
              className="object-cover transition-transform duration-700 ease-(--ease-brand) group-hover:scale-[1.035]"
              sizes="(min-width: 1024px) 410px, (min-width: 640px) 360px, 90vw"
            />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

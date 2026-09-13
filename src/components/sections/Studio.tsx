import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * El estudio es una sola persona: no hay equipo que presentar, así que la
 * sección habla en primera persona en vez de la típica bajada institucional
 * de "nosotros".
 */
export function Studio({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section
      id="estudio"
      className="relative mt-18 scroll-mt-20 overflow-hidden px-6 py-16 md:px-10 lg:mt-27.5 lg:px-14 lg:py-23"
    >
      <div
        aria-hidden="true"
        className="animate-mesh-alt absolute -top-40 -left-40 size-140 rounded-full bg-[radial-gradient(circle,var(--mesh-2)_0%,transparent_68%)] blur-[110px]"
      />

      <div className="relative grid grid-cols-1 items-start gap-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-21">
        <div className="animate-rise mx-auto w-full max-w-[280px] overflow-hidden rounded-md border border-hair-strong shadow-xl lg:mx-0 lg:max-w-none">
          <Image
            src="/team/matias-dip.jpg"
            alt={t.studio.photoAlt}
            width={1024}
            height={1421}
            className="h-auto w-full object-cover"
            sizes="(min-width: 1024px) 360px, 280px"
          />
        </div>

        <div>
          <SectionHeading kicker={t.studio.kicker} title={t.studio.title}>
            <div className="mt-4.5 mb-7 flex max-w-[560px] flex-col gap-4 text-[15.5px] leading-[1.68] font-light text-dim">
              {t.studio.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </SectionHeading>

          <div className="flex max-w-[560px] flex-wrap gap-2.5">
            <span className="flex items-center gap-2.5 rounded-full border border-hair-strong bg-glass px-4.5 py-2.5 text-[13.5px] font-normal text-dim backdrop-blur-md">
              <Icon name="check" size={15} className="text-brand" />
              {t.studio.credentials.broker} — {t.studio.credentials.brokerLicence}
            </span>
            <span className="flex items-center gap-2.5 rounded-full border border-hair-strong bg-glass px-4.5 py-2.5 text-[13.5px] font-normal text-dim backdrop-blur-md">
              <Icon name="shield" size={15} className="text-brand" />
              {t.studio.credentials.insurance} — {t.studio.credentials.insuranceLicence}
            </span>
            <span className="flex items-center gap-2.5 rounded-full border border-hair-strong bg-glass px-4.5 py-2.5 text-[13.5px] font-normal text-dim backdrop-blur-md">
              <Icon name="pin" size={15} className="text-brand" />
              {t.studio.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

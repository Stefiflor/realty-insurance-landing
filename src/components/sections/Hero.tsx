import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { intentMessage } from "@/lib/domain/whatsapp";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Hero.
 *
 * El collage no es una sola imagen compuesta: son las cuatro fotos del
 * cliente (`casa`, `terreno`, `alquiler`, `firma`) como piezas de grilla
 * reales, cada una recortada en diagonal con `clip-path` y con su propia
 * sombra (`filter: drop-shadow`, que sigue el recorte — un `box-shadow`
 * no lo haría). Los bloques de color detrás de las costuras son divs lisos,
 * no parte de las fotos.
 *
 * `propertyCount` viene de la base: el badge dice cuántos avisos hay de verdad.
 */
export function Hero({ locale, propertyCount }: { locale: Locale; propertyCount: number }) {
  const t = getDictionary(locale);

  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] lg:items-center">
        {/* --- contenido --- */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-14 md:px-10 lg:px-14 lg:py-20">
          <div
            className="animate-rise mb-3 font-mono text-[11px] font-medium tracking-[0.16em] text-faint uppercase"
            style={{ animationDelay: "0.02s" }}
          >
            {t.hero.location}
          </div>

          {/* etiqueta con contador real */}
          <div className="mb-6 inline-flex w-fit flex-wrap items-center gap-x-2.5 gap-y-2 rounded-full border border-hair-strong bg-surface px-3.5 py-2 text-[11.5px] font-medium sm:pr-2 sm:text-[12.5px]">
            <span className="relative flex size-[7px] shrink-0">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-brand" />
              <span className="relative size-[7px] rounded-full bg-brand" />
            </span>
            <span className="text-dim">{t.hero.badge}</span>
            <span className="rounded-full bg-brand-soft px-2.5 py-[3px] font-mono text-[10.5px] font-medium text-brand">
              {propertyCount} {t.hero.badgeCount}
            </span>
          </div>

          {/* título en dos líneas, cada una con su propia máscara */}
          {/*
            El título escala con el viewport en lugar de saltar por breakpoints:
            así nunca queda ni gigante en un teléfono chico ni chico en una
            pantalla ancha. El `clamp` fija el piso y el techo.
          */}
          <div className="mb-1.5 overflow-hidden">
            <h1 className="animate-mask-up m-0 text-[clamp(2.5rem,5.4vw,3.75rem)] leading-[1.05] font-light tracking-[-0.03em] text-ink">
              {t.hero.line1}
            </h1>
          </div>
          <div className="mb-6 overflow-hidden">
            <p
              className="animate-mask-up m-0 bg-[linear-gradient(96deg,var(--brand)_0%,var(--brand-light)_100%)] bg-clip-text font-display text-[clamp(2.625rem,5.8vw,4rem)] leading-[1.1] tracking-[-0.02em] text-transparent"
              style={{ animationDelay: "0.12s" }}
            >
              {t.hero.line2}
            </p>
          </div>

          <div
            className="animate-line-x mb-6 h-0.5 w-[100px] bg-brand"
            style={{ animationDelay: "0.5s" }}
            aria-hidden="true"
          />

          <p
            className="animate-rise m-0 mb-9 max-w-[440px] text-[16px] leading-[1.68] font-light text-dim"
            style={{ animationDelay: "0.3s" }}
          >
            {t.hero.sub}
          </p>

          {/* En móvil los botones ocupan todo el ancho y se apilan: son los dos
              destinos principales y tienen que ser fáciles de tocar. */}
          <div
            className="animate-rise mb-11 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5"
            style={{ animationDelay: "0.4s" }}
          >
            <Button as="a" href="#propiedades" variant="primary" size="lg" className="w-full sm:w-auto">
              {t.hero.ctaPrimary}
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </Button>
            <WhatsappButton
              message={intentMessage("comprar", locale)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              intent="comprar"
              locale={locale}
            >
              {t.hero.ctaSecondary}
            </WhatsappButton>
          </div>

          {/* métricas */}
          <div className="animate-rise flex items-stretch" style={{ animationDelay: "0.5s" }}>
            {[
              { value: String(propertyCount), suffix: "", label: t.hero.stats.properties },
              { value: "3", suffix: "", label: t.hero.stats.years },
              { value: "48", suffix: "h", label: t.hero.stats.response },
            ].map((stat) => (
              <div
                key={stat.label}
                className="mr-5 border-r border-hair pr-5 last:mr-0 last:border-r-0 last:pr-0 sm:mr-9 sm:pr-9"
              >
                <div className="flex items-baseline gap-[3px]">
                  <span className="text-[26px] font-light tracking-[-0.035em] text-ink sm:text-[32px]">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-[15px] font-light text-brand sm:text-[17px]">{stat.suffix}</span>
                  )}
                </div>
                {/* 11px es el piso legible; por debajo el mono en versalitas
                    se vuelve ilegible en pantallas chicas. */}
                <div className="mt-[5px] font-mono text-[11px] tracking-[0.08em] text-faint sm:tracking-[0.1em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- collage de portada --- */}
        <div className="relative px-6 py-10 lg:pt-16 lg:pr-14 lg:pb-16 lg:pl-10 xl:pr-20">
          <div className="relative mx-auto aspect-[9/5] w-full max-w-[600px] lg:max-w-none">
            {/* bloques de acento detrás de las costuras */}
            <div className="absolute top-[9%] left-[1%] z-0 h-[29%] w-[5%] bg-accent" aria-hidden="true" />
            <div
              className="absolute top-[54%] left-[2%] z-0 h-[13%] w-[7%] bg-brand"
              aria-hidden="true"
            />
            <div
              className="absolute top-[25%] right-[1%] z-0 h-[26%] w-[6%] bg-brand"
              aria-hidden="true"
            />
            <div
              className="absolute right-[1%] bottom-0 z-0 h-[20%] w-[6%] bg-accent"
              aria-hidden="true"
            />

            <div className="relative z-10 h-full w-full">
              <div
                className="absolute top-0 left-0 h-[54%] w-[56%] [clip-path:polygon(8%_0,100%_0,84%_100%,0_100%)]"
              >
                <Image
                  src="/hero/casa.png"
                  alt="Casa de estilo patagónico entre bosque y montañas"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute top-0 right-0 h-[54%] w-[52%] [clip-path:polygon(17%_0,100%_0,92%_100%,2%_100%)]"
              >
                <Image
                  src="/hero/terreno.png"
                  alt="Vista de Ushuaia y el Canal Beagle desde la montaña"
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute bottom-0 left-[5%] h-[44%] w-[62%] [clip-path:polygon(6%_0,100%_0,91%_100%,0_100%)]"
              >
                <Image
                  src="/hero/alquiler.png"
                  alt="Habitación con vista al Beagle, estilo hotel fueguino"
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute right-0 bottom-0 h-[44%] w-[39%] [clip-path:polygon(18%_0,100%_0,94%_100%,2%_100%)]"
              >
                <Image
                  src="/hero/firma.png"
                  alt="Firma de documentación de una operación inmobiliaria"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

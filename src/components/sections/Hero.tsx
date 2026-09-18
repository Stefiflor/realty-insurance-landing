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
 * `portada.jpg` ya trae su propio margen marfil a la izquierda (así la diseñó
 * el cliente): por eso el texto va ahí en vez de superponerse a la foto, y la
 * sección comparte el mismo marfil de fondo para que no se note la costura.
 * La columna de texto es angosta a propósito — el pedido fue que la portada
 * se vea grande, así que le cede todo el ancho posible.
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
            <h1
              className="animate-mask-up m-0 text-[clamp(2.5rem,5.4vw,3.75rem)] leading-[1.05] font-light tracking-[-0.03em] text-ink"
            >
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
            className="animate-line-x mb-6 h-0.5 w-[100px] bg-accent"
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
            <Button
              as="a"
              href="#propiedades"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.hero.ctaPrimary}
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </Button>
            <WhatsappButton
              message={intentMessage("comprar", locale)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
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
                    <span className="text-[15px] font-light text-brand sm:text-[17px]">
                      {stat.suffix}
                    </span>
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

        {/* --- collage de portada ---
            Ancho intrínseco + `h-auto`, sin `fill`/`object-contain`: así la
            imagen ocupa exactamente el espacio que le corresponde según su
            proporción real, sin el hueco vacío arriba/abajo que dejaba un
            contenedor más alto que la foto. La sombra le da volumen: no hay
            fotos separadas para sombrear una por una, así que se aplica al
            collage entero, como una lámina apoyada sobre la página. */}
        <div className="relative py-6 lg:py-0">
          <Image
            src="/hero/portada.jpg"
            alt="Casa de estilo patagónico, terreno con vista al Beagle, habitación y firma de documentación"
            width={1672}
            height={724}
            priority
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="h-auto w-full drop-shadow-[0_30px_50px_rgba(23,29,31,0.22)]"
          />

          {/* tarjeta de cobertura, apoyada sobre la esquina de la portada */}
          <div className="absolute bottom-4 left-4 hidden w-[240px] rounded-[5px] border border-hair-strong bg-glass-solid p-4.5 shadow-lg backdrop-blur-sm sm:block lg:bottom-8 lg:left-8">
            <div className="mb-2.5 flex items-center gap-2.5">
              <div className="flex size-[28px] items-center justify-center rounded bg-brand-soft text-brand">
                <Icon name="shield" size={14} />
              </div>
              <div className="font-mono text-[9px] tracking-[0.13em] text-faint">
                {t.hero.floatLabel}
              </div>
            </div>
            <div className="text-[13px] leading-snug font-medium text-ink">{t.hero.floatText}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
 * Portada a pantalla completa: la foto de Ushuaia ocupa todo el fondo, con un
 * degradé oscuro fijo (no depende del tema) para que el texto blanco se lea
 * igual de bien de día o de noche, en modo claro o en modo oscuro.
 *
 * `propertyCount` viene de la base: el badge dice cuántos avisos hay de verdad.
 */
export function Hero({ locale, propertyCount }: { locale: Locale; propertyCount: number }) {
  const t = getDictionary(locale);

  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden lg:h-[780px] lg:min-h-0">
      {/* --- foto de portada --- */}
      <Image
        src="/hero/ushuaia.jpg"
        alt={t.studio.location}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* degradé para legibilidad: oscuro a la izquierda (donde va el texto),
          más claro hacia la derecha para que la foto siga respirando */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,10,12,0.86)_0%,rgba(6,10,12,0.6)_38%,rgba(6,10,12,0.22)_65%,rgba(6,10,12,0.35)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,10,12,0.5)_0%,transparent_22%,transparent_78%,rgba(6,10,12,0.3)_100%)]"
      />

      {/* línea de escaneo */}
      <div
        aria-hidden="true"
        className="animate-scanline absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--scan),transparent)]"
      />

      {/* esquinas técnicas, ahora enmarcando toda la portada */}
      {[
        "top-5 left-5 border-t border-l",
        "top-5 right-5 border-t border-r",
        "bottom-5 left-5 border-b border-l",
        "bottom-5 right-5 border-b border-r",
      ].map((position) => (
        <div key={position} className={`absolute z-10 size-6 border-white/40 ${position}`} aria-hidden="true" />
      ))}

      <div className="absolute bottom-7 left-8 z-10 font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">
        {t.studio.location}
      </div>

      {/* --- contenido --- */}
      <div className="relative z-10 w-full px-6 py-16 md:px-10 lg:px-14 lg:py-0">
        <div className="max-w-[620px]">
          {/* badge con contador real */}
          <div
            className="animate-rise mb-7 inline-flex flex-wrap items-center gap-x-2.5 gap-y-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-2 text-[11.5px] font-medium backdrop-blur-md sm:pr-2 sm:text-[12.5px]"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="relative flex size-[7px] shrink-0">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-brand" />
              <span className="relative size-[7px] rounded-full bg-brand" />
            </span>
            <span className="text-white/80">{t.hero.badge}</span>
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
              className="animate-mask-up m-0 text-[clamp(2.5rem,7vw,4.625rem)] leading-[1.02] font-light tracking-[-0.035em] text-white lg:leading-[0.98]"
              style={{ animationDelay: "0.16s" }}
            >
              {t.hero.line1}
            </h1>
          </div>
          <div className="mb-6 overflow-hidden">
            <p
              className="animate-mask-up m-0 bg-[linear-gradient(96deg,var(--brand)_0%,var(--brand-glow)_100%)] bg-clip-text font-display text-[clamp(2.625rem,7.4vw,4.875rem)] leading-[1.05] tracking-[-0.03em] text-transparent lg:leading-none"
              style={{ animationDelay: "0.3s" }}
            >
              {t.hero.line2}
            </p>
          </div>

          <div
            className="animate-line-x mb-6 h-0.5 w-[120px] bg-[linear-gradient(90deg,var(--brand),transparent)]"
            style={{ animationDelay: "0.62s" }}
            aria-hidden="true"
          />

          <p
            className="animate-rise m-0 mb-9 max-w-[470px] text-[16.5px] leading-[1.68] font-light text-white/80"
            style={{ animationDelay: "0.44s" }}
          >
            {t.hero.sub}
          </p>

          {/* En móvil los botones ocupan todo el ancho y se apilan: son los dos
              destinos principales y tienen que ser fáciles de tocar. */}
          <div
            className="animate-rise mb-11 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5"
            style={{ animationDelay: "0.56s" }}
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
              variant="glass-dark"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.hero.ctaSecondary}
            </WhatsappButton>
          </div>

          {/* métricas */}
          <div className="animate-rise flex items-stretch" style={{ animationDelay: "0.7s" }}>
            {[
              { value: String(propertyCount), suffix: "", label: t.hero.stats.properties },
              { value: "3", suffix: "", label: t.hero.stats.years },
              { value: "48", suffix: "h", label: t.hero.stats.response },
            ].map((stat) => (
              <div
                key={stat.label}
                className="mr-5 border-r border-white/20 pr-5 last:mr-0 last:border-r-0 last:pr-0 sm:mr-9 sm:pr-9"
              >
                <div className="flex items-baseline gap-[3px]">
                  <span className="text-[26px] font-light tracking-[-0.035em] text-white sm:text-[34px]">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-[15px] font-light text-brand sm:text-[18px]">
                      {stat.suffix}
                    </span>
                  )}
                </div>
                {/* 11px es el piso legible; por debajo el mono en versalitas
                    se vuelve ilegible en pantallas chicas. */}
                <div className="mt-[5px] font-mono text-[11px] tracking-[0.08em] text-white/55 sm:tracking-[0.12em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* tarjeta flotante con el dato de cobertura, apoyada sobre la foto.
          Oculta en móvil: ahí el copy ya ocupa toda la pantalla y esta
          tarjeta sería un elemento decorativo más para scrollear. */}
      <div
        className="animate-rise animate-float absolute right-6 bottom-8 z-10 hidden w-[262px] rounded-[5px] border border-hair-strong bg-glass-solid p-5 shadow-xl backdrop-blur-2xl lg:right-14 lg:block"
        style={{ animationDelay: "0.85s" }}
      >
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex size-[30px] items-center justify-center rounded bg-brand-soft text-brand">
            <Icon name="shield" size={15} />
          </div>
          <div className="font-mono text-[9.5px] tracking-[0.14em] text-faint">
            {t.hero.floatLabel}
          </div>
        </div>
        <div className="mb-3 text-[14px] leading-snug font-medium">{t.hero.floatText}</div>
        <div className="h-[3px] overflow-hidden rounded-full bg-hair-strong">
          <div
            className="animate-line-x h-full w-[74%] bg-[linear-gradient(90deg,var(--brand),var(--brand-glow))]"
            style={{ animationDelay: "1.1s" }}
          />
        </div>
      </div>
    </section>
  );
}

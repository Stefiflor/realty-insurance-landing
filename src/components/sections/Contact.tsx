"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { WhatsappGlyph } from "@/components/ui/Icon";
import { whatsappLink, intentMessage, logEnquiry } from "@/lib/domain/whatsapp";
import { ENQUIRY_INTENTS } from "@/lib/domain/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Número formateado, o `null` si todavía no está cargado.
 *
 * Sin número no se muestra el recuadro: un placeholder visible en producción
 * es peor que no mostrar nada. Completar `NEXT_PUBLIC_WHATSAPP_PHONE` en
 * `.env.local` lo activa solo.
 */
function displayPhone(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  if (!raw) return null;

  // Ushuaia y el resto de Tierra del Fuego/Patagonia sur usan código de área
  // de 4 dígitos (29xx) + 6 de abonado, no el 2+8 de Buenos Aires: hay que
  // probar este patrón primero o el corte cae mal (área "29" en vez de "2901").
  const arPatagonia = raw.match(/^54(9)?(29\d{2})(\d{2})(\d{4})$/);
  if (arPatagonia) {
    const [, nine, area, first, second] = arPatagonia;
    return `+54 ${nine ? "9 " : ""}${area} ${first}-${second}`;
  }

  // "5491123456789" -> "+54 9 11 2345-6789" para el resto de los números
  // argentinos (área de 2 a 4 dígitos + 8 de abonado); el resto se muestra
  // con un + adelante y sin más formato.
  const ar = raw.match(/^54(9)?(\d{2,4})(\d{4})(\d{4})$/);
  if (ar) {
    const [, nine, area, first, second] = ar;
    return `+54 ${nine ? "9 " : ""}${area} ${first}-${second}`;
  }
  return `+${raw}`;
}

/**
 * Contacto.
 *
 * No hay formulario: el estudio atiende por WhatsApp. La tarjeta de la derecha
 * es una muestra de conversación —no un chat real— para que se entienda de qué
 * va antes de hacer clic. Los chips de intención abren el chat con distinto
 * mensaje precargado según lo que la persona busca.
 */
export function Contact({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const phone = displayPhone();

  return (
    <section
      id="contacto"
      className="relative scroll-mt-20 bg-band px-6 py-18 md:px-10 lg:px-14 lg:py-26"
    >

      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-20">
        <div>
          <SectionHeading kicker={t.contact.kicker} title={t.contact.title}>
            <p className="mt-4.5 mb-9 max-w-[460px] text-[16.5px] leading-[1.68] font-light text-dim">
              {t.contact.sub}
            </p>
          </SectionHeading>

          {/* chips de intención: cada uno abre el chat con otro mensaje */}
          <div className="flex max-w-[560px] flex-wrap gap-2.5">
            {ENQUIRY_INTENTS.map((intent) => {
              const href = whatsappLink(intentMessage(intent, locale));
              const label = t.contact.intents[intent];
              const className =
                "flex items-center gap-2.5 rounded-full border border-hair-strong bg-glass px-4.5 py-2.5 text-[13.5px] font-normal text-dim backdrop-blur-md transition-all duration-[350ms] ease-(--ease-brand) hover:-translate-y-0.5 hover:border-brand/40 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

              const content = (
                <>
                  <span className="size-[5px] rounded-full bg-brand" aria-hidden="true" />
                  {label}
                </>
              );

              return href ? (
                <a
                  key={intent}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  onClick={() => logEnquiry(intent, locale)}
                >
                  {content}
                </a>
              ) : (
                <span key={intent} className={className}>
                  {content}
                </span>
              );
            })}
          </div>
        </div>

        {/* tarjeta de WhatsApp */}
        <div className="animate-rise relative overflow-hidden rounded-md border border-hair-strong bg-surface p-6 shadow-xl sm:p-9">
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 size-55 rounded-full bg-[radial-gradient(circle,rgb(37_211_102/0.22),transparent_70%)] blur-[60px]"
          />

          <div className="relative">
            <div className="mb-6 flex items-center gap-3.5">
              <div className="relative flex size-11.5 items-center justify-center rounded-full bg-whatsapp text-whatsapp-ink">
                <span
                  aria-hidden="true"
                  className="animate-pulse-ring absolute inset-0 rounded-full bg-whatsapp"
                />
                <WhatsappGlyph size={23} className="relative" />
              </div>
              <div>
                <div className="text-[18px] font-medium tracking-[-0.01em]">
                  {t.contact.waTitle}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-faint">
                  <span className="size-[5px] rounded-full bg-whatsapp" aria-hidden="true" />
                  {t.contact.waStatus}
                </div>
              </div>
            </div>

            {/* conversación de muestra */}
            <div className="mb-6 flex flex-col gap-2.5">
              <div className="max-w-[84%] self-end rounded-[14px_14px_4px_14px] bg-brand-soft px-3.5 py-2.5 text-[14px] leading-normal font-light text-brand">
                {t.contact.waSample.from}
              </div>
              <div className="max-w-[84%] self-start rounded-[14px_14px_14px_4px] bg-hair px-3.5 py-2.5 text-[14px] leading-normal font-light">
                {t.contact.waSample.reply}
              </div>
            </div>

            {phone && (
              <div className="mb-5 rounded-[5px] border border-dashed border-hair-strong px-4.5 py-3.5">
                <div className="mb-1.5 font-mono text-[9.5px] tracking-[0.16em] text-faint">
                  {t.contact.waNumberLabel}
                </div>
                <div className="text-[20px] font-normal tracking-[-0.01em]">{phone}</div>
              </div>
            )}

            <WhatsappButton
              message={intentMessage("comprar", locale)}
              size="lg"
              className="w-full"
              intent="comprar"
              locale={locale}
            >
              {t.contact.waCta}
            </WhatsappButton>

            <div className="mt-3.5 text-center text-[12px] font-light text-faint">
              {t.contact.waNote}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

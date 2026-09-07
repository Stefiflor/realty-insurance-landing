import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Marquesina con los servicios del estudio.
 *
 * La lista va dos veces: la animación desplaza el 50% del ancho, así que
 * cuando termina la primera copia la segunda está justo donde empezó la
 * primera y el bucle no tiene salto.
 */
export function Ticker({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = [...t.ticker, ...t.ticker];

  return (
    <div
      className="relative overflow-hidden border-y border-hair bg-band py-[18px]"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max">
        {items.map((label, i) => (
          <div key={`${label}-${i}`} className="flex items-center gap-4 px-6.5 whitespace-nowrap">
            <span className="size-1 rounded-full bg-brand" />
            <span className="font-mono text-[11.5px] tracking-[0.14em] text-dim">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { formatAmount, formatLocation, formatPeriod, summariseFacts } from "@/lib/domain/format";
import type { Property } from "@/lib/domain/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Gradiente de portada mientras no haya foto.
 *
 * Se elige por el código de la propiedad, no al azar: así una misma propiedad
 * conserva su color entre renders y entre servidor y cliente.
 */
const PLACEHOLDER_GRADIENTS = [
  "from-[#3a5a5d] via-[#25454a] to-[#152a2d]",
  "from-[#8a9a8f] via-[#5f7267] to-[#38443c]",
  "from-[#c2a077] via-[#8f7350] to-[#4f3f2c]",
  "from-[#6d8f92] via-[#456265] to-[#243839]",
];

function gradientFor(code: string): string {
  const sum = [...code].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PLACEHOLDER_GRADIENTS[sum % PLACEHOLDER_GRADIENTS.length];
}

/** Portada: la foto real si existe, un gradiente marcado si todavía no. */
function Cover({
  property,
  placeholder,
  className,
}: {
  property: Property;
  placeholder: string;
  className?: string;
}) {
  const cover = property.images[0];

  if (cover) {
    return (
      // Sin next/image por ahora: las URLs de Supabase Storage necesitan que su
      // host esté declarado en next.config, y eso se hace cuando haya fotos reales.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cover.url}
        alt={cover.alt || property.title}
        className={cn(
          "absolute inset-0 size-full object-cover transition-transform duration-[1100ms] ease-(--ease-brand) group-hover:scale-108",
          className,
        )}
      />
    );
  }

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-transform duration-[1100ms] ease-(--ease-brand) group-hover:scale-108",
          gradientFor(property.code),
          className,
        )}
      />
      <div className="absolute right-3.5 bottom-3 font-mono text-[9.5px] tracking-[0.14em] text-white/50">
        {placeholder}
      </div>
    </>
  );
}

/** Tarjeta en grilla: foto grande arriba, datos abajo. */
export function PropertyCard({
  property,
  locale,
  index = 0,
}: {
  property: Property;
  locale: Locale;
  /** Posición en la lista; escalona la entrada. */
  index?: number;
}) {
  const t = getDictionary(locale);
  const facts = summariseFacts(property, locale);

  return (
    <Link
      href={`/${locale}/propiedades/${property.slug}`}
      className="group animate-rise block overflow-hidden rounded-[5px] border border-hair bg-surface shadow-sm hover:-translate-y-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      style={{ animationDelay: `${0.07 * index}s` }}
    >
      <div className="relative h-58 overflow-hidden">
        <Cover property={property} placeholder={t.properties.photoPlaceholder} />

        {/* velo que aparece al pasar el cursor, para que el ícono se lea */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(0_0_0/0.6)_100%)] opacity-0 transition-opacity duration-[600ms] group-hover:opacity-35"
        />

        {/* esquinas técnicas */}
        <span
          aria-hidden="true"
          className="absolute top-3 left-3 size-3 border-t border-l border-white/85 opacity-50 transition-all duration-500 group-hover:size-5.5 group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 size-3 border-r border-b border-white/85 opacity-50 transition-all duration-500 group-hover:size-5.5 group-hover:opacity-100"
        />

        <Badge tone="glass" mono className="absolute top-3.5 left-7.5">
          {t.properties.kinds[property.kind].toUpperCase()}
        </Badge>

        {property.insuranceSlug && (
          <Badge tone="brand" className="absolute top-3.5 right-3.5">
            <Icon name="shield" size={11} strokeWidth={2.4} />
            {t.properties.insuredBadge}
          </Badge>
        )}

        {/* flecha que entra en diagonal */}
        <span
          aria-hidden="true"
          className="absolute right-3.5 bottom-3.5 flex size-9 translate-x-2.5 translate-y-2.5 items-center justify-center rounded-full bg-white text-[#12181b] opacity-0 transition-all duration-500 ease-(--ease-brand) group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Icon name="arrow-up-right" size={16} strokeWidth={2.2} />
        </span>
      </div>

      <div className="px-5.5 pt-5.5 pb-5">
        <div className="mb-2.5 flex items-baseline justify-between gap-3.5">
          <span className="text-[27px] font-normal tracking-[-0.032em]">
            {formatAmount(property.price, locale)}
          </span>
          <span className="font-mono text-[10px] tracking-[0.1em] text-faint">
            {formatPeriod(property.price, locale)}
          </span>
        </div>

        <div className="mb-1.5 text-[15px]">{property.title}</div>

        <div className="flex items-center gap-1.5 text-[13.5px] font-light text-dim">
          <Icon name="pin" size={13} />
          {formatLocation(property)}
        </div>

        <div className="mt-4.5 flex items-center gap-3.5 border-t border-hair pt-4 font-mono text-[11px] tracking-[0.06em] text-dim">
          {facts.map((fact, i) => (
            <span key={fact} className="flex items-center gap-3.5">
              {i > 0 && <span className="size-[3px] rounded-full bg-faint" aria-hidden="true" />}
              {fact}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

/** Fila en lista: foto a la izquierda, datos y precio a la derecha. */
export function PropertyRow({
  property,
  locale,
  index = 0,
}: {
  property: Property;
  locale: Locale;
  index?: number;
}) {
  const t = getDictionary(locale);
  const facts = summariseFacts(property, locale);

  return (
    <Link
      href={`/${locale}/propiedades/${property.slug}`}
      className="group animate-rise flex flex-col overflow-hidden rounded-[5px] border border-hair bg-surface shadow-sm hover:-translate-y-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-row sm:gap-6.5"
      style={{ animationDelay: `${0.07 * index}s` }}
    >
      {/* En móvil la foto va arriba a lo ancho; desde `sm` pasa al costado. */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-48.5 sm:w-60 lg:w-75">
        <Cover property={property} placeholder={t.properties.photoPlaceholder} />
        <Badge tone="glass" mono className="absolute top-3 left-3">
          {t.properties.kinds[property.kind].toUpperCase()}
        </Badge>
      </div>

      <div className="flex grow flex-col justify-between gap-5 p-5.5 sm:flex-row sm:items-center sm:gap-6 sm:py-6 sm:pr-6.5 sm:pl-0">
        <div>
          {property.insuranceSlug && (
            <Badge tone="neutral" className="mb-3.5">
              <Icon name="shield" size={11} strokeWidth={2.4} />
              {t.properties.insuredBadge}
            </Badge>
          )}
          <div className="mb-2 text-[22px] font-normal tracking-[-0.028em] lg:text-[27px]">
            {property.title}
          </div>
          <div className="mb-4.5 text-[14px] font-light text-dim">{formatLocation(property)}</div>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-[11px] tracking-[0.06em] text-dim">
            {facts.map((fact, i) => (
              <span key={fact} className="flex items-center gap-3.5">
                {i > 0 && (
                  <span
                    className="hidden size-[3px] rounded-full bg-faint sm:block"
                    aria-hidden="true"
                  />
                )}
                {fact}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-hair pt-4 sm:border-t-0 sm:pt-0 sm:text-right">
          <div className="text-[28px] font-light tracking-[-0.038em] lg:text-[34px]">
            {formatAmount(property.price, locale)}
          </div>
          <div className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-faint">
            {formatPeriod(property.price, locale)}
          </div>
        </div>
      </div>
    </Link>
  );
}

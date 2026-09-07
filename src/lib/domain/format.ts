import type { Locale, Price, Property, PropertyFacts } from "./types";

/** Etiquetas locales de Intl por idioma del sitio. */
const INTL_LOCALE: Record<Locale, string> = {
  es: "es-AR",
  en: "en-US",
  pt: "pt-BR",
};

/**
 * Formatea un importe sin decimales — los precios inmobiliarios son redondos y
 * los centavos sólo agregan ruido visual.
 */
export function formatAmount(price: Price, locale: Locale): string {
  const symbol = price.currency === "USD" ? "USD" : "$";
  const n = new Intl.NumberFormat(INTL_LOCALE[locale], {
    maximumFractionDigits: 0,
  }).format(price.amount);
  return `${symbol} ${n}`;
}

const PERIOD_LABEL: Record<Locale, Record<Price["period"], string>> = {
  es: { unico: "VALOR DE LISTA", mes: "POR MES", noche: "POR NOCHE" },
  en: { unico: "LIST PRICE", mes: "PER MONTH", noche: "PER NIGHT" },
  pt: { unico: "VALOR DE LISTA", mes: "POR MÊS", noche: "POR NOITE" },
};

/** Leyenda en versalitas que acompaña al precio. */
export function formatPeriod(price: Price, locale: Locale): string {
  return PERIOD_LABEL[locale][price.period];
}

const AREA_UNIT: Record<NonNullable<PropertyFacts["areaUnit"]>, string> = {
  m2: "m²",
  ha: "ha",
};

/**
 * Devuelve las tres cifras que la tarjeta muestra bajo el título.
 * El orden es deliberado: primero lo que define el tipo de propiedad
 * (ambientes o superficie), después el tamaño, después el diferencial.
 */
export function summariseFacts(property: Property, locale: Locale): string[] {
  const { facts } = property;
  const out: string[] = [];

  const roomWord = { es: "amb", en: "rooms", pt: "amb" }[locale];
  const bedWord = { es: "dorm", en: "bed", pt: "quartos" }[locale];

  if (facts.rooms) out.push(`${facts.rooms} ${roomWord}`);
  else if (facts.bedrooms) out.push(`${facts.bedrooms} ${bedWord}`);

  const area = facts.coveredArea ?? facts.totalArea;
  if (area) out.push(`${area} ${AREA_UNIT[facts.areaUnit ?? "m2"]}`);

  out.push(...facts.highlights);

  return out.slice(0, 3);
}

/** Ubicación en una línea: "Palermo Soho, CABA". */
export function formatLocation(property: Property): string {
  const { neighbourhood, city } = property.location;
  return neighbourhood ? `${neighbourhood}, ${city}` : city;
}

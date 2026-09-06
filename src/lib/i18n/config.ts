import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/domain/types";

export { DEFAULT_LOCALE, LOCALES };
export type { Locale };

/** Nombre de cada idioma en su propio idioma, para el selector del nav. */
export const LOCALE_LABEL: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

/** Etiqueta `lang` del HTML, con región, para lectores de pantalla y SEO. */
export const HTML_LANG: Record<Locale, string> = {
  es: "es-AR",
  en: "en",
  pt: "pt-BR",
};

/** Type guard: ¿este string es uno de nuestros idiomas? */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Reemplaza el idioma en una ruta ya localizada.
 * `/es/propiedades` + `en` -> `/en/propiedades`
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  // segments[0] es "" porque la ruta arranca con "/"
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/");
  }
  return `/${next}${pathname}`;
}

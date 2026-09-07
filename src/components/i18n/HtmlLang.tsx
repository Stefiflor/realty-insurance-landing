"use client";

import { useEffect } from "react";
import { HTML_LANG, type Locale } from "@/lib/i18n/config";

/**
 * Sincroniza el atributo `lang` del `<html>` con el idioma de la ruta.
 *
 * El layout raíz no conoce el idioma (está fuera de `[locale]`), así que se
 * ajusta desde el cliente. No afecta al SEO —los buscadores leen el `hreflang`
 * de la metadata— pero sí a los lectores de pantalla, que eligen la voz según
 * este atributo.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);

  return null;
}

import { formatAmount } from "./format";
import { createClientBrowser, isSupabaseConfigured } from "@/lib/db/browser-client";
import type { EnquiryIntent, Locale, Property } from "./types";

/**
 * WhatsApp es el único canal de contacto del sitio: no hay formulario. Cada
 * botón abre un chat con un mensaje ya escrito, para que la persona sólo tenga
 * que apretar enviar y el estudio reciba el contexto de dónde salió la consulta.
 */

/** Número del estudio en formato internacional sin `+` ni separadores. */
const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";

const INTENT_MESSAGE: Record<Locale, Record<EnquiryIntent, string>> = {
  es: {
    comprar: "Hola, estoy buscando una propiedad para comprar.",
    alquilar: "Hola, estoy buscando una propiedad para alquilar.",
    terreno: "Hola, me interesa consultar por un terreno.",
    seguro: "Hola, quisiera cotizar un seguro.",
    tasar: "Hola, quisiera tasar una propiedad.",
  },
  en: {
    comprar: "Hi, I'm looking to buy a property.",
    alquilar: "Hi, I'm looking to rent a property.",
    terreno: "Hi, I'd like to ask about a plot of land.",
    seguro: "Hi, I'd like a quote for insurance.",
    tasar: "Hi, I'd like to get a property valued.",
  },
  pt: {
    comprar: "Olá, estou procurando um imóvel para comprar.",
    alquilar: "Olá, estou procurando um imóvel para alugar.",
    terreno: "Olá, gostaria de consultar sobre um terreno.",
    seguro: "Olá, gostaria de cotar um seguro.",
    tasar: "Olá, gostaria de avaliar um imóvel.",
  },
};

const ABOUT_PROPERTY: Record<Locale, string> = {
  es: "Hola, me interesa esta propiedad:",
  en: "Hi, I'm interested in this property:",
  pt: "Olá, tenho interesse neste imóvel:",
};

/**
 * Mensaje precargado para una consulta general, según la intención elegida
 * (los chips de la sección de contacto).
 */
export function intentMessage(intent: EnquiryIntent, locale: Locale): string {
  return INTENT_MESSAGE[locale][intent];
}

/**
 * Mensaje precargado desde la ficha de una propiedad. Incluye el código para
 * que el estudio sepa de cuál se trata sin tener que preguntar.
 */
export function propertyMessage(property: Property, locale: Locale): string {
  const price = formatAmount(property.price, locale);
  return [
    ABOUT_PROPERTY[locale],
    "",
    `${property.code} — ${property.title}`,
    price,
  ].join("\n");
}

/**
 * Arma el enlace de WhatsApp. Devuelve `null` si no hay número configurado,
 * para que quien llame decida si esconde el botón o muestra un placeholder;
 * un enlace roto es peor que ningún enlace.
 */
export function whatsappLink(message: string): string | null {
  if (!PHONE) return null;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

/** `true` cuando el número está configurado y los botones pueden abrir el chat. */
export const hasWhatsapp = Boolean(PHONE);

/**
 * Registra el clic en la tabla `enquiries`, para saber qué intención y qué
 * propiedad generan consultas. Se llama desde el `onClick` de los botones de
 * WhatsApp, siempre antes de que se abra el chat — nunca lo bloquea: si esto
 * falla (sin Supabase configurado, sin conexión), el botón igual funciona.
 */
export function logEnquiry(intent: EnquiryIntent, locale: Locale, propertyId?: string | null) {
  if (!isSupabaseConfigured) return;
  try {
    const supabase = createClientBrowser();
    void supabase.from("enquiries").insert({
      intent,
      locale,
      property_id: propertyId ?? null,
    });
  } catch {
    // Ver comentario de arriba: un botón de WhatsApp roto es peor que una
    // consulta sin registrar.
  }
}

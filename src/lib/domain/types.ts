/**
 * Tipos del dominio de MD Estudio Inmobiliario.
 *
 * Estos tipos son la fuente de verdad de la aplicación: los componentes y las
 * consultas a Supabase se escriben contra ellos, nunca contra la forma cruda de
 * las filas de la base. El mapeo fila -> dominio vive en `src/lib/db/mappers.ts`.
 */

/** Las cuatro operaciones que ofrece el estudio. */
export const OPERATIONS = ["venta", "alquiler", "terreno", "temporario"] as const;
export type Operation = (typeof OPERATIONS)[number];

/** Tipo de inmueble. `lote` y `campo` sólo aplican a la operación `terreno`. */
export const PROPERTY_KINDS = [
  "casa",
  "departamento",
  "ph",
  "estudio",
  "lote",
  "campo",
  "cabana",
  "local",
  "oficina",
] as const;
export type PropertyKind = (typeof PROPERTY_KINDS)[number];

/** Ciclo de vida de un aviso. Sólo `publicado` es visible al público. */
export const LISTING_STATES = ["publicado", "revision", "borrador", "pausado"] as const;
export type ListingState = (typeof LISTING_STATES)[number];

/** Monedas con las que opera el estudio. */
export type Currency = "ARS" | "USD";

/**
 * Cada cuánto se paga el precio. Determina cómo se muestra:
 * `unico` es un valor de lista (venta), el resto es recurrente.
 */
export type PricePeriod = "unico" | "mes" | "noche";

export interface Price {
  amount: number;
  currency: Currency;
  period: PricePeriod;
}

/** Ubicación. `lat`/`lng` son opcionales: no toda propiedad se geolocaliza. */
export interface Location {
  neighbourhood: string;
  city: string;
  province: string;
  lat?: number;
  lng?: number;
}

/**
 * Las tres cifras que se muestran en la tarjeta de una propiedad.
 * Varían según el tipo: un lote no tiene ambientes pero sí superficie.
 */
export interface PropertyFacts {
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  /** Superficie cubierta en m². */
  coveredArea?: number;
  /** Superficie total del terreno en m² (o hectáreas si `areaUnit` es `ha`). */
  totalArea?: number;
  areaUnit?: "m2" | "ha";
  floor?: number;
  hasParking?: boolean;
  /** Rasgos sueltos que se listan tal cual: "Pileta", "Terraza", "Wi-Fi". */
  highlights: string[];
}

export interface PropertyImage {
  url: string;
  alt: string;
  /** Orden de aparición en la galería; 0 es la portada. */
  position: number;
}

/**
 * Una propiedad publicada. `insurance` es el diferencial del estudio: indica
 * qué cobertura se ofrece junto con esta operación, o `null` si todavía no se
 * asignó ninguna.
 */
export interface Property {
  id: string;
  /** Código visible al cliente, ej. "MD-1042". Único. */
  code: string;
  slug: string;
  title: string;
  description: string;
  operation: Operation;
  kind: PropertyKind;
  state: ListingState;
  price: Price;
  location: Location;
  facts: PropertyFacts;
  images: PropertyImage[];
  /** Slug del producto de seguro asociado, o `null` si no tiene. */
  insuranceSlug: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Familias de cobertura que ofrece el estudio. */
export const INSURANCE_KINDS = ["hogar", "garantia", "responsabilidad", "construccion"] as const;
export type InsuranceKind = (typeof INSURANCE_KINDS)[number];

export interface InsuranceProduct {
  id: string;
  slug: string;
  kind: InsuranceKind;
  name: string;
  description: string;
  /** Línea corta en versalitas, ej. "APROBACIÓN EN 48 H". */
  detail: string;
  /** Aseguradoras con las que se cotiza este producto. */
  carriers: string[];
  position: number;
}

/** Motivo por el que alguien escribe. Define el mensaje precargado de WhatsApp. */
export const ENQUIRY_INTENTS = ["comprar", "alquilar", "terreno", "seguro", "tasar"] as const;
export type EnquiryIntent = (typeof ENQUIRY_INTENTS)[number];

/**
 * Una consulta entrante. Todo el contacto es por WhatsApp, así que esto registra
 * el clic (con qué intención y desde qué propiedad) más que un mensaje recibido.
 */
export interface Enquiry {
  id: string;
  intent: EnquiryIntent;
  /** Propiedad desde la que se originó, si la consulta salió de una ficha. */
  propertyId: string | null;
  locale: Locale;
  createdAt: string;
}

/** Idiomas del sitio. `es` es el idioma por defecto y el de referencia. */
export const LOCALES = ["es", "en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Filtros del buscador. Todo es opcional: sin filtros se listan todas. */
export interface PropertyFilters {
  operation?: Operation;
  kind?: PropertyKind;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  /** Sólo propiedades con cobertura asignada. */
  insuredOnly?: boolean;
}

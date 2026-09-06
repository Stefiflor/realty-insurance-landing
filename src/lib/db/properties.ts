import { createClient, isSupabaseConfigured } from "./client";
import { INSURANCE_FIXTURES, PROPERTY_FIXTURES } from "./fixtures";
import {
  mapInsuranceProduct,
  mapProperty,
  PROPERTY_SELECT,
  type InsuranceProductRow,
  type PropertyRow,
} from "./mappers";
import type {
  InsuranceProduct,
  Property,
  PropertyFilters,
} from "@/lib/domain/types";

/**
 * Capa de acceso a datos.
 *
 * Los componentes llaman a estas funciones y nunca a Supabase directamente.
 * Mientras no haya credenciales configuradas devuelven las fixtures locales,
 * así el sitio siempre renderiza algo y el diseño se puede trabajar sin base.
 */

/** Aplica los filtros del buscador a un arreglo en memoria (modo fixtures). */
function filterLocally(list: Property[], filters: PropertyFilters): Property[] {
  return list.filter((p) => {
    if (filters.operation && p.operation !== filters.operation) return false;
    if (filters.kind && p.kind !== filters.kind) return false;
    if (filters.city && p.location.city !== filters.city) return false;
    if (filters.insuredOnly && !p.insuranceSlug) return false;
    if (filters.currency && p.price.currency !== filters.currency) return false;
    if (filters.minPrice != null && p.price.amount < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price.amount > filters.maxPrice) return false;
    return true;
  });
}

/** Propiedades publicadas que cumplen los filtros, más recientes primero. */
export async function listProperties(
  filters: PropertyFilters = {},
  limit = 24,
): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    const published = PROPERTY_FIXTURES.filter((p) => p.state === "publicado");
    return filterLocally(published, filters).slice(0, limit);
  }

  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("state", "publicado")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.operation) query = query.eq("operation", filters.operation);
  if (filters.kind) query = query.eq("kind", filters.kind);
  if (filters.city) query = query.eq("city", filters.city);
  if (filters.currency) query = query.eq("price_currency", filters.currency);
  if (filters.minPrice != null) query = query.gte("price_amount", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price_amount", filters.maxPrice);
  if (filters.insuredOnly) query = query.not("insurance_product_id", "is", null);

  const { data, error } = await query;
  if (error) throw new Error(`No se pudieron leer las propiedades: ${error.message}`);

  return (data as unknown as PropertyRow[]).map(mapProperty);
}

/** Las destacadas de una operación, para la home. */
export async function listFeatured(
  operation: Property["operation"],
  limit = 3,
): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    return PROPERTY_FIXTURES.filter(
      (p) => p.state === "publicado" && p.featured && p.operation === operation,
    ).slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("state", "publicado")
    .eq("featured", true)
    .eq("operation", operation)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`No se pudieron leer las destacadas: ${error.message}`);
  return (data as unknown as PropertyRow[]).map(mapProperty);
}

/** Una propiedad por su slug, o `null` si no existe o no está publicada. */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    return (
      PROPERTY_FIXTURES.find((p) => p.slug === slug && p.state === "publicado") ?? null
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("slug", slug)
    .eq("state", "publicado")
    .maybeSingle();

  if (error) throw new Error(`No se pudo leer la propiedad: ${error.message}`);
  return data ? mapProperty(data as unknown as PropertyRow) : null;
}

/**
 * Propiedades parecidas a una dada, para el pie de la ficha.
 *
 * "Parecida" es: misma operación, distinta propiedad. Se prefieren las de la
 * misma ciudad, y si no alcanzan se completa con otras de la misma operación —
 * mostrar tres opciones siempre es mejor que mostrar una sola por ser estrictos.
 */
export async function listSimilar(property: Property, limit = 3): Promise<Property[]> {
  const pick = (candidates: Property[]) => {
    const sameCity = candidates.filter((p) => p.location.city === property.location.city);
    const rest = candidates.filter((p) => p.location.city !== property.location.city);
    return [...sameCity, ...rest].slice(0, limit);
  };

  if (!isSupabaseConfigured) {
    return pick(
      PROPERTY_FIXTURES.filter(
        (p) =>
          p.state === "publicado" &&
          p.operation === property.operation &&
          p.id !== property.id,
      ),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("state", "publicado")
    .eq("operation", property.operation)
    .neq("id", property.id)
    // Se piden de más para poder priorizar por ciudad en memoria.
    .limit(limit * 4);

  if (error) throw new Error(`No se pudieron leer las similares: ${error.message}`);
  return pick((data as unknown as PropertyRow[]).map(mapProperty));
}

/** Todos los slugs publicados, para prerenderizar las fichas en el build. */
export async function listPublishedSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return PROPERTY_FIXTURES.filter((p) => p.state === "publicado").map((p) => p.slug);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("slug")
    .eq("state", "publicado");

  if (error) throw new Error(`No se pudieron leer los slugs: ${error.message}`);
  return (data as { slug: string }[]).map((row) => row.slug);
}

/** Una cobertura por su slug, para mostrarla en la ficha de la propiedad. */
export async function getInsuranceBySlug(slug: string): Promise<InsuranceProduct | null> {
  if (!isSupabaseConfigured) {
    return INSURANCE_FIXTURES.find((p) => p.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insurance_products")
    .select("id, slug, kind, name, description, detail, carriers, position")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`No se pudo leer la cobertura: ${error.message}`);
  return data ? mapInsuranceProduct(data as InsuranceProductRow) : null;
}

/** Catálogo de coberturas, en el orden en que se muestran. */
export async function listInsuranceProducts(): Promise<InsuranceProduct[]> {
  if (!isSupabaseConfigured) {
    return INSURANCE_FIXTURES.slice().sort((a, b) => a.position - b.position);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insurance_products")
    .select("id, slug, kind, name, description, detail, carriers, position")
    .order("position", { ascending: true });

  if (error) throw new Error(`No se pudieron leer los seguros: ${error.message}`);
  return (data as InsuranceProductRow[]).map(mapInsuranceProduct);
}

/** Cuántos avisos publicados hay en total; alimenta el contador del hero. */
export async function countPublished(): Promise<number> {
  if (!isSupabaseConfigured) {
    return PROPERTY_FIXTURES.filter((p) => p.state === "publicado").length;
  }

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("state", "publicado");

  if (error) throw new Error(`No se pudo contar las propiedades: ${error.message}`);
  return count ?? 0;
}

import {
  DEFAULT_SORT,
  OPERATIONS,
  PROPERTY_KINDS,
  SORT_OPTIONS,
  type Operation,
  type PropertyFilters,
  type PropertyKind,
  type SortOption,
} from "./types";

/**
 * Traducción entre los filtros y la barra de direcciones.
 *
 * Los filtros viven en la URL, no en el estado de React. Eso hace que una
 * búsqueda se pueda compartir por WhatsApp, guardar en favoritos y volver atrás
 * con el botón del navegador — cosas que la gente espera de un buscador de
 * propiedades y que un estado interno rompe.
 *
 * Todo valor que no reconocemos se descarta en silencio: la URL la escribe
 * cualquiera y no puede romper la página.
 */

/** Nombres de los parámetros. Cambiarlos invalida los enlaces ya compartidos. */
export const FILTER_KEYS = {
  operation: "operacion",
  kind: "tipo",
  city: "ciudad",
  maxPrice: "hasta",
  insuredOnly: "seguro",
  sort: "orden",
} as const;

type SearchParams = Record<string, string | string[] | undefined>;

/** Toma el primer valor cuando el parámetro viene repetido en la URL. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Lee los filtros de los parámetros de una URL. */
export function parseFilters(params: SearchParams): PropertyFilters {
  const filters: PropertyFilters = {};

  const operation = first(params[FILTER_KEYS.operation]);
  if (operation && (OPERATIONS as readonly string[]).includes(operation)) {
    filters.operation = operation as Operation;
  }

  const kind = first(params[FILTER_KEYS.kind]);
  if (kind && (PROPERTY_KINDS as readonly string[]).includes(kind)) {
    filters.kind = kind as PropertyKind;
  }

  const city = first(params[FILTER_KEYS.city]);
  if (city) filters.city = city;

  const maxPrice = Number(first(params[FILTER_KEYS.maxPrice]));
  if (Number.isFinite(maxPrice) && maxPrice > 0) filters.maxPrice = maxPrice;

  if (first(params[FILTER_KEYS.insuredOnly]) === "1") filters.insuredOnly = true;

  const sort = first(params[FILTER_KEYS.sort]);
  if (sort && (SORT_OPTIONS as readonly string[]).includes(sort)) {
    filters.sort = sort as SortOption;
  }

  return filters;
}

/**
 * Escribe los filtros como query string.
 *
 * Los valores vacíos y los que ya son el default no se escriben, para que la
 * URL quede corta y legible: `?operacion=alquiler` en vez de arrastrar seis
 * parámetros con sus valores por defecto.
 */
export function buildQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();

  if (filters.operation) params.set(FILTER_KEYS.operation, filters.operation);
  if (filters.kind) params.set(FILTER_KEYS.kind, filters.kind);
  if (filters.city) params.set(FILTER_KEYS.city, filters.city);
  if (filters.maxPrice) params.set(FILTER_KEYS.maxPrice, String(filters.maxPrice));
  if (filters.insuredOnly) params.set(FILTER_KEYS.insuredOnly, "1");
  if (filters.sort && filters.sort !== DEFAULT_SORT) {
    params.set(FILTER_KEYS.sort, filters.sort);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

/** `true` si hay algún filtro puesto (el orden no cuenta como filtro). */
export function hasActiveFilters(filters: PropertyFilters): boolean {
  return Boolean(
    filters.operation ||
      filters.kind ||
      filters.city ||
      filters.maxPrice ||
      filters.insuredOnly,
  );
}

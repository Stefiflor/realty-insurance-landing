import type {
  InsuranceProduct,
  Property,
  PropertyImage,
} from "@/lib/domain/types";

/**
 * Traducción fila de Supabase -> objeto de dominio.
 *
 * Todo lo que sale de la base pasa por acá. Los componentes nunca ven
 * `covered_area` ni `price_amount`: ven `facts.coveredArea` y `price.amount`.
 * Cambiar un nombre de columna se arregla en este archivo y en ningún otro.
 */

/** Fila cruda de `properties`, con el join a imágenes y al producto de seguro. */
export interface PropertyRow {
  id: string;
  code: string;
  slug: string;
  title: string;
  description: string;
  operation: Property["operation"];
  kind: Property["kind"];
  state: Property["state"];
  price_amount: number;
  price_currency: Property["price"]["currency"];
  price_period: Property["price"]["period"];
  neighbourhood: string;
  city: string;
  province: string;
  lat: number | null;
  lng: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  covered_area: number | null;
  total_area: number | null;
  area_unit: "m2" | "ha" | null;
  floor: number | null;
  has_parking: boolean;
  highlights: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImageRow[] | null;
  insurance_products?: { slug: string } | null;
}

export interface PropertyImageRow {
  path: string;
  alt: string;
  position: number;
}

export interface InsuranceProductRow {
  id: string;
  slug: string;
  kind: InsuranceProduct["kind"];
  name: string;
  description: string;
  detail: string;
  carriers: string[];
  position: number;
}

/** Bucket de storage donde viven las fotos de las propiedades. */
const IMAGE_BUCKET = "property-images";

/**
 * Convierte una ruta de storage en URL pública. La base guarda rutas, no URLs,
 * para que mover el bucket no obligue a migrar filas.
 */
function imageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  return `${base}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

function mapImage(row: PropertyImageRow): PropertyImage {
  return {
    url: imageUrl(row.path),
    alt: row.alt,
    position: row.position,
  };
}

export function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    code: row.code,
    slug: row.slug,
    title: row.title,
    description: row.description,
    operation: row.operation,
    kind: row.kind,
    state: row.state,
    price: {
      amount: Number(row.price_amount),
      currency: row.price_currency,
      period: row.price_period,
    },
    location: {
      neighbourhood: row.neighbourhood,
      city: row.city,
      province: row.province,
      lat: row.lat ?? undefined,
      lng: row.lng ?? undefined,
    },
    facts: {
      rooms: row.rooms ?? undefined,
      bedrooms: row.bedrooms ?? undefined,
      bathrooms: row.bathrooms ?? undefined,
      coveredArea: row.covered_area ? Number(row.covered_area) : undefined,
      totalArea: row.total_area ? Number(row.total_area) : undefined,
      areaUnit: row.area_unit ?? undefined,
      floor: row.floor ?? undefined,
      hasParking: row.has_parking,
      highlights: row.highlights ?? [],
    },
    images: (row.property_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(mapImage),
    insuranceSlug: row.insurance_products?.slug ?? null,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapInsuranceProduct(row: InsuranceProductRow): InsuranceProduct {
  return {
    id: row.id,
    slug: row.slug,
    kind: row.kind,
    name: row.name,
    description: row.description,
    detail: row.detail,
    carriers: row.carriers ?? [],
    position: row.position,
  };
}

/** Columnas que pide la consulta pública de propiedades, con sus joins. */
export const PROPERTY_SELECT = `
  id, code, slug, title, description, operation, kind, state,
  price_amount, price_currency, price_period,
  neighbourhood, city, province, lat, lng,
  rooms, bedrooms, bathrooms, covered_area, total_area, area_unit,
  floor, has_parking, highlights,
  featured, created_at, updated_at,
  property_images ( path, alt, position ),
  insurance_products ( slug )
`;

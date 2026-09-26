import { createClient } from "./client";
import {
  mapProperty,
  PROPERTY_SELECT,
  type InsuranceProductRow,
  type PropertyRow,
} from "./mappers";
import type {
  Currency,
  Enquiry,
  EnquiryIntent,
  InsuranceKind,
  ListingState,
  Locale,
  Operation,
  Property,
  PropertyKind,
  PropertyImage,
  PricePeriod,
} from "@/lib/domain/types";

/**
 * Capa de datos del panel de administración.
 *
 * A diferencia de `properties.ts` (lectura pública, cae a fixtures), estas
 * funciones asumen que hay sesión y que Supabase está configurado — no tienen
 * sentido sin eso. Las llaman las Server Actions de `src/app/admin/**`, nunca
 * un componente directamente.
 */

const IMAGE_BUCKET = "property-images";

// --- propiedades --------------------------------------------------------------

/** Todas las propiedades sin importar su estado, para el listado del panel. */
export async function listAllProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`No se pudieron leer las propiedades: ${error.message}`);
  return (data as unknown as PropertyRow[]).map(mapProperty);
}

/** Una propiedad por `id` (no por slug, y sin filtrar por estado). */
export async function getPropertyForEdit(id: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`No se pudo leer la propiedad: ${error.message}`);
  return data ? mapProperty(data as unknown as PropertyRow) : null;
}

/** Forma plana que entiende el formulario; se traduce a columnas acá adentro. */
export interface PropertyInput {
  code: string;
  slug: string;
  title: string;
  description: string;
  operation: Operation;
  kind: PropertyKind;
  state: ListingState;
  priceAmount: number;
  priceCurrency: Currency;
  pricePeriod: PricePeriod;
  neighbourhood: string;
  city: string;
  province: string;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  coveredArea: number | null;
  totalArea: number | null;
  areaUnit: "m2" | "ha" | null;
  floor: number | null;
  hasParking: boolean;
  highlights: string[];
  insuranceProductId: string | null;
  featured: boolean;
}

function toRow(input: PropertyInput) {
  return {
    code: input.code,
    slug: input.slug,
    title: input.title,
    description: input.description,
    operation: input.operation,
    kind: input.kind,
    state: input.state,
    price_amount: input.priceAmount,
    price_currency: input.priceCurrency,
    price_period: input.pricePeriod,
    neighbourhood: input.neighbourhood,
    city: input.city,
    province: input.province,
    rooms: input.rooms,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    covered_area: input.coveredArea,
    total_area: input.totalArea,
    area_unit: input.areaUnit,
    floor: input.floor,
    has_parking: input.hasParking,
    highlights: input.highlights,
    insurance_product_id: input.insuranceProductId,
    featured: input.featured,
  };
}

/** Crea una propiedad y devuelve su `id`. */
export async function createProperty(input: PropertyInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .insert(toRow(input))
    .select("id")
    .single();

  if (error) throw new Error(`No se pudo crear la propiedad: ${error.message}`);
  return (data as { id: string }).id;
}

export async function updateProperty(id: string, input: PropertyInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("properties").update(toRow(input)).eq("id", id);
  if (error) throw new Error(`No se pudo guardar la propiedad: ${error.message}`);
}

/**
 * Borra la propiedad. La política RLS ya exige rol admin; esto además borra
 * las fotos del bucket, porque `on delete cascade` limpia la tabla pero no
 * los archivos de storage.
 */
export async function deleteProperty(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("property_images")
    .select("path")
    .eq("property_id", id);

  if (images && images.length > 0) {
    await supabase.storage.from(IMAGE_BUCKET).remove(images.map((i) => i.path as string));
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(`No se pudo borrar la propiedad: ${error.message}`);
}

// --- fotos ---------------------------------------------------------------------

/**
 * `PropertyImage` (el tipo público, en `domain/types.ts`) no lleva el `id` de
 * fila ni el `path` de storage — el sitio público sólo necesita mostrar la
 * foto. El panel sí necesita ambos para poder borrarla, por eso esta versión
 * ampliada vive acá y no ahí.
 */
export interface AdminPropertyImage extends PropertyImage {
  id: string;
  path: string;
}

function imageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

/** Fotos de una propiedad, en orden, para la pantalla de edición. */
export async function listPropertyImages(propertyId: string): Promise<AdminPropertyImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_images")
    .select("id, path, alt, position")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });

  if (error) throw new Error(`No se pudieron leer las fotos: ${error.message}`);
  return (data as Array<{ id: string; path: string; alt: string; position: number }>).map(
    (row) => ({
      id: row.id,
      path: row.path,
      alt: row.alt,
      position: row.position,
      url: imageUrl(row.path),
    }),
  );
}

/** Sube un archivo al bucket y crea su fila en `property_images`. */
export async function addPropertyImage(
  propertyId: string,
  file: File,
  position: number,
): Promise<AdminPropertyImage> {
  const supabase = await createClient();

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${propertyId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(`No se pudo subir la foto: ${uploadError.message}`);

  const { data, error } = await supabase
    .from("property_images")
    .insert({ property_id: propertyId, path, position, alt: "" })
    .select("id, path, alt, position")
    .single();
  if (error) throw new Error(`No se pudo guardar la foto: ${error.message}`);

  return { id: data.id, path: data.path, alt: data.alt, position: data.position, url: imageUrl(data.path) };
}

export async function removePropertyImage(imageId: string, path: string): Promise<void> {
  const supabase = await createClient();
  await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  const { error } = await supabase.from("property_images").delete().eq("id", imageId);
  if (error) throw new Error(`No se pudo borrar la foto: ${error.message}`);
}

// --- seguros ---------------------------------------------------------------------

export interface InsuranceInput {
  slug: string;
  kind: InsuranceKind;
  name: string;
  description: string;
  detail: string;
  carriers: string[];
  position: number;
}

export async function createInsuranceProduct(input: InsuranceInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("insurance_products").insert(input);
  if (error) throw new Error(`No se pudo crear la cobertura: ${error.message}`);
}

export async function updateInsuranceProduct(id: string, input: InsuranceInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("insurance_products").update(input).eq("id", id);
  if (error) throw new Error(`No se pudo guardar la cobertura: ${error.message}`);
}

export async function deleteInsuranceProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("insurance_products").delete().eq("id", id);
  if (error) throw new Error(`No se pudo borrar la cobertura: ${error.message}`);
}

export async function getInsuranceForEdit(
  id: string,
): Promise<(InsuranceInput & { id: string }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insurance_products")
    .select("id, slug, kind, name, description, detail, carriers, position")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`No se pudo leer la cobertura: ${error.message}`);
  if (!data) return null;
  const row = data as InsuranceProductRow;
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

// --- consultas -------------------------------------------------------------------

export interface EnquiryRow extends Enquiry {
  property: { title: string; code: string } | null;
}

/** Consultas recibidas, más recientes primero, con el título del aviso si vino de uno. */
export async function listEnquiries(limit = 100): Promise<EnquiryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("id, intent, property_id, locale, created_at, properties ( title, code )")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`No se pudieron leer las consultas: ${error.message}`);

  return (
    data as unknown as Array<{
      id: string;
      intent: EnquiryIntent;
      property_id: string | null;
      locale: Locale;
      created_at: string;
      properties: { title: string; code: string } | null;
    }>
  ).map((row) => ({
    id: row.id,
    intent: row.intent,
    propertyId: row.property_id,
    locale: row.locale,
    createdAt: row.created_at,
    property: row.properties,
  }));
}

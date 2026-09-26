"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireStaff } from "@/lib/auth/session";
import {
  addPropertyImage,
  createProperty,
  deleteProperty,
  removePropertyImage,
  updateProperty,
  type PropertyInput,
} from "@/lib/db/admin";
import type { Currency, ListingState, Operation } from "@/lib/domain/types";

/** `""` -> `null`, sino el número. Los campos numéricos del form llegan como texto. */
function num(formData: FormData, key: string): number | null {
  const raw = formData.get(key);
  if (raw == null || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Arma el input tipado a partir del FormData del formulario de propiedad. */
function parsePropertyForm(formData: FormData): PropertyInput {
  const highlightsRaw = str(formData, "highlights");

  return {
    code: str(formData, "code"),
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    description: str(formData, "description"),
    operation: str(formData, "operation") as Operation,
    kind: str(formData, "kind") as PropertyInput["kind"],
    state: str(formData, "state") as ListingState,
    priceAmount: num(formData, "priceAmount") ?? 0,
    priceCurrency: str(formData, "priceCurrency") as Currency,
    pricePeriod: str(formData, "pricePeriod") as PropertyInput["pricePeriod"],
    neighbourhood: str(formData, "neighbourhood"),
    city: str(formData, "city"),
    province: str(formData, "province"),
    rooms: num(formData, "rooms"),
    bedrooms: num(formData, "bedrooms"),
    bathrooms: num(formData, "bathrooms"),
    coveredArea: num(formData, "coveredArea"),
    totalArea: num(formData, "totalArea"),
    areaUnit: (str(formData, "areaUnit") || null) as PropertyInput["areaUnit"],
    floor: num(formData, "floor"),
    hasParking: formData.get("hasParking") === "on",
    highlights: highlightsRaw
      ? highlightsRaw.split(",").map((h) => h.trim()).filter(Boolean)
      : [],
    insuranceProductId: str(formData, "insuranceProductId") || null,
    featured: formData.get("featured") === "on",
  };
}

export interface PropertyFormState {
  error?: string;
}

export async function createPropertyAction(
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  // Cualquier colaborador puede llegar acá; si intenta publicar directo, la
  // política RLS lo va a rechazar igual, pero devolver un mensaje claro es
  // mejor que dejar que reviente como error de base de datos.
  const session = await requireStaff();
  const input = parsePropertyForm(formData);
  if (input.state === "publicado" && session.role !== "admin") {
    return { error: "Sólo un administrador puede publicar una propiedad." };
  }

  let id: string;
  try {
    id = await createProperty(input);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo crear la propiedad." };
  }

  revalidatePath("/admin/propiedades");
  revalidatePath(`/admin/propiedades/${id}`);
  redirect("/admin/propiedades?guardado=1");
}

export async function updatePropertyAction(
  id: string,
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const session = await requireStaff();
  const input = parsePropertyForm(formData);
  if (input.state === "publicado" && session.role !== "admin") {
    return { error: "Sólo un administrador puede publicar una propiedad." };
  }

  try {
    await updateProperty(id, input);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo guardar la propiedad." };
  }

  revalidatePath("/admin/propiedades");
  revalidatePath(`/admin/propiedades/${id}`);
  redirect("/admin/propiedades?guardado=1");
}

export async function deletePropertyAction(id: string) {
  await requireAdmin();
  await deleteProperty(id);
  revalidatePath("/admin/propiedades");
  redirect("/admin/propiedades");
}

export async function addPropertyImageAction(propertyId: string, formData: FormData) {
  await requireStaff();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  const position = Number(formData.get("position") ?? 0);
  await addPropertyImage(propertyId, file, position);
  revalidatePath(`/admin/propiedades/${propertyId}`);
}

export async function removePropertyImageAction(
  propertyId: string,
  imageId: string,
  path: string,
) {
  await requireStaff();
  await removePropertyImage(imageId, path);
  revalidatePath(`/admin/propiedades/${propertyId}`);
}

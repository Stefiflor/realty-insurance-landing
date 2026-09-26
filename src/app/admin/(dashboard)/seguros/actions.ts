"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import {
  createInsuranceProduct,
  deleteInsuranceProduct,
  updateInsuranceProduct,
  type InsuranceInput,
} from "@/lib/db/admin";
import type { InsuranceKind } from "@/lib/domain/types";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseInsuranceForm(formData: FormData): InsuranceInput {
  const carriersRaw = str(formData, "carriers");
  return {
    slug: str(formData, "slug"),
    kind: str(formData, "kind") as InsuranceKind,
    name: str(formData, "name"),
    description: str(formData, "description"),
    detail: str(formData, "detail"),
    carriers: carriersRaw ? carriersRaw.split(",").map((c) => c.trim()).filter(Boolean) : [],
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

export interface InsuranceFormState {
  error?: string;
}

export async function createInsuranceAction(
  _prev: InsuranceFormState,
  formData: FormData,
): Promise<InsuranceFormState> {
  await requireStaff();
  try {
    await createInsuranceProduct(parseInsuranceForm(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo crear la cobertura." };
  }
  revalidatePath("/admin/seguros");
  redirect("/admin/seguros");
}

export async function updateInsuranceAction(
  id: string,
  _prev: InsuranceFormState,
  formData: FormData,
): Promise<InsuranceFormState> {
  await requireStaff();
  try {
    await updateInsuranceProduct(id, parseInsuranceForm(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo guardar la cobertura." };
  }
  revalidatePath("/admin/seguros");
  redirect("/admin/seguros");
}

export async function deleteInsuranceAction(id: string) {
  await requireStaff();
  await deleteInsuranceProduct(id);
  revalidatePath("/admin/seguros");
  redirect("/admin/seguros");
}

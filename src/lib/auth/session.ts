import { redirect } from "next/navigation";
import { createClient } from "@/lib/db/client";

/**
 * Sesión y rol del panel de administración.
 *
 * El rol no viene del JWT: se lee de `profiles`, la tabla que agrega
 * `supabase/roles.sql`. Un usuario autenticado sin fila en `profiles`
 * (no debería pasar, hay un trigger) cuenta como `colaborador`.
 */

export type StaffRole = "admin" | "colaborador";

export interface StaffSession {
  userId: string;
  email: string;
  role: StaffRole;
}

/** `null` si no hay sesión. No redirige: lo decide quien llama. */
export async function getStaffSession(): Promise<StaffSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? "",
    role: (profile?.role as StaffRole | undefined) ?? "colaborador",
  };
}

/** Para páginas que exigen estar logueado. Manda a `/admin/login` si no. */
export async function requireStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Para acciones que sólo puede hacer un administrador (publicar, borrar). */
export async function requireAdmin(): Promise<StaffSession> {
  const session = await requireStaff();
  if (session.role !== "admin") {
    throw new Error("Esta acción es sólo para administradores.");
  }
  return session;
}

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Clientes de Supabase.
 *
 * Hay dos porque corren en lugares distintos: el de servidor lee las cookies de
 * sesión para que el panel de administración sepa quién entró, y el de
 * navegador se usa sólo donde hace falta interactividad en el cliente.
 *
 * Las credenciales salen de variables de entorno; ver `.env.example`.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * `true` cuando hay credenciales configuradas. Mientras sea `false` la capa de
 * datos cae a las fixtures locales, así el sitio arranca sin Supabase.
 */
export const isSupabaseConfigured = Boolean(URL && ANON_KEY);

function requireEnv(): { url: string; key: string } {
  if (!URL || !ANON_KEY) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copiá .env.example a .env.local y completalas.",
    );
  }
  return { url: URL, key: ANON_KEY };
}

/** Cliente para Server Components, Server Actions y Route Handlers. */
export async function createClient() {
  const { url, key } = requireEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Escribir cookies desde un Server Component lanza: es esperable
          // cuando el refresco de sesión ya lo maneja el middleware.
        }
      },
    },
  });
}

/** Cliente para Client Components. */
export function createClientBrowser() {
  const { url, key } = requireEnv();
  return createBrowserClient(url, key);
}

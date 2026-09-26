import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para Client Components, en su propio módulo.
 *
 * A propósito no vive junto al de servidor (`client.ts`, que importa
 * `next/headers`): cualquier Client Component que use este cliente arma su
 * bundle de navegador a partir de este archivo, y si `next/headers` estuviera
 * en el mismo módulo, el build se rompe (esa API no existe en el navegador).
 * Por eso repite `isSupabaseConfigured`/`requireEnv` en vez de importarlos de
 * `client.ts` — son tres líneas, y evita el problema de raíz.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

/** Cliente para Client Components. */
export function createClientBrowser() {
  const { url, key } = requireEnv();
  return createBrowserClient(url, key);
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para lecturas públicas y anónimas: la home, el
 * listado, la ficha de una propiedad. A propósito no usa cookies ni sesión
 * (a diferencia de `client.ts`) — estas lecturas no dependen de quién está
 * mirando, y algunas corren en build time (`generateStaticParams`), donde
 * `next/headers` ni siquiera está disponible. El panel de administración usa
 * el cliente de `client.ts`, que sí necesita la sesión.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(URL && ANON_KEY);

export function createStaticClient() {
  if (!URL || !ANON_KEY) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copiá .env.example a .env.local y completalas.",
    );
  }
  return createSupabaseClient(URL, ANON_KEY);
}
